import { renderRegistrationBlock, renderSignBlock, createUser, loginUser } from "../authorization-block/authorization";

export async function authorizationListen(): Promise<void> {
  const registerOpenButton = document.querySelector('.register-open__button') as HTMLElement;
  const signOpenButton = document.querySelector('.sign-open__button') as HTMLElement;

  const registerButtonsArray: Array<HTMLElement> = [registerOpenButton, signOpenButton];

  async function closeAuthorizationForms(): Promise<void> {
    const closeForm = document.querySelector<HTMLElement>('.close-form');
    closeForm?.addEventListener('click', (): void => {
      (closeForm.parentNode?.parentNode as HTMLElement).innerHTML = ``;
    });
  }

  registerOpenButton.addEventListener('click', (): void => {
    registerButtonsArray.forEach(elem => (elem.nextElementSibling as HTMLElement).innerHTML = ``);
    renderRegistrationBlock();
    closeAuthorizationForms();
    const registerSubmit = document.querySelector('.register-submit') as HTMLElement;
    registerSubmit.addEventListener('click', () => {
      const registerName = document.querySelector('#register-name') as HTMLInputElement;
      const registerEmail = document.querySelector('#register-email') as HTMLInputElement;
      const registerPassword = document.querySelector('#register-password') as HTMLInputElement;
      createUser({ "name": `${registerName.value}`, "email": `${registerEmail.value}`, "password": `${registerPassword.value}` });
    });
  });

  signOpenButton.addEventListener('click', (): void => {
    registerButtonsArray.forEach(elem => (elem.nextElementSibling as HTMLElement).innerHTML = ``);
    renderSignBlock();
    closeAuthorizationForms();
    const signSubmit = document.querySelector('.sign-submit') as HTMLElement;
    signSubmit.addEventListener('click', () => {
      const signEmail = document.querySelector('#sign-email') as HTMLInputElement;
      const signPassword = document.querySelector('#sign-password') as HTMLInputElement;
      loginUser({ "email": `${signEmail.value}`, "password": `${signPassword.value}` });
    });
  });
};
