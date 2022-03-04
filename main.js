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

// get html elements refs
const searchOutput = document.querySelector("#search-output");
const wordInput = document.querySelector("#word-input");
const stringLengthInput = document.querySelector("#length-input");
const generateSearchButton = document.querySelector("#generate-search-btn");

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

// return a random integer ranging from min to max
function randomInt(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    const rand = Math.random();
    return Math.floor(min*(1 - rand) + rand*max);
}

/* ------------------- */
/* Dedicated Functions */
/* ------------------- */

function invalidSearchMessage(message) {
    const oldText = generateSearchButton.textContent;
    let oldBackgroundColor = document.querySelector(".generate-search-btn")

    console.log($(".generate-search-btn").css("background-color"));
    generateSearchButton.textContent = message;
    // generateSearchButton.style.backgroundColor = "var(--theme-error-background-color)";

    setTimeout(function() {
        $(".generate-search-btn").removeClass("generate-search-btn-invalid")
        // generateSearchButton.style.backgroundColor = oldBackgroundColor
        generateSearchButton.textContent = oldText
    }, 2000)
}

// generate random lower-case letters from ASCII code
function getRandomLetterLower() {
    return String.fromCharCode(randomInt(97, 122));
}

function generateSearch() {
    const wordInputValue = wordInput.value;
    const stringLengthValue = parseInt(stringLengthInput.value);

    // handle no word input or no length input
    if (!wordInputValue || isNaN(stringLengthValue)) {
        invalidSearchMessage("Invalid data. Try again.");
        return;
    } else if (stringLengthValue > 200) {
        invalidSearchMessage("String length is too large.");
        return;
    }
}

// load default css properties into 'savedElementPropertyDefaults'
function loadElementPropertyDefaults() {
    savedElementPropertyDefaults[generateSearchButton] = getComputedStyle(generateSearchButton);
}

// invoke css default property loader once the page loads
document.addEventListener("readystatechange", event => {
    if (document.readyState === "complete") {
        loadElementPropertyDefaults();
    }
})

// generate search click listener //
const generateSearchDebounce = debounce(generateSearch, 2000);
generateSearchButton.addEventListener("click", generateSearchDebounce);

