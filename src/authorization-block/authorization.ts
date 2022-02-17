import { getStatistics } from '../api/api';
import { createStatistic } from '../utilits/utilits';
import './authorization.css';
import { showHideAuthButtons } from '../listen/authorization-listen';

const emailExistsError = 'User with this e-mail exists' as string;
const registrationSuccessText = 'Registration is done! Please sign up ;)' as string;
const notRegisteredEmailText = 'This email is not registered' as string;
const writeEmailCaption = 'Please, write correct email' as string;
const signSuccessText = 'Success!' as string;
const signPasswordEmailError = 'Incorrect e-mail or password' as string;
const serverUrl = `https://react-rslang-example.herokuapp.com` as string;

export async function renderAuthorizationBlock(): Promise<void> {
  const authorizationBlock = document.querySelector('.authorization-block') as HTMLElement;
  authorizationBlock.innerHTML = `
  <div class="authorization-border">
  <img class="close-form" src="../assets/cross.svg" alt="Close">
  <div class="auth"> 
  <div class="register-sign__button-wrap">
    <div class="register-open__button">Register</div>
    <div class="sign-open__button">Sign in</div>
  </div>
  <div class="register-sign__block-wrap"> 
    <div class="register-block"></div>
    <div class="sign-block"></div>
  </div>
  </div> 
  </div>`;
};

export async function renderRegistrationBlock(): Promise<void> {
  const registerBlock = document.querySelector('.register-block') as HTMLElement;
  registerBlock.innerHTML = `
    <form class="register-form">
        <div class="form-block">
          <div class="placeholder-container">
            <input class="form-input" type="text" name="register-name" id="register-name" placeholder="Name">
            <label>Name</label>
          </div>
          <div class="register-error__name"></div>
        </div>
        <div class="form-block">
          <div class="placeholder-container">
            <input class="form-input" type="email" name="register-email" id="register-email" placeholder="Email">
            <label>Email</label>
          </div>
          <div class="register-error__email"></div>
        </div>
        <div class="form-block">
          <div class="placeholder-container">
              <input class="form-input" type="password" name="register-password" id="register-password" placeholder="Password">
              <a href="#" class="password-control"></a>
              <label>Password</label>
            </div>
            <div class="register-error__password"></div>
        </div>
        <div class="form-block">
          <input class="register-submit" type="button" value="Register">
          <div class="registration-success"></div>
        </div>
    </form>`;
};

export async function renderSignBlock(): Promise<void> {
  const signBlock = document.querySelector('.sign-block') as HTMLElement;
  signBlock.innerHTML = `
  <form class="sign-form">
    <div class="form-block">
      <div class="placeholder-container">
        <input class="form-input" type="email" name="sign-email" id="sign-email" required placeholder="">
        <label>Email</label>
      </div>
      <div class="sign-error__email"></div>
    </div>
    <div class="form-block">
      <div class="placeholder-container">
        <input class="form-input" type="password" name="sign-password" id="sign-password" required placeholder="Password">
        <a href="#" class="password-control"></a>
        <label>Password</label>
      </div>
        <div class="sign-error__password"></div>
    </div>
    <div class="form-block">
      <input class="sign-submit" type="button" value="Sign in">
      <div class="sign-success"></div>
    </div>
  </form>`;
};

export async function renderLogoutBlock(): Promise<void> {
  const logoutBlock = document.querySelector('.logout-block') as HTMLElement;
  logoutBlock.innerHTML = `
  <div class="logout-border">
  <img class="close-form" src="../assets/cross.svg" alt="Close">
  <div class="auth"> 
  <div class="logout__block-wrap"> 
  <div class="logout-text">Are you sure you want to go out?</div>
    <div class="logout-buttons__wrap">
      <div class="logout-button" id="logout-exit">Yes</div>
      <div class="logout-button" id="logout-stay">No</div>
  </div>
  </div>
  </div>`;
};

export const createUser = async (user: IRegisterUser): Promise<void> => {
  const rawResponse: Response = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  const registerErrorName = document.querySelector('.register-error__name') as HTMLElement;
  const registerErrorEmail = document.querySelector('.register-error__email') as HTMLElement;
  const registerErrorPassword = document.querySelector('.register-error__password') as HTMLElement;
  const registrationSuccess = document.querySelector('.registration-success') as HTMLElement;

  function emptyRegisterCaptions(): void {
    registerErrorName.innerHTML = '';
    registerErrorEmail.innerHTML = '';
    registerErrorPassword.innerHTML = '';
  }

  switch (rawResponse.status as number) {

    case 200:
      const goodResult = await rawResponse.json();
      emptyRegisterCaptions();
      registrationSuccess.innerHTML = `${registrationSuccessText}`;
      localStorage.clear();
      localStorage.setItem('Your name', goodResult.name);
      localStorage.setItem('Your id', goodResult.id);
      localStorage.setItem('Your email', goodResult.email);
      break;

    case 417:
      emptyRegisterCaptions();
      registerErrorEmail.innerHTML = `${emailExistsError}`;
      break;

    case 422:
      const badResult = await rawResponse.json();
      emptyRegisterCaptions();
      badResult.error.errors.forEach((element: { message: string; path: string[]; }) => {
        element.path.forEach((elem: string): void => {
          (document.querySelector(`.register-error__${elem}`) as HTMLElement).innerHTML = `Invalid ${element.path}`;
        });
      });
      break;
  };
};

export const loginUser = async (user: ISignUser): Promise<void> => {
  const rawResponse: Response = await fetch(`${serverUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  function emptySignCaptions(): void {
    signErrorEmail.innerHTML = '';
    signErrorPassword.innerHTML = '';
  };

  const authorizationBlock = document.querySelector('.authorization-block') as HTMLElement;
  const signEmail = document.querySelector('#sign-email') as HTMLInputElement;
  const signErrorEmail = document.querySelector('.sign-error__email') as HTMLElement;
  const signErrorPassword = document.querySelector('.sign-error__password') as HTMLElement;
  const signSuccess = document.querySelector('.sign-success') as HTMLElement;

  switch (rawResponse.status as number) {

    case 200:
      const content = await rawResponse.json();
      signSuccess.innerHTML = `${signSuccessText}`;
      emptySignCaptions();
      localStorage.setItem('Name', content.name);
      localStorage.setItem('Message', content.message);
      localStorage.setItem('Your token', content.token);
      localStorage.setItem('Your refreshToken', content.refreshToken);
      localStorage.setItem('Your userId', content.userId);
      setTimeout(() => {
        authorizationBlock.innerHTML = '';
        userGreeting();
        showHideAuthButtons();
        window.location.reload();
      }, 2000);
      authorizationBlock.dataset.open = 'false';
      await getStatistics(content.userId);
      break;

    case 403:
      emptySignCaptions();
      signErrorPassword.innerHTML = `${signPasswordEmailError}`;
      break;

    case 404:
      if (signEmail.value.length < 1) {
        emptySignCaptions();
        signErrorEmail.innerHTML = `${writeEmailCaption}`;
      } else {
        emptySignCaptions();
        signSuccess.innerHTML = `${notRegisteredEmailText}`;
      }
      break;
  };
};

export function userGreeting(): void {
  const greetBlock = document.querySelector('.greet-block') as HTMLElement;
  localStorage.getItem('Name') ? greetBlock.innerHTML = `Hello, ${localStorage.getItem('Name')}!` : greetBlock.innerHTML = ``;
};
