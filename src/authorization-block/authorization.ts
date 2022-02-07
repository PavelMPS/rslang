import './authorization.css';

export async function renderRegistrationBlock(): Promise<void> {
  const registerBlock = document.querySelector('.register-block') as HTMLElement;
  registerBlock.innerHTML = `<img class="close-form" src="./assets/cross.svg" alt="Close">
    <form class="register-form">
        <label class="form-label" for="register-name">Name</label>
        <input class="form-input" type="text" name="register-name" id="register-name" required>
        <label class="form-label" for="register-email">E-mail</label>
        <input class="form-input" type="email" name="register-email" id="register-email" required>
        <label class="form-label" for="register-password">Password</label>
        <input class="form-input" type="password" name="register-password" id="register-password" required>
        <input class="register-submit" type="submit" value="Register">
    </form>`;
}

export async function renderSignBlock(): Promise<void> {
  const signBlock = document.querySelector('.sign-block') as HTMLElement;
  signBlock.innerHTML = `<img class="close-form" src="./assets/cross.svg" alt="Close">
  <form class="sign-form">
      <label class="form-label" for="sign-email">E-mail</label>
      <input class="form-input" type="email" name="sign-email" id="sign-email" required>
      <label class="form-label" for="sign-password">Password</label>
      <input class="form-input" type="password" name="sign-password" id="sign-password" required>
      <input class="sign-submit" type="submit" value="Sign in">
  </form>`;
}

export async function closeAuthorizationForms(): Promise<void> {
  const closeForm = document.querySelector<HTMLElement>('.close-form');
  closeForm?.addEventListener('click', (): void => {
    (closeForm.parentNode as HTMLElement).innerHTML = ``;
  });
}
