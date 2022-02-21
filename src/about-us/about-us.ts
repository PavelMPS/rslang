import '../about-us/about-us.css';

export async function renderAboutUsBlock(): Promise<void> {
  const aboutUs = `
  <div class="group-select-page">
    <div class="game-page-title">About us</div>
    <section class="about-us__block">
      <div class="person-block">
        <img class="person-image" src="../assets/pavel.jpg" alt="Pavel Sergeevich">
        <div class="person-info__wrap">
          <div class="person-github">
            <a class="github-link" href="https://github.com/PavelMPS">
              <img class="github-image" src="../assets/github.png">
              <div class="github-nickname">PavelMPS</div>
            </a>
          </div>
          <div class="person-info">
            Team Lead of your crew ;) Pavel create sprint and statistics page logic, sprint game design
          </div>
        </div>
      </div>
      <div class="person-block">
        <img class="person-image" src="../assets/veronika.jpg" alt="Veronika Yashchenkova">
        <div class="person-info__wrap">
          <div class="person-github">
            <a class="github-link" href="https://github.com/aiyoy">
              <img class="github-image" src="../assets/github.png">
              <div class="github-nickname">Veronika Yashchenkova</div>
            </a>
          </div>
        <div class="person-info">Veronika works with app design, textbook, create audio challenge game, developed API functions, word learning progress, learned words</div>
        </div>
      </div>
      <div class="person-block">
        <img class="person-image" src="../assets/alexander.jpg" alt="Alexander Mazurin">
        <div class="person-info__wrap">
          <div class="person-github">
            <a class="github-link" href="https://github.com/AlexJester147">
              <img class="github-image" src="../assets/github.png">
              <div class="github-nickname">AlexJester147</div>
            </a>
          </div>
        <div class="person-info">Create app start page, authorization, logout block and About Us page, design statistics page</div>
      </div>
      </div>
    </section>
  </div>`;
  const main = document.querySelector('.main') as HTMLElement;
  main.innerHTML = aboutUs;
};
