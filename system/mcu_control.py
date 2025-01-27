# mcu_control.py
import serial, time, logging, json
from threading import Thread, Event, Lock
from queue import Queue, Empty

logging.basicConfig(level=logging.ERROR, format='%(asctime)s [%(levelname)s] %(message)s')

class DeviceControl:
    def __init__(self, port="/dev/ttyS0", baudrate=9600, timeout=1):
        self.system_data = {}
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.command_queue = Queue()
        self.stop_event = Event()
        self.lock = Lock()  # Lock 생성
        self.sd_lock = Lock()  # Lock 생성
        self._connect_serial()
        # 단일 워커 스레드 시작
        self.worker_thread = Thread(target=self._worker, daemon=True)
        self.worker_thread.start()
        logging.info(f"DeviceControl create successfully.")

    def _connect_serial(self):
        """Serial 포트를 연결합니다."""
        try:
            self.ser = serial.Serial(port=self.port, baudrate=self.baudrate, timeout=self.timeout)
            logging.info(f"Serial port {self.port} opened successfully.")
        except serial.SerialException as e:
            logging.error(f"Failed to open serial port {self.port}: {e}")
            self.ser = None

    def _send_raw_internal(self, raw):
        """직렬 포트로 원시 데이터를 전송하고 응답을 반환합니다."""
        with self.lock:  # Lock 사용하여 동기화
            if not self.ser or not self.ser.is_open:
                logging.warning("Serial port not open. Attempting to reconnect.")
                self._connect_serial()

                if not self.ser or not self.ser.is_open:
                    logging.error("Failed to reconnect serial port.")
                    return ""

            try:
                self.ser.reset_input_buffer()
                logging.debug("Input buffer reset.")

                self.ser.write(raw.encode('utf-8'))
                logging.debug(f"Sent: {raw}")

                data = []
                while True:
                    raw_bytes = self.ser.read()  # 바이트 단위로 읽기
                    if not raw_bytes:
                        # 타임아웃 발생
                        logging.warning("Read timeout.")
                        break
                    logging.debug(f"Raw byte received: {raw_bytes}")
                    try:
                        ch = raw_bytes.decode('utf-8')
                    except UnicodeDecodeError as ude:
                        logging.error(f"Unicode decode error: {ude}. Raw bytes: {raw_bytes} >> {raw}")
                        continue  # 이 바이트는 건너뛰고 계속 진행

                    if ch in ['#', '\r', '\n']:
                        continue
                    if ch == '!':
                        break
                    data.append(ch)

                response = ''.join(data)
                logging.info(f"Received: {response}")
                return response
            except serial.SerialException as e:
                logging.error(f"Serial communication error: {e}")
                if self.ser:
                    try:
                        self.ser.close()
                        logging.info("Serial port closed due to error.")
                    except Exception as close_ex:
                        logging.error(f"Error closing serial port: {close_ex}")
                self.ser = None
                return ""
            except Exception as e:
                logging.error(f"Unexpected error in _send_raw_internal: {e}")
                return ""

    def send_raw(self, raw):
        """외부에서 호출되는 함수로, 명령을 큐에 넣고 응답을 기다립니다."""
        response_queue = Queue()
        self.command_queue.put((raw, response_queue))
        try:
            # 응답을 기다립니다.
            response = response_queue.get(timeout=self.timeout + 2)  # 추가 시간을 주어 충분히 기다림
            return response
        except Empty:
            logging.error(f"No response received for command: {raw}")
            return ""

    def _worker(self):
        """단일 워커 스레드: 주기적인 업데이트와 명령 큐 처리."""
        # 초기 주기적 작업 타이밍 설정
        next_battery_time = time.time()
        next_system_time = time.time()

        while not self.stop_event.is_set():
            current_time = time.time()

            # 배터리 데이터 업데이트 (10초 간격)
            if current_time >= next_battery_time:
                response = self._send_raw_internal("#15:!")
                with self.sd_lock:
                    self.system_data['battery'] = response
                logging.info(f"Battery data updated: {response}")
                next_battery_time = current_time + 10
                # MCU가 명령을 처리할 시간을 주기 위해 짧은 지연 추가
                time.sleep(0.1)

            # 시스템 데이터 업데이트 (1초 간격)
            if current_time >= next_system_time:
                response = self._send_raw_internal("#40:!")
                with self.sd_lock:
                    self.system_data['system'] = response
                logging.info(f"System data updated: {response}")
                next_system_time = current_time + 1
                # MCU가 명령을 처리할 시간을 주기 위해 짧은 지연 추가
                time.sleep(0.1)

            # 명령 큐 처리
            try:
                # 명령 큐에서 명령을 가져옵니다.
                command, response_queue = self.command_queue.get_nowait()
                response = self._send_raw_internal(command)
                logging.info(f"Processed command '{command}', response: {response if response else '-'}")
                # 응답 큐에 응답을 넣어줍니다.
                response_queue.put(response)
            except Empty:
                pass
            except Exception as e:
                logging.error(f"Unexpected error in worker thread: {e}")

            # CPU 사용량을 줄이기 위해 짧은 대기
            time.sleep(0.05)

    def close(self):
        """DeviceControl을 안전하게 종료합니다."""
        self.stop_event.set()
        self.worker_thread.join(timeout=2)
        if self.ser and self.ser.is_open:
            self.ser.close()
            logging.info("Serial port closed.")

    def __del__(self):
        """객체 소멸 시 자원 해제."""
        self.close()
