import { getWords } from '../api/api';

import '../textbook-page/textbook-page.css';

const textbookSettings: { page: number, group: number } = {
  page: 1,
  group: 1,
}
const maxPageNum = 30;

//TODO сделать проверку на сложные и изученные и добавить стили при рендере

async function createTextbookContent(): Promise<void> {
  const words: IWord[] = await getWords(textbookSettings.group, textbookSettings.page);

  const page: HTMLElement = document.querySelector('.page') as HTMLElement;
  page.innerHTML = '';

  let textForInput: string = '' as string;

  words.forEach((word: IWord): void => {
    textForInput += `<div class="word-card" data-wordId="${word.id}">
      <div class="word-img" style="background-image: url('https://react-rslang-example.herokuapp.com/${word.image}');"></div>
      <div class="word-inf">
        <div class="word">${word.word} - ${word.transcription} - ${word.wordTranslate}</div>
        <div class="word-meaning">
          <div class="english"><b>${word.textMeaning}</b></div>
          <div class="translation">${word.textMeaningTranslate}</div>
        </div>
        <div class="word-example">
          <div class="english">${word.textExample}</div>
          <div class="translation">${word.textExampleTranslate}</div>
        </div>
      </div>
      <div class="word-settings-container">
        <div class="audio-btn"></div>
        <div class="heavy-btn"></div>
        <div class="learned-btn"></div>
        <div class="word-statistic">
          <div class="learned-count"></div>
        </div>
      </div>
    </div>`;
  })

  page.innerHTML = textForInput;

  const wordCards: NodeListOf<HTMLElement> = document.querySelectorAll('.word-card') as  NodeListOf<HTMLElement>;
  wordCards.forEach((card: HTMLElement) => {
    const audioBTN: HTMLElement = card.querySelector('.audio-btn') as HTMLElement;
    audioBTN.addEventListener(('click'), (): void => {
      //TODO проигрывание звука
    });

    const heavyBTN: HTMLElement = card.querySelector('.heavy-btn') as HTMLElement;
    console.log(heavyBTN);
    heavyBTN.addEventListener(('click'), (): void => {
      heavyBTN.classList.toggle('active');
      card.classList.toggle('heavy-word');
      //TODO функция добавления в сложные
    });

    const learnedBTN: HTMLElement = card.querySelector('.learned-btn') as HTMLElement;
    learnedBTN.addEventListener(('click'), (): void => {
      learnedBTN.classList.toggle('active');
      card.classList.toggle('learned-word');
    });
  })
}

export function createTextbookStructyre(): void {
  const main: HTMLElement = document.querySelector('.main') as HTMLElement;
  main.innerHTML = '';

  const content = `<div class="textbook">
      <div class="page-container">
        <div class="sidebar">
          <div class="bookmarks">
            <div class="bookmark" data-group="1">I</div>
            <div class="bookmark" data-group="2">II</div>
            <div class="bookmark" data-group="3">III</div>
            <div class="bookmark" data-group="4">IV</div>
            <div class="bookmark" data-group="5">V</div>
            <div class="bookmark" data-group="6">VI</div>
            <div class="bookmark" data-group="7"></div>
          </div>

          <div class="page-nav">
            <div class="prev-page"></div>
            <div class="page-num">${textbookSettings.page}</div>
            <div class="next-page"></div>
          </div>
        </div>
        <div class="game-container">
          <div class="sprint-btn"></div>
          <div class="audio-call-btn"></div>
          <div class="game-menu-text">Let's start training</div>
        </div>        
        <div class="page">
        </div>
      </div>      
    </div>`;

    main.innerHTML = content;

    const bookmarks: NodeListOf<HTMLElement> = document.querySelectorAll('.bookmark');

    bookmarks.forEach((bookmarkEl: HTMLElement) => {
      if (Number(bookmarkEl.dataset.group) === textbookSettings.group) {
        bookmarkEl.classList.add('active');
      }
    })

    if (textbookSettings.page === 1) {
      document.querySelector('.prev-page')?.classList.add('disable');
    }
    if (textbookSettings.page === maxPageNum) {
      document.querySelector('.next-page')?.classList.add('disable');
    }
}

function toPrevPage(): void {
  textbookSettings.page = textbookSettings.page - 1;
  console.log(textbookSettings.page);
  renderTextbookPage();
}

function toNextPage(): void {
  textbookSettings.page = textbookSettings.page + 1;
  console.log(textbookSettings.page);
  renderTextbookPage();
}

function goToGroup(bookmark: HTMLElement): void {
  textbookSettings.group = Number(bookmark.dataset.group);
  textbookSettings.page = 1;
  renderTextbookPage();
}

export function renderTextbookPage(): void {
  createTextbookStructyre();
  createTextbookContent();

  const prevBTN: HTMLElement = document.querySelector('.prev-page') as HTMLElement;
  if (!prevBTN.classList.contains('disable')) {
    prevBTN.addEventListener(('click'), toPrevPage);
  }

  const nextBTN: HTMLElement = document.querySelector('.next-page') as HTMLElement;
  if (!nextBTN.classList.contains('disable')) {
    nextBTN.addEventListener(('click'), toNextPage);
  }

  const bookmarks: NodeListOf<HTMLElement> = document.querySelectorAll('.bookmark') as  NodeListOf<HTMLElement>;
  bookmarks.forEach((bookmarkEl: HTMLElement): void => {
    bookmarkEl.addEventListener(('click'), (): void => goToGroup(bookmarkEl));
  })

  const sprintBTN: HTMLElement = document.querySelector('.sprint-btn') as HTMLElement;
  sprintBTN.addEventListener(('click'), () => {
    //TODO функция спринта
  });

  const audiocallBTN: HTMLElement = document.querySelector('.audio-call-btn') as HTMLElement;
  audiocallBTN.addEventListener(('click'), () => {
    //TODO функция аудиовызова
  });
}
