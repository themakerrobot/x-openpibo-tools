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
  confirm_wifi: {
    ko: "\n\n로봇의 Wifi 정보를 변경하시겠습니까?\nWifi 정보를 한번 더 확인하시기 바랍니다.\n(잘못된 정보 입력 시, 심각한 오류가 발생할 수 있습니다.)",
    en: "\n\nAre you sure you want to change the wifi information of the robot?\nPlease check the wifi information once more.\n(Serious errors may occur if you enter incorrect information.)"
  },
  move_to_tool: {
    ko: "Tools로 이동하시겠습니까?",
    en: "Are you sure you want to go to Tools?"
  },
  file_error: {
    ko: "파일전송 오류",
    en: "File Transfer error."
  },
  file_ok: {
    ko: "파일전송 완료",
    en: "File transfer ok."
  },
  nofile: {
    ko: "파일없음.",
    en: "No file found."
  },
  not_load_block: {
    ko: "블록 데이터를 불러오지 못했습니다.",
    en: "Failed to load block data."
  },
  not_move_parent: {
    ko: "더이상 상위 폴더로 이동할 수 없습니다.",
    en: "Cannot move further up in the folder hierarchy"
  },
  confirm_load_file: {
    ko: ( filepath ) => { return `${filepath} 파일을 불러오겠습니까?` },
    en: ( filepath ) => { return `Would you like to load ${filepath}?` }
  },
  confirm_save_file: {
    ko: ( filepath ) => { return `${filepath} 파일을 저장하지 않았습니다. 저장하시겠습니까?` },
    en: ( filepath ) => { return `${filepath} not saved.Would you like to save it?` }
  },
  confirm_delete_file: {
    ko: ( filepath ) => { return `${filepath} 파일 또는 폴더를 삭제하시겠습니까?` },
    en: ( filepath ) => { return `Are you sure you want to delete the file or folder ${filepath}?` }
  },
  confirm_rename: {
    ko: ( oldname, newname ) => { return `${oldname} 파일 또는 폴더의 이름을 ${newname}으로 변경하시겠습니까?` },
    en: ( oldname, newname ) => { return `Are you sure you want to rename the file or folder ${oldname} to ${newname}?` },
  },
  confirm_poweroff: {
    ko: "정말 종료하시겠습니까?",
    en: "Are you sure you want to quit?"
  },
  confirm_restart: {
    ko: "재시작하시겠습니까?",
    en: "Are you sure you want to restart?",
  },
  check_newfolder_name: {
    ko: "새폴더의 이름을 입력하세요.",
    en: "Enter a name for the new folder."
  },
  check_newfile_name: {
    ko: "새파일의 이름을 입력하세요.",
    en: "Enter a name for the new file."
  },
  name_size_limit: {
    ko: (max_limit) => { return ` (${max_limit}자 이하로 입력해주세요.)`},
    en: (max_limit) => { return `Enter within ${max_limit} characters or less.`}
  },
  upload: {
    ko: "업로드",
    en: "Upload"
  },
  add_directory: {
    ko: "새폴더",
    en: "new folder"
  },
  add_file: {
    ko: "새파일",
    en: "new file"
  },
  python: {
    ko: "파이썬",
    en: "Python"
  },
  block: {
    ko: "블록",
    en: "Block"
  },
  execute: {
    ko: "실행",
    en: "Run"
  },
  stop: {
    ko: "정지",
    en: "Stop"
  },
  save : {
    ko: "저장",
    en: "Save"
  },
  reset: {
    ko: "초기화",
    en: "Reset"
  },
  logic: {
    ko: "논리",
    en: "Logic"
  },
  loops: {
    ko: "반복",
    en: "Loops"
  },
  math: {
    ko: "수학",
    en: "Math"
  },
  text: {
    ko: "문자",
    en: "Text"
  },
  lists: {
    ko: "목록",
    en: "Lists"
  },
  colour: {
    ko: "색상",
    en: "Colour"
  },
  variables: {
    ko: "변수",
    en: "Variables"
  },
  functions: {
    ko: "함수",
    en: "Functions"
  },
  audio: {
    ko: "소리",
    en: "Audio"
  },
  collect: {
    ko: "수집",
    en: "Collect"
  },
  device: {
    ko: "장치",
    en: "Device"
  },
  motion: {
    ko: "동작",
    en: "Motion"
  },
  oled: {
    ko: "화면",
    en: "Oled"
  },
  speech: {
    ko: "음성",
    en: "Speech"
  },
  vision: {
    ko: "시각",
    en: "Vision"
  },
  utils: {
    ko: "도구",
    en: "Utils"
  },
  mymotion: {
    ko: "나의 모션",
    en: "My motion"
  },
  filename: {
    ko: "파일 이름",
    en: "Filename"
  },
  image_filename: {
    ko: "이미지 파일 이름",
    en: "Image filename"
  },
  audio_filename: {
    ko: "오디오 파일 이름",
    en: "Audio filename"
  },
  model_filename: {
    ko: "모델 파일 이름",
    en: "Model filename"
  },
  label_filename: {
    ko: "라벨 파일 이름",
    en: "Label filename"
  },
  csv_filename: {
    ko: "csv 파일 이름",
    en: "csv filename"
  },
  keyname: {
    ko: "키 이름",
    en: "Key name"
  },
  path: {
    ko: "경로",
    en: "Path"
  },
  robot: {
    ko: "로봇",
    en: "Robot"
  },
  sample_text: {
    ko: "안녕하세요",
    en: "Hello"
  },
  abc: {
    ko: "가나다",
    en: "abc"
  },
  a: {
    ko: "가",
    en: "a"
  },
  b: {
    ko: "나",
    en: "b"
  },
  c: {
    ko: "다",
    en: "c"
  },
  confirm_block_file: {
    ko: "파일을 선택하거나, 새파일을 생성하세요.",
    en: "Select a file or create a new one."
  },
  file_number_limit: {
    ko: (max_limit) => { return `파일은 ${max_limit}개 이하로 업로드해주세요.`},
    en: (max_limit) => { return `Upload within ${max_limit} files or less.`}
  },
  enter: {
    ko: "입력",
    en: "Enter"
  }
};
