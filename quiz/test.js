import { questions } from './questions.js';

const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const resultaat_box = document.querySelector(".resultaat_box");
const option_lijst = document.querySelector(".option_lijst");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

let timewaarde = 30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let teller;
let tellerLine;
let widthwaarde = 0;
let currentFocus = 0;
let isAnswerSelected = false;

const restart_quiz = resultaat_box.querySelector(".buttons .restart");
const quit_quiz = resultaat_box.querySelector(".buttons .quit");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_teller = document.querySelector("footer .total_que");

start_btn.addEventListener("click", () => {
    info_box.classList.add("activeInfo");
    start_btn.blur();
    info_box.focus();
});

exit_btn.addEventListener("click", () => {
    info_box.classList.remove("activeInfo");
});

continue_btn.addEventListener("click", () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    startQuiz();
});

restart_quiz.addEventListener("click", () => {
    resetQuiz();
});

quit_quiz.addEventListener("click", () => {
    window.location.reload();
});

next_btn.addEventListener("click", () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        updateQuestion();
    } else {
        clearInterval(teller);
        clearInterval(tellerLine);
        toonresultaat();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        window.location.reload();
    }

    if (info_box.classList.contains("activeInfo")) {
        if (e.key === "Enter") continue_btn.click();
    } else if (quiz_box.classList.contains("activeQuiz")) {
        if (e.key === "ArrowUp") navigateOptions("up");
        if (e.key === "ArrowDown") navigateOptions("down");
        if (e.key === "Enter") {
            if (!isAnswerSelected) {
                selectOption();
            } else {
                if (next_btn.classList.contains("toon")) {
                    next_btn.click();
                    isAnswerSelected = false;
                }
            }
        }
    } else if (resultaat_box.classList.contains("activeresultaat")) {
        if (e.key === "Enter") restart_quiz.click();
    }
});

const startQuiz = () => {
    resetTimers();
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthwaarde = 0;
    toonvraag(que_count);
    queteller(que_numb);
    startTimer(timewaarde);
    startTimerLine(widthwaarde);
    timeText.textContent = "tijd over";
    next_btn.classList.remove("toon");
    verbergTip();
}

const updateQuestion = () => {
    resetTimers();
    toonvraag(que_count);
    queteller(que_numb);
    startTimer(timewaarde);
    startTimerLine(widthwaarde);
    timeText.textContent = "tijd over";
    next_btn.classList.remove("toon");
    verbergTip();
    isAnswerSelected = false;
}

const toonvraag = (index) => {
    const que_text = document.querySelector(".que_text");
    const vraag = questions[index];
    let que_tag = `<span>${vraag.numb}. ${vraag.question}</span>`;
    let option_tag = vraag.options.map(option => `<div class="option"><span>${option}</span></div>`).join('');
    que_text.innerHTML = que_tag;
    option_lijst.innerHTML = option_tag;

    const options = option_lijst.querySelectorAll(".option");
    options.forEach((option, i) => {
        option.addEventListener("click", () => optionSelected(option));
        option.setAttribute('tabindex', '0');
    });

    currentFocus = 0;
    if (options.length > 0) options[currentFocus].focus();
}

const optionSelected = (antwoord) => {
    clearInterval(teller);
    clearInterval(tellerLine);
    let userAns = antwoord.textContent;
    let correcAns = questions[que_count].antwoord;
    const allOptions = option_lijst.children.length;

    if (userAns === correcAns) {
        userScore += 1;
        antwoord.classList.add("juist");
        antwoord.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
        antwoord.classList.add("injuist");
        antwoord.insertAdjacentHTML("beforeend", crossIconTag);

        for (let i = 0; i < allOptions; i++) {
            if (option_lijst.children[i].textContent === correcAns) {
                option_lijst.children[i].setAttribute("class", "option juist");
                option_lijst.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }
    for (let i = 0; i < allOptions; i++) {
        option_lijst.children[i].classList.add("disabled");
    }
    next_btn.classList.add("toon");
    toonTip(que_count);
    isAnswerSelected = true;
}

const toonresultaat = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    resultaat_box.classList.add("activeresultaat");
    const scoreText = resultaat_box.querySelector(".score_text");
    let scoreTag;
    if (userScore > 3) {
        scoreTag = `<span>Goed!, Je hebt <p>${userScore}</p> van de <p>${questions.length}</p> vragen juist beantwoord.</span>`;
    } else if (userScore > 1) {
        scoreTag = `<span>Goed, je hebt <p>${userScore}</p> van de <p>${questions.length}</p> vragen juist beantwoord.</span>`;
    } else {
        scoreTag = `<span>Helaas, je hebt maar <p>${userScore}</p> van de <p>${questions.length}</p> vragen juist beantwoord.</span>`;
    }
    scoreText.innerHTML = scoreTag;
}

const startTimer = (time) => {
    teller = setInterval(() => {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(teller);
            timeText.textContent = "Tijd Op";
            const allOptions = option_lijst.children.length;
            let correcAns = questions[que_count].antwoord;
            for (let i = 0; i < allOptions; i++) {
                if (option_lijst.children[i].textContent === correcAns) {
                    option_lijst.children[i].setAttribute("class", "option juist");
                    option_lijst.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_lijst.children[i].classList.add("disabled");
            }
            next_btn.classList.add("toon");
            toonTip(que_count);
            isAnswerSelected = true;
        }
    }, 1000);
}

const startTimerLine = (time) => {
    tellerLine = setInterval(() => {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) {
            clearInterval(tellerLine);
        }
    }, 29);
}

const queteller = (index) => {
    let totalQueCounTag = `<span><p>${index}</p> van <p>${questions.length}</p> Vragen</span>`;
    bottom_ques_teller.innerHTML = totalQueCounTag;
}

const toonTip = (index) => {
    const tipText = questions[index].tip || "Geen tip beschikbaar.";
    const tipBox = document.createElement("div");
    tipBox.className = "tip_box";
    tipBox.innerHTML = '<span>Tip: ' + tipText + '</span>';
    quiz_box.appendChild(tipBox);
}

const verbergTip = () => {
    const tipBox = document.querySelector(".tip_box");
    if (tipBox) {
        tipBox.remove();
    }
}

const resetTimers = () => {
    clearInterval(teller);
    clearInterval(tellerLine);
    timeCount.textContent = "30";
    time_line.style.width = "0px";
}

const resetQuiz = () => {
    quiz_box.classList.add("activeQuiz");
    resultaat_box.classList.remove("activeresultaat");
    timewaarde = 30;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthwaarde = 0;
    startQuiz();
}

const navigateOptions = (direction) => {
    const options = option_lijst.querySelectorAll(".option");
    if (options.length > 0) {
        options[currentFocus].blur();
        if (direction === "up") {
            currentFocus = (currentFocus > 0) ? currentFocus - 1 : options.length - 1;
        } else if (direction === "down") {
            currentFocus = (currentFocus < options.length - 1) ? currentFocus + 1 : 0;
        }
        options[currentFocus].focus();
    }
}

const selectOption = () => {
    const options = option_lijst.querySelectorAll(".option");
    if (options.length > 0) {
        options[currentFocus].click();
    }
}


