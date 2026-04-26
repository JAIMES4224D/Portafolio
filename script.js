/* ==================== SCRIPT.JS — DEVPASS DIGITAL SOLUTIONS ==================== */

// ===== CUSTOM CURSOR =====
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .project-card, .gallery-card, .stat-card, .pillar').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
        cursorRing.style.borderColor = 'rgba(0,255,180,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(0,255,180,0.5)';
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
});


// ===== CANVAS PARTICLE SYSTEM =====
const canvas = document.getElementById('universe');
const ctx    = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const mouse = { x: null, y: null, radius: 120 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor(x, y, size) {
        this.x = this.originalX = x;
        this.y = this.originalY = y;
        this.size = size;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,180,${this.opacity})`;
        ctx.fill();
    }

    update() {
        // Drift
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse repulsion
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= Math.cos(angle) * force * 3;
                this.y -= Math.sin(angle) * force * 3;
            }
        }

        this.draw();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5 + 0.5;
        particles.push(new Particle(x, y, size));
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const opacity = (1 - dist / 100) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,255,180,${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    connectParticles();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animate();


// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    const sectionIds = ['about', 'projects', 'skills', 'gallery', 'contact'];
    let current = '';
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= 90) current = id;
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
}


// ===== SKILLS — TAB FILTER + BAR ANIMATION =====
function animateBars(cards) {
    cards.forEach(card => {
        const fill = card.querySelector('.bar-fill');
        if (!fill) return;
        fill.style.width = '0';
        requestAnimationFrame(() => {
            setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, 60);
        });
    });
}

const tabs    = document.querySelectorAll('.tab-btn');
const allCards = document.querySelectorAll('.skill-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        const visible = [];

        allCards.forEach((card, i) => {
            const show = target === 'all' || card.dataset.group === target;
            card.style.display = show ? '' : 'none';
            if (show) {
                card.style.animationName = 'none';
                card.style.animationDelay = (visible.length * 0.05) + 's';
                requestAnimationFrame(() => { card.style.animationName = 'fadeUp'; });
                visible.push(card);
            }
        });

        animateBars(visible);
    });
});

animateBars(document.querySelectorAll('.skill-card'));


// ===== GALLERY CAROUSELS =====
document.querySelectorAll('.carousel').forEach(carousel => {
    const track  = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsC  = carousel.querySelector('.carousel-dots');
    const counter = carousel.querySelector('.slide-counter');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let current = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goTo(i);
        dotsC.appendChild(dot);
    });

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsC.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
        counter.textContent = `${current + 1} / ${slides.length}`;
    }

    prevBtn.onclick = e => { e.stopPropagation(); goTo(current - 1); };
    nextBtn.onclick = e => { e.stopPropagation(); goTo(current + 1); };

    if (slides.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    goTo(0);
});


// ===== LIGHTBOX =====
let lbImages = [];
let lbIndex  = 0;

function openLightbox(slide) {
    const carousel = slide.closest('.carousel');
    const imgs = [...carousel.querySelectorAll('.carousel-slide img')];
    lbImages = imgs.map(img => ({ src: img.src, alt: img.alt }));
    lbIndex = imgs.indexOf(slide.querySelector('img'));
    renderLightbox();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function renderLightbox() {
    document.getElementById('lightbox-img').src     = lbImages[lbIndex].src;
    document.getElementById('lightbox-caption').textContent = lbImages[lbIndex].alt;
}

function lightboxNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    renderLightbox();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
});

document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lightboxNav(1);
    if (e.key === 'ArrowLeft')   lightboxNav(-1);
});


// ===== INTERSECTION OBSERVER — Fade in sections =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.project-card, .pillar, .stat-card, .gallery-card').forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


// ===== SCROLL TO GALLERY (helper) =====
function scrollToGallery(projectId) {
    const idMap = {
        portfolio:  0, calc: 1, garage: 2, converter: 3,
        movies: 4, tele: 5, qr: 6, ecommerce: 7, sql: 8
    };
    const index  = idMap[projectId];
    const cards  = document.querySelectorAll('.gallery-card');
    const target = cards[index];
    if (!target) return;
    setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.borderColor = 'rgba(0,255,180,0.6)';
        target.style.boxShadow = '0 0 28px rgba(0,255,180,0.15)';
        setTimeout(() => {
            target.style.borderColor = '';
            target.style.boxShadow = '';
        }, 2200);
    }, 600);
}