import { renderRegistrationBlock, renderSignBlock, closeAuthorizationForms } from "../authorization-block/authorization";

export async function authorizationListen(): Promise<void> {
  const registerOpenButton = document.querySelector('.register-open__button') as HTMLElement;
  const signOpenButton = document.querySelector('.sign-open__button') as HTMLElement;
  const registerButtonsArray: Array<HTMLElement> = [registerOpenButton, signOpenButton];

  registerOpenButton.addEventListener('click', (): void => {
    registerButtonsArray.forEach(elem => (elem.nextElementSibling as HTMLElement).innerHTML = ``);
    renderRegistrationBlock();
    closeAuthorizationForms();
  });

  signOpenButton.addEventListener('click', (): void => {
    registerButtonsArray.forEach(elem => (elem.nextElementSibling as HTMLElement).innerHTML = ``);
    renderSignBlock();
    closeAuthorizationForms();
  });
}
