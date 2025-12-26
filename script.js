// Golden Vibes - JavaScript

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scrolling for CTA button
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    document.querySelector('#vibes').scrollIntoView({ behavior: 'smooth' });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.feature-card, .vibe-card');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('scroll-reveal', 'revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const formSuccess = document.querySelector('.form-success');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulate form submission
    console.log('Form submitted:', { name, email, message });

    // Show success message
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Reset form after 5 seconds
    setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
    }, 5000);
});

// Vibe card interactive effects
const vibeCards = document.querySelectorAll('.vibe-card');

vibeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });

    // Add click event for mobile
    card.addEventListener('click', function() {
        const vibeNumber = this.getAttribute('data-vibe');
        console.log(`Vibe card ${vibeNumber} clicked`);
        // You can add more interactive features here
    });
});

// Dynamic gradient animation on hero
const hero = document.querySelector('.hero');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

function animateHeroGradient() {
    const xOffset = mouseX * 20 - 10;
    const yOffset = mouseY * 20 - 10;

    hero.style.backgroundPosition = `${50 + xOffset}% ${50 + yOffset}%`;

    requestAnimationFrame(animateHeroGradient);
}

animateHeroGradient();

// Add parallax effect to hero content
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});

// Add wave animation
const waves = document.querySelector('.waves');
let waveOffset = 0;

function animateWaves() {
    waveOffset += 0.5;
    if (waves) {
        waves.style.transform = `translateX(${Math.sin(waveOffset * 0.01) * 10}px)`;
    }
    requestAnimationFrame(animateWaves);
}

animateWaves();

// Easter egg: Konami code for extra vibes
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateExtraVibes();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateExtraVibes() {
    // Add extra golden vibes effect
    document.body.style.animation = 'goldenPulse 2s ease-in-out';

    // Create floating emojis
    const emojis = ['☀️', '🌊', '🌴', '🌅', '✨'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 100);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

function createFloatingEmoji(emoji) {
    const floater = document.createElement('div');
    floater.textContent = emoji;
    floater.style.position = 'fixed';
    floater.style.fontSize = '2rem';
    floater.style.left = Math.random() * 100 + 'vw';
    floater.style.top = '100vh';
    floater.style.zIndex = '9999';
    floater.style.pointerEvents = 'none';
    floater.style.transition = 'all 3s ease-out';

    document.body.appendChild(floater);

    setTimeout(() => {
        floater.style.top = '-10vh';
        floater.style.opacity = '0';
        floater.style.transform = `rotate(${Math.random() * 360}deg)`;
    }, 10);

    setTimeout(() => {
        floater.remove();
    }, 3000);
}

// Add CSS animation for golden pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes goldenPulse {
        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
        50% { filter: hue-rotate(20deg) brightness(1.2); }
    }
`;
document.head.appendChild(style);

// Log welcome message
console.log('%c🌊 Welcome to Golden Vibes! 🌅', 'font-size: 20px; color: #FFD700; font-weight: bold;');
console.log('%cEnjoy the California vibes ☀️', 'font-size: 14px; color: #FF6B35;');
console.log('%cTip: Try the Konami code for a surprise! 😉', 'font-size: 12px; color: #4A90E2;');
