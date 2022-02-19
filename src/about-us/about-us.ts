import '../about-us/about-us.css';

export async function renderAboutUsBlock(): Promise<void> {
  const aboutUs = `
  <div class="group-select-page">
    <div class="game-page-title">About us</div>
  </div>`;
  const main = document.querySelector('.main') as HTMLElement;
  main.innerHTML = aboutUs;
}