/*
? @document-start
========================
| NOISY SEARCH PROGRAM |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/02/2022
? @document-modified:      03/02/2022
? @document-version:       v0.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Something soon

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

* If this program supports changelog records then there should be a 'changelog' folder within the same directory as this program
file. Learn more about the changelog system here: 
https://github.com/william-horn/my-coding-conventions/blob/main/document-conventions/about-changelog.txt

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-  

==================================================================================================================================
*/

/* ------------ */
/* Program Init */
/* ------------ */

// global constants
const MAX_STRING_LENGTH = 200;
const MAX_WORD_LENGTH = 15;

const DEBUG_PRINT_ON = true;

// get html elements refs
const $searchOutput = document.querySelector("#search-output");
const $outputDisplayContainer = document.querySelector("#output-display-container");
const $wordInput = document.querySelector("#word-input");
const $stringLengthInput = document.querySelector("#length-input");
const $generateSearchButton = document.querySelector("#generate-search-btn");
const $probabilityInfoContainer = document.querySelector("#probability-info");
const $defaultStatsContainer = document.querySelector("#hide-default-stats");
const $theoStatsContainers = document.querySelector("#theo-stats-display");
const $expStatsContainer = document.querySelector("#exp-stats-display");

// assign settings to elements
$wordInput.setAttribute("maxlength", MAX_WORD_LENGTH);

// store default css property states
let savedElementPropertyDefaults = {};

/* ----------------- */
/* Utility Functions */
/* ----------------- */

function debounce(func, delay) {
    let gate = true;
    return function(...args) {
        if (gate === true) {
            gate = false;
            func(...args);
            setTimeout(() => {
                gate = true
            }, delay)
        }
    }
}

function weakObjectClone(obj) {
    let newObj = {};
    for (key in obj) newObj[key] = obj[key];
    return newObj;
}


// return a random integer ranging from min to max
function randomInt(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    const rand = Math.random();
    return Math.floor(min*(1 - rand) + rand*max);
}

function debugPrint(...args) {
    if (DEBUG_PRINT_ON === true) {
        console.log(...args);
    }
}

/* ------------------- */
/* Dedicated Functions */
/* ------------------- */

function getDefaultProperties(element) {
    return savedElementPropertyDefaults[element];
}

function getDefaultElementProperty(element, property) {
    let defEl = savedElementPropertyDefaults[element];
    return defEl[property] || defEl.style[property];
}

function setElementPropertyToDefault(element, property) {
    let defEl = savedElementPropertyDefaults[element];
    element[property] ? element[property] = defEl[property] : element.style[property] = defEl.style[property];
}

function invalidSearchMessage(message, displayTime) {
    $generateSearchButton.textContent = message;
    $generateSearchButton.style.backgroundColor = "var(--theme-error-background-color)";

    setTimeout(function() {
        setElementPropertyToDefault($generateSearchButton, "backgroundColor");
        setElementPropertyToDefault($generateSearchButton, "textContent");
    }, displayTime ? displayTime*1000 : 1500);
}

// generate random lower-case letters from ASCII code
function getRandomLetterLower() {
    return String.fromCharCode(randomInt(97, 122));
}

// calculate theoretical probability of word generation based on word length and generated string length
function calcProbability(wordLength, genStrLength, truncFrac) {
    let prob = genStrLength/Math.pow(26, wordLength);
    return {
        frac: truncFrac ? /[0\.]+[^0.]/.exec(prob)[0] : prob,
        int: Math.round(1/prob)
    };
}

function generateDynamicTextTo(parent, textData) {
    // clear existing children
    const parentChildren = parent.children;
    for (let i = 0; i < parentChildren.length; i++) {
        parentChildren[i].remove();
    }

    // create parent text object
    const $textEl = document.createElement("p");
    parent.appendChild($textEl);

    // generate text children
    for (let i = 0; i < textData.length; i++) {
        const info = textData[i];
        const $subtext = document.createElement("span");

        $subtext.textContent = info.content;
        if (info.style) $subtext.setAttribute("style", info.style);

        $textEl.append($subtext);
    }

    // return text children
    return $textEl.children;
}

function generateSearch() {
    const wordInputValue = $wordInput.value;
    let genStringLength = parseInt($stringLengthInput.value);

    // handle no word input or no length input
    if (!wordInputValue || isNaN(genStringLength)) {
        invalidSearchMessage("Incomplete data. Try again.");
        return;
    } else if (genStringLength > MAX_STRING_LENGTH) {
        invalidSearchMessage(`String length must be <= ${MAX_STRING_LENGTH}.`);
        return;
    }

    // update text info when successful generation starts
    genStringLength = Math.max(wordInputValue.length, genStringLength);
    $stringLengthInput.value = genStringLength;
    $generateSearchButton.textContent = "Generating...";

    // hide the default probability info text and display the generated text
    $defaultStatsContainer.style.setProperty("display", "none");
    $theoStatsContainers.style.setProperty("display", "block");
    $expStatsContainer.style.setProperty("display", "block");

    // calculate the theoretical probability
    const probability = calcProbability(wordInputValue.length, genStringLength, true);

    // generate 
    const numberStyle = "color: #bd5959";
    const percentStyle = "color: #ab9163";
    generateDynamicTextTo($theoStatsContainers, [
        {content: "Your search is "},
        {content: "1", style: numberStyle},
        {content: " in "},
        {content: probability.int.toLocaleString("en-US"), style: numberStyle},
        {content: " chance of being generated "},
        {content: `(~${probability.frac}%).`, style: percentStyle},
    ]);




    // generate logic
    let strChunk = "";

    for (let i = 0; i < genStringLength; i++) {
        strChunk += getRandomLetterLower();
    }

    generateDynamicTextTo($outputDisplayContainer, [
        {content: strChunk},
        {content: "testing"}
    ])


    setElementPropertyToDefault($generateSearchButton, "textContent");
}

// load default css properties into 'savedElementPropertyDefaults'
function loadElementPropertyDefaults() {
    debugPrint(">> storing default style settings...");

    savedElementPropertyDefaults[$generateSearchButton] = {
        textContent: $generateSearchButton.textContent,
        style: weakObjectClone(getComputedStyle($generateSearchButton))
    }

    debugPrint("<< default style settings have been stored.");
}

function initPageElementDefaults() {
    debugPrint(">> setting page first impression...");
    $generateSearchButton.textContent = "Generate Search!";

    generateDynamicTextTo($outputDisplayContainer, [
        {content: "Somethingstrangeis"},
        {content: "afoot", style: "color: #00ff1f"}
    ]);

    debugPrint("<< page first impression setup complete!");
}

// invoke css default property loader once the page loads
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        debugPrint("page loaded!");
        initPageElementDefaults();
        loadElementPropertyDefaults();
    }
})

// generate search click listener //
const generateSearchDebounce = debounce(generateSearch, 2000);
$generateSearchButton.addEventListener("click", generateSearchDebounce);

