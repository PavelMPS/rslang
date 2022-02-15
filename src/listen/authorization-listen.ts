import { renderAuthorizationBlock, renderRegistrationBlock, renderSignBlock, createUser, loginUser } from "../authorization-block/authorization";

export async function authorizationListen(): Promise<void> {

  const authorizationOpenButton = document.querySelector('.authorization-open__button') as HTMLElement;
  const authorizationBlock = document.querySelector('.authorization-block') as HTMLElement;
  authorizationBlock.dataset.open = 'false';

  const handler = function closeForm(e: MouseEvent) {
    if (e.target !== authorizationOpenButton) {
      e.composedPath().every(element => authorizationBlock.contains((element as Node))
        ? false
        : (authorizationBlock.innerHTML = '', authorizationBlock.dataset.open = 'false'));
    };
  };

  document.removeEventListener('click', handler, true);

  authorizationOpenButton.addEventListener('click', (): void => {

    renderAuthorizationBlock();
    renderRegistrationBlock();
    showHidePassword();

    if (authorizationBlock.dataset.open == 'true') {
      authorizationBlock.dataset.open = 'false';
      authorizationBlock.innerHTML = '';
      document.removeEventListener('click', handler, true);
    } else {
      authorizationBlock.dataset.open = 'true';
      renderAuthorizationBlock();
      renderRegistrationBlock();
      switchAuthorizeBlock([document.querySelector('.register-open__button') as HTMLElement, document.querySelector('.sign-open__button') as HTMLElement]);
      signSubmitCall(document.querySelector('.register-block') as HTMLElement);
      registerSubmitCall(document.querySelector('.sign-block') as HTMLElement);
      document.addEventListener('click', handler, true);
      showHidePassword();
    }

    function showHidePassword(): void {
      const passwordControl = document.querySelector('.password-control') as HTMLInputElement;
      passwordControl.addEventListener('click', (): Boolean => {
        if (passwordControl.previousElementSibling?.getAttribute('type') == 'password') {
          passwordControl.classList.add('view');
          passwordControl.previousElementSibling?.setAttribute('type', 'text');
        } else {
          passwordControl.classList.remove('view');
          passwordControl.previousElementSibling?.setAttribute('type', 'password');
        }
        return false;
      });
    };

    function switchAuthorizeBlock(args: Array<HTMLElement>): void {
      args[0].classList.add('active');
      args.forEach((element: Element) => {
        element.addEventListener('click', (): void => {
          args.forEach((element: Element) => {
            element.classList.remove('active');
          });
          element.classList.add('active');
        });
      });
    };

    function sendRegistrationInfo(): void {
      const registerSubmit = document.querySelector('.register-submit') as HTMLInputElement;
      registerSubmit.addEventListener('click', (): void => {
        const registerName = document.querySelector('#register-name') as HTMLInputElement;
        const registerEmail = document.querySelector('#register-email') as HTMLInputElement;
        const registerPassword = document.querySelector('#register-password') as HTMLInputElement;
        createUser({ "name": `${registerName.value}`, "email": `${registerEmail.value}`, "password": `${registerPassword.value}` });
      });
    }

    function registerSubmitCall(element: HTMLElement): void {
      sendRegistrationInfo();
      const registerOpenButton = document.querySelector('.register-open__button') as HTMLElement;
      registerOpenButton.addEventListener('click', (): void => {
        element.innerHTML = '';
        renderRegistrationBlock();
        sendRegistrationInfo();
        showHidePassword();
      });
    };

    function signSubmitCall(element: HTMLElement): void {
      const signOpenButton = document.querySelector('.sign-open__button') as HTMLElement;
      signOpenButton.addEventListener('click', (): void => {
        element.innerHTML = '';
        renderSignBlock();
        showHidePassword();
        const signSubmit = document.querySelector('.sign-submit') as HTMLInputElement;
        signSubmit.addEventListener('click', (): void => {
          const signEmail = document.querySelector('#sign-email') as HTMLInputElement;
          const signPassword = document.querySelector('#sign-password') as HTMLInputElement;
          loginUser({ "email": `${signEmail.value}`, "password": `${signPassword.value}` });
        });
      });
    };
  });
};
