import '../start-page/start-page.css';

export function renderStartPage() {
  const startPage = `
  <header class="header">
  <nav class="nav">
      <div class="app-name">RSLang</div>
      <div class="register-sign__block">
          <button class="register-open__button">Register</button>
          <button class="sign-open__button">Sign in</button>
      </div>
  </nav>
</header>

<main class="main">
  <section class="games-button__wrap">
      <div class="game1">Game1</div>
      <div class="game2">Game2</div>
  </section>
</main>

<footer class="footer"></footer>
 `;
  const body = document.querySelector('.body') as HTMLElement;
  body.innerHTML = startPage;
}
