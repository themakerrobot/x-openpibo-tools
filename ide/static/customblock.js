const color_type={
  "audio": "#07A0C7",
  "collect": "#0790B7",
  "device": "#0780A7",
  "motion": "#077097",
  "oled": "#076087",
  "speech": "#075077",
  "vision": "#074067"
};

Blockly.defineBlocksWithJsonArray(
  [
    {
      type: 'audio_play',
      message0: '%{BKY_AUDIO_PLAY}',
      args0: 
        [
          {"type": "input_value", "name": "filename"}, 
          {
            "type": "field_number",
            "name": "volume",
            "value": 80,
            "min": 0,
            "max": 100,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: 'call audio.play',
      helpUrl: ''
    },
    {
      type: 'audio_stop',
      message0: '%{BKY_AUDIO_STOP}',
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: 'call audio.stop',
      helpUrl: ''
    },
    {
      type: 'wikipedia_search',
      message0: '%{BKY_COLLECT_WIKIPEDIA}',
      args0: 
        [
          {"type": "input_value", "name": "topic"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: 'call wikipedia.search',
      helpUrl: ''
    },
    {
      type: 'weather_search',
      message0: '%{BKY_COLLECT_WEATHER}',
      args0: [
        {"type": "field_dropdown", "name":"topic",
         "options":[
          [ '전국', '전국' ], [ '서울', '서울' ],
          [ '인천', '인천' ], [ '경기', '경기' ],
          [ '부산', '부산' ], [ '울산', '울산' ],
          [ '경남', '경남' ], [ '대구', '대구' ],
          [ '경북', '경북' ], [ '광주', '광주' ],
          [ '전남', '전남' ], [ '전북', '전북' ],
          [ '대전', '대전' ], [ '세종', '세종' ],
          [ '충남', '충남' ], [ '충북', '충북' ],
          [ '강원', '강원' ], [ '제주', '제주' ]
         ]
       }],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: 'call weather.search',
      helpUrl: ''
    },
    {
      type: 'news_search',
      message0: '%{BKY_COLLECT_NEWS}',
      args0: 
        [
          {"type": "field_dropdown", "name":"topic",
          "options":[
            [ '속보', '속보' ],
            [ '정치', '정치' ],
            [ '경제', '경제' ],
            [ '사회', '사회' ],
            [ '국제', '국제' ],
            [ '문화', '문화' ],
            [ '연예', '연예' ],
            [ '스포츠', '스포츠' ],
            [ '풀영상', '풀영상' ],
            [ '뉴스랭킹', '뉴스랭킹' ],
            [ '뉴스룸', '뉴스룸' ],
            [ '아침&', '아침&' ],
            [ '썰전 라이브', '썰전 라이브' ],
            [ '정치부회의', '정치부회의' ]
          ]
          }
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: 'call news.search',
      helpUrl: ''
    },
    {
      type: 'device_eye_on',
      message0: '%{BKY_DEVICE_EYE_ON}',
      args0: 
        [
          {
            "type": "field_number",
            "name": "val0",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val1",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val2",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val3",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val4",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val5",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.eye_on',
      helpUrl: ''
    },
    {
      type: 'device_eye_off',
      message0: '%{BKY_DEVICE_EYE_OFF}',
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.eye_off',
      helpUrl: ''
    },
    {
      type: 'device_get_dc',
      message0: '%{BKY_DEVICE_GET_DC}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_dc',
      helpUrl: ''
    },
    {
      type: 'device_get_battery',
      message0: '%{BKY_DEVICE_GET_BATTERY}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_battery',
      helpUrl: ''
    },
    {
      type: 'device_get_system',
      message0: '%{BKY_DEVICE_GET_SYSTEM}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_system',
      helpUrl: ''
    },
    {
      type: 'device_get_pir',
      message0: '%{BKY_DEVICE_GET_PIR}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_system',
      helpUrl: ''
    },
    {
      type: 'device_get_touch',
      message0: '%{BKY_DEVICE_GET_TOUCH}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_system',
      helpUrl: ''
    },
    {
      type: 'device_get_button',
      message0: '%{BKY_DEVICE_GET_BUTTON}',
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: 'call device.get_system',
      helpUrl: ''
    },    
    // motion
    {
      type: 'motion_set_motion',
      message0: '%{BKY_MOTION_SET_MOTION}',
      args0:
        [
          {"type": "input_value", "name": "name"}, 
          {
            "type": "field_number",
            "name": "cycle",
            "value": 1,
            "min": 1,
            "max": 10,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call motion.set_motion',
      helpUrl: ''
    },
    {
      type: 'motion_set_mymotion',
      message0: '%{BKY_MOTION_SET_MYMOTION}',
      args0: 
        [
          {"type": "input_value", "name": "name"}, 
          {
            "type": "field_number",
            "name": "cycle",
            "value": 1,
            "min": 1,
            "max": 10,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call motion.set_mymotion',
      helpUrl: ''
    },
    {
      type: 'motion_set_motor',
      message0: '%{BKY_MOTION_SET_MOTOR}',
      args0: 
        [
          {"type": "field_dropdown", "name":"no",
           "options":[
              ['0','0'],['1','1'],['2','2'],['3','3'],['4','4'],
              ['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],
            ]
          },
          {
            "type": "field_number",
            "name": "pos",
            "value": 0,
            "min": -80,
            "max": 80,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call motion.set_motor',
      helpUrl: ''
    },
    // oled
    {
      type: 'oled_set_font',
      message0: '%{BKY_OLED_SET_FONT}',
      args0:
        [
          // {"type": "input_value", "name": "font"}, 
          {
            "type": "field_number",
            "name": "size",
            "value": 10,
            "min": 5,
            "max": 50,
            "precision": 1
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call oled.set_font',
      helpUrl: ''
    },
    {
      type: 'oled_draw_text',
      message0: '%{BKY_OLED_DRAW_TEXT}',
      args0:
        [
          {
            "type": "field_number",
            "name": "x",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {"type": "input_value", "name": "text"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call oled.draw_text',
      helpUrl: ''
    },
    {
      type: 'oled_draw_image',
      message0: '%{BKY_OLED_DRAW_IMAGE}',
      args0: 
        [
          {"type": "input_value", "name": "filename"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: 'call oled.draw_image',
      helpUrl: ''
    },
    {
      type: 'oled_show',
      message0: '%{BKY_OLED_SHOW}',
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'call oled.show',
      helpUrl: ''
    },
    {
      type: 'oled_clear',
      message0: '%{BKY_OLED_CLEAR}',
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'call oled.clear',
      helpUrl: ''
    },
    {
      type: 'speech_tts',
      message0: '%{BKY_SPEECH_TTS}',
      args0:
        [
          {"type": "input_value", "name": "text"},
          {"type": "input_value", "name": "filename"},
          {"type": "field_dropdown", "name":"voice",
           "options":[
              ['main','main'],['man','man1'],['woman','woman1'],
              ['boy','boy'],['girl','girl'],['espeak','espeak']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: 'call speech.tts',
      helpUrl: ''
    },
    {
      type: 'speech_get_dialog',
      message0: '%{BKY_SPEECH_GET_DIALOG}',
      args0:
        [
          {"type": "input_value", "name": "text"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: 'call speech.get_dialog',
      helpUrl: ''
    },
    {
      type: 'vision_read',
      message0: '%{BKY_VISION_READ}',
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: 'call camera.read',
      helpUrl: ''
    },
    {
      type: 'vision_imwrite',
      message0: '%{BKY_VISION_IMWRITE}',
      args0:
        [
          {"type": "input_value", "name": "filename"},
          {"type": "input_value", "name": "img"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: 'call camera.imwrite',
      helpUrl: ''
    },
    {
      type: 'vision_cartoonize',
      message0: '%{BKY_VISION_CARTOONIZE}',
      "args0": [
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: 'call camera.cartoonize',
      helpUrl: ''
    },
  ]
);