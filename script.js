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


document.querySelector('#contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
        const response = await fetch('https://formspree.io/f/xzzrwddr', {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            form.reset();

            // Affiche l'overlay
            const overlay = document.getElementById('overlay-success');
            overlay.style.display = 'flex';

            // Lance l’explosion d’étoiles
            launchStarExplosion();

            // Le retire après 5 secondes
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 5000);
        } else {
            alert("Une erreur s’est produite.");
        }
    } catch (error) {
        alert("Erreur réseau.");
    }
});

function launchStarExplosion() {
    const canvas = document.getElementById('star-explosion');
    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 30;

    // Redimensionne le canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            angle: Math.random() * 2 * Math.PI,
            speed: Math.random() * 4 + 2,
            alpha: 1
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.alpha -= 0.02;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${hexToRgb(star.color)}, ${star.alpha})`;
            ctx.fill();
        });

        if (stars.some(s => s.alpha > 0)) {
            requestAnimationFrame(animate);
        }
    };

    animate();
}

function hexToRgb(hsl) {
    const tmp = document.createElement("div");
    tmp.style.color = hsl;
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color.match(/\d+/g);
    tmp.remove();
    return rgb.join(',');
}




// Call initTheme au chargement
initTheme();
