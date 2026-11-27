/*
 * PausaSegura - sign in and register forms (login.html, v1.1.0).
 */
(function () {
  'use strict';

  const account = window.PausaSegura && window.PausaSegura.account;
  if (!account) {
    return;
  }

  // Only pages of this site are allowed after signing in.
  const ALLOWED_NEXT_PAGES = ['index.html', 'index.html#evaluate', 'historial.html'];

  const loginForm = document.getElementById('login');
  const registerForm = document.getElementById('register');
  const signedPanel = document.querySelector('[data-signed-in]');
  const formsWrapper = document.querySelector('[data-auth-forms]');

  function getNextPage() {
    const next = new URLSearchParams(window.location.search).get('next');
    return ALLOWED_NEXT_PAGES.indexOf(next) !== -1 ? next : 'index.html';
  }

  function showMessage(form, text) {
    const message = form.querySelector('[data-form-message]');
    message.textContent = text;
    message.hidden = !text;
  }

  function setBusy(form, isBusy) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = isBusy;
  }

  function finishSignIn() {
    account.savePendingToHistory();
    window.location.href = getNextPage();
  }

  function showSignedInState() {
    const user = account.getCurrentUser();
    if (!user || !signedPanel || !formsWrapper) {
      return;
    }
    signedPanel.querySelector('[data-signed-name]').textContent = user.name;
    signedPanel.querySelector('[data-signed-email]').textContent = user.email;
    signedPanel.hidden = false;
    formsWrapper.hidden = true;
  }

  if (loginForm) {
    const rememberedEmail = account.getRememberedEmail();
    if (rememberedEmail) {
      loginForm.elements.email.value = rememberedEmail;
      loginForm.elements.remember.checked = true;
    }

    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      showMessage(loginForm, '');
      if (!loginForm.reportValidity()) {
        return;
      }
      setBusy(loginForm, true);
      try {
        await account.login({
          email: loginForm.elements.email.value,
          password: loginForm.elements.password.value,
          remember: loginForm.elements.remember.checked
        });
        finishSignIn();
      } catch (error) {
        showMessage(loginForm, error.message);
        loginForm.elements.password.value = '';
        loginForm.elements.password.focus();
      } finally {
        setBusy(loginForm, false);
      }
    });
  }

  if (registerForm) {
    const password = registerForm.elements.password;
    const confirmation = registerForm.elements['password-confirm'];

    const checkPasswords = function () {
      password.setCustomValidity(account.validatePassword(password.value));
      confirmation.setCustomValidity(
        confirmation.value && confirmation.value !== password.value ? 'Las contraseñas no coinciden.' : ''
      );
    };

    password.addEventListener('input', checkPasswords);
    confirmation.addEventListener('input', checkPasswords);

    registerForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      showMessage(registerForm, '');
      checkPasswords();
      if (!registerForm.reportValidity()) {
        return;
      }
      setBusy(registerForm, true);
      try {
        await account.register({
          name: registerForm.elements.name.value,
          email: registerForm.elements.email.value,
          password: password.value,
          remember: registerForm.elements.remember.checked
        });
        finishSignIn();
      } catch (error) {
        showMessage(registerForm, error.message);
      } finally {
        setBusy(registerForm, false);
      }
    });
  }

  document.addEventListener('pausasegura:session-changed', function () {
    if (signedPanel && formsWrapper) {
      signedPanel.hidden = true;
      formsWrapper.hidden = false;
    }
  });

  showSignedInState();
}());
