const sections = document.querySelectorAll('section');
const linksNav = document.querySelectorAll('nav a');
const header = document.querySelector('header');
const btnHome = document.querySelector('.btn-home');
const menuIcon = document.querySelector('#menu-burger');
const nav = document.querySelector('.navigation');
const themeToggleBtn = document.getElementById('theme-toggle');

let menuOpen = false;

// Toggle menu burger
const burgerActive = () => {
    menuIcon.classList.toggle('bx-x');
    nav.classList.toggle('show');
    menuOpen = !menuOpen;
};



// Barreeeeee
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});



// Gestion du scroll : active links, sticky header, scroll top btn
const scrollActive = () => {
    const top = window.scrollY;

    sections.forEach(section => {
        const offset = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            linksNav.forEach(link => link.classList.remove('active'));
            const currentLink = document.querySelector(`nav a[href*=${id}]`);
            if (currentLink) currentLink.classList.add('active');
        }
    });

    header.classList.toggle('sticky', top > 100);
    btnHome.classList.toggle('btnDisplay', top > 150);

    if (menuOpen && top > 100) {
        menuIcon.classList.remove('bx-x');
        nav.classList.remove('show');
        menuOpen = false;
    }
};

// ScrollReveal animations
ScrollReveal({ 
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .section-title', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-content, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

// Typed.js animation
const typed = new Typed('.multiple', {
    strings: ['Développeur Front End', 'Web Designer'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Theme toggle logic

const enableLightTheme = () => {
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerText = '🌙'; // Icon for dark mode
};

const enableDarkTheme = () => {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerText = '☀️'; // Icon for light mode
};

const toggleTheme = () => {
    if (document.body.classList.contains('light-theme')) {
        enableDarkTheme();
    } else {
        enableLightTheme();
    }
};

// Initial theme setting on page load
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'light') enableLightTheme();
        else enableDarkTheme();
    } else {
        // No saved preference, check system preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) enableLightTheme();
        else enableDarkTheme();
    }
};

// Events
menuIcon.addEventListener('click', burgerActive);
window.addEventListener('scroll', scrollActive);

linksNav.forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) {
            menuIcon.classList.remove('bx-x');
            nav.classList.remove('show');
            menuOpen = false;
        }
    });
});

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Call initTheme au chargement
initTheme();
