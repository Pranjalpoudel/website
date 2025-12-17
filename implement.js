// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});



// 3D Tilt Effect
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Active Navigation on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Interactive Circuit Background
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Handle mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Create Particle
class Particle {
    constructor(x, y, networkColor) {
        this.x = x;
        this.y = y;
        this.directionX = (Math.random() * 2) - 1;
        this.directionY = (Math.random() * 2) - 1;
        this.size = (Math.random() * 3) + 1;
        this.color = networkColor;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }
        // Move particle
        this.x += this.directionX * 0.5; // slow speed
        this.y += this.directionY * 0.5;

        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    // Reduce particle density for smaller screens to prevent lag
    let divisor = 9000;
    if (window.innerWidth < 768) {
        divisor = 20000; // Much fewer particles on mobile
    }
    let numberOfParticles = (canvas.height * canvas.width) / divisor;
    let networkColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = networkColor; // Use theme color

        particlesArray.push(new Particle(x, y, color));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Check if particles are close enough to draw line
function connect() {
    let opacityValue = 1;
    let networkColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                const rgb = hexToRgb(networkColor) || { r: 0, g: 243, b: 255 }; // Fallback
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Helper to convert hex to rgb
function hexToRgb(hex) {
    if (!hex) return null;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    }
);

// Mouse out event
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();

// Visitor Counter Logic (Mock/Local)
const visitCount = localStorage.getItem('page_visits') || 0;
// Simulate multiple people by adding some random number to start or just plain count
// For a personal site feel, let's start at a realistic base
let displayedCount = parseInt(visitCount) + 1;

localStorage.setItem('page_visits', displayedCount);
const counterElement = document.getElementById('visit-count');
if (counterElement) {
    counterElement.innerText = displayedCount;
}

// Firebase Imports
import { db, collection, addDoc } from './firebase-config.js';

console.log("implement.js loaded - Firebase Config imported");

// Contact Form Logic
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    console.log("Contact form found");
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const date = new Date().toLocaleString();

        try {
            console.log("Attempting to add document to Firestore...");
            const messagesCol = collection(db, 'messages');
            await addDoc(messagesCol, {
                name: name,
                email: email,
                message: message,
                date: date,
                timestamp: new Date()
            });
            console.log("Document written with ID");
            alert('Message Sent Successfully!');
            contactForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            if (error.message.includes("permission-denied")) {
                alert("Error: Database Permission Denied.\n\nDid you create the Firestore Database in the Console?\nDid you set the rules to 'Test Mode'?");
            } else if (error.message.includes("API has not been used")) {
                alert("Error: Firestore API Disabled.\n\nPlease enable it in the Google Cloud Console (Link in Debug Walkthrough).");
            } else {
                alert('Error sending message: ' + error.message);
            }
        }
    });
} else {
    console.error("Contact form NOT found in DOM");
}
