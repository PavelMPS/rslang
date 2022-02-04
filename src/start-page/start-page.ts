import '../start-page/start-page.css';

export function renderStartPage(): void {
  const startPage = `
  <header class="header">
  <nav class="nav">
      <div class="app-name">RSLang</div>
      <div class="register-sign__block">
          <button class="register-open__button">Register</button>
          <div class="register-block">
              <img class="close-form" src="./assets/cross.svg" alt="Close">
              <form class="register-form">
                  <label class="form-label" for="register-email">E-mail</label>
                  <input class="form-input" type="email" name="register-email" id="register-email" required>
                  <label class="form-label" for="register-password">Password</label>
                  <input class="form-input" type="password" name="register-password" id="register-password"
                      required>
                  <input class="register-submit" type="submit" value="Register">
              </form>
          </div>
          <button class="sign-open__button">Sign in</button>
          <div class="sign-block">
              <img class="close-form" src="./assets/cross.svg" alt="Close">
              <form class="sign-form">
                  <label class="form-label" for="sign-email">E-mail</label>
                  <input class="form-input" type="email" name="sign-email" id="sign-email" required>
                  <label class="form-label" for="sign-password">Password</label>
                  <input class="form-input" type="password" name="sign-password" id="sign-password" required>
                  <input class="sign-submit" type="submit" value="Sign in">
              </form>
          </div>
      </div>
  </nav>
</header>

<main class="main">
  <section class="games-button__wrap">
      <div class="game1">Game1</div>
      <div class="game2">Game2</div>
  </section>

  <section class="about-us__block">
      <button class="about-us__button">About us</button>
      <article class="about-us__info">
          Description
      </article>
  </section>
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

  const registerOpenButton = document.querySelector('.register-open__button') as HTMLElement;
  const signOpenButton = document.querySelector('.sign-open__button') as HTMLElement;
  const registerButtonsArray: Array<HTMLElement> = [registerOpenButton, signOpenButton];
  const closeForm = document.querySelectorAll<HTMLElement>('.close-form');

  closeForm.forEach((element): void => {
    element.addEventListener('click', (): void => {
      element.parentElement?.classList.toggle('active');
    });
  });

  registerButtonsArray.forEach((element): void => {
    element.addEventListener('click', (): void => {
      registerButtonsArray.forEach(elem => elem.nextElementSibling?.classList.remove('active'));
      element.nextElementSibling?.classList.toggle('active');
    });
  });

};
