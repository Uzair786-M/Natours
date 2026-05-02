import { login, logout } from './login-logout';
import { updateData } from './updateSettings';
const loginForm = document.querySelector('.login-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}
