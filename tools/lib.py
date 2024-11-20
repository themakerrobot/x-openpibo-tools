import openpibo
import openpibo_models
from openpibo.vision import Camera,Face,Detect,TeachableMachine
from openpibo.audio import Audio
from openpibo.oled import Oled
from openpibo.speech import Speech,Dialog
from openpibo.motion import Motion
from openpibo.device import Device
import asyncio
import numpy as np
import time,datetime
import base64
import cv2,dlib,logging
import os,json,shutil,csv
from PIL import Image,ImageDraw,ImageFont,ImageOps
from queue import Queue
from threading import Thread, Timer

logging.basicConfig(level=logging.ERROR, format='%(asctime)s [%(levelname)s] %(message)s')

def to_base64(im):
  im = cv2.resize(im, (320, 240))
  _, buffer = cv2.imencode('.jpg', im, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
  return base64.b64encode(buffer).decode('utf-8')

def TimerStart(intv, func, daemon=True):
  tim = Timer(intv, func)
  tim.daemon = True
  tim.start()
  return tim

class Pibo:
  def __init__(self, emit_func=None, logger=None):
    logging.info('Class INIT')
    self.emit = emit_func
    self.system_status = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
    self.dev = Device()
    self.onoff = False
    self.mymodel_path = "/home/pi/mymodel"
    self.tracker, self.trackX, self.trackY = None, 0, 0
    self.imgX, self.imgY = 0,0
    self.marker_length = 2
    self.aud = Audio()
    self.mot = Motion()
    #self.pil_font = ImageFont.truetype(openpibo_models.filepath("KDL.ttf"), 20)
    self.mot.set_motion("wake_up2", 1)
    self.mot.set_motors([0,0,-80,0, 0,0, 0,0,80,0], 3000)
    self.speech = Speech()
    self.ole = Oled()
    self.cam = None
    self.fac = Face()
    self.det = Detect()
    self.tm = TeachableMachine()
    self.device_start()
    TimerStart(1, self.async_system_report, True)

  ## system
  def async_system_report(self):
    self.system_status = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
    asyncio.run(self.emit('system', self.system_status, callback=None))
    TimerStart(10, self.async_system_report, True)

  ## vision
  def vision_start(self):
    self.cam = Camera()
    try:
      self.tm.load(f"{self.mymodel_path}/model_unquant.tflite", f"{self.mymodel_path}/labels.txt")
    except Exception as ex:
      logging.error(f'[vision_start] Error: {ex}')
      os.system(f"rm -rf {self.mymodel_path}/*")

    self.vision_type = "camera"
    self.vision_flag, self.vision_sleep  = True, True
    Thread(name='vision_loop', target=self.vision_loop, args=(), daemon=True).start()

  def vision_stop(self):
    self.vision_flag = False
    self.cam.cap.stop()
    self.cam.cap.close()
    del self.cam
    self.cam = None

  def vision_loop(self):
    while self.vision_flag == True:
      if self.vision_sleep == True:
        time.sleep(1)
        continue

      try:
        self.frame = self.cam.read()  # read the camera frame
        if self.vision_type == 'grayscale':
          img, res = cv2.cvtColor(self.frame.copy(), cv2.COLOR_BGR2GRAY), ''
        elif self.vision_type == 'canny':
          img, res = cv2.Canny(cv2.cvtColor(self.frame.copy(), cv2.COLOR_BGR2GRAY), 200, 200), ''
        elif self.vision_type == 'edgePreservingFilter':
          img, res = self.edgePreservingFilter()
        elif self.vision_type == "qr":
          img, res = self.qr_detect()
        elif self.vision_type == "face":
          img, res = self.face_detect()
        elif self.vision_type == "face_landmark":
          img, res = self.face_landmark()
        elif self.vision_type == "object":
          img, res = self.object_detect()
        elif self.vision_type == "classify":
          img, res = self.classify_image()
        elif self.vision_type == "pose":
          img, res = self.pose_detect()
        elif self.vision_type == "cartoon":
          img, res = self.stylization()
        elif self.vision_type == "sketch_g":
          img, res = self.pencilSketch(mode='g')
        elif self.vision_type == "sketch_rgb":
          img, res = self.pencilSketch(mode='rgb')
        elif self.vision_type == "detail":
          img, res = self.detailEnhance()
        elif self.vision_type == "tm":
          img, res = self.tm_classify()
        elif self.vision_type == "track":
          img, res = self.track_object()
        elif self.vision_type == "marker":
          img, res = self.detect_marker()
        else:
          img, res = self.frame, ""
      except Exception as ex:
        logging.error(f'[vision_loop] Error: {ex}')
        img, res = self.frame, str(ex)

      self.res_img = img.copy()
      if self.cam:
        self.cam.putText(img, '+', (self.imgX-5,self.imgY), 0.6, (100,100,200), 3)
      asyncio.run(self.emit('stream', {'img':to_base64(img), 'data':res}, callback=None))

  def stylization(self):
    im = self.frame.copy()
    return self.cam.stylization(im), ''

  def pencilSketch(self, mode="g"):
    im = self.frame.copy()
    return self.cam.pencilSketch(im)[0 if mode == "g" else 1], ''

  def detailEnhance(self):
    im = self.frame.copy()
    return self.cam.detailEnhance(im), ''

  def edgePreservingFilter(self):
    im = self.frame.copy()
    return cv2.edgePreservingFilter(im), ''

  def face_detect(self):
    im = self.frame.copy()
    items = self.fac.detect_face(im)
    res = ''

    if len(items) > 0:
      x,y,w,h = items[0]
      face = self.fac.get_ageGender(im, items[0])
      colors = (200,100,0) if face['gender'] == 'Male' else (100,200,0)
      self.cam.rectangle(im, (x,y), (x+w, y+h), colors, 3)
      self.cam.putText(im, face['gender']+face['age'], (x+10, y+20),0.6,colors,2)
      res += '[{}/{}-({},{})] '.format(face['gender'], face['age'], x, y)
    return im, res

  def face_landmark(self):
    im = self.frame.copy()
    res = self.fac.landmark_face(im)
    return res['img'], ''

  def object_detect(self):
    im = self.frame.copy()
    items = self.det.detect_object(im)
    res = ''

    for obj in items:
      x1,y1,x2,y2 = obj['position']
      colors = (100,100,200)
      self.cam.rectangle(im, (x1,y1), (x2, y2),colors,3)
      (text_width, text_height), baseline = cv2.getTextSize(f'{obj["name"]} {obj["score"]}', cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
      cv2.rectangle(im, (x1, y1 - text_height - baseline), (x1 + text_width, y1), colors, -1)
      self.cam.putText(im, f'{obj["name"]} {obj["score"]}', (x1, y1 - baseline), 0.5, (255,255,255),2)
      res += '[{}-({},{})] '.format(obj['name'], x1, y1)
    return im, res

  def classify_image(self):
    im = self.frame.copy()
    res = self.det.classify_image(im)

    r = []
    #im = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))
    for i in range(len(res)):
      #self.cam.putText(im, "{}:{:.1f}%".format(self.tm.class_names[i], raw[i]*100), (50, 50+((i+1)*25)), 0.7, colors, 1)
      pred = f"{res[i]['score']}%"
      text= f"{res[i]['name']}:{pred}"
      points = (20, 20+(i*25))
      im = self.cam.putTextPIL(im, text, points, 20, (0,0,0))
      #ImageDraw.Draw(im).text(points, text, font=self.pil_font, fill=(0,0,0))
      r.append(f"{res[i]['name']}: {pred}")

    #im = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    return im, ", ".join(r)

  def qr_detect(self):
    im = self.frame.copy()
    item = self.det.detect_qr(im)
    res = ''

    if item['type'] != '':
      x1,y1,x2,y2 = item['position']
      colors = (100,0,200)
      self.cam.rectangle(im, (x1,y1), (x2, y2),colors,3)
      self.cam.putText(im, 'QR', (x1+10, y1+20),0.6,colors,2)
      res += '[{}-{} / ({},{})] '.format(item['data'], item['type'], x1, y1)

    return im, res

  def pose_detect(self):
    im = self.frame.copy()
    item = self.det.detect_pose(im)
    return item['img'], ''

  def tm_classify(self):
    im = self.frame.copy()
    res, raw = self.tm.predict(im)
    quantization = True if sum(raw) > 2 else False
    #colors = (10,10,10)
    #self.cam.putText(im, "{} : {:.1f}%".format(res, raw.max()*100), (50, 50), 0.7, colors, 1)

    r = []
    #im = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))
    for i in range(len(self.tm.class_names)):
      #self.cam.putText(im, "{}:{:.1f}%".format(self.tm.class_names[i], raw[i]*100), (50, 50+((i+1)*25)), 0.7, colors, 1)
      pred = f"{float(raw[i]/255.0)*100:.1f}%" if quantization else f"{raw[i]*100:.1f}%"
      text= f"{self.tm.class_names[i]}:{pred}"
      points = (20, 20+(i*25))
      im = self.cam.putTextPIL(im, text, points, 20, (0,0,0))
      #ImageDraw.Draw(im).text(points, text, font=self.pil_font, fill=(0,0,0))
      r.append(f"{self.tm.class_names[i]}: {pred}")

    #im = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    return im, ", ".join(r)

  def object_tracker_init(self, d):
    im = self.frame.copy()
    if self.tracker is not None:
      del self.tracker

    self.tracker = self.det.object_tracker_init(im, (d['x1'], d['y1'], d['x2'], d['y2']))
  
  def track_object(self):
    im = self.frame.copy()
    colors = (100,0,200)

    if self.tracker is not None:
      res = self.det.track_object(self.tracker, im)
      self.tracker = res['tracker']
      x1,y1,x2,y2 = res['position']
      self.cam.rectangle(im, (x1,y1), (x2,y2),colors,3)
    return im, ""

  def detect_marker(self):
    im = self.frame.copy()
    res = self.det.detect_marker(im, self.marker_length)

    return res['img'], " ".join([ f'({d["id"]})-{d["distance"]}cm' for d in res['data']])

  def imwrite(self, name):
    self.cam.imwrite(name, self.res_img.copy())

  ## device
  def device_start(self):
    self.devque = Queue()
    self.system_value = ['','','','','','']
    self.battery = '0%'
    
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      self.neopixel_value = tmp['eye'].split(',') if 'eye' in tmp else [0,0,0,0,0,0]
    
    Thread(name='device_loop', target=self.device_loop, args=(), daemon=True).start()
    self.send_message("30", 'on')
    time.sleep(0.1)
    self.send_message("14")
    time.sleep(0.1)
    self.send_message("23", ','.join([str(_) for _ in self.neopixel_value]))

  def device_stop(self):
    pass

  def send_message(self, code, data=""):
    self.devque.put(f'#{code}:{data}!')

  def decode_pkt(self, pkt):
    logging.debug(f'Recv: {pkt}-1')
    logging.debug(f'Recv: {pkt}-2, {pkt.split(":")[1].split("-")}')
    pkt = pkt.split(":")
    code, data = pkt[0], pkt[1]

    if code == '15': # battery
      self.battery = data
      asyncio.run(self.emit('update_battery', self.battery, callback=None))
    elif code == '14': # dc
      self.system_value[2] = data
      asyncio.run(self.emit('update_device', self.system_value, callback=None))
    elif code == '40': # system
      item = data.split("-")
      item[2] = self.system_value[2] if item[2] == '' else item[2]
      self.system_value = item
      asyncio.run(self.emit('update_device', self.system_value, callback=None))

  def device_loop(self):
    system_check_time = time.time()

    while True:
      try:
        res = None
        if time.time() - system_check_time > 1:
          self.decode_pkt(self.dev.send_raw("#40:!"))
          self.decode_pkt(self.dev.send_raw("#15:!"))
          system_check_time = time.time()
        elif self.devque.qsize() > 0:
          data = self.dev.send_raw(self.devque.get())
          self.decode_pkt(data)
        else:
          pass
      except Exception as ex:
        logging.error(f'[device_loop] Error: {ex}')
      time.sleep(0.1)

  def set_neopixel(self, d):
    if type(d) is dict and 'idx' in d and 'value' in d:
      self.neopixel_value[d['idx']] = d['value']
    if type(d) is list and len(d) == 6:
      self.neopixel_value = d
    self.send_message("23", ','.join([str(_) for _ in self.neopixel_value]))

  def set_oled_image(self, filepath):
    img = self.cam.imread(filepath)
    self.ole.draw_data(cv2.resize(img, (128, 64)))
    self.ole.show()

  def set_oled(self, d):
    self.ole.clear()
    self.ole.set_font(size=d['size'])
    x = d['x']
    y = d['y']

    for item in d['text'].split('\\n'):
      #_, h = self.ole.font.getsize(item)
      _,_,_, h = self.ole.font.getbbox(item)
      self.ole.draw_text((x, y), item)
      y += h
    self.ole.show()

  def mic(self, d):
    record_time = d['time']
    filename = "/home/pi/myaudio/mic.wav"
    os.system(f'arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d {record_time} -t wav -q -vv -V streo stream.raw;sox stream.raw -c 1 -b 16 {filename};rm stream.raw')

  def play_audio(self, filename, volume, background):
    self.aud.play(filename=filename, volume=volume, background=background)

  def stop_audio(self):
    self.aud.stop()

  def tts(self, d):
    voice_type = d['voice_type']
    volume = d['volume']
    filename = "/home/pi/myaudio/tts.mp3"

    try:
      if voice_type == "espeak":
        os.system(f'espeak "{d["text"]}" -w {filename}')
      else:
        lang = "en" if "e_" in voice_type else "ko"
        self.speech.tts(string=d['text'], filename=filename, voice=voice_type, lang=lang)
      self.play_audio(filename, volume, True)
    except Exception as ex:
      logging.error(f'[tts] Error: {ex}')
      pass
    return

  ## chatbot
  def chatbot_start(self):
    self.chat_list = []
    self.dialog = Dialog()

  def chatbot_stop(self):
    self.chat_list = []
    del self.dialog

  def load_csv(self, d):
    with open(d, 'r', encoding='utf-8') as f:
      items = csv.reader(f)
      res = []
      for item in items:
        if len(item) == 2:
          res.append(item)
      
      if len(res) == 0:
          return False
  
    self.dialog.load(d)
    return True

  def reset_csv(self, d):
    if d['lang'] == 'en':
      self.dialog.load(openpibo_models.filepath('dialog_en.csv'))
    else:
      self.dialog.load(openpibo_models.filepath('dialog.csv'))

  def question(self, d):
    q = d['question']
    voice_type = d['voice_type']
    volume = d['volume']
    n = d['n']
    ans = self.dialog.get_dialog(q, n)
    self.chat_list.append([str(datetime.datetime.now()).split('.')[0], q, ans])
    #self.emit('answer', {'answer':ans, 'chat_list':list(reversed(self.chat_list))})
    if len(self.chat_list) > 10:
      self.chat_list.pop(0)

    if d['voice_en'] == 'off':
      return ans

    try:
      self.tts({'text':ans, 'voice_type':voice_type, 'volume':volume})
    except Exception as ex:
      logging.error(f'[question] Error: {ex}')
      pass
    return ans

  def translate(self, d):
    res = self.dialog.translate(d['text'], d['langtype'])
    if d['voice_en'] == 'off':
      return res

    voice_type = "gtts"
    volume = d['volume']
    filename = "/home/pi/myaudio/tts.mp3"
    self.speech.tts(string=res, filename=filename, voice=voice_type, lang=d['langtype'])
    self.play_audio(filename, volume, True)
    return res

  ## motion
  def motion_start(self):
    self.motion_d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
    self.motion_p = [] # current pos list value
    self.motion_j = {} # current json value
    self.mot.set_motors(self.motion_d, movetime=1000)

    try:
      with open('/home/pi/mymotion.json', 'rb') as f:
        self.motion_j = json.load(f)
        #await self.emit('disp_code', self.motion_j)
    except Exception as ex:
      logging.error(f'[motion_start] Error: {ex}')
      pass

  def motion_stop(self):
    self.motion_d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
    self.motion_p = [] # current pos list value
    self.motion_j = {} # current json value
    self.mot.set_motors(self.motion_d, movetime=1000)

  def make_raw(self):
    if len(self.motion_p) == 0:
      return {}
    return {'init_def':1, 'init':self.motion_p[0]['d'], 'pos':self.motion_p[1:]} if self.motion_p[0]['seq'] == 0 else {'init_def':0, 'pos':self.motion_p[:]}

  def get_motor_info(self):
    return self.motion_d, self.motion_p, self.motion_j

  def set_motor(self, idx, pos):
    self.motion_d[idx] = pos
    self.mot.set_speed(idx, 50)
    self.mot.set_acceleration(idx, 0)
    self.mot.set_motor(idx, pos)

  def set_motors(self, pos_lst, movetime=1000):
    self.motion_d = pos_lst
    self.mot.set_motors(pos_lst, movetime)

  def add_frame(self, seq):
    seq = int(seq)
    _check = False
    for idx, pos in enumerate(self.motion_p):
      if pos['seq'] == seq:
        self.motion_p[idx] = {'d': self.motion_d[:], 'seq': int(seq)}
        _check = True
        break

    if _check == False:
      self.motion_p.append({'d': self.motion_d[:], 'seq': int(seq)})
      self.motion_p.sort(key=lambda x: x['seq'])
    return self.motion_p

  def delete_frame(self, seq):
    for idx, pos in enumerate(self.motion_p):
      if pos['seq'] == seq:
        del self.motion_p[idx]
        break
    return self.motion_p

  def init_frame(self):
    self.motion_p = []
    return self.motion_p

  def play_frame(self, cycle):
    raw = self.make_raw()
    Thread(name='play_frame', target=self.mot.set_motion_raw, args=(raw, int(cycle)), daemon=True).start()

  def stop_frame(self):
    self.mot.stop()

  def add_motion(self, name):
    self.motion_j[name] = self.make_raw()
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j

  def load_motion(self, name):
    if name in self.motion_j:
      a = self.motion_j[name]
    elif name in self.mot.get_motion():
      a = self.mot.get_motion(name)
    else:
      return self.motion_p

    self.motion_p = []
    if 'init_def' in a and 'init' in a:
      self.motion_p.append({'d':a['init'], 'seq':0})
    if 'pos' in a:
      for item in a['pos']:
        self.motion_p.append(item)

    return self.motion_p

  def delete_motion(self, name):
    if name in self.motion_j:
      del self.motion_j[name]
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j

  def reset_motion(self):
    self.motion_j = {}
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j

  # simulate
  def sim_motion(self, name, cycle=1, path=None, log=True):
    self.mot.set_motion(name, cycle, path)
    if log == True:
      asyncio.run(self.emit('sim_result', {'motion':'stop'}, callback=None))

  def async_sim_motion(self, name, cycle=1, path=None, log=True):
    self.mot.stop()
    try:
      self.mot.simT.join()
    except Exception as ex:
      pass
    self.mot.simT = Thread(name='sim_motion', target=self.sim_motion, args=(name, cycle, path, log), daemon=True)
    self.mot.simT.start()

  def sim_audio(self, filename, volume, log=True):
    self.stop_audio()
    self.play_audio(filename, volume, False)
    if log == True:
      asyncio.run(self.emit('sim_result', {'audio':'stop'}, callback=None))

  def async_sim_audio(self, filename, volume, log=True):
    Thread(name='sim_audio', target=self.sim_audio, args=(filename, volume, log), daemon=True).start()

  def set_simulate(self, item):
    logging.info(item)
    if 'eye' in item:
      d = item['eye']
      content = d['content']
      self.set_neopixel(content)
    if 'motion' in item:
      d = item['motion']
      content = d['content']
      if d['type'] == 'default':
        self.async_sim_motion(content, d['cycle'], log=False)
      if d['type'] == 'mymotion':
        self.async_sim_motion(content, d['cycle'], "/home/pi/mymotion.json", log=False)
    if 'audio' in item:
      d = item['audio']
      content = d['content']
      self.async_sim_audio(d["type"]+content, d["volume"], log=False)
    if 'oled' in item:
      d = item['oled']
      content = d['content']
      if d['type'] == 'text':
        self.set_oled({'x':d['x'], 'y': d['y'], 'size': d['size'], 'text': content})
      else:
        self.set_oled_image(content)
    if 'tts' in item:
      d = item['tts']
      content = d['content']
      self.tts({'text': content, 'voice_type': d['type'], 'volume': d['volume']})

  def start_simulate(self, items):
    self.stop_simulate()
    self.timers = []
    for idx, item in enumerate(items):
      timer = Timer(item['time'], self.set_simulate, args=(item,))
      timer.daemon = True
      timer.start()
      self.timers.append(timer)

  def stop_simulate(self):
    try:
      for timer in self.timers:
        timer.cancel()
      self.stop_frame()
      self.stop_audio()
      self.set_motors([0, 0, -80, 0, 0, 0, 0, 0, 80, 0])
    except Exception as ex:
      logging.error(ex)
