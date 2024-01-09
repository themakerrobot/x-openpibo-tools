// audio
Blockly.Python['audio_play_dynamic'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  const dir = block.getFieldValue("dir");
  //const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  const filename = block.getFieldValue("filename");
  const volume = Blockly.Python.valueToCode(block, 'volume', Blockly.Python.ORDER_ATOMIC);
  // const volume = block.getFieldValue("volume");
  return `audio.play('${dir}'+'${filename}', ${volume})\n`;
}
Blockly.Python['audio_play'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  const volume = Blockly.Python.valueToCode(block, 'volume', Blockly.Python.ORDER_ATOMIC);
  // const volume = block.getFieldValue("volume");
  return `audio.play('${dir}'+${filename}, ${volume})\n`;
}
Blockly.Python['audio_stop'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  return 'audio.stop()\n'
}
Blockly.Python['audio_record'] = function(block) {
  Blockly.Python.definitions_['import_os'] = 'import os';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  //const timeout = block.getFieldValue("timeout");
  const timeout = Blockly.Python.valueToCode(block, 'timeout', Blockly.Python.ORDER_ATOMIC);
  return `os.system("arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d ${timeout} -t wav -q stream.raw;sox stream.raw -c 1 -b 16 " + '${dir}'+${filename}+ ";rm stream.raw")\n`;
}

// collect
Blockly.Python['wikipedia_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Wikipedia'] = 'from openpibo.collect import Wikipedia';
  Blockly.Python.definitions_['assign_wikipedia'] = 'wikipedia = Wikipedia()';

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC);
  return [`wikipedia.search_for_block(${topic})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['weather_forecast'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Weather'] = 'from openpibo.collect import Weather';
  Blockly.Python.definitions_['assign_weather'] = 'weather = Weather()';

  const topic = block.getFieldValue("topic");

  return [`weather.search_for_block('${topic}', 'forecast')`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['weather_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Weather'] = 'from openpibo.collect import Weather';
  Blockly.Python.definitions_['assign_weather'] = 'weather = Weather()';

  const topic = block.getFieldValue("topic");
  const mode = block.getFieldValue("mode");
  const type = block.getFieldValue("type");
  return [`weather.search_for_block('${topic}', '${mode}')[${type}]`, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['news_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_News'] = 'from openpibo.collect import News';
  Blockly.Python.definitions_['assign_news'] = 'news = News()';

  const topic = block.getFieldValue("topic");
  const mode = block.getFieldValue("mode");
  return [`news.search_for_block('${topic}', '${mode}')`, Blockly.Python.ORDER_ATOMIC];
}

// device
Blockly.Python['device_eye_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  
  const val0 = Blockly.Python.valueToCode(block, 'val0', Blockly.Python.ORDER_ATOMIC);
  const val1 = Blockly.Python.valueToCode(block, 'val1', Blockly.Python.ORDER_ATOMIC);
  const val2 = Blockly.Python.valueToCode(block, 'val2', Blockly.Python.ORDER_ATOMIC);
  const val3 = Blockly.Python.valueToCode(block, 'val3', Blockly.Python.ORDER_ATOMIC);
  const val4 = Blockly.Python.valueToCode(block, 'val4', Blockly.Python.ORDER_ATOMIC);
  const val5 = Blockly.Python.valueToCode(block, 'val5', Blockly.Python.ORDER_ATOMIC);

  return `device.eye_on(${val0}, ${val1}, ${val2}, ${val3}, ${val4}, ${val5})\n`
}
Blockly.Python['device_eye_colour_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';

  const l = Blockly.Python.valueToCode(block, 'left', Blockly.Python.ORDER_ATOMIC);
  const r = Blockly.Python.valueToCode(block, 'right', Blockly.Python.ORDER_ATOMIC);

  return `device.eye_on(*([int(${l}[${l}.index('#'):${l}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)]+[int(${r}[${r}.index('#'):${r}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)]))\n`
}
Blockly.Python['device_eye_fade'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';

  const l = Blockly.Python.valueToCode(block, 'left', Blockly.Python.ORDER_ATOMIC);
  const r = Blockly.Python.valueToCode(block, 'right', Blockly.Python.ORDER_ATOMIC);
  const time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);

  return `device.send_cmd(24, ",".join([str(s) for s in [int(${l}[${l}.index('#'):${l}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)]+[int(${r}[${r}.index('#'):${r}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)] + [${time}]]))\n`
}
Blockly.Python['device_eye_off'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return 'device.eye_off()\n'
}
Blockly.Python['device_get_dc'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_dc().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_battery'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_battery().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_system'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_pir'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[0]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_touch'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_button'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[3]", Blockly.Python.ORDER_ATOMIC];
}

// motion
Blockly.Python['motion_get_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return ["motion.get_motion()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['motion_get_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return ["motion.get_motion(path='/home/pi/mymotion.json')", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['motion_set_motion_dropdown'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = block.getFieldValue("name");
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_motion('${name}', ${cycle})\n`;
}
Blockly.Python['motion_set_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC);
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_motion(${name}, ${cycle})\n`;
}
Blockly.Python['motion_set_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC);
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_mymotion(${name}, ${cycle})\n`;
}
Blockly.Python['motion_init_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return `motion.set_motors([0,0,-80,0,0,0,0,0,80,0], 500)\n`;
}
Blockly.Python['motion_set_motor'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const pos = Blockly.Python.valueToCode(block, 'pos', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_motor(${no}, ${pos})\n`;
}
Blockly.Python['motion_set_speed'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_speed(${no}, ${val})\n`;
}
Blockly.Python['motion_set_acceleration'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC);
  return `motion.set_acceleration(${no}, ${val})\n`;
}

// oled
Blockly.Python['oled_set_font'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const size = Blockly.Python.valueToCode(block, 'size', Blockly.Python.ORDER_ATOMIC);
  return `oled.set_font(size=${size})\n`;
}
Blockly.Python['oled_draw_text'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
  const y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
  return `oled.draw_text((${x}, ${y}), ${text})\n`;
}
Blockly.Python['oled_draw_image_dynamic'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const dir = block.getFieldValue("dir");
  const filename = block.getFieldValue("filename");
  return `oled.draw_image('${dir}'+'${filename}')\n`;
}
Blockly.Python['oled_draw_image'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  return `oled.draw_image('${dir}'+${filename})\n`;
}

Blockly.Python['oled_draw_data'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return `oled.draw_data(${img})\n`;
}

Blockly.Python['oled_draw_rectangle'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC);
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC);
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC);
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC);
  const fill = block.getFieldValue("fill");

  return `oled.draw_rectangle((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_ellipse'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC);
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC);
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC);
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC);
  const fill = block.getFieldValue("fill");

  return `oled.draw_ellipse((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_line'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC);
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC);
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC);
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC);
  return `oled.draw_line((${x1}, ${y1}, ${x2}, ${y2}))\n`;
}
Blockly.Python['oled_invert'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.invert()\n";
}
Blockly.Python['oled_show'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.show()\n";
}
Blockly.Python['oled_clear'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.clear()\n";
}

// speech
Blockly.Python['speech_stt'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  //const timeout = block.getFieldValue("timeout");
  const timeout = Blockly.Python.valueToCode(block, 'timeout', Blockly.Python.ORDER_ATOMIC);
  return [`speech.stt(timeout=${timeout}, verbose=False)`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['speech_tts'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  const voice = block.getFieldValue("voice");
  return `speech.tts(string=${text}, filename='${dir}'+${filename}, voice='${voice}')\n`;
}
Blockly.Python['speech_translate'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
  const lang = block.getFieldValue("lang");
  return [`dialog.translate(${text}, '${lang}')`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['speech_get_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
  return [`dialog.get_dialog(${text})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['speech_load_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  return `dialog.load('${dir}'+${filename})\n`;
}

// vision
Blockly.Python['vision_read'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';
  return ["camera.read()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_imread_dynamic'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = block.getFieldValue("filename");
  return [`camera.imread('${dir}'+'${filename}')\n`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_imread'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = block.getFieldValue("filename");
  return [`camera.imread('${dir}'+'${filename}')\n`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_imwrite'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return `camera.imwrite('${dir}'+${filename}, ${img})\n`;
}
Blockly.Python['vision_imshow_to_ide'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  return `camera.imshow_to_ide('${dir}'+${filename})\n`;
}
Blockly.Python['vision_imshow_to_ide_img'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return `camera.imshow_to_ide(${img})\n`;
}
Blockly.Python['vision_rectangle'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC);
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC);
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC);
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC);
  const color = Blockly.Python.valueToCode(block, 'color', Blockly.Python.ORDER_ATOMIC);
  const tickness = Blockly.Python.valueToCode(block, 'tickness', Blockly.Python.ORDER_ATOMIC);

  return `${img} = camera.rectangle(${img}, (${x1},${y1}), (${x2},${y2}), tuple([int(${color}[${color}.index('#'):${color}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)][::-1]), ${tickness})\n`;
}
Blockly.Python['vision_circle'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
  const y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
  const r = Blockly.Python.valueToCode(block, 'r', Blockly.Python.ORDER_ATOMIC);
  const color = Blockly.Python.valueToCode(block, 'color', Blockly.Python.ORDER_ATOMIC);
  const tickness = Blockly.Python.valueToCode(block, 'tickness', Blockly.Python.ORDER_ATOMIC);

  return `${img} = camera.circle(${img}, (${x},${y}), ${r}, tuple([int(${color}[${color}.index('#'):${color}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)][::-1]), ${tickness})\n`;
}
Blockly.Python['vision_text'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC);
  const x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
  const y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
  const size = Blockly.Python.valueToCode(block, 'size', Blockly.Python.ORDER_ATOMIC);
  const color = Blockly.Python.valueToCode(block, 'color', Blockly.Python.ORDER_ATOMIC);
  return `${img} = camera.putTextPIL(${img}, ${text}, (${x},${y}), ${size}, tuple([int(${color}[${color}.index('#'):${color}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)][::-1]))\n`;
}
Blockly.Python['vision_transfer'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const type = block.getFieldValue("type");
  let res = '';

  switch (type) {
    case 'cartoon':
      res = `camera.stylization(${img})`;
      break;
    case 'detail':
      res = `camera.detailEnhance(${img})`;
      break;
    case 'sketch_g':
      res = `camera.pencilSketch(${img})[0]`;
      break;
    case 'sketch_c':
      res = `camera.pencilSketch(${img})[1]`;
      break;
  }
  return [res, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_face'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Face'] = 'from openpibo.vision import Face';
  Blockly.Python.definitions_['assign_face'] = '_face = Face()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`_face.detect(${img})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_face_age'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Face'] = 'from openpibo.vision import Face';
  Blockly.Python.definitions_['assign_face'] = '_face = Face()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const v = Blockly.Python.valueToCode(block, 'v', Blockly.Python.ORDER_ATOMIC);
  
  return [`_face.get_age(${img}[${v}[1]:${v}[1]+${v}[3], ${v}[0]:${v}[0]+${v}[2]])[0]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_face_gender'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Face'] = 'from openpibo.vision import Face';
  Blockly.Python.definitions_['assign_face'] = '_face = Face()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const v = Blockly.Python.valueToCode(block, 'v', Blockly.Python.ORDER_ATOMIC);
  
  return [`_face.get_gender(${img}[${v}[1]:${v}[1]+${v}[3], ${v}[0]:${v}[0]+${v}[2]])[0]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_object'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`[ item['name'] for item in detect.detect_object(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_qr'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`detect.detect_qr(${img})['data']`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_pose'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`detect.detect_pose(${img})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_analyze_pose'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC);
  const type = block.getFieldValue("type");
  let res = '';

  switch (type) {
    case 'motion':
      res = `detect.analyze_pose(${val})`;
      break;
    case 'pose':
      res = `[[_i.coordinate.x, _i.coordinate.y] for _i in ${val}['data'][0][0]]`
      break;
    case 'person':
      res = `[_j for _i in ${val}['data'][0][1] for _j in _i]`
      break;
    case 'acc':
      res = `round(${val}['data'][0][2]*100, 1)`
      break;
  }
  return [res, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_classification'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`[ item['name'] for item in detect.classify_image(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_object_tracker_init'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC);
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC);
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC);
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC);
  return [`detect.object_tracker_init(${img}, (${x1},${y1},${x2},${y2}))`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_object_track'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const tracker = Blockly.Python.valueToCode(block, 'tracker', Blockly.Python.ORDER_ATOMIC);
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`detect.object_track(${tracker}, ${img})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_load_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const dir = block.getFieldValue("dir");
  const modelpath = Blockly.Python.valueToCode(block, 'modelpath', Blockly.Python.ORDER_ATOMIC);
  const labelpath = Blockly.Python.valueToCode(block, 'labelpath', Blockly.Python.ORDER_ATOMIC);
  return `tm.load('${dir}'+${modelpath}, '${dir}'+${labelpath})\n`;
}
Blockly.Python['vision_predict_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`tm.predict(${img})[0]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_call_ai'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_vision_api'] = 'from openpibo.vision import vision_api';

  const type = block.getFieldValue("type");
  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);

  return [`vision_api('${type}', '${dir}'+${filename})['data']`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_call_ai_img'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_vision_api'] = 'from openpibo.vision import vision_api';

  const type = block.getFieldValue("type");
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`vision_api('${type}', ${img})['data']`, Blockly.Python.ORDER_ATOMIC];
}

// Utils
Blockly.Python['utils_sleep'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  const t = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  return `time.sleep(${t})\n`;
}
Blockly.Python['utils_time'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  return ["time.time()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_current_time'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  return ["time.strftime('%Y-%m-%d %H:%M:%S')", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_include'] = function(block) {
  const a = Blockly.Python.valueToCode(block, 'a', Blockly.Python.ORDER_ATOMIC);
  const b = Blockly.Python.valueToCode(block, 'b', Blockly.Python.ORDER_ATOMIC);

  return [`${a} in ${b}`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_dict_get'] = function(block) {
  const dictionary = Blockly.Python.valueToCode(block, 'dictionary', Blockly.Python.ORDER_ATOMIC);
  const keyname = Blockly.Python.valueToCode(block, 'keyname', Blockly.Python.ORDER_ATOMIC);

  return [`${dictionary}[${keyname}]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_dict_set'] = function(block) {
  const dictionary = Blockly.Python.valueToCode(block, 'dictionary', Blockly.Python.ORDER_ATOMIC);
  const keyname = Blockly.Python.valueToCode(block, 'keyname', Blockly.Python.ORDER_ATOMIC);
  const value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);

  return `${dictionary}[${keyname}] = ${value}\n`;
}
Blockly.Python['utils_dict_create'] = function(block) {
  return [`dict()\n`, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['utils_check_path'] = function(block) {
  Blockly.Python.definitions_['import_os'] = 'import os';
  const type = block.getFieldValue('type');
  const path = Blockly.Python.valueToCode(block, 'path', Blockly.Python.ORDER_ATOMIC);

  return [`${type}(${path})`, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['utils_typecast_string'] = function(block) {
  Blockly.Python.definitions_['import_os'] = 'import os';
  const value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);

  return [`str(${value})`, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['utils_typecast_number'] = function(block) {
  Blockly.Python.definitions_['import_os'] = 'import os';
  const type = block.getFieldValue('type');
  const value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);

  return [`${type}(${value})`, Blockly.Python.ORDER_ATOMIC];
}
