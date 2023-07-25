// const { text } = require("express");

let optionsButtons = document.querySelectorAll(".option-button");
let mediaButtons = document.querySelectorAll(".media-buttons");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
// let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  // highlighter(optionsButtons, true);

  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  //create options for font names
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  //fontSize allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  //default size
  fontSizeRef.value = 3;
};

const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});
let isSpeaking = false;
// mediaButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     if (button.id == "pause") {
//       let ele = button.firstElementChild;
//       if (ele.className == "fa-solid fa-circle-play")
//         ele.className = "fa-solid fa-circle-pause";
//       else ele.className = "fa-solid fa-circle-play";
//     }
//   });
// });

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;

        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        //Remove highlight from other buttons
        // highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};
// text to speech
let synth = speechSynthesis;
// let isenxt =false;
function textToSpeech(text, flag = false) {
  if (!text) return;
  console.log("play " + text);
  document.getElementById("pause").firstElementChild.className =
    "fa-solid fa-circle-pause";
  let utterance = new SpeechSynthesisUtterance(text);
  // isenxt = false;
  utterance.rate = document.getElementById("range").value;
  synth.speak(utterance);
  // console.log("speak ends " + text);
  utterance.onend = function () {
    currIndex++;
    console.log("onend " + currIndex);
    if (isSpeaking)
      textToSpeech(sentences[currIndex], currIndex == sentences.length - 1);
    if (typeof onEndCallback === "function") {
      onEndCallback();
    }
    if (flag == true) {
      document.getElementById("pause").firstElementChild.className =
        "fa-solid fa-circle-play";
      isSpeaking = false;
    }
  };
}
let sentences = [],
  currIndex = 0;

function pauseVoice() {
  document.getElementById("pause").firstElementChild.className =
    "fa-solid fa-circle-play";
  // synth.pause();
  synth.cancel();
  isSpeaking = false;
}
function back() {
  pauseVoice();
  currIndex--;
  if (currIndex <= 0) currIndex = 0;
  isSpeaking = true;

  if (isSpeaking) {
    synth.cancel();
    // console.log("back" + currIndex + " " + isSpeaking);
    textToSpeech(sentences[currIndex], currIndex == sentences.length - 1);
  }
}
function forward() {
  pauseVoice();
  currIndex++;
  if (currIndex >= sentences.length) {
    synth.cancel();
    return;
  }
  isSpeaking = true;

  if (isSpeaking) {
    synth.cancel();
    // console.log("forward" + currIndex + " " + isSpeaking);
    textToSpeech(sentences[currIndex], currIndex == sentences.length - 1);
  }
}

function spliter(originalList, delimiter) {
  if (typeof originalList == "string")
    return originalList.split(delimiter).filter((el) => el.length > 0);
  let resultList = [];

  originalList.forEach((string) => {
    let splitStrings = string.split(delimiter);
    resultList.push(...splitStrings);
  });
  return resultList.filter((el) => el.length > 0);
}

function playVoice() {
  // document.getElementById("pause").firstElementChild.className =
  //   "fa-solid fa-circle-pause";
  let x = document.getElementById("text-input");
  if (x.innerText == "") return;
  // console.log(x.innerText);

  synth.cancel();
  isSpeaking = true;

  // sentences = x.value.split().filter((el) => el.length > 0);

  let newSentences = spliter(spliter(x.innerText, "."), "\n"); // splitting and removing empty sentences
  if (newSentences != sentences) {
    currIndex = 0;
    sentences = newSentences;
  }
  currIndex = Math.min(currIndex, sentences.length);
  currIndex %= sentences.length;

  if (isSpeaking)
    textToSpeech(sentences[currIndex], currIndex == sentences.length - 1);

  // for (; currIndex < sentences.length;) {
  //   if (isSpeaking) {

  //     console.log(currIndex)
  //     textToSpeech(sentences[currIndex], currIndex == sentences.length - 1);
  //     // if(isenxt) currIndex++;
  //   }
  // }
}

window.onload = initializer();
