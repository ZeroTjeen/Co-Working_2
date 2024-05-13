// Selecteer alle benodigde elementen
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

// Als op de startQuiz-knop wordt geklikt
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); // Toon info box
}

// Als op de exitQuiz-knop wordt geklikt
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); // Verberg info box
}

// Als op de continueQuiz-knop wordt geklikt
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); // Verberg info box
    quiz_box.classList.add("activeQuiz"); // Toon quiz box
    toonvraag(0); // Roept de toonvraag functie aan
    queteller(1); // Geeft 1 parameter door aan queteller
    startTimer(30); // Roept de startTimer functie aan
    startTimerLine(0); // Roept de startTimerLine functie aan
}

let timewaarde =  30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let teller;
let tellerLine;
let widthwaarde = 0;

const restart_quiz = resultaat_box.querySelector(".buttons .restart");
const quit_quiz = resultaat_box.querySelector(".buttons .quit");

// Als de restartQuiz-knop wordt geklikt
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); // Toon quiz box
    resultaat_box.classList.remove("activeresultaat"); // Verberg resultaat box
    timewaarde =30; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthwaarde = 0;
    toonvraag(que_count); // Roept de toonvraag functie aan
    queteller(que_numb); // Geeft que_numb waarde door aan queteller
    clearInterval(teller); // Wis teller
    clearInterval(tellerLine); // Wis tellerLine
    startTimer(timewaarde); // Roept de startTimer functie aan
    startTimerLine(widthwaarde); // Roept de startTimerLine functie aan
    timeText.textContent = "tijd over"; // Verandert de tekst van timeText naar "Tijd Over"
    next_btn.classList.remove("toon"); // Verberg de volgende knop
}

// Als de quitQuiz-knop wordt geklikt
quit_quiz.onclick = ()=>{
    window.location.reload(); // Herlaadt het huidige venster
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_teller = document.querySelector("footer .total_que");

// Als de Volgende-vraag-knop wordt geklikt
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ // Als het aantal vragen kleiner is dan de totale lengte van vragen
        que_count++; // Verhoog het aantal vragen
        que_numb++; // Verhoog het vraagnummer
        toonvraag(que_count); // Roept de toonvraag functie aan
        queteller(que_numb); // Geeft het vraagnummer door aan queteller
        clearInterval(teller); // Wis teller
        clearInterval(tellerLine); // Wis tellerLine
        startTimer(timewaarde); // Roept de startTimer functie aan
        startTimerLine(widthwaarde); // Roept de startTimerLine functie aan
        timeText.textContent = "tijd over"; // Verandert de tijdtekst naar "Tijd Over"
        next_btn.classList.remove("toon"); // Verberg de volgende knop
    }else{
        clearInterval(teller); // Wis teller
        clearInterval(tellerLine); // Wis tellerLine
        toonresultaat(); // Roept de toonresultaat functie aan
    }
}

// Haal vragen en opties op uit de array
function toonvraag(index){
    const que_text = document.querySelector(".que_text");

    // Maakt een nieuwe span en div aan voor de vraag en optie en geeft de waarde door met array index
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';
    que_text.innerHTML = que_tag; // Voegt nieuwe span tag toe aan que_tag
    option_lijst.innerHTML = option_tag; // Voegt nieuwe div tag toe aan option_tag
    
    const option = option_lijst.querySelectorAll(".option");

    // Stel onclick-attribuut in voor alle beschikbare opties
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// Maakt nieuwe div tags aan voor iconen
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Als gebruiker op optie klikt
function optionSelected(antwoord){
    clearInterval(teller); // Wis teller
    clearInterval(tellerLine); // Wis tellerLine
    let userAns = antwoord.textContent; // Haalt door de gebruiker geselecteerde optie op
    let correcAns = questions[que_count].antwoord; // Haalt juist antwoord op uit array
    const allOptions = option_lijst.children.length; // Haalt alle opties op
    
    if(userAns == correcAns){ // Als door gebruiker geselecteerde optie gelijk is aan juist antwoord uit array
        userScore += 1; // Verhoog de score met 1
        antwoord.classList.add("juist"); // Voegt groene kleur toe aan juist geselecteerde optie
        antwoord.insertAdjacentHTML("beforeend", tickIconTag); // Voegt een vinkje-icoon toe aan juist geselecteerde optie
        console.log("juist antwoord");
        console.log("jouw juist antwoords = " + userScore);
    }else{
        antwoord.classList.add("injuist"); // Voegt rode kleur toe aan juist geselecteerde optie
        antwoord.insertAdjacentHTML("beforeend", crossIconTag); // Voegt een kruis-icoon toe aan juist geselecteerde optie
        console.log("fout antwoord");

        for(i=0; i < allOptions; i++){
            if(option_lijst.children[i].textContent == correcAns){ // Als er een optie is die overeenkomt met een juist antwoord uit de array 
                option_lijst.children[i].setAttribute("class", "option juist"); // Voegt groene kleur toe aan overeenkomende optie
                option_lijst.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Voegt een vinkje-icoon toe aan overeenkomende optie
                console.log("Automatisch juist antwoord geselecteerd.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_lijst.children[i].classList.add("disabled"); // Eenmaal door gebruiker een optie is geselecteerd, worden alle opties uitgeschakeld
    }
    next_btn.classList.add("toon"); // Toon de volgende knop als gebruiker een optie heeft geselecteerd
}

function toonresultaat(){
    info_box.classList.remove("activeInfo"); // Verberg info box
    quiz_box.classList.remove("activeQuiz"); // Verberg quiz box
    resultaat_box.classList.add("activeresultaat"); // Toon resultaat box
    const scoreText = resultaat_box.querySelector(".score_text");
    if (userScore > 3){ // Als gebruiker meer dan 3 punten heeft gescoord
        // Maakt een nieuwe span tag aan en geeft het aantal punten en totaal aantal vragen door
        let scoreTag = '<span>Goed!,Je hebt <p>'+ userScore +'</p>van de<p>'+ questions.length +'</p>vragen juist beantwoord.</span>';
        scoreText.innerHTML = scoreTag;  // Voegt nieuwe span tag toe aan score_Text
    }
    else if(userScore > 1){ // Als gebruiker meer dan 1 punt heeft gescoord
        let scoreTag = '<span>Goed,je hebt <p>'+ userScore +'</p>van de<p>'+ questions.length +'</p>vragen juist beantwoord.</span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ // Als gebruiker minder dan 1 punt heeft gescoord
        let scoreTag = '<span>Helaas, je hebt maar <p>'+ userScore +'</p>van de<p>'+ questions.length +'</p>vragen juist beantwoord.</span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time){
    teller = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; // Verandert de waarde van timeCount naar de tijdswaarde
        time--; // Verlaagt de tijdswaarde met 1
        if(time < 9){ // Als de timer minder is dan 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; // Voeg een 0 toe voor de tijdswaarde
        }
        if(time < 0){ // Als de timer minder dan 0 is
            clearInterval(teller); // Wis teller
            timeText.textContent = "Tijd Op"; // Verandert de tekst naar "Tijd Op"
            const allOptions = option_lijst.children.length; // Haalt alle opties op
            let correcAns = questions[que_count].antwoord; // Haalt juist antwoord op uit array
            for(i=0; i < allOptions; i++){
                if(option_lijst.children[i].textContent == correcAns){ // Als er een optie is die overeenkomt met een juist antwoord uit de array
                    option_lijst.children[i].setAttribute("class", "option juist"); // Voegt groene kleur toe aan overeenkomende optie
                    option_lijst.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Voegt een vinkje-icoon toe aan overeenkomende optie
                    console.log("Tijd Op: Automatisch juist antwoord geselecteerd.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_lijst.children[i].classList.add("disabled"); // Eenmaal door gebruiker een optie is geselecteerd, worden alle opties uitgeschakeld
            }
            next_btn.classList.add("toon"); // Toon de volgende knop als gebruiker een optie heeft geselecteerd
        }
    }
}

function startTimerLine(time){
    tellerLine = setInterval(timer, 29);
    function timer(){
        time += 1; // Verhoog de tijdswaarde met 1
        time_line.style.width = time + "px"; // Verhoog de breedte van time_line met px met de tijdswaarde
        if(time > 549){ // Als de tijdswaarde groter is dan 549
            clearInterval(tellerLine); // Wis tellerLine
        }
    }
}

function queteller(index){
    // Maakt een nieuwe span tag aan en geeft het vraagnummer en totaal aantal vragen door
    let totalQueCounTag = '<span><p>'+ index +'</p> van de <p>'+ questions.length +'</p> Vragen</span>';
    bottom_ques_teller.innerHTML = totalQueCounTag;  // Voegt nieuwe span tag toe aan bottom_ques_teller
}