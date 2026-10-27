// Initialize Lucide Icons
lucide.createIcons();

/* --- Canvas Cyber Particles Background --- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 65;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4 - 0.2; // Slowly float up
        this.alpha = Math.random() * 0.7 + 0.1;
        this.color = Math.random() > 0.4 ? '#00f3ff' : '#0066ff';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* --- Interactive Sparkles Click Effect --- */
function createClickSparkles(x, y) {
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.backgroundColor = Math.random() > 0.5 ? '#00f3ff' : '#ffffff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.boxShadow = '0 0 10px #00f3ff';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 20;
        const destX = x + Math.cos(angle) * distance;
        const destY = y + Math.sin(angle) * distance;

        document.body.appendChild(sparkle);

        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destX - x}px, ${destY - y}px) scale(0)`, opacity: 0 }
        ], {
            duration: 700 + Math.random() * 300,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => sparkle.remove();
    }
}

window.addEventListener('click', (e) => {
    // Avoid triggering when clicking buttons or inputs
    if (!e.target.closest('button') && !e.target.closest('input')) {
        createClickSparkles(e.clientX, e.clientY);
    }
});

document.getElementById('sparkleBtn').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    createClickSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

/* --- Cyber Ambient Audio Generator (Web Audio API) --- */
let audioCtx = null;
let isPlaying = false;
let oscillator = null;
let gainNode = null;

const audioBtn = document.getElementById('audioBtn');
const visualizer = document.getElementById('visualizer');

function toggleAudio() {
    if (!isPlaying) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Synth Ambient Pad Sound
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // A3 note
        
        // Lowpass filter for warm cyber vibe
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 2);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        isPlaying = true;

        audioBtn.classList.add('active');
        visualizer.classList.add('active');
        audioBtn.querySelector('span').innerText = 'PAUSE CYBER AMBIENT';
    } else {
        if (gainNode && audioCtx) {
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
            setTimeout(() => {
                oscillator.stop();
                audioCtx.close();
                isPlaying = false;
                audioBtn.classList.remove('active');
                visualizer.classList.remove('active');
                audioBtn.querySelector('span').innerText = 'PLAY CYBER AMBIENT';
            }, 1000);
        }
    }
}

audioBtn.addEventListener('click', toggleAudio);

/* --- Image Lightbox Modal --- */
const mainImg = document.getElementById('mainImage');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

mainImg.addEventListener('click', () => {
    lightboxImg.src = mainImg.src;
    lightbox.classList.add('active');
});

lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
});

/* --- Memory Log Generator --- */
const memoryForm = document.getElementById('memoryForm');
const memoryInput = document.getElementById('memoryInput');
const memoryGrid = document.getElementById('memoryGrid');
let logCounter = 3;

memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = memoryInput.value.trim();
    if (text) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="memory-date">LOG_ENTRY #00${logCounter++}</div>
            <div class="memory-text">${text}</div>
        `;
        memoryGrid.prepend(card);
        memoryInput.value = '';
    }
});