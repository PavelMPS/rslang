import './authorization.css';

const emailExistsError = 'User with this e-mail exists' as string;
const invalidNameError = 'Invalid name' as string;
const invalidEmailError = 'Invalid email' as string;
const invalidPasswordError = 'Invalid password' as string;
const nameTypeError = 'name' as string;
const emailTypeError = 'email' as string;
const passwordTypeError = 'password' as string;
const registrationSuccessText = 'Registration is done! Please sign up ;)' as string;

const notRegisteredEmailText = 'This email is not registered' as string;
const writeEmailCaption = 'Please, write correct email' as string;
const signSuccessText = 'Success!' as string;
const signPasswordEmailError = 'Incorrect e-mail or password' as string;
const serverUrl = `https://react-rslang-example.herokuapp.com` as string;

export async function renderRegistrationBlock(): Promise<void> {
  const registerBlock = document.querySelector('.register-block') as HTMLElement;
  registerBlock.innerHTML = `
  <div class="form-border__wrap">
  <img class="close-form" src="./assets/cross.svg" alt="Close">
    <form class="register-form">
        <div class="form-block">
          <input class="form-input" type="text" name="register-name" id="register-name" required placeholder="Name">
          <div class="register-error__name"></div>
        </div>
        <div class="form-block">
          <input class="form-input" type="email" name="register-email" id="register-email" required placeholder="Email">
          <div class="register-error__email"></div>
        </div>
        <div class="form-block">
          <input class="form-input" type="password" name="register-password" id="register-password" required placeholder="Password">
          <div class="register-error__password"></div>
        </div>
        <div class="form-block">
          <input class="register-submit" type="button" value="Register">
          <div class="registration-success"></div>
        </div>
    </form>
    </div>`;
}

export const registerSubmit = document.querySelector('.register-submit') as HTMLElement;

export async function renderSignBlock(): Promise<void> {
  const signBlock = document.querySelector('.sign-block') as HTMLElement;
  signBlock.innerHTML = `
  <div class="form-border__wrap">
  <img class="close-form" src="./assets/cross.svg" alt="Close">
  <form class="sign-form">
    <div class="form-block">
      <input class="form-input" type="email" name="sign-email" id="sign-email" required placeholder="Email">
      <div class="sign-error__email"></div>
    </div>
    <div class="form-block">
      <input class="form-input" type="password" name="sign-password" id="sign-password" required placeholder="Password">
      <div class="sign-error__password"></div>
    </div>
    <div class="form-block">
      <input class="sign-submit" type="button" value="Sign in">
      <div class="sign-success"></div>
    </div>
  </form>
  </div>`;
}

export const createUser = async (user: IRegisterUser): Promise<void> => {
  const rawResponse: Response = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  const registerBlock = document.querySelector('.register-block') as HTMLElement;
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
      setTimeout((): void => { registerBlock.innerHTML = '' }, 2000);
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
  }

  const signBlock = document.querySelector('.sign-block') as HTMLElement;
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
      setTimeout((): void => { signBlock.innerHTML = '' }, 2000);
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
  }
};
