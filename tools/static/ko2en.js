const blang = (navigator.language || navigator.userLanguage).includes('ko')?'ko':'en';
let lang = localStorage.getItem("language")?localStorage.getItem("language"):blang;

const translations = {
  password: {
    ko: "비밀번호",
    en: "Password"
  },
  internet_settings: {
    ko: "인터넷 설정",
    en: "Internet settings"
  },
  wifi_name: {
    ko: "이름",
    en: "Name"
  },
  wifi_type: {
    ko: "종류",
    en: "Type"
  },
  wifi_identity: {
    ko: "아이디",
    en: "Identity"
  },
  confirm: {
    ko: "확인",
    en: "Confirm"
  },
  reset: {
    ko: "초기화",
    en: "Reset"
  },
  wifi_signal: {
    ko: "신호세기",
    en: "Signal"
  },
  wifi_psk: {
    ko: "암호화방식",
    en: "Encryption"
  },
  usedata: {
    ko: "사용성 데이터",
    en: "Used Data"
  },
  home_description: {
    ko: "시스템 정보 확인, 설정하기",
    en: "Checking system information and set it"
  },
  device_description: {
    ko: "로봇 부품 제어, 센서 데이터 확인하기",
    en: "Controlling robot parts and check sensor data"
  },
  motion_description: {
    ko: "서보 모터 제어, 나만의 모션 만들기",
    en: "Controlling servo motor and create your own motion"
  },
  vision_description: {
    ko: "이미지 분석, 비전 인공지능 이해하기",
    en: "Image analysis and Understand vision artificial intelligence"
  },
  speech_description: {
    ko: "자연어 처리, 보이스 인공지능 이해하기",
    en: "Natural Language Processing and Understand Voice AI"
  },
  simulator_description: {
    ko: "나만의 로봇 동작 시퀀스 만들기",
    en: "Creating Your Own Robot Motion Sequences"
  },
  system_settings: {
    ko: "시스템 설정",
    en: "System settings"
  },
  volume_setting: {
    ko: "소리크기 설정하기",
    en: "Set volume"
  },
  eyecolor_checking : {
    ko: "눈 색상 확인하기",
    en: "Check eye color"
  },
  poweroff : {
    ko: "종료하기",
    en: "Poweroff"
  },
  restart : {
    ko: "재시작하기",
    en: "Restart"
  },
  restore : {
    ko: "초기화하기",
    en: "Restore"
  },
  swupdate : {
    ko: "업데이트하기",
    en: "S/W Update"
  },

  eyecolor_setting : {
    ko: "눈 색상 조정하기",
    en: "Set eye color"
  },

  save : {
    ko: "저장하기",
    en: "Save"
  },

  right: {
    ko: "오른쪽",
    en: "Right"
  },
  left: {
    ko: "왼쪽",
    en: "Left"
  },
  red : {
    ko: "빨강",
    en: "Red"
  },
  green : {
    ko: "초록",
    en: "Green"
  },
  blue : {
    ko: "파랑",
    en: "Blue"
  },
  audio_use : {
    ko: "오디오 사용하기",
    en: "Use audio"
  },
  mic : {
    ko: "마이크",
    en: "Mic"
  },
  file : {
    ko: "파일",
    en: "File"
  },
  second: {
    ko: "초",
    en: "sec"
  },
  record : {
    ko: "녹음하기",
    en: "Record"
  },
  replay : {
    ko: "다시듣기",
    en: "Replay"
  },
  audio_play : {
    ko: "음악재생",
    en: "Play Audio"
  },

  category : {
    ko: "카테고리",
    en: "Category"
  },
  animal_audio : {
    ko: "동물",
    en: "Animal"
  },
  effect : {
    ko: "효과음",
    en: "Effect"
  },
  music : {
    ko: "음악",
    en: "Music"
  },
  piano : {
    ko: "피아노",
    en: "Piano"
  },
  voice: {
    ko: "목소리",
    en: "Voice"
  },
  myaudio: {
    ko: "내 오디오",
    en: "My audio"
  },
  play: {
    ko: "재생하기",
    en: "Play"
  },
  stop: {
    ko: "정지하기",
    en: "Stop"
  },
  upload_to_myaudio: {
    ko: "내 오디오에 업로드하기",
    en: "Upload to my audio"
  },
  upload: {
    ko: "업로드",
    en: "Upload"
  },
  oled_use: {
    ko: "디스플레이(OLED) 사용하기",
    en: "Use the Display (OLED)"
  },
  reset: {
    ko: "초기화하기",
    en: "Reset"
  },
  enter_text: {
    ko: "문자입력하기",
    en: "Enter text"
  },
  display: {
    ko: "출력하기",
    en: "Display"
  },

  animal_image: {
    ko: "동물",
    en: "Animal"
  },
  expression: {
    ko: "표정",
    en: "Expression"
  },
  family: {
    ko: "가족",
    en: "Family"
  },
  food: {
    ko: "음식",
    en: "Food"
  },
  furniture: {
    ko: "가구",
    en: "Furniture"
  },
  game: {
    ko: "가위바위보",
    en: "Game"
  },
  goods: {
    ko: "잡화",
    en: "Goods"
  },
  kitchen: {
    ko: "주방",
    en: "Kitchen"
  },
  machine: {
    ko: "도구",
    en: "Machine"
  },
  recycle: {
    ko: "재활용",
    en: "Recycle"
  },
  sport: {
    ko: "운동",
    en: "Sport"
  },
  transport: {
    ko: "교통",
    en: "Transport"
  },
  weather: {
    ko: "날씨",
    en: "Weather"
  },
  marker: {
    ko: "마커",
    en: "Marker"
  },
  etc: {
    ko: "기타 이미지",
    en: "Etc"
  },
  sample: {
    ko: "샘플 이미지",
    en: "Sample"
  },
  myimage: {
    ko: "내 이미지",
    en: "My image"
  },
  enter_image_robot: {
    ko: "사진입력하기(로봇)",
    en: "Enter image stored in the Robot"
  },
  enter_image_pc: {
    ko: "사진입력하기(PC)",
    en: "Enter image stored in the PC"
  },
  upload_to_myimage: {
    ko: "내 이미지에 업로드하기",
    en: "Upload to my image"
  },
  check_sensor: {
    ko: "센서 인식하기",
    en: "Check sensor"
  },
  check_pir: {
    ko: "인체감지",
    en: "PIR"
  },
  check_touch: {
    ko: "터치센서",
    en: "TOUCH"
  },
  init_motors: {
    ko: "원래자세",
    en: "Init motors"
  },
  time: {
    ko: "시간",
    en: "Time"
  },
  add: {
    ko: "추가하기",
    en: "Add"
  },
  play_cycle: {
    ko: "반복",
    en: "Cycle"
  },
  execute: {
    ko: "실행하기",
    en: "Execute"
  },
  remove_all: {
    ko: "모두 지우기",
    en: "Remove all"
  },
  motion_name: {
    ko: "모션이름",
    en: "Motion name"
  },
  register: {
    ko: "등록하기",
    en: "Register"
  },
  load: {
    ko: "불러오기",
    en: "Load"
  },
  remove: {
    ko: "삭제하기",
    en: "Remove"
  },
  example: {
    ko: "예제",
    en: "Example"
  },
  camera: {
    ko: "카메라",
    en: "Camera"
  },
  vision_use: {
    ko: "Vision 사용하기",
    en: "Use vision"
  },
  function_setting: {
    ko: "기능 설정",
    en: "Functions"
  },
  v_grayscale: {
    ko: "흑백",
    en: "Grayscale"
  },
  v_canny: {
    ko: "윤곽선",
    en: "Canny Edge"
  },
  v_edgePreservingFilter: {
    ko: "흐리게",
    en: "edgePreservingFilter"
  },
  v_cartoon: {
    ko: "만화",
    en: "Cartoon"
  },
  v_sketch_g: {
    ko: "스케치(흑백)",
    en: "Sketch(grayscale)"
  },
  v_sketch_rgb: {
    ko: "스케치(컬러)",
    en: "Sketch(rgb)"
  },
  v_detail: {
    ko: "선명도개선",
    en: "Detail enhancement"
  },
  v_qr: {
    ko: "QR코드",
    en: "QR code"
  },
  v_face: {
    ko: "얼굴분석",
    en: "Face analysis"
  },
  v_face_landmark: {
    ko: "얼굴분석(랜드마크)",
    en: "Face landmark"
  },
  v_object: {
    ko: "사물인식",
    en: "Object detection"
  },
  v_classify: {
    ko: "이미지분류",
    en: "Image classification"
  },
  v_pose: {
    ko: "포즈인식",
    en: "Human pose"
  },
  v_tm: {
    ko: "티쳐블머신",
    en: "Teachable machine"
  },
  v_tm_model: {
    ko: "티쳐블머신 모델",
    en: "Teachable machine Model"
  },
  v_track: {
    ko: "사물 트래킹",
    en: "Object tracking"
  },
  v_marker: {
    ko: "마커인식",
    en: "Marker detection"
  },
  v_marker_length: {
    ko: "마커길이",
    en: "Marker length"
  },
  save_image: {
    ko: "사진저장하기",
    en: "Save image"
  },
  save_images: {
    ko: "사진 10장 저장하기",
    en: "Save 10 images"
  },
  camera_position: {
    ko: "카메라 위치 조정",
    en: "Camera postion control"
  },
  result: {
    ko: "결과",
    en: "Result"
  },
  speak: {
    ko: "말하기",
    en: "Speak"
  },
  voice_type: {
    ko: "음성종류",
    en: "Voice type"
  },
  language_type: {
    ko: "언어종류",
    en: "Language type"
  },
  s_lang_en : {
    ko: "영어",
    en: "English"
  },
  s_lang_ko : {
    ko: "한국어",
    en: "Korean"
  },
  s_lang_es : {
    ko: "스페인어",
    en: "Spanish"
  },
  s_lang_fr : {
    ko: "프랑스어",
    en: "French"
  },
  s_lang_de : {
    ko: "독일어",
    en: "German"
  },
  s_lang_zhcn : {
    ko: "중국어",
    en: "Chinese (Simplified)"
  },
  s_lang_ja : {
    ko: "일본어",
    en: "Japanese"
  },
  s_lang_ru : {
    ko: "러시아어",
    en: "Russian"
  },
  s_lang_ar : {
    ko: "아랍어",
    en: "Arabic"
  },
  s_lang_hi : {
    ko: "힌디어",
    en: "Hindi"
  },
  s_lang_la : {
    ko: "라틴어",
    en: "Latin"
  },
  espeak: {
    ko: "기본음성",
    en: "Espeak"
  },
  main: {
    ko: "파이보(ko)",
    en: "Pibo(ko)"
  },
  man: {
    ko: "남성(ko)",
    en: "Man(ko)"
  },
  woman: {
    ko: "여성(ko)",
    en: "Woman(ko)"
  },
  boy: {
    ko: "소년(ko)",
    en: "Boy(ko)"
  },
  girl: {
    ko: "소녀(ko)",
    en: "Girl(ko)"
  },
  e_gtts: {
    ko: "구글음성(en)",
    en: "Google TTS(en)"
  },
  gtts: {
    ko: "구글음성(ko)",
    en: "Google TTS(ko)"
  },
  tts: {
    ko: "음성합성",
    en: "TTS"
  },
  talk: {
    ko: "대화하기",
    en: "Talk"
  },
  conversation_dataset: {
    ko: "대화 데이터셋",
    en: "Conversation dataset"
  },
  question: {
    ko: "질문",
    en: "Question"
  },
  answer: {
    ko: "대답",
    en: "Answer"
  },
  conversation_record: {
    ko: "대화기록 (최근 대화 10개)",
    en: "Conversation history (10 recent conversations)"
  },
  
  // alert
  file_ok: {
    ko: "파일 전송이 완료되었습니다.",
    en: "File transfer complete."
  },
  file_error: {
    ko: "파일 전송 오류입니다.",
    en: "File transfer error."
  },
  range_warn: {
    ko: (min, max) => {return `${min} ~ ${max} 사이를 입력하세요.`},
    en: (min, max) => {return `Enter between ${min} and ${max}.`},
  },
  motion_empty: {
    ko: "저장된 동작이 없습니다.\n먼저 동작을 저장해주세요.",
    en: "There are no saved moves.\nPlease save your moves first."
  },
  motion_name_empty: {
    ko: "먼저 모션이름을 입력하세요.",
    en: "Enter the motion name first."
  },
  voice_enable: {
    ko: "음성을 활성화해주세요.",
    en: "Please activate your voice."
  },
  text_empty: {
    ko: "문장을 입력하세요.",
    en: "Please enter a sentence."
  },
  text_size_limit: {
    ko: (max_limit) => { return `문장을 (${max_limit}자 이내로 작성해주세요.)`},
    en: (max_limit) => { return `Please write your sentences in ${max_limit} characters or less.`}    
  },
  oled_input_error: {
    ko: "입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50",
    en: "Invalid input value.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50"
  },
  audio_input_error: {
    ko: "입력 값이 잘못되었습니다.\n녹음시간: 1 ~ 30초",
    en: "Invalid input value.\nRecoding Time: 1 ~ 30s"
  },
  music_name_empty: {
    ko: "음악을 선택하세요.",
    en: "Choose your music."
  },
  reset_ok: {
    ko: "초기화가 완료되었습니다.",
    en: "Initialization complete."
  },
  sequence_exist: {
    ko: "이미 존재하는 시퀀스입니다.",
    en: "This sequence already exists."
  },
  title_empty: {
    ko: "먼저 제목을 입력하세요.",
    en: "Enter the title name first."
  },
  remove_timeline_empty: {
    ko: "삭제할 타임라인을 선택하세요.",
    en: "Select the timeline to delete."
  },
  execute_timeline_empty: {
    ko: "실행할 타임라인을 선택하세요.",
    en: "Select the timeline to execute."
  },
  not_complete_setting: {
    ko: "설정을 완료하세요.",
    en: "Please complete the setup."
  },
  unit_warn: {
    ko: (unit) => { return `${unit} 초 단위로 입력하세요.`},
    en: (unit) => { return `Enter in ${unit} seconds.`}
  },
  confirm_wifi: {
    ko: "\n\n로봇의 Wifi 정보를 변경하시겠습니까?\nWifi 정보를 한번 더 확인하시기 바랍니다.\n(잘못된 정보 입력 시, 심각한 오류가 발생할 수 있습니다.)",
    en: "\n\nAre you sure you want to change the wifi information of the robot?\nPlease check the wifi information once more.\n(Serious errors may occur if you enter incorrect information.)"
  },
  confirm_poweroff: {
    ko: "정말 종료하시겠습니까?",
    en: "Are you sure you want to quit?"
  },
  confirm_restart: {
    ko: "재시작하시겠습니까?",
    en: "Are you sure you want to restart?",
  },
  confirm_swupdate: {
    ko: "업데이트를 하시겠습니까?(인터넷 연결 상태에서 진행하세요.)",
    en: "Do you want to update? (Proceed while connected to the Internet.)"
  },
  confirm_restore: {
    ko: "초기화하시겠습니까?",
    en: "Are you sure you want to reset?"
  },
  confirm_motion_delete: {
    ko: (t) => {return `${t} 초 항목을 삭제하시겠습니까?`},
    en: (t) => {return `Are you sure you want to delete items ${t} seconds?`}
  },
  confirm_motion_delete_all: {
    ko: "테이블을 모두 지우시겠습니까?",
    en: "Are you sure you want to clear all tables?"
  },
  confirm_motion_register: {
    ko: (name) => {return `${name} 모션을 등록하시겠습니까?`},
    en: (name) => {return `Are you sure you want to register motion ${name}?`}
  },
  confirm_motion_load: {
    ko: (name) => {return `${name} 모션을 불러오시겠습니까?`},
    en: (name) => {return `Would you like to load motion ${name}?`}
  },
  confirm_motion_delete: {
    ko: (name) => {return `${name} 모션을 삭제하시겠습니까?`},
    en: (name) => {return `Are you sure you want to delete motion ${name}?`}
  },
  confirm_motion_delete_all: {
    ko: "모션을 모두 삭제하시겠습니까?",
    en: "Are you sure you want to delete all motion?"
  },
  confirm_eyecolor_save: {
    ko: "눈 색상을 저장하시겠습니까?",
    en: "Would you like to save eye color?"
  },
  confirm_current_sequence_delete: {
    ko: "현재 편집 중인 시퀀스입니다. 삭제하시겠습니까?",
    en: "This sequence is currently being edited. Are you sure you want to delete it?"
  },
  confirm_sequence_delete: {
    ko: (name) => {return `${name} 시퀀스를 삭제하시겠습니까?`},
    en: (name) => {return `Are you sure you want to delete sequence ${name}?`}
  },
  confirm_sequence_delete_all: {
    ko: "시퀀스를 모두 삭제하시겠습니까?",
    en: "Are you sure you want to delete all sequence?"
  },
  confirm_sequence_timeline: {
    ko: "선택된 시간에 설정된 내용을 삭제하시겠습니까?",
    en: "Are you sure you want to delete the settings at the selected time?"
  },
  move_to_ide: {
    ko: "IDE로 이동하시겠습니까?",
    en: "Would you like to move to the IDE?"
  },
  simulator_activate_warn: {
    ko: '파이보 메이커를 활성화한 후 사용해주세요.',
    en: 'Please activate Pibo Maker before using it.'
  },
  sequence_warn: {
    ko: "선택된 시퀀스가 없습니다. 새 시퀀스를 만들거나 저장된 시퀀스를 불러오기하여 시퀀스를 설정하세요.",
    en: "No sequence selected. Set up a sequence by creating a new sequence or loading a saved sequence."
  },
  unfold: {
    ko: "펼치기",
    en: "Unfold"
  },
  fold: {
    ko: "접기",
    en: "Fold"
  },
  name: {
    ko: "이름",
    en: "Name"
  },
  label_small_guide: {
    ko: "영문 및 숫자만을 이용하여 입력하세요.",
    en: "Please enter using only English letters and numbers."
  },
  eye_color: {
    ko: "눈 색상",
    en: "Eye Color"
  },
  type: {
    ko: "분류",
    en: "Type"
  },
  oled: {
    ko: "디스플레이",
    en: "Oled"
  },
  saved_sequence_list: {
    ko: "저장된 시퀀스 목록",
    en: "List of saved sequences"
  },
  new_sequence_create: {
    ko: "새 시퀀스 만들기",
    en: "Create a sew sequence"
  },
  no_sequence: {
    ko: "저장된 시퀀스가 없습니다.",
    en: "There are no saved sequences."
  },
  sequence_contents_time: {
    ko: "시간별 시퀀스 내용 설정",
    en: "Sequence content by time"
  },
  execute_from_time: {
    ko: "초 부터 실행",
    en: "second start"
  },
  content: {
    ko: "내용",
    en: "Cont"
  },
  position: {
    ko: "위치",
    en: "Position"
  },
  size: {
    ko: "크기",
    en: "Size"
  },
  motion: {
    ko: "모션",
    en: "Motion"
  },
  repeat: {
    ko: "반복",
    en: "Repeat"
  },
  audio: {
    ko: "오디오",
    en: "Audio"
  },
  sequence_timeline: {
    ko: "시퀀스 타임라인",
    en: "Sequence timeline"
  },
  default: {
    ko: "기본",
    en: "Default"
  },
  custom: {
    ko: "사용자",
    en: "Custom"
  },
  mymotion: {
    ko: "내 모션",
    en: "My motion"
  },
  text: {
    ko: "문자",
    en: "Text"
  },
  image: {
    ko: "이미지",
    en: "Image"
  },
  select: {
    ko: "선택",
    en: "Select"
  },
  select_audio: {
    ko: "오디오 파일을 선택하세요.",
    en: "Choose an audio file."
  },
  select_image: {
    ko: "이미지를 선택하세요.",
    en: "Choose an image."
  },
  select_image_type: {
    ko: "이미지 종류를 선택하세요.",
    en: "Choose an image type."
  },
  select_motion: {
    ko: "모션을 선택하세요.",
    en: "Choose an motion."
  },
  import: {
    ko: "가져오기",
    en: "Import"
  },
  export: {
    ko: "내보내기",
    en: "Export"
  }
};

const setLanguage = (lang) => {
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(element => {
      const key = element.getAttribute('data-key');
      if (translations[key] && translations[key][lang]) {
          element.textContent = translations[key][lang];
      }
  });
}

const language = document.getElementById("language");
language.value = lang;
setLanguage(lang);
localStorage.setItem("language", lang);

language.addEventListener("change", () => {
  lang = language.value;
  setLanguage(lang);
  localStorage.setItem("language", lang);
})
