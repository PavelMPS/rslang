import { sprint } from '../constants/constants';
import { GameWord, sprintGame } from '../constants/sprint';
import '../sprint-game/sprint-game.css';
import { getQuestionArr, getResults, resetGame } from '../utilits/utilits';

export let timerId: NodeJS.Timer;

async function getWords(): Promise<IWord[]> {
    const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${sprintGame.group}&page=${sprintGame.page}`);
    const words: IWord[] = await response.json();
    return words;
}

export async function startGameSprint(group?: number, page?: number): Promise<void> {
    console.log(sprintGame.difficult)
    await resetGame(sprint);
    const content: string = `
    <div class="timer-sprint"></div>

    <div class="sprint-info-table">
        <div class="question-number">Question: 0/20</div>
    </div>
    
    <div class="sprint-game-area">
        <div class="sprint-difficult-info-container">
            <div class="sprint-score">${sprintGame.gameOptions[0]}<span class="score-window">0</span></div>
            <div class="pop-up-window-score"></div>
            <p class="sprint-difficult-info">Difficulty: ${group ? group : sprintGame.difficult + 1}</p>               
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
    await formGameWords(group, page);
    timer(60);
    const btnAnswer = document.querySelector('.answer-btn') as HTMLElement;   
    btnAnswer.addEventListener('click', async (e: Event): Promise<void> => {
    await verifyAnswer(e)}); 
    document.addEventListener('keydown',keyboardControl);
}

export function keyboardControl(event: KeyboardEventInit): void {
    switch (event.code) {
        case "ArrowLeft":
            console.log('left')
            if (sprintGame.gameWords[sprintGame.count - 1].right) { 
                rightAnswer();
            } else {
                sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
                wrongAnswer();
            }
            break;
        case "ArrowRight":
            console.log('right')
            if (!sprintGame.gameWords[sprintGame.count - 1].right) {
                rightAnswer();
            } else {
                sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
                wrongAnswer();
            }
            break;
    }
}

async function formGameWords(group?: number, page?: number): Promise<void> {
    group ? sprintGame.group = group : sprintGame.group = sprintGame.difficult;
    let arr: IWord[];
    if (group !== undefined && page !== undefined) {
        arr = await getQuestionArr(sprintGame.group, page);
    } else {
        arr = await getQuestionArr(sprintGame.group);
    } 
    await formWordsArray(arr);
    await formRandomWords(); 
}

async function formWordsArray(array: IWord[]): Promise<void> {
    array.forEach((elem: IWord, index) => {
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
            rightAnswer();
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            wrongAnswer();
        }
    } else if (target.id === sprintGame.gameOptions[2]) {
        if (!sprintGame.gameWords[sprintGame.count - 1].right) {
            rightAnswer();
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            wrongAnswer();
        }
    }
}

function rightAnswer(): void {
    sprintGame.rightAnswers++;
    highlightAnswer('green');
    getSprintScore();
    renderQuestion(); 
}

function wrongAnswer(): void {
    sprintGame.answerSeries = 0;
    highlightAnswer('red');
    renderQuestion();
}

async function disableButtons(): Promise<void> {
    const rightBtn = document.querySelector('.right-btn') as HTMLButtonElement;
    const wrongBtn = document.querySelector('.wrong-btn') as HTMLButtonElement;
    rightBtn.disabled = true;
            wrongBtn.disabled = true;
            setTimeout(() => {
                rightBtn.disabled = false;
                wrongBtn.disabled = false;
            }, 1000);
}

function getSprintScore(): void {
    switch (sprintGame.answerSeries) {
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
    sprintGame.answerSeries++;
    if (sprintGame.answerSeries > sprintGame.seriesTotalStatistics) {
        sprintGame.seriesTotalStatistics = sprintGame.answerSeries
    }
    const scoreWindow = document.querySelector('.score-window') as HTMLElement;
    scoreWindow.innerHTML = sprintGame.score.toString();
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
    if (sprintGame.count === sprintGame.gameWords.length) {
        clearTimeout(timerId); 
        sprintGame.allAnswers = sprintGame.gameWords.length;
        const rightBtn = document.querySelector('.right-btn') as HTMLButtonElement;
        const wrongBtn = document.querySelector('.wrong-btn') as HTMLButtonElement;
        rightBtn.disabled = true;
        wrongBtn.disabled = true;
        getResults(sprintGame.gameWords, 'sprint');
        return;
    }  
    await disableButtons();    
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
    array.sort(() => Math.random() - 0.5);
    await renderQuestion();
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
            document.removeEventListener('keydown', keyboardControl);
            sprintGame.allAnswers = sprintGame.gameWords.length;
            getResults(sprintGame.gameWords, 'sprint');
        }
        const timerWindow = document.querySelector('.timer-sprint') as HTMLElement;
        timerWindow.innerHTML = String(value).padStart(2, '0');
        value--;
    }, 1000);
}
