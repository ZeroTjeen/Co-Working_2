import { questions } from './escaperoom/questions.js';

// buttons
const startButton = document.querySelector('.startButton')
const restartButton = document.querySelector('.restartButton')
const resetButton = document.querySelector('.resetButton')
const hoofdmenuButton = document.querySelector('.hoofdmenuButton')
const controleButton = document.querySelector('.controleButton')

// quiz objecten
const versleepbaars = document.querySelectorAll('.versleepbaar')
const targets = document.querySelectorAll('.target')
const puzzelMessage = document.getElementById('puzzelMessage')

const originalParents = {}
const objectToTargetMap = []





// functies voor het spel
const addEventListenerTo = (selector, event, callback) => {
    document.querySelector(selector).addEventListener(event, callback)
}
const displayElement = (id, displayStyle) => {
    document.getElementById(id).classList.toggle('hidden', displayStyle === 'none')
}
const resetGame = () => {
    versleepbaars.forEach(versleepbaar => {
        const originalParent = originalParents[versleepbaar.id]
        originalParent.appendChild(versleepbaar)
        versleepbaar.style.backgroundColor = '#fff'
    })
    puzzelMessage.style.display = 'none'
}
const controleWinConditie = () => {
    const allCorrect = objectToTargetMap.every(([objectId, targetId]) => {
        const objectElement = document.getElementById(objectId)
        const targetElement = document.getElementById(targetId)
        const isCorrect = objectElement.parentElement === targetElement
        return isCorrect
    })

    if (allCorrect) {
        puzzelMessage.textContent = 'Je hebt alle doelen bereikt!'
        puzzelMessage.style.display = 'block'
        setTimeout(() => {
            displayElement('puzzelPage', 'none')
            displayElement('eindPagina', 'flex')
        }, 1000)
    } 
}


// functies voor de vele objecten
versleepbaars.forEach((versleepbaar, index) => {
    versleepbaar.draggable = true
    originalParents[versleepbaar.id] = versleepbaar.parentElement
    objectToTargetMap.push([versleepbaar.id, `target${index + 1}`])
    
    versleepbaar.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text', event.target.id)
    })
})
targets.forEach((target) => {
    target.addEventListener('dragover', (event) => {
        event.preventDefault()
    })

    target.addEventListener('drop', (event) => {
        event.preventDefault()
        const data = event.dataTransfer.getData('text')
        const draggedElement = document.getElementById(data)
        if (draggedElement && !target.contains(draggedElement)) {
            target.appendChild(draggedElement)
            controleWinConditie()
            
            const objectToTarget = objectToTargetMap.find(([objectId, targetId]) => objectId === draggedElement.id)
            const isCorrect = objectToTarget && objectToTarget[1] === target.id
            if (isCorrect) {
                draggedElement.style.backgroundColor = '#066b0b'// groen
                puzzelMessage.style.display = 'none'
                toonTip(1)

            } else {
                draggedElement.style.backgroundColor = '#9e0909'// rood
                puzzelMessage.textContent = 'jammer, maar dit klopt nog niet helemaal'
                puzzelMessage.style.display = 'block'
                
            }
        }
    })
})


// button functies
startButton.addEventListener('click', () => {
    displayElement('startPage', 'none')
    displayElement('puzzelPage', 'flex')
})
restartButton.addEventListener('click', () => {
    resetGame()
    displayElement('eindPagina', 'none')
    displayElement('startPage', 'flex')
    displayElement('puzzelMessage', '')
})
resetButton.addEventListener('click', () => {
    resetGame()
})
hoofdmenuButton.addEventListener('click', () => {
    displayElement('startPage', 'flex')
    displayElement('puzzelPage', 'none')
})






// toont tip
const toonTip = (index) => {
    const tipText = questions[index].tip || "Geen tip beschikbaar.";
    const tipBox = document.createElement("div");
    tipBox.className = "tip_box";
    tipBox.innerHTML = '<span>Tip: '+ tipText +'</span>';
    quiz_box.appendChild(tipBox);
}
// verwijderd tip
const verbergTip = () => {
    const tipBox = document.querySelector(".tip_box");
    if(tipBox){
        tipBox.remove();
    }
}