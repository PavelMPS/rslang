import './authorization.css';

export async function renderRegistrationBlock(): Promise<void> {
  const registerBlock = document.querySelector('.register-block') as HTMLElement;
  registerBlock.innerHTML = `
  <div class="form-border__wrap">
  <img class="close-form" src="./assets/cross.svg" alt="Close">
    <form class="register-form">
        <div class="form-block">
          <input class="form-input" type="text" name="register-name" id="register-name" required placeholder="Name">
        </div>
        <div class="form-block">
          <input class="form-input" type="email" name="register-email" id="register-email" required placeholder="Email">
          <div class="register-error__email"></div>
        </div>
        <div class="form-block">
          <input class="form-input" type="password" name="register-password" id="register-password" required placeholder="Password">
          <div class="register-error__password"></div>
        </div>
        <input class="register-submit" type="button" value="Register">
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

export const createUser = async user => {
  const rawResponse = await fetch('https://react-rslang-example.herokuapp.com/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  const registerErrorEmail = document.querySelector('.register-error__email') as HTMLElement;
  const registerErrorPassword = document.querySelector('.register-error__password') as HTMLElement;
  const content = await rawResponse.json();
  console.log(rawResponse)
  switch (rawResponse.status) {

    case 417:
      console.log('Mistake: ', rawResponse.status);
      registerErrorEmail.innerHTML = 'User with this e-mail exists';
      break;

    case 200:
      console.log('Everything okay: ', rawResponse.status);
      registerErrorEmail.innerHTML = '';
      registerErrorPassword.innerHTML = '';
      localStorage.setItem('Your id', content.id)
      break;

    case 422:
      console.log('Mistake: ', rawResponse.status);
      console.log(content.error.errors)
      if (content.error && content.error.errors.length > 1) {
        registerErrorEmail.innerHTML = 'Invalid email';
        registerErrorPassword.innerHTML = 'Invalid password';
      } else {
        registerErrorEmail.innerHTML = '';
        registerErrorPassword.innerHTML = '';

        content.error.errors.forEach(element => {
          element.path.forEach(elem => {
            console.log(elem)
            elem == 'email' ? registerErrorEmail.innerHTML = 'Invalid email' : registerErrorEmail.innerHTML = '';
            elem == 'password' ? registerErrorPassword.innerHTML = 'Invalid password' : registerErrorPassword.innerHTML = '';
          });
        })
      }

      break;
  }

};


// export async function createUser(user): Promise<void> {

//   fetch('https://react-rslang-example.herokuapp.com/users', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(user)
//   }).then(data => {
//     const content = data.json();
//     const registerErrorEmail = document.querySelector('.register-error__email') as HTMLElement;
//     switch (data.status) {
//       case 200:
//         console.log('Everything okay: ', data);

//         break;
//       case 422:
//         console.log('Mistake: ', data);
//         break;
//       case 417:
//         console.log('Mistake: ', data);
//         break;
//     }

//   }).then(data => console.log(data))
// };