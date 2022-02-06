import { GameWord, sprintGame } from '../constants/sprint';
import '../sprint-game/sprint-game.css';

export let timerId;

async function getWords(): Promise<IWord[]> {
    const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${sprintGame.page}&page=${sprintGame.difficult}`);
    const words: IWord[] = await response.json();
    return words;
  }


export async function renderSprintPage(): Promise<void> {
    const content: string = `
    <div class="game-sprint-title-container">
        <h3 class="game-sprint-page-title">SPRINT</h3>
    </div>
    <div class="game-sprint-describe-container">
        <h3 class="game-sprint-describe">In this game you must choose rihgt answer.
        Click at that button you think right or press key left or right
        for choosing answer</h3>
    </div>
    <div class="game-sprint-difficult-container">
        <h4 class="sprint-difficult-subtitle">Choose the difficult of the game:</h4>
        <div class="difficult-buttons-container">
            <button class="btn difficult-btn choosen-btn" id="sprint-difficult-btn-1">1</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-2">2</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-3">3</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-4">4</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-5">5</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-6">6</button>
        </div>
    </div>
    <button class="btn sprint-start-btn">Let's start!</button>
    `;
    const footer = document.querySelector('.footer') as HTMLElement;
    const main = document.querySelector('.main') as HTMLElement;
    footer.classList.add('disabled');
    main.innerHTML = content;
    await chooseDifficult();
    await startGameSprint();
}

async function chooseDifficult(): Promise<void> {
    const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.difficult-btn');
    const buttonContainer: HTMLElement | null = document.querySelector('.difficult-buttons-container');
    buttonContainer?.addEventListener('click', async (e: Event) => {
        const target = e.target as HTMLElement;
        buttons.forEach((el, i) => {
            el.classList.remove('choosen-btn')
        })
        target.classList.add('choosen-btn');
        sprintGame.difficult = +target.id.slice(target.id.length - 1);
    }) 
    
}

async function startGameSprint(): Promise<void> {
    const btnStart = document.querySelector('.sprint-start-btn') as HTMLButtonElement;
    btnStart.addEventListener('click', async () => {
        const content: string = `
        <div class="timer-sprint"></div>
        <div class="sprint-game-area">
            <div class="sprint-difficult-info-container">
                <div class="sprint-score">SCORE: <span>0</span></div>
                <p class="sprint-difficult-info">Difficulty: ${sprintGame.difficult}</p>               
            </div>  
            <div class="question-area"></div>  
            <div class="answer-btn">
                <button class="next">RIGHT</button>
                <button class="next">WRONG</button>
            </div> 
                                     
        </div>
        `;
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = content;
        await formGameWords();
        timer(60);
        renderQuestion(0);
        const btnNext = document.querySelector('.next') as HTMLElement;   
        btnNext.addEventListener('click', () => {
        renderQuestion(sprintGame.count)})
    });
         
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

function getResults(): void {
    //TODO выводит результат
}

function getSprintScore():void {
    //TODO считает score и выводит
}

async function formGameWords(): Promise<void> {
    const arr = await getWords();
    arr.forEach(async (elem, index) => {
        const gameWord: GameWord = {question: elem.word, answer: elem.wordTranslate, right: true}
        sprintGame.gameWords[index] = gameWord;       
    });
    await formRandomWords();
 
}

async function formRandomWords() {
    sprintGame.gameWords.forEach(async (el, index) => {
        if (index % 2 === 0) {
            const temporary = await getRandomAnswer();
            el.answer = temporary.answer;
            el.right = temporary.right;
        }
           
    })
    console.log(sprintGame.gameWords)
}

async function getRandomAnswer(): Promise<{answer: string, right: boolean}> {
    const randomAnswer = await getWords();
    const temp: {answer: string, right: boolean} = {answer: '', right: false};
    const group: number = Math.round(Math.random() * 5);
    const page: number = Math.round(Math.random() * 29);
    const index: number = Math.round(Math.random() * 19);
    sprintGame.difficult = group;
    sprintGame.page = page;   
    temp.answer = randomAnswer[index].wordTranslate;
    temp.right = false;
    return temp
}

function renderQuestion(count: number):void {
    const content = `
    <div>${sprintGame.gameWords[count].question}</div>
    <div>${sprintGame.gameWords[count].answer}</div>
    `;
    const gameArea = document.querySelector('.question-area') as HTMLElement;
    gameArea.innerHTML = content;
    sprintGame.count++;
    
}