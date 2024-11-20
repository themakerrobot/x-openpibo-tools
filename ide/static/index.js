let fullscreen = false;
$('#fullscreen_txt').html(
  fullscreen?
  '<i class="fa-solid fa-minimize fa-xl"></i>':
  '<i class="fa-solid fa-maximize fa-xl"></i>'
);

$('#fullscreen_bt').on('click', ()=>{
  if (!fullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
    fullscreen=true;
    $('#fullscreen_txt').html('<i class="fa-solid fa-minimize fa-xl"></i>');
  }
  else if (fullscreen && document.exitFullscreen) {
    document.exitFullscreen();
    fullscreen=false;
    $('#fullscreen_txt').html('<i class="fa-solid fa-maximize fa-xl"></i>');
  }
  else {}
});

$('#guide_bt').on('click', () => {
  window.open('https://themakerrobot.github.io/openpibo-python/build/html/index.html');
});

const init_usedata = {
  staytime:0, 
  home:{click:0, keydown:0, staytime:0},
  device:{click:0, keydown:0, staytime:0},
  motion:{click:0, keydown:0, staytime:0},
  vision:{click:0, keydown:0, staytime:0},
  speech:{click:0, keydown:0, staytime:0},
  simulator:{click:0, keydown:0, staytime:0},
  block:{click:0, keydown:0, execute:0, staytime:0},
  python:{click:0, keydown:0, execute:0, staytime:0}
};
const system_port = 8080;
let usedata = init_usedata; // from server
const MAX_FILENAME_LENGTH = 50;
const MAX_FILE_NUMBER = 10;
const codeEditor = CodeMirror.fromTextArea(
  document.getElementById("codemirror-code"),
  {
    lineNumbers: "true",
    //lineWrapping: "true",
    mode: "python",
    theme: "cobalt",
    extraKeys: {
      "Ctrl-S": function (instance) {
        if ($("#codepath").html() == "") {
          alert(translations['nofile'][lang]);
          return;
        }
        saveCode = codeEditor.getValue();
        CodeMirror.signal(codeEditor, "change");
        socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
      },
      "Ctrl-/": "toggleComment"
    },
  }
);

const execute = document.getElementById("execute");
const stop = document.getElementById("stop");
const codeTypeBtns = document.querySelectorAll("div[name=codetype] button");
const result = document.getElementById("result");
const socket = io();

let CURRENT_DIR;
let CODE_PATH = '';
let BLOCK_PATH = '';
let saveCode = "";
let saveBlock = "{}";

$("#logo_bt").on("click", () => {
  location.href = `http://${location.hostname}`;
});

$("#fontsize").on("change", () => {
  document.querySelector("div.CodeMirror").style.fontSize = `${$("#fontsize").val()}px`;
  codeEditor.refresh();
  document.getElementById("result").style.fontSize = `${$("#fontsize").val()}px`;
});

socket.on("update", (data) => {
  if ("code" in data) {
    const oldpath = $("#codepath").html();
    $("#codepath").html(data["filepath"]);

    if(oldpath != "" || data["code"] != "") {
      let codetype = "";
      codeTypeBtns.forEach((el) => {
        if (el.classList.value.includes("checked")) codetype = el.name;
      });
      if (codetype == "block") {
        try {
          Blockly.serialization.workspaces.load(JSON.parse(data["code"]), workspace);
          if(data["code"] != "{}" && 'blocks' in JSON.parse(data["code"])) {
            for(jdata of JSON.parse(data["code"])["blocks"]["blocks"]) {
              findBlocks({block:jdata})
            }
          }
          saveBlock = data["code"];
          update_block();
        }
        catch(e) {
          if(data["code"] == "") {
            saveBlock = "{}";
            Blockly.serialization.workspaces.load(JSON.parse("{}"), workspace);
            update_block();
          }
          else {
            alert(translations['not_load_block'][lang]);
            $("#codepath").html(oldpath);
          }
        }
      }
      else {
        saveCode = data["code"];
        codeEditor.setValue(saveCode);
      }
    }
  }

  if ("image" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#image").prop("src", `data:image/jpeg;charset=utf-8;base64,${data["image"]}`);
  }

  if ("audio" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#audio").prop("src", `data:audio/mpeg;charset=utf-8;base64,${data["audio"]}`);
  }

  if ("record" in data) {
    result.value = data["record"];
    result.scrollTop = result.scrollHeight;
    execute.classList.add("disabled");
    stop.classList.remove("disabled");
    execute.disabled = true;
    stop.disabled = false;
  }

  if ("dialog" in data) {
    alert(data["dialog"]);
  }

  if ("exit" in data) {
    execute.classList.remove("disabled");
    stop.classList.add("disabled");
    execute.disabled = false;
  }
});

function findBlocks(data) {
  if (data && typeof data === 'object') {
    if ('block' in data) {
      jdata = data['block'];
      if(jdata['type'].includes('_dynamic')) {
        updateSecondDropdown.call(workspace.getBlockById(jdata['id']), jdata['fields']['dir'], jdata['fields']['filename'])
      }
    }
    for (const key in data) {
      findBlocks(data[key]);
    }
  }
}
socket.emit("init");
socket.on("init", (d) => {
  let filepath = d["codepath"];
  let file_extension = filepath.substring(filepath.lastIndexOf(".")+1, filepath.length).toLowerCase();

  if(file_extension == "py") {
    saveCode = d["codetext"];
    codeEditor.setValue(saveCode);

    codeTypeBtns.forEach((el) => {
      if (el.name == "python") el.classList.add("checked");
      else el.classList.remove("checked");
    });
    $("#codepath").text(d["codepath"]);
    $("#codeDiv").show();
    $("#blocklyDiv").hide();
    setLanguage(lang);
  }
  else {
    try {
      codeTypeBtns.forEach((el) => {
        if (el.name == "block") el.classList.add("checked");
        else el.classList.remove("checked");
      });

      Blockly.serialization.workspaces.load(JSON.parse(d["codetext"]), workspace);
      if(d["codetext"] != "{}" && 'blocks' in JSON.parse(d["codetext"])) {
        for(jdata of JSON.parse(d["codetext"])["blocks"]["blocks"]) {
          findBlocks({block:jdata})
        }
      }
      saveBlock = d["codetext"];
      update_block();
      $("#codepath").text(d["codepath"]);
    }
    catch(e) {
      if(d["codetext"] == "") {
        saveBlock = "{}";
        Blockly.serialization.workspaces.load(JSON.parse("{}"), workspace);
        update_block();
        $("#codepath").text(d["codepath"]);
      }
      else {
        $("#codepath").html("");
      }
    }
    finally {
      $("#codeDiv").hide();
      $("#blocklyDiv").show();
      setLanguage(lang);
      Blockly.svgResize(workspace);
    }
  }

  CURRENT_DIR = d["path"].split("/");
  socket.emit("load_directory", CURRENT_DIR.join("/"));
});

socket.on("system", (data) => {
  $("#s_serial").text(data[0]);
  $("#s_os_version").text(data[1]);
  $("#s_runtime").text(`${Math.floor(data[2] / 3600)} hours`);
  $("#s_cpu_temp").text(data[3]);
  $("#s_memory").text(`${Math.floor(data[5]/data[4]/4*100)} %`);
  $("#s_network").html(`<i class="fas fa-network-wired"></i> ${data[7]}, <i class="fa-solid fa-wifi"></i> ${data[6]}/${data[8]}`);
  $("#network_info").html(`<i class="fas fa-network-wired"></i> ${data[7]}, <i class="fa-solid fa-wifi"></i> ${data[6]}/${data[8]}`);
});

let startTime_item = new Date().getTime();

codeTypeBtns.forEach((btn) => {
  const handler = (e) => {
    let before_codetype = "";
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) before_codetype = el.name;
    });
    codeTypeBtns.forEach((el) => el.classList.remove("checked"));
    const target = e.currentTarget;
    target.classList.add("checked");

    usedata[target.name]["staytime"] += parseInt((new Date().getTime() - startTime_item) / 1000);
    startTime_item = new Date().getTime();

    if (target.name == "block") {
      if (before_codetype != "block") {
        $("#codeDiv").hide();
        $("#blocklyDiv").show();
        CODE_PATH = $("#codepath").html();
        $("#codepath").html(BLOCK_PATH);
      }
    }
    else {
      if (before_codetype == "block") {
        $("#blocklyDiv").hide();
        $("#codeDiv").show();
        BLOCK_PATH = $("#codepath").html();
        $("#codepath").html(CODE_PATH);
      }
    }
    setLanguage(lang);
    Blockly.svgResize(workspace);
  };
  btn.addEventListener("click", handler);
});

codeEditor.on("change", () => {
  $("#codecheck").html(saveCode==codeEditor.getValue() ? "" : "<i class='fa-solid fa-circle'></i>");
});

execute.addEventListener("click", () => {
  let filepath = $("#codepath").html();
  if (filepath == "") {
    alert(translations['nofile'][lang]);
    return;
  }

  let codetype = "";
  let codepath = "";
  result.value = "";

  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  if (codetype == "block") {
    // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
    //   alert("json 파일만 실행 가능합니다.");
    //   return;
    // }
    saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
    socket.emit("save", { 
      codepath: filepath, 
      codetext: saveBlock 
    });
    update_block();
    // for block
    socket.emit("executeb", { codetype: "python", codepath: "/home/pi/blockly.py", codetext: Blockly.Python.workspaceToCode(workspace) });
  }
  else {
    saveCode = codeEditor.getValue();
    codepath = $("#codepath").html();
    CodeMirror.signal(codeEditor, "change");
    socket.emit("execute", { codetype: codetype, codepath: codepath, codetext: saveCode });
  }

  execute.classList.add("disabled");
  stop.classList.remove("disabled");
  execute.disabled = true;
  stop.disabled = false;
  $("#respath").text($("#codepath").html());

  usedata[codetype]["execute"]++;
  localStorage.setItem("usedata", JSON.stringify(usedata));
});

stop.addEventListener("click", () => {
  socket.emit("stop");
  stop.disabled = true;
});

socket.on("update_file_manager", (d) => {
  CURRENT_DIR = "path" in d?d["path"].split("/"):CURRENT_DIR;
  $('#path').text( CURRENT_DIR.join("/"));
  $("#fm_table > tbody").empty();

  let data;
  if ($("#hiddenfile").is(":checked") == false) {
   data = [];
   for (let i = 0; i < d['data'].length; i++)
     if (d['data'][i].name[0] != ".")
       data.push(d['data'][i])
  }
  else {
    data = d['data'];
  }

  data.unshift({name:"..", type:""});
  for (let i = 0; i < data.length; i++) {
    $("#fm_table > tbody").append(
      $("<tr>")
        .append(
          $("<td style='width:30px;text-align:center'>").append(`<i class='fa-solid fa-${data[i].type}'></i>`),
          $("<td>").append(data[i].name)
            .hover(
              function () { $(this).animate({ opacity: "0.3" }, 100); $(this).css("cursor", "pointer"); },
              function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
            )
            .click( function() {
              let idx = $(this).closest('tr').index();
              let type = $(`#fm_table tr:eq(${idx}) td:eq(0)`).html()
              let name = $(`#fm_table tr:eq(${idx}) td:eq(1)`).html()

              if (name == "..") {
                if (CURRENT_DIR.length < 4) {
                  alert(translations['not_move_parent'][lang]);
                  return;
                }
                CURRENT_DIR.pop();
                socket.emit("load_directory", CURRENT_DIR.join("/"));
              }
              else if (type.includes("folder")) {
                CURRENT_DIR.push(name);
                socket.emit("load_directory", CURRENT_DIR.join("/"));
              }
              else if (type.includes("file")){
                let ext = name.split(".");
                ext = ext[ext.length-1];
                let filepath = CURRENT_DIR.join("/") + "/" + name;

                if(confirm(translations['confirm_load_file'][lang](filepath)) == false) return;
                if (["jpg", "png", "jpeg"].includes(ext.toLowerCase())) {
                  socket.emit("view", filepath);
                }
                else if(["wav", "mp3"].includes(ext.toLowerCase())) {
                  socket.emit("play", filepath);
                }
                else {
                  let codetype = "";
                  codeTypeBtns.forEach((el) => {
                    if (el.classList.value.includes("checked")) codetype = el.name;
                  });
                  if (codetype == "block") {
                    // if(["json"].includes(ext.toLowerCase()) == false) {
                    //   alert("json 파일만 로드 가능합니다.");
                    //   return;
                    // }
                    if (saveBlock != JSON.stringify(Blockly.serialization.workspaces.save(workspace))) {
                      if(confirm(translations['confirm_save_file'][lang]($("#codepath").html())))
                        socket.emit("save", { codepath: $("#codepath").html(), codetext: JSON.stringify(Blockly.serialization.workspaces.save(workspace)) });
                    }
                  }
                  else {
                    if(saveCode != codeEditor.getValue()){
                      if(confirm(translations['confirm_save_file'][lang]($("#codepath").html())))
                        socket.emit("save", { codepath: $("#codepath").html(), codetext: codeEditor.getValue() });
                    }
                  }
                  socket.emit("load", filepath);
                }
              }
            })
            ,
            $("<td style='width:15px;text-align:center'>").append(data[i].type == "" || data[i].protect==true?"":`<a href='/download?filename=${data[i].name}'><i class='fa-solid fa-circle-down'></i></a>`)
            //$("<td style='width:15px;text-align:center'>").append(["", "folder"].includes(data[i].type) || data[i].protect==true?"":`<a href='/download?filename=${data[i].name}'><i class='fa-solid fa-circle-down'></i></a>`)
              .hover(
                function () { $(this).animate({ opacity: "0.3" }, 100); },
                function () { $(this).animate({ opacity: "1" }, 100); }
              )
            ,
            $("<td style='width:15px;text-align:center'>").append([""].includes(data[i].type) || data[i].protect==true?"":"<i class='fa-solid fa-pencil-alt'></i>")
            .hover(
              function () { $(this).animate({ opacity: "0.3" }, 100); },
              function () { $(this).animate({ opacity: "1" }, 100); }
            )
            .click(function () {
              if ($(this).html() == "") return;

              let idx = $(this).closest('tr').index();
              //let type = $(`#fm_table tr:eq(${idx}) td:eq(0)`).html();
              let name = $(`#fm_table tr:eq(${idx}) td:eq(1)`).html();
              let newname = prompt(translations['check_newfile_name'][lang], name);

              if (newname != null) {
                if(newname == "") {
                  alert(translations['check_newfile_name'][lang]);
                  return;
                }
                newname = newname.trim()//.replace(/ /g, "_");
                if(newname.length > MAX_FILENAME_LENGTH) {
                  alert(translations['name_size_limit'][lang](MAX_FILENAME_LENGTH));
                  return;
                }
              }
              else {
                return;
              }

              if (!confirm(translations['confirm_rename'][lang](name, newname))) return;

              if ($("#codepath").html().includes(CURRENT_DIR.join("/") + "/" + name)) {
                $("#codepath").html("");
              }
              if (CODE_PATH.includes(CURRENT_DIR.join("/") + "/" + name)) {
                CODE_PATH = "";
                saveCode = "";
                codeEditor.setValue(saveCode);
              }
              if (BLOCK_PATH.includes(CURRENT_DIR.join("/") + "/" + name)) {
                BLOCK_PATH = "";
                saveBlock = "{}";
                Blockly.serialization.workspaces.load(JSON.parse(saveBlock), workspace);
              }
              socket.emit('rename', {oldpath:CURRENT_DIR.join("/") + "/" + name, newpath: CURRENT_DIR.join("/") + "/" + newname});
            })
            ,
            $("<td style='width:15px;text-align:center'>").append([""].includes(data[i].type) || data[i].protect==true?"":"<i class='fa-solid fa-trash-can'></i>")
              .hover(
                function () { $(this).animate({ opacity: "0.3" }, 100); $(this).css("cursor", "pointer"); },
                function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
              )
              .click(function () {
                if ($(this).html() == "") return;

                let idx = $(this).closest('tr').index();
                //let type = $(`#fm_table tr:eq(${idx}) td:eq(0)`).html();
                let name = $(`#fm_table tr:eq(${idx}) td:eq(1)`).html();

                if (confirm(translations['confirm_delete_file'][lang](`${CURRENT_DIR.join("/")}/${name}`))) {
                  if ($("#codepath").html().includes(CURRENT_DIR.join("/") + "/" + name)) {
                    $("#codepath").html("");
                  }
                  if (CODE_PATH.includes(CURRENT_DIR.join("/") + "/" + name)) {
                    CODE_PATH = "";
                    saveCode = "";
                    codeEditor.setValue(saveCode);
                  }
                  if (BLOCK_PATH.includes(CURRENT_DIR.join("/") + "/" + name)) {
                    BLOCK_PATH = "";
                    saveBlock = "{}";
                    Blockly.serialization.workspaces.load(JSON.parse(saveBlock), workspace);
                  }
                  socket.emit('delete', CURRENT_DIR.join("/") + "/" + name);
                }
              })
            ,
        )
    );
  }
});

$("#hiddenfile").on("change", () => {
  socket.emit("load_directory", CURRENT_DIR.join("/"));
});

$("#add_directory").on("click", () => {
  let name = prompt(translations['check_newfolder_name'][lang]);
  if (name != null) {
    if(name == "") {
      alert(translations['check_newfolder_name'][lang]);
      return;
    }
    name = name.trim()//.replace(/ /g, "_");
    if(name.length > MAX_FILENAME_LENGTH) {
      alert(translations['name_size_limit'][lang](MAX_FILENAME_LENGTH));
      return;
    }

    socket.emit('add_directory', CURRENT_DIR.join("/") + "/"+ name);
  }
});

$("#log").on("click", () => {
  $("#result").slideToggle();
});

$("#add_file").on("click", () => {
  let name = prompt(translations['check_newfile_name'][lang]);
  if (name != null ) {
    if(name == "") {
      alert(translations['check_newfile_name'][lang]);
      return;
    }

    name = name.trim()//.replace(/ /g, "_");
    if(name.length > MAX_FILENAME_LENGTH) {
      alert(translations['name_size_limit'][lang](MAX_FILENAME_LENGTH));
      return;
    }
    if(saveCode != codeEditor.getValue()){
      if(confirm(translations['confirm_save_file'][lang]($("#codepath").html())))
        socket.emit("save", { codepath: $("#codepath").html(), codetext: codeEditor.getValue() });
    }
    socket.emit('add_file', CURRENT_DIR.join("/") + "/"+ name);
  }
});

$("#upload").on("change", (e) => {
  let upload_files = $("#upload")[0].files;

  if (upload_files.length > MAX_FILE_NUMBER) {
    alert(translations['file_number_limit'][lang](MAX_FILE_NUMBER));
    return;
  }
  for (item of upload_files) {
    if(item.name.length > MAX_FILENAME_LENGTH) {
      alert(translations['name_size_limit'][lang](MAX_FILENAME_LENGTH));
      return;
    }
  }

  let formData = new FormData();
  for (item of upload_files) {
    formData.append('data', item);
  }
  $("#upload").val("");
  $.ajax({
    url: `/upload`,
    type:'post',
    data: formData,
    contentType: false,
    processData: false
  })
  .always((xhr, status) => {
    if (status == "success") {
      alert(translations['file_ok'][lang]);
    } else {
      alert(`${translations['file_error'][lang]}\n >> ${xhr.responseJSON["result"]}`);
      $("#upload").val("");
    }
  });
});

$("#eraser").on("click", () => {
  // if ($("#terminal_check").is(":checked")) {
  //   $("#terminal").prop("src", `http://${location.hostname}:50001`);
  // }
  // else {
    result.value = "";
    $("#respath").text("");
    $("#prompt").val("");
    socket.emit('reset_log');
  // }
});
window.dispatchEvent(new Event('onresize'));
window.onresize = () => {
  if ($("#result_check").is(":checked") == false) {
    if (window.innerWidth < 1130) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if (window.innerWidth >= 1130 && window.innerWidth < 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if(window.innerWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(60vw - 190px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(60vw - 190px)';
    }
  }
  else {
    if (window.innerWidth < 1130) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if (window.innerWidth >= 1130 && window.innerWidth < 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if(window.innerWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
  }
}

$("#result_check").on("change", ()=> {
  //codeEditor.setSize(700, null);
  if ($("#result_check").is(":checked") == false) {
    $("#result_en").show();
    if(document.body.offsetWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(60vw - 190px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(60vw - 190px)';
    }
  }
  else {
    $("#result_en").hide();
    if(document.body.offsetWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
  }
  codeEditor.refresh();
  Blockly.svgResize(workspace);
});

// $("#terminal").prop("src", `http://${location.hostname}:50001`);
// $("#terminal_check").on("change", ()=> {
//   if ($("#terminal_check").is(":checked")) {
//     $("#result").hide();
//     $("#terminal").show();
//   }
//   else {
//     $("#result").show();
//     $("#terminal").hide();
//   }
// });

$("#home_bt").on("click", () => {
  if (confirm(translations["move_to_tool"][lang])) {
    location.href = `http://${location.hostname}`;
  }
});

$("#home_bt").hover(
  function () { $(this).animate({ opacity: "0.7" }, 100); $(this).css("cursor", "pointer"); },
  function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
);

$("#theme_check").on("change", () => {
  codeEditor.setOption(
    "theme",
    $("#theme_check").is(":checked")?"cobalt":"duotone-light"
  );
});

$("#save").on("click", () => {
  let filepath = $("#codepath").html();

  if (filepath == "") {
    alert(translations['nofile'][lang]);
    return;
  }
  let codetype = "";
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  if (codetype == "block") {
    // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
    //   alert("json 파일만 저장 가능합니다.");
    //   return;
    // }
    saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
    socket.emit("save", {
      codepath: "/home/pi/blockly.py",
      codetext: Blockly.Python.workspaceToCode(workspace) });
    socket.emit("save", { 
      codepath: $("#codepath").html(), 
      codetext: saveBlock 
    });
    result.value = Blockly.Python.workspaceToCode(workspace);
    update_block();
  }
  else {
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) codetype = el.name;
    });

    saveCode = codeEditor.getValue();
    CodeMirror.signal(codeEditor, "change");
    socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
  }
});

let update_block = () => {
  $("#codecheck").html(saveBlock==JSON.stringify(Blockly.serialization.workspaces.save(workspace)) ? "" : "<i class='fa-solid fa-circle fa-fade'></i>");
}

const workspace = Blockly.inject("blocklyDiv", {
  toolbox: lang == "en"? toolbox_en:toolbox_ko,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  css: true,
  media: "../static/",
  rtl: false,
  scrollbars: true,
  sounds: false,
  oneBasedIndex: true,
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ddd',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: false,
    startScale: 0.7,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true
  },
  move:{
    scrollbars: {
      horizontal: true,
      vertical: true
    },
    drag: true,
    wheel: true,
  },
  renderer:"zelos", // "zelos", "minimalist", "thrasos"
  theme: Blockly.Theme.defineTheme('modest', {
    'base': Blockly.Themes.Classic,
    startHats: true,
    fontStyle: {
      family: null,
      weight: 'bold',
      size: 16,
    },
    blockStyles: {
      logic_blocks: {
        colourPrimary: '#B098CB',
        colourSecondary: '#EDE7F6',
        colorTertiary: '#B39DDB',
      },
      loop_blocks: {
        colourPrimary: '#85B687',
        colourSecondary: '#E8F5E9',
        colorTertiary: '#66BB6A',
      },
      math_blocks: {
        colourPrimary: '#2196F3',
        colourSecondary: '#1E88E5',
        colorTertiary: '#0D47A1',
      },
      text_blocks: {
        colourPrimary: '#FFAA08',
        colourSecondary: '#555555',
        colorTertiary: '#FF8F00',
      },
      list_blocks: {
        colourPrimary: '#4DB6AC',
        colourSecondary: '#B2DFDB',
        colorTertiary: '#009688',
      },
      colour_blocks: {
        colourPrimary: '#DFADB2',
        colourSecondary: '#FFEBEE',
        colorTertiary: '#EF9A9A',
      },
      variable_blocks: {
        colourPrimary: '#EF9A9A',
        colourSecondary: '#EF9A9A',
        //colourSecondary: '#FFEBEE',
        colorTertiary: '#EF5350',
      },
      // variable_dynamic_blocks: {
      //   colourPrimary: '#EF9A9A',
      //   colourSecondary: '#FFEBEE',
      //   colorTertiary: '#EF5350',
      // },
      procedure_blocks: {
        colourPrimary: '#C7BCB8',
        colourSecondary: '#EFEBE9',
        colorTertiary: '#BCAAA4',
      },
    },
    categoryStyles: {
      // logic_category: {
      //   colour: '#D1C4E9'
      // },
      // loop_category: {
      //   colour: '#A5D6A7'
      // },
      // math_category: {
      //   colour: '#2196F3'
      // },
      // text_category: {
      //   colour: '#FFCA28'
      // },
      // list_category: {
      //   colour: '#4DB6AC'
      // },
      // colour_category: {
      //   colour: '#FFCDD2'
      // },
      // variable_category: {
      //   colour: '#EF9A9A'
      // },
      // // variable_dynamic_category: {
      // //   colour: '#EF9A9A'
      // // },
      // procedure_category: {
      //   colour: '#D7CCC8'
      // }
    },
    componentStyles: {
      'flyoutOpacity': 0.5,
      'insertionMarkerOpacity': 0.5,
      'scrollbarOpacity': 0.5,
      'selectedGlowColour': '#000000',
      'selectedGlowSize': 0.5,
      'replacementGlowColour': '#000000',
    }
  }),
});

Blockly.Python.init(workspace);
Blockly.Python.nameDB_.getName = function(name, type) {
  const enc_name = Blockly.Names.prototype.getName.call(this, name, type);

  // 인코딩된 한글 문자 디코딩
  const decodedName = enc_name.replace(/(_[A-Z0-9]{2})+/g, (match) => {
    try {
      const uriEncoded = match.replace(/_/g, "%");
      return decodeURIComponent(uriEncoded);
    } catch (error) {
      return match; // 디코딩 실패 시 그대로 반환
    }
  });

  // Python 변수명에 맞지 않는 문자 중 한글, 알파벳, 숫자, 밑줄만 허용하고 나머지를 언더스코어로 변환
  const pythonCompatibleName = decodedName.replace(/[^a-zA-Z0-9가-힣_]/g, "_");
  return pythonCompatibleName;
};

workspace.addChangeListener ((event)=>{
  update_block();
  if (event.type == Blockly.Events.CREATE) {
    if($("#codepath").html() == '') setTimeout(()=>{alert(translations["confirm_block_file"][lang])},500);
  }

  if (event.type == Blockly.Events.BLOCK_CHANGE) {
    if (event.element == 'field' && event.name == 'dir') {
      folderValue = workspace.getBlockById(event.blockId).getFieldValue('dir');
      updateSecondDropdown.call(workspace.getBlockById(event.blockId), folderValue);
    }
  }
});

$(document).keydown((evt)=> {
  if((evt.which == '115' || evt.which == '83') && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      let filepath = $("#codepath").html();

      if (filepath == "") {
        alert(translations['nofile'][lang]);
        return;
      }
      let codetype = "";
      codeTypeBtns.forEach((el) => {
        if (el.classList.value.includes("checked")) codetype = el.name;
      });
      if (codetype == "block") {
        // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
        //   alert("json 파일만 저장 가능합니다.");
        //   return;
        // }
        saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
        socket.emit("save", {
          codepath: "/home/pi/blockly.py",
          codetext: Blockly.Python.workspaceToCode(workspace) });
        socket.emit("save", {
          codepath: $("#codepath").html(),
          codetext: saveBlock
        });
        result.value = Blockly.Python.workspaceToCode(workspace);
        update_block();
      }
      else {
        codeTypeBtns.forEach((el) => {
          if (el.classList.value.includes("checked")) codetype = el.name;
        });
        saveCode = codeEditor.getValue();
        CodeMirror.signal(codeEditor, "change");
        socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
      }
      return false;
  }
  return true;
});

$("#showNetwork").on("click", ()=>{
  document.getElementById("usedataPopup").style.display = "none";

  $("#wifi_list > tbody").empty();
  $("#wifi_list > tbody").append(
    $("<tr>")
    .append(
      $("<td colspan='4'>").append("Scanning...")
    )
  )
  $.ajax({
    url: `http://${location.hostname}:${system_port}/wifi_scan`,
  }).always((xhr, status) => {
    if (status == "success") {
      data = xhr
      $("#wifi_list > tbody").empty();
      for (let i = 0; i < data.length; i++) {
        if (data[i].essid.length > 50 || data[i].essid.includes('\x00')) continue;
        $("#wifi_list > tbody").append(
          $("<tr>")
            .append(
              $("<td>").append(data[i].essid),
              $("<td>").append(`${data[i].signal_quality} %`),
              $("<td>").append(data[i].encryption)
            )
            .hover(
              function () {
                $(this).animate({ opacity: "0.5" }, 100);
              },
              function () {
                $(this).animate({ opacity: "1" }, 100);
              }
            )
            .click(function () {
              let lst = $(this).children();
              $("#ssid").val(lst.eq(0).text());
              $("#identity").val("");
              $("#psk").val("");
              $(`input[name='wifi_type_sel'][value='${lst.eq(2).text()}']`).prop("checked", true).trigger("change");
              if(lst.eq(2).text() == "none") { // open
                $("#ssid").prop("disabled", false);
                $("#identity").prop("disabled", true);
                $("#psk").prop("disabled", true);
              }
              else if(lst.eq(2).text() == "wpa-psk") { // wpa-psk
                $("#ssid").prop("disabled", false);
                $("#identity").prop("disabled", true);
                $("#psk").prop("disabled", false);
              }
              else if(lst.eq(2).text() == "wpa-eap") { // wpa-enterprise
                $("#ssid").prop("disabled", false);
                $("#identity").prop("disabled", false);
                $("#psk").prop("disabled", false);
              }
            })
        );
      }
    } else {
      //
    }
  });
  document.getElementById("wifiPopup").style.display = "block";
});

$("#hidewifi").on("click", ()=>{
  document.getElementById("wifiPopup").style.display = "none";
});

$.ajax({
  url: `http://${location.hostname}:${system_port}/wifi`,
}).always((xhr, status) => {
  if (status == "success") {
    $("#ssid").val(xhr["ssid"]);
    $("#psk").val(xhr["psk"]);
    if(xhr["key-mgmt"] == "none") { // open
      $("#ssid").prop("disabled", false);
      $("#identity").prop("disabled", true);
      $("#identity").val("");
      $("#psk").prop("disabled", true);
      $("#psk").val("");
      $(`input[name='wifi_type_sel'][value='${xhr["key-mgmt"]}']`).prop("checked", true).trigger("change");
    }
    else if(xhr["key-mgmt"] == "wpa-psk") { // wpa-psk
      $("#ssid").prop("disabled", false);
      $("#ssid").val(xhr["ssid"]);
      $("#identity").prop("disabled", true);
      $("#identity").val("");
      $("#psk").prop("disabled", false);
      $("#psk").val(xhr["psk"]);
      $(`input[name='wifi_type_sel'][value='${xhr["key-mgmt"]}']`).prop("checked", true).trigger("change");
    }
    else if(xhr["key-mgmt"] == "wpa-eap") { // wpa-enterprise
      $("#ssid").prop("disabled", false);
      $("#ssid").val(xhr["ssid"]);
      $("#identity").prop("disabled", false);
      $("#identity").val(xhr["identity"]);
      $("#psk").prop("disabled", false);
      $("#psk").val(xhr["psk"]);
      $(`input[name='wifi_type_sel'][value='${xhr["key-mgmt"]}']`).prop("checked", true).trigger("change");
    }
  } else {
    //
  }
});

$("#wifi_bt").on("click", function () {
  let comment = "Wifi: " + $("#ssid").val().trim();
  comment += "\nPSK: " + $("#psk").val().trim();
  comment += "\nEncryption: " + ($("#psk").val().trim()==""?"OPEN":"WPA-PSK");
  comment += translations["confirm_wifi"][lang];
  if (confirm(comment)) {
    $.ajax({
      url: `http://${location.hostname}:${system_port}/wifi`,
      type: "post",
      data: JSON.stringify({ssid:$("#ssid").val().trim(), psk:$("#psk").val().trim(), identity:$("#identity").val().trim()}),
      contentType: "application/json",
    }).always((xhr, status) => {
      if (status == "success") {
      } else {
        //alert("WPA-PSK 방식에서는 비밀번호가 8자리 이상이어야 합니다.")
      }
    });
  }
});

$(document).on("click keydown", (evt) => {
  if (["click", "keydown"].includes(evt.type)) {
    let codetype = "";
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) codetype = el.name;
    });
    usedata[codetype][evt.type]++;
  }
});

let startTime = new Date().getTime();

window.addEventListener('beforeunload', (evt) => {
  usedata["staytime"] = parseInt((new Date().getTime() - startTime) / 1000);
  let codetype = "";
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  usedata[codetype]["staytime"] += parseInt((new Date().getTime() - startTime_item) / 1000);
  $.ajax({
    url: `http://${location.hostname}:${system_port}/usedata`,
    type: "post",
    data: JSON.stringify(usedata),
    contentType: "application/json",
  }).always((xhr, status) => {
    if (status == "success") {
      usedata = init_usedata;
    } else {
      //alert(`usedata error.\n >> ${xhr.responseJSON["result"]}`);
    }
  });
  socket.emit("stop");
});

$("#usedata_bt").on("click", ()=> {
  document.getElementById("wifiPopup").style.display = "none";

  $.ajax({
    url: `http://${location.hostname}:${system_port}/usedata`,
    type: "post",
    data: JSON.stringify(usedata),
    contentType: "application/json",
  }).always((xhr, status) => {
    if (status == "success") {
      $("#usedata_json").JSONView(xhr, {collapsed:true});
      usedata = init_usedata;
    } else {
      //alert(`usedata error.\n >> ${xhr.responseJSON["result"]}`);
    }
  });
  document.getElementById("usedataPopup").style.display = "block";
});

$("#hideUsedata").on("click", ()=>{
  document.getElementById("usedataPopup").style.display = "none";
});

$('#psk_visible').on('click',function(){
  $('#psk_visible').toggleClass('active');
  $('#psk').prop('type', $('#psk_visible').hasClass('active')?"text":"password");
});

$('input[name="wifi_type_sel"]').on('click', function () {
  // 선택된 라디오 버튼의 값을 가져오기
  const selectedValue = $(this).val();
  if (selectedValue === 'wpa-psk') {
      console.log("WPA 설정을 선택했습니다.");
      $("#ssid").prop("disabled", false);
      $("#identity").prop("disabled", true);
      $("#identity").val("");
      $("#psk").prop("disabled", false);
  } else if (selectedValue === 'none') {
      console.log("Open 설정을 선택했습니다.");
      $("#ssid").prop("disabled", false);
      $("#identity").prop("disabled", true);
      $("#identity").val("");
      $("#psk").prop("disabled", true);
      $("#psk").val("");
  } else if (selectedValue === 'wpa-eap') {
      console.log("WPA-EAP 설정을 선택했습니다.");
      $("#ssid").prop("disabled", false);
      $("#identity").prop("disabled", false);
      $("#psk").prop("disabled", false);        
  } else if (selectedValue === 'custom') {
      console.log("Custom 설정을 선택했습니다.");
      $("#ssid").prop("disabled", false);
      $("#identity").prop("disabled", false);
      $("#psk").prop("disabled", false);        
  }
}); 

$("#prompt").on("keypress", function (evt) {
  if (evt.keyCode == 13) {
    socket.emit("prompt", $("#prompt").val().trim());
    //$("#prompt").val("");
  }
});

$("#prompt_bt").on('click', function() {
  socket.emit("prompt", $("#prompt").val().trim());
});

socket.on("update_battery", function (data) {
  let bat = Number(data.split("%")[0]);
  let bat_str = ['empty', 'quarter', 'half', 'three-quarters', 'full'];

  $("#d_battery_val").html(
    `<i class='fa fa-battery-${bat_str[Math.floor(bat / 25)]}' aria-hidden='true'></i>${data} `
  );
});

socket.on("update_dc", function (data) {
  $("#d_dc_val").html(
    data.toUpperCase() == "ON"?"<i class='fa fa-plug' aria-hidden='true'></i>":""
  );
});

$("#poweroff_bt").on("click", function () {
  if (confirm(translations["confirm_poweroff"][lang])) socket.emit("poweroff");
});

$("#restart_bt").on("click", function () {
  if (confirm(translations["confirm_restart"][lang])) socket.emit("restart");
});

const setLanguage = (langCode) => {
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(element => {
      const key = element.getAttribute('data-key');
      if (translations[key] && translations[key][langCode]) {
          element.textContent = translations[key][langCode];
      }
  });

  const langFileVersion = '240110v1';
  const langFile = `../static/${langCode}.js?ver=${langFileVersion}`;
  const prevKoScript = document.querySelector(`script[src*="../static/ko.js?ver=${langFileVersion}"]`);
  if (prevKoScript) {
    prevKoScript.remove();
  }
  const prevEnScript = document.querySelector(`script[src*="../static/en.js?ver=${langFileVersion}"]`);
  if (prevEnScript) {
    prevEnScript.remove();
  }
  const script = document.createElement('script');
  script.setAttribute('src', langFile);
  document.head.appendChild(script);
  workspace.updateToolbox(langCode=="en"?toolbox_en:toolbox_ko);

  if (langCode == "en") {
    document.getElementById('add_directory').style.width = '105px';
    document.getElementById('add_file').style.width = '100px';
  }
  else {
    document.getElementById('add_directory').style.width = '80px';
    document.getElementById('add_file').style.width = '85px';
  }
}

const language = document.getElementById("language");
language.value = lang;
setLanguage(lang);
localStorage.setItem("language", lang);

language.addEventListener("change", () => {
  lang = language.value;
  setLanguage(lang);
  localStorage.setItem("language", lang);
});

// warning
document.querySelector("div.CodeMirror textarea").setAttribute("name", "ctx");
