import { renderRegistrationBlock, renderSignBlock, createUser, registerSubmit } from "../authorization-block/authorization";

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
      const registerEmail = document.querySelector('#register-email') as HTMLInputElement;
      const registerPassword = document.querySelector('#register-password') as HTMLInputElement;
      createUser({ "email": `${registerEmail.value}`, "password": `${registerPassword.value}` })
    })
  });

  signOpenButton.addEventListener('click', (): void => {
    registerButtonsArray.forEach(elem => (elem.nextElementSibling as HTMLElement).innerHTML = ``);
    renderSignBlock();
    closeAuthorizationForms();
  });

}
