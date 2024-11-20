from openpibo.oled import Oled
from openpibo.audio import Audio
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from threading import Timer
from collections import Counter
import json,time,os,shutil
import wifi, network_disp
import argparse
from mcu_control import DeviceControl

@asynccontextmanager
async def lifespan(app: FastAPI):
  global winfo, ole, aud, device_control
  ole = Oled()
  aud = Audio()
  device_control = DeviceControl()
  winfo = ['','','','','','']
  boot()
  yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
apmode = True
@app.get("/device/{pkt}")
async def device_command(pkt: str):
  try:
    if pkt == "#15:!":
      return JSONResponse(content=device_control.system_data.get('battery', ''), status_code=200)
    elif pkt == "#40:!":
      return JSONResponse(content=device_control.system_data.get('system', ''), status_code=200)
    else:
      response = device_control.send_raw(pkt)
      return JSONResponse(content=response, status_code=200)
  except Exception as ex:
    return JSONResponse(content=f"Error: {str(ex)}", status_code=500)

@app.get('/usedata')
async def f():

  try:
    res = {}
    with open(f'/home/pi/.openpibo.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    print(f'[usedata] Error: {ex}')
    pass
  return JSONResponse(content=res, status_code=200)

@app.post('/usedata')
async def f(data: dict = Body(...)):
  try:
    res = None
    with open(f'/home/pi/.openpibo.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    print(f'[usedata] Error: {ex}')
    pass

  try:
    if res == None:
      with open(f'/home/pi/.openpibo.json', 'w') as f:
        json.dump(data, f)
      shutil.chown(f'/home/pi/.openpibo.json', 'pi', 'pi')
    else:
      tmp = {}
      for k in data:
        if type(data[k]) is dict:
          tmp[k] = dict(Counter(res[k]) + Counter(data[k]))
        else:
          tmp[k] = res[k] + data[k] if k in res else data[k]
      with open(f'/home/pi/.openpibo.json', 'w') as f:
        json.dump(tmp, f)
  except Exception as ex:
    with open(f'/home/pi/.openpibo.json', 'w') as f:
      json.dump(data, f)
    shutil.chown(f'/home/pi/.openpibo.json', 'pi', 'pi')

  return JSONResponse(content=res, status_code=200)

@app.get('/wifi_scan')
async def f():
  return JSONResponse(content=wifi.wifi_scan(), status_code=200)

@app.get('/wifi')
async def f():
  return JSONResponse(content={'result':'ok', 'ssid':winfo[2], 'psk':winfo[3], 'ipaddress':winfo[0], 'eth1': winfo[1], 'identity':winfo[4], 'key-mgmt':winfo[5]}, status_code=200)

@app.post('/wifi')
async def f(data: dict = Body(...)):
  print(data)
  if data['ssid'] == "": # error
    return JSONResponse(content=f"Error: {str(ex)}", status_code=500)
  elif data['psk'] == "": # open
    os.system(f"sudo /home/pi/openpibo-os/system/conwifi.sh open '{data['ssid']}'")
  elif data['psk'] != "": # wpa or wpa-e
    if len(data['psk']) < 8:
      return JSONResponse(content={'result':'fail', 'data':'psk must be at least 8 digits.'}, status_code=200)
    elif data['identity'] == "": # wpa
      os.system(f"sudo /home/pi/openpibo-os/system/conwifi.sh wpa-psk '{data['ssid']}' '{data['psk']}'")
    else: #wpa-e
      os.system(f"sudo /home/pi/openpibo-os/system/conwifi.sh wpa-enterprise '{data['ssid']}' '{data['identity']}' '{data['psk']}'")
  else:
    return JSONResponse(content=f"Error: {str(ex)}", status_code=500)
  
  return JSONResponse(content="ok", status_code=200)

def wifi_update():
  global winfo, apmode
  tmp = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
  if (tmp[6] != '' and tmp[6][0:3] != '169') or (tmp[7] != '' and tmp[7][0:3] != '169'):
    if apmode == True:
      #os.system("sudo ip link set ap0 down")
      os.system("/home/pi/openpibo-os/system/hotspot.sh stop")
      print(f'ap0 up->down')
    apmode = False
  else:
    if apmode == False:
      #os.system("sudo ip link set ap0 up")
      os.system("/home/pi/openpibo-os/system/hotspot.sh start")
      print(f'ap0 down->up')
    apmode = True
  if winfo != tmp[6:12]:
    print(f'Network Change {winfo} -> {tmp[6:12]}')
    network_disp.run()
  winfo = tmp[6:12]
  _ = Timer(10, wifi_update)
  _.daemon = True
  _.start()

## boot
def boot():
  try:
    with open('/home/pi/.OS_VERSION', 'r') as f:
      os_version = str(f.readlines()[0].split('\n')[0].split('OPENPIBO_')[1])
  except Exception as ex:
    os_version = "OS (None)"
    pass

  try:
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      os.system('echo "#23:{}!" >/dev/ttyS0'.format(tmp['eye']))
  except Exception as ex:
    pass

  aud.play("/home/pi/openpibo-os/system/opening.mp3", 70, True)
  ole.clear()
  ole.draw_image("/home/pi/openpibo-os/system/themaker.jpg")
  ole.set_font(size=15)
  ole.draw_text((5,40), os_version)
  ole.show()
  time.sleep(5)
  for i in range(1,10):
    tmp = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
    if (tmp[6] != '' and tmp[6][0:3] != '169') or (tmp[7] != '' and tmp[7][0:3] != '169'):
      os.system("/home/pi/openpibo-os/system/hotspot.sh stop")
      break
    ole.draw_image("/home/pi/openpibo-os/system/pibo.jpg")
    ole.draw_text((5,5), "˚".join(["" for _ in range(i+1)]))
    ole.show()
    time.sleep(3)
  network_disp.run()
  _ = Timer(10, wifi_update)
  _.daemon = True
  _.start()

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=8080)
  args = parser.parse_args()

  import uvicorn
  uvicorn.run('booting:app', host='0.0.0.0', port=args.port, access_log=False)
