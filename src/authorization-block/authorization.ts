import './authorization.css';

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
      <input class="sign-submit" type="button" value="Sign in">
  </form>
  </div>`;
}

const emailExistsError = 'User with this e-mail exists';
const invalidNameError = 'Invalid name'
const invalidEmailError = 'Invalid email';
const invalidPasswordError = 'Invalid password';
const nameTypeError = 'name';
const emailTypeError = 'email';
const passwordTypeError = 'password';
const registrationSuccessText = 'Registration is done! Please sign up ;)'

export const createUser = async (user: IUser) => {
  const rawResponse = await fetch('https://react-rslang-example.herokuapp.com/users', {
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

  switch (rawResponse.status) {

    case 417:
      registerErrorName.innerHTML = '';
      registerErrorEmail.innerHTML = `${emailExistsError}`;
      break;

    case 200:
      const goodResult = await rawResponse.json();
      registerErrorName.innerHTML = '';
      registerErrorEmail.innerHTML = '';
      registerErrorPassword.innerHTML = '';
      registrationSuccess.innerHTML = `${registrationSuccessText}`;
      localStorage.setItem('Your name', goodResult.name);
      localStorage.setItem('Your id', goodResult.id);
      localStorage.setItem('Your email', goodResult.email);
      setTimeout(() => { registerBlock.innerHTML = '' }, 2000);
      break;

    case 422:
      const badResult = await rawResponse.json();

      if (badResult.error) {
        badResult.error.errors.forEach((element: { path: string[]; }) => {
          element.path.forEach((elem: string) => {
            console.log(elem)
            elem == `${nameTypeError}` ? registerErrorName.innerHTML = `${invalidNameError}` : registerErrorName.innerHTML = '';
            elem == `${emailTypeError}` ? registerErrorEmail.innerHTML = `${invalidEmailError}` : registerErrorEmail.innerHTML = '';
            elem == `${passwordTypeError}` ? registerErrorPassword.innerHTML = `${invalidPasswordError}` : registerErrorPassword.innerHTML = '';
          });
        })
      }
      break;
  }
};
