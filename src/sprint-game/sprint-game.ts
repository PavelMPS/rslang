import { GameWord, sprintGame } from '../constants/sprint';
import '../sprint-game/sprint-game.css';
import { setStatistic } from '../statistic-page/statistic-page';

export let timerId: NodeJS.Timer;

async function getWords(): Promise<IWord[]> {
    const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${sprintGame.group}&page=${sprintGame.page}`);
    const words: IWord[] = await response.json();
    return words;
}

export async function startGameSprint(): Promise<void> {
    await resetSprintGame();
    const content: string = `
    <div class="timer-sprint"></div>

    <div class="sprint-info-table">
        <div class="question-number">Question: 0/20</div>
    </div>
    
    <div class="sprint-game-area">
        <div class="sprint-difficult-info-container">
            <div class="sprint-score">${sprintGame.gameOptions[0]}<span class="score-window">0</span></div>
            <div class="pop-up-window-score"></div>
            <p class="sprint-difficult-info">Difficulty: ${sprintGame.difficult + 1}</p>               
        </div>  
        <div class="question-area"></div>  
        <div class="answer-btn">
            <button class="right-btn" id="right-answer"></button>
            <button class="wrong-btn" id="wrong-answer"></button>
        </div>                                 
    </div>
    `;
    const main = document.querySelector('.main') as HTMLElement;
    main.innerHTML = content;
    await formGameWords();
    timer(60);
    const btnAnswer = document.querySelector('.answer-btn') as HTMLElement;   
    btnAnswer.addEventListener('click', async (e: Event): Promise<void> => {
    await verifyAnswer(e)});      
}

async function formGameWords(): Promise<void> {
    console.log('1forming game words');
    sprintGame.group = sprintGame.difficult;
    const arr = await getWords();
    console.log(arr);
    await formWordsArray(arr);
    await formRandomWords(); 
}

async function formWordsArray(array): Promise<void> {
    console.log('2forming words array');
    array.forEach((elem, index) => {
        const gameWord: GameWord = {id: elem.id, word: elem.word, answer: elem.wordTranslate, right: true, wordTranslate: elem.wordTranslate, userAnswer: true, audio: elem.audio}
        sprintGame.gameWords[index] = gameWord;
    });
    
}

async function formRandomAnswers(): Promise<Array<string>> {
    const arr: Array<string> = [];
    for (let i = 0; i < 20; i++) {
        arr[i] = await getRandomAnswer()
    }
    return arr;
}

async function formRandomWords(): Promise<void> {
    const randomAnswers = await formRandomAnswers();
    console.log(randomAnswers);
    let count = randomAnswers.length - 1;
    sprintGame.gameWords.forEach((el, index) => {
        if (index % 2 !== 0) {
            if (el.answer !== randomAnswers[count]) {
                el.answer = randomAnswers[count];
                el.right = false;
                count--;
            }         
        }        
    })
    await shuffle(sprintGame.gameWords);
}

async function getRandomAnswer(): Promise<string> {
    sprintGame.group = Math.round(Math.random() * 5);
    sprintGame.page = Math.round(Math.random() * 29);
    const randomAnswer = await getWords();
    let temp: string = '';
    temp = randomAnswer[Math.round(Math.random() * 19)].wordTranslate;
    return temp;
}

async function verifyAnswer(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    if (target.id === sprintGame.gameOptions[1]) {
        if (sprintGame.gameWords[sprintGame.count - 1].right) { 
            highlightAnswer('green');
            getSprintScore();
            renderQuestion(); 
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            sprintGame.currentAnswerSerie = 0;
            highlightAnswer('red');
            renderQuestion();
        }
    } else if (target.id === sprintGame.gameOptions[2]) {
        if (!sprintGame.gameWords[sprintGame.count - 1].right) {
            highlightAnswer('green');
            getSprintScore();
            renderQuestion();
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            sprintGame.currentAnswerSerie = 0;
            highlightAnswer('red');
            renderQuestion();
        }
    }
}

function getSprintScore(): void {
    switch (sprintGame.currentAnswerSerie) {
        case 2: 
            sprintGame.score += sprintGame.advanceScore[0];
            showWinMessage('nice!', sprintGame.advanceScore[0]);
            break;
        case 5:
            sprintGame.score += sprintGame.advanceScore[1];
            showWinMessage('good!', sprintGame.advanceScore[1]);
            break;
        case 8:
            sprintGame.score += sprintGame.advanceScore[2];
            showWinMessage('very good!', sprintGame.advanceScore[2]);
            break;
        case 11:
            sprintGame.score += sprintGame.advanceScore[3];
            showWinMessage('amazing!', sprintGame.advanceScore[3]);
            break;
        case 14:
            sprintGame.score += sprintGame.advanceScore[4];
            showWinMessage('excellent!', sprintGame.advanceScore[4]);
            break;
        case 17:
            sprintGame.score += sprintGame.advanceScore[5];
            showWinMessage('impressive!', sprintGame.advanceScore[5]);
            break;
        case 19:
            sprintGame.score += sprintGame.advanceScore[6];
            showWinMessage('godlike!', sprintGame.advanceScore[6]);
            break;  
    }
    sprintGame.score += sprintGame.advanceScore[0];
    sprintGame.currentAnswerSerie++;
    if (sprintGame.currentAnswerSerie > sprintGame.maxSerie) {
        sprintGame.maxSerie = sprintGame.currentAnswerSerie
    }
    const scoreWindow = document.querySelector('.score-window') as HTMLElement;
    scoreWindow.innerHTML = sprintGame.score.toString();
    console.log( sprintGame.currentAnswerSerie, sprintGame.maxSerie);
}

function showWinMessage(message: string, addingScore: number): void {
    const content: string = `
        <div class="win-message-container">
            <p class="win-message">${message}</p>
            <p class="adding-score">+${addingScore}</p>
        </div>
    `;
    const popUpWindow = document.querySelector('.pop-up-window-score') as HTMLElement;
    popUpWindow.innerHTML = content;
}

async function renderQuestion(): Promise<void> {
    console.log('5 render question');
    console.log(sprintGame.gameWords);
    if (sprintGame.count === 20) { 
        getResults();
        return;
    }      
    const questionNumber = `Question: ${sprintGame.count + 1}/${sprintGame.gameWords.length}`;
    const content = `
    <div class="sprint-question">${sprintGame.gameWords[sprintGame.count].word}</div>
    <div class="sprint-meaning">this means?</div>
    <div class="sprint-answer">${sprintGame.gameWords[sprintGame.count].answer}</div>
    `;
    const gameArea = document.querySelector('.question-area') as HTMLElement;
    const questionNumberArea = document.querySelector('.question-number') as HTMLElement;
    questionNumberArea.innerHTML = questionNumber;
    gameArea.innerHTML = content;
    sprintGame.count++;  
}

async function shuffle(array: Array<GameWord>): Promise<void> {
    console.log('4 shuffle array');
    array.sort(() => Math.random() - 0.5);
    await renderQuestion();
}

function getResults(): void {
    clearInterval(timerId);
    sprintGame.gameWords.length = sprintGame.count;
    const main = document.querySelector('.main') as HTMLElement;
    let rightAnswers: string = '';
    let wrongAnswers: string = '';
    sprintGame.gameWords.forEach(el => {
        if (el.userAnswer) {
            rightAnswers += `<li>${el.word} - ${el.wordTranslate}</li>`;
        } else if (!el.userAnswer) {
            wrongAnswers += `<li>${el.word} - ${el.wordTranslate}</li>`;
        }
    })
    const content: string = `
        <div class="results-container">
            <div class="result-cat-right"></div>
            <div class="sprint-results-area">
                <p class="sprint-results">${sprintGame.currentAnswerSerie === 0 ?
                    sprintGame.gameOver[0] : sprintGame.gameOver[1]}${sprintGame.gameOptions[3]}${sprintGame.score}</p>
                <div class="area-results">
                    <p class="answer-subtitle-right">Right answers:</p>
                    <ol class="right-answers-result"></ol>
                    <p class="answer-subtitle-wrong">Wrong answers:</p>
                    <ol class="wrong-answers-result"></ol>
                </div>          
            </div>
            <div class="result-button-container">
                <button class="try-again-sprint">${sprintGame.gameOptions[4]}</button>
                <div class="result-cat-left"></div>
            </div>
            
        </div>        
    `; 
    main.innerHTML = content;
    const rightAnswersResult = document.querySelector('.right-answers-result') as HTMLElement;
    const wrongAnswersResult = document.querySelector('.wrong-answers-result') as HTMLElement;
    const areaResult = document.querySelector('.area-results') as HTMLElement;
    if (sprintGame.count === 1) {
        areaResult.innerHTML = sprintGame.gameOver[2];
    } else {
        rightAnswersResult.innerHTML = rightAnswers;
        wrongAnswersResult.innerHTML = wrongAnswers;      
    }
    // setStatistic();Количество новых слов, самая длинная серия правильных ответов, кол-во правильных ответов.
    const tryAgainBtn = document.querySelector('.try-again-sprint') as HTMLButtonElement;
    tryAgainBtn.addEventListener('click', () => {     
        startGameSprint();
    });
}

async function resetSprintGame(): Promise<void> {
    sprintGame.count = 0;
    sprintGame.score = 0;
    sprintGame.currentAnswerSerie = 0;
    sprintGame.group = sprintGame.difficult;
    sprintGame.page = 0;
}

function highlightAnswer(color: string): void {
    const answerArea = document.querySelector('.question-area') as HTMLElement;
    answerArea.classList.add(`active-area-${color}`);
    setTimeout(() => {
        answerArea.classList.remove(`active-area-${color}`);
    }, 1000)
}

function timer(value: number): void {
    timerId = setInterval(() => {
        if (value === 0) {
            clearInterval(timerId);       
            getResults();
        }
        const timerWindow = document.querySelector('.timer-sprint') as HTMLElement;
        timerWindow.innerHTML = String(value).padStart(2, '0');
        value--;
    }, 1000);
}
