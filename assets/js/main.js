const MENU_OPEN_CLASS = 'navbar__menu--open';

const menuToggle = document.querySelector('.navbar__toggle');
const navMenu = document.querySelector('#nav-menu');

function setMenuOpen(isOpen) {
  navMenu.classList.toggle(MENU_OPEN_CLASS, isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    setMenuOpen(false);
  }
});
