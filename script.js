import { questions } from './escaperoom/questions.js';

// buttons
const startButton = document.querySelector('.startButton');
const restartButton = document.querySelector('.restartButton');
const resetButton = document.querySelector('.resetButton');
const hoofdmenuButton = document.querySelector('.hoofdmenuButton');
const controleButton = document.querySelector('.controleButton');

// quiz objecten
const versleepbaars = document.querySelectorAll('.versleepbaar');
const targets = document.querySelectorAll('.target');
const puzzelMessage = document.getElementById('puzzelMessage');

const originalParents = {};
const objectToTargetMap = [];
let currentTipIndex = 0; // Initialize the current tip index

// Define an array of tips
const environmentalTips = [
    "Remember to recycle!",
    "Use reusable bags instead of plastic.",
    "Save water by taking shorter showers.",
    "Turn off lights when you leave a room.",
    "Use a bicycle or walk for short trips.",
    "Plant a tree to help the environment.",
    "Avoid single-use plastics.",
    "Compost your food waste.",
    "Use a refillable water bottle.",
];

// functies voor het spel
const addEventListenerTo = (selector, event, callback) => {
    document.querySelector(selector).addEventListener(event, callback);
};

const displayElement = (id, displayStyle) => {
    document.getElementById(id).classList.toggle('hidden', displayStyle === 'none');
};

const resetGame = () => {
    versleepbaars.forEach(versleepbaar => {
        const originalParent = originalParents[versleepbaar.id];
        originalParent.appendChild(versleepbaar);
        versleepbaar.style.backgroundColor = '#fff';
    });
    puzzelMessage.style.display = 'none';
    puzzelMessage.innerHTML = ''; // Clear previous messages
    currentTipIndex = 0; // Reset the tip index
};

const controleWinConditie = () => {
    const allCorrect = objectToTargetMap.every(([objectId, targetId]) => {
        const objectElement = document.getElementById(objectId);
        const targetElement = document.getElementById(targetId);
        return objectElement.parentElement === targetElement;
    });

    if (allCorrect) {
        puzzelMessage.innerHTML = '<div>Je hebt alle doelen bereikt!</div>'; // Clear and append new message
        puzzelMessage.style.display = 'block';
        setTimeout(() => {
            displayElement('puzzelPage', 'none');
            displayElement('eindPagina', 'flex');
        }, 1000);
    }
};

// functies voor de vele objecten
versleepbaars.forEach((versleepbaar, index) => {
    versleepbaar.draggable = true;
    originalParents[versleepbaar.id] = versleepbaar.parentElement;
    objectToTargetMap.push([versleepbaar.id, `target${index + 1}`]);

    versleepbaar.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text', event.target.id);
    });
});

targets.forEach((target) => {
    target.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    target.addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const draggedElement = document.getElementById(data);
        if (draggedElement && !target.contains(draggedElement)) {
            target.appendChild(draggedElement);
            controleWinConditie();

            const objectToTarget = objectToTargetMap.find(([objectId, targetId]) => objectId === draggedElement.id);
            const isCorrect = objectToTarget && objectToTarget[1] === target.id;

            puzzelMessage.innerHTML = ''; // Clear previous messages
            if (isCorrect) {
                draggedElement.style.backgroundColor = '#066b0b'; // groen
                puzzelMessage.innerHTML = '<div>Yay, dit klopt! Ga zo door!</div>'; // Clear and append new message
                puzzelMessage.style.display = 'block';
                toonTip(); // Show the next tip

                setTimeout(() => {
                    puzzelMessage.style.display = 'none';
                }, 5000);
                
            } else {
                draggedElement.style.backgroundColor = '#9e0909'; // rood
                puzzelMessage.innerHTML = '<div>Jammer, maar dit klopt nog niet helemaal</div>'; // Clear and append new message
                puzzelMessage.style.display = 'block';
                setTimeout(() => {
                    puzzelMessage.style.display = 'none';
                }, 5000);
            }
        }
    });
});

// button functies
startButton.addEventListener('click', () => {
    displayElement('startPage', 'none');
    displayElement('puzzelPage', 'flex');
});

restartButton.addEventListener('click', () => {
    resetGame();
    displayElement('eindPagina', 'none');
    displayElement('startPage', 'flex');
    displayElement('puzzelMessage', '');
});

resetButton.addEventListener('click', () => {
    resetGame();
});

hoofdmenuButton.addEventListener('click', () => {
    displayElement('startPage', 'flex');
    displayElement('puzzelPage', 'none');
});

// toont tip
const toonTip = () => {
    verbergTip(); // Remove existing tip before showing a new one
    const tipText = environmentalTips[currentTipIndex];
    const tipBox = document.createElement('div');
    tipBox.className = 'tip_box';
    tipBox.innerHTML = '<span>Tip: ' + tipText + '</span>';
    document.body.appendChild(tipBox); // Append tipBox to the body for better control

    currentTipIndex = (currentTipIndex + 1) % environmentalTips.length; // Increment the tip index

    setTimeout(() => {
        verbergTip();
    }, 5000); // Automatically hide the tip after 5 seconds
};

// verwijderd tip
const verbergTip = () => {
    const tipBox = document.querySelector('.tip_box');
    if (tipBox) {
        tipBox.remove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const redirectCode = document.getElementById('redirectCode');

    if (redirectCode) {
        redirectCode.addEventListener('click', () => {
            window.location.href = 'https://berghoff-belgium.be/';
        });
    }
});
