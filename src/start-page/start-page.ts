import { burgerListen } from '../listen/burger-listen';
import { startPageListen } from '../listen/start-page-listen';
import { authorizationListen } from '../listen/authorization-listen';
import '../start-page/start-page.css';

export function renderStartPage(): void {
  const startPage = `
  <header class="header">
  <div class="burger-menu">
  <nav class="burger-menu__nav">
    <ul>
      <li><a href="#"><img class="burger-menu__img" src="./assets/home.png"><div id="burger-menu-item-0">Home</div></a></a></li>
      <li><a href="#"><img class="burger-menu__img" src="./assets/exercise.png"><div id="burger-menu-item-1">Sprint</div></a></a></li>
      <li><a href="#"><img class="burger-menu__img" src="./assets/audio.png"><div id="burger-menu-item-2">Audio challenge</div></a></a></li>
      <li><a href="#"><img class="burger-menu__img" src="./assets/textbook.png"><div id="burger-menu-item-3">Textbook</div></a></li>
      <li><a href="#"><img class="burger-menu__img" src="./assets/stats.png"><div id="burger-menu-item-4">Statistics</div></a></li>
      <li><a href="#"><img class="burger-menu__img" src="./assets/about.png"><div id="burger-menu-item-5">About us</div></a></li>
    </ul>
  </nav>
</div>
  <nav class="nav">
  <div class="burger">
    <div class="line1"></div>
    <div class="line2"></div>
    <div class="line3"></div>
  </div>
      <div class="greet-block"></div>
      <div class="register-sign__block">
          <button class="authorization-open__button">Authorize</button>
          <div class="authorization-block"></div>
          <button class="logout-open__button">Log out</button>
          <div class="logout-block"></div>
      </div>
  </nav>
</header>
<main class="main">
      <article class="about-us__info">
          Description
      </article>
  <section class="games-button__wrap">
    <div class="sprint-game">
      <img class="game-img" src="../assets/busy.png">
      <div class="game-caption">Sprint game</div>
    </div>
    <div class="textbook-button">
      <img class="game-img" src="../assets/books.png">
      <div class="game-caption">Textbook</div>
  </div>
  <div class="audio-challenge">
    <img class="game-img" src="../assets/marketing.png">
    <div class="game-caption">Audio challenge</div>
  </div>
</section>
<button class="about-us__button">About us</button>
</main>
<footer class="footer">
  <div class="developers">
      <a href="https://github.com/PavelMPS" target="_blank">Pavel Sergeevich, </a>
      <a href="https://github.com/aiyoy" target="_blank">Veronika Yashchenkova, </a>
      <a href="https://github.com/AlexJester147" target="_blank">Alexander Mazurin</a>
  </div>
  <div class="year">2022</div>
  <a href="https://rs.school/js/" target="_blank">
      <img class="rsschool-img" src="https://rs.school/images/rs_school_js.svg" alt="RSSchool">
  </a>
</footer>
 `;
  const body = document.querySelector('.body') as HTMLElement;
  body.innerHTML = startPage;
  const burger = document.querySelector('.burger') as HTMLElement;
  const burgerMenu = document.querySelector('.burger-menu') as HTMLElement;
  const burgerMenuLinks = document.querySelectorAll<HTMLElement>('.burger-menu a, .burger');

  const openBurgerMenu = () => {
    burgerMenu.classList.toggle('active');
    burger.children[0].classList.toggle('active');
    burger.children[1].classList.toggle('passive');
    burger.children[2].classList.toggle('active');
  };

  burgerMenuLinks.forEach(el => {
    el.addEventListener('click', () => {
      openBurgerMenu();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target !== burger) {
      burgerMenu.classList.remove('active');
      burger.children[0].classList.remove('active');
      burger.children[1].classList.remove('passive');
      burger.children[2].classList.remove('active');
    }
  });
  burgerListen();
  startPageListen();
  authorizationListen();
};