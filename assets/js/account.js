/*
 * PausaSegura - accounts, session and evaluation history (v1.1.0).
 *
 * Demo implementation without a backend: data is stored only in this
 * browser with the Web Storage API (localStorage and sessionStorage).
 * Passwords are never stored in plain text: they are hashed with
 * SHA-256 and a random salt (Web Crypto API).
 */
(function () {
  'use strict';

  const USERS_KEY = 'pausasegura.users';
  const SESSION_KEY = 'pausasegura.session';
  const LAST_EMAIL_KEY = 'pausasegura.lastEmail';
  const HISTORY_PREFIX = 'pausasegura.history.';
  const PENDING_KEY = 'pausasegura.pendingEvaluation';
  const MIN_PASSWORD_LENGTH = 8;

  function readJson(storage, key, fallback) {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeKey(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      // Storage not available (private mode or blocked): nothing to remove.
    }
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (byte) { return byte.toString(16).padStart(2, '0'); })
      .join('');
  }

  function createSalt() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return toHex(bytes);
  }

  async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Tu navegador no permite proteger la contraseña. Abre la página desde https o actualiza tu navegador.');
    }
    const data = new TextEncoder().encode(salt + ':' + password);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return toHex(digest);
  }

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function getUsers() {
    return readJson(window.localStorage, USERS_KEY, []);
  }

  function saveUsers(users) {
    if (!writeJson(window.localStorage, USERS_KEY, users)) {
      throw new Error('No pudimos guardar tu cuenta. Revisa que tu navegador permita guardar datos de este sitio.');
    }
  }

  function getSession() {
    return readJson(window.localStorage, SESSION_KEY, null) ||
      readJson(window.sessionStorage, SESSION_KEY, null);
  }

  function startSession(userId, remember) {
    const session = { userId: userId, startedAt: new Date().toISOString() };
    removeKey(window.localStorage, SESSION_KEY);
    removeKey(window.sessionStorage, SESSION_KEY);
    // "Recordarme": localStorage keeps the session after closing the browser.
    writeJson(remember ? window.localStorage : window.sessionStorage, SESSION_KEY, session);
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) {
      return null;
    }
    const user = getUsers().find(function (item) { return item.id === session.userId; });
    return user ? { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } : null;
  }

  function validatePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return 'La contraseña debe tener al menos ' + MIN_PASSWORD_LENGTH + ' caracteres.';
    }
    if (!/[a-zA-ZñÑ]/.test(password) || !/[0-9]/.test(password)) {
      return 'La contraseña debe tener letras y números.';
    }
    return '';
  }

  function rememberEmail(email, remember) {
    if (remember) {
      writeJson(window.localStorage, LAST_EMAIL_KEY, email);
    } else {
      removeKey(window.localStorage, LAST_EMAIL_KEY);
    }
  }

  function getRememberedEmail() {
    return readJson(window.localStorage, LAST_EMAIL_KEY, '');
  }

  async function register(data) {
    const name = String(data.name || '').trim();
    const email = normalizeEmail(data.email);
    const password = String(data.password || '');

    if (name.length < 2) {
      throw new Error('Escribe tu nombre.');
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const users = getUsers();
    if (users.some(function (user) { return user.email === email; })) {
      throw new Error('Ya existe una cuenta con ese correo. Inicia sesión.');
    }

    const salt = createSalt();
    const user = {
      id: createId(),
      name: name,
      email: email,
      salt: salt,
      passwordHash: await hashPassword(password, salt),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    startSession(user.id, Boolean(data.remember));
    rememberEmail(email, Boolean(data.remember));
    return getCurrentUser();
  }

  async function login(data) {
    const email = normalizeEmail(data.email);
    const user = getUsers().find(function (item) { return item.email === email; });
    const genericError = 'El correo o la contraseña no son correctos.';

    if (!user) {
      throw new Error(genericError);
    }
    const hash = await hashPassword(String(data.password || ''), user.salt);
    if (hash !== user.passwordHash) {
      throw new Error(genericError);
    }
    startSession(user.id, Boolean(data.remember));
    rememberEmail(email, Boolean(data.remember));
    return getCurrentUser();
  }

  function logout() {
    removeKey(window.localStorage, SESSION_KEY);
    removeKey(window.sessionStorage, SESSION_KEY);
  }

  function historyKey(userId) {
    return HISTORY_PREFIX + userId;
  }

  function getHistory() {
    const user = getCurrentUser();
    if (!user) {
      return [];
    }
    return readJson(window.localStorage, historyKey(user.id), []);
  }

  function saveHistory(history) {
    const user = getCurrentUser();
    if (!user) {
      return false;
    }
    return writeJson(window.localStorage, historyKey(user.id), history);
  }

  function addEvaluation(record) {
    const history = getHistory();
    const entry = Object.assign({}, record, { id: createId(), date: new Date().toISOString() });
    history.unshift(entry);
    saveHistory(history);
    return entry;
  }

  function updateEvaluation(id, changes) {
    const history = getHistory();
    const index = history.findIndex(function (item) { return item.id === id; });
    if (index === -1) {
      return addEvaluation(changes);
    }
    history[index] = Object.assign({}, history[index], changes, { id: id, date: history[index].date });
    saveHistory(history);
    return history[index];
  }

  function deleteEvaluation(id) {
    saveHistory(getHistory().filter(function (item) { return item.id !== id; }));
  }

  function clearHistory() {
    const user = getCurrentUser();
    if (user) {
      removeKey(window.localStorage, historyKey(user.id));
    }
  }

  function deleteAccount() {
    const user = getCurrentUser();
    if (!user) {
      return;
    }
    clearHistory();
    saveUsers(getUsers().filter(function (item) { return item.id !== user.id; }));
    if (getRememberedEmail() === user.email) {
      removeKey(window.localStorage, LAST_EMAIL_KEY);
    }
    logout();
  }

  // A guest can finish an evaluation and save it after signing in.
  function savePendingEvaluation(record) {
    writeJson(window.sessionStorage, PENDING_KEY, record);
  }

  function savePendingToHistory() {
    const pending = readJson(window.sessionStorage, PENDING_KEY, null);
    removeKey(window.sessionStorage, PENDING_KEY);
    if (pending && getCurrentUser()) {
      addEvaluation(pending);
      return true;
    }
    return false;
  }

  // Shows the right links in the header: guest or signed-in user.
  function renderAccountNav() {
    const user = getCurrentUser();
    document.querySelectorAll('[data-auth="guest"]').forEach(function (element) {
      element.hidden = Boolean(user);
    });
    document.querySelectorAll('[data-auth="user"]').forEach(function (element) {
      element.hidden = !user;
    });
    document.querySelectorAll('[data-user-name]').forEach(function (element) {
      element.textContent = user ? user.name.split(' ')[0] : '';
    });
  }

  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-logout]');
    if (!button) {
      return;
    }
    logout();
    if (document.body.hasAttribute('data-requires-auth')) {
      window.location.href = 'index.html';
      return;
    }
    renderAccountNav();
    document.dispatchEvent(new CustomEvent('pausasegura:session-changed'));
  });

  document.addEventListener('DOMContentLoaded', renderAccountNav);

  window.PausaSegura = window.PausaSegura || {};
  window.PausaSegura.account = {
    MIN_PASSWORD_LENGTH: MIN_PASSWORD_LENGTH,
    register: register,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    getRememberedEmail: getRememberedEmail,
    validatePassword: validatePassword,
    getHistory: getHistory,
    addEvaluation: addEvaluation,
    updateEvaluation: updateEvaluation,
    deleteEvaluation: deleteEvaluation,
    clearHistory: clearHistory,
    deleteAccount: deleteAccount,
    savePendingEvaluation: savePendingEvaluation,
    savePendingToHistory: savePendingToHistory,
    renderAccountNav: renderAccountNav
  };
}());
