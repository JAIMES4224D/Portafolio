const canvas = document.getElementById('universe');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y, size, speedX, speedY){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.originalX = x;
        this.originalY = y;
    }
    
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();
    }
    
    update(){
        // Movimiento hacia el mouse
        if(mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < mouse.radius) {
                let angle = Math.atan2(dy, dx);
                let force = (mouse.radius - distance) / mouse.radius;
                let moveX = Math.cos(angle) * force * 2;
                let moveY = Math.sin(angle) * force * 2;
                this.x -= moveX;
                this.y -= moveY;
            } else {
                // Regresar a posición original
                this.x += (this.originalX - this.x) * 0.05;
                this.y += (this.originalY - this.y) * 0.05;
            }
        } else {
            this.x += (this.originalX - this.x) * 0.05;
            this.y += (this.originalY - this.y) * 0.05;
        }
        
        this.draw();
    }
}

// Crear partículas
function init() {
    particles = [];
    let numberOfParticles = (canvas.width * canvas.height) / 8000;
    
    for(let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 2 + 1;
        let speedX = (Math.random() - 0.5) * 0.5;
        let speedY = (Math.random() - 0.5) * 0.5;
        particles.push(new Particle(x, y, size, speedX, speedY));
    }
}

function connectParticles(){
    for(let a = 0; a < particles.length; a++) {
        for(let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < 120) {
                ctx.beginPath();
                let opacity = (1 - distance / 120) * 0.3;
                ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Crear efecto de estrella fugaz (fondo dinámico)
    ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => p.update());
    connectParticles();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();
// Animate bars
    function animateBars(cards) {
        cards.forEach(card => {
        const fill = card.querySelector('.bar-fill');
        if (fill) {
            fill.style.width = '0';
            requestAnimationFrame(() => {
            setTimeout(() => {
                fill.style.width = fill.dataset.w + '%';
            }, 50);
            });
        }
        });
    }

    // Tab filtering
    const tabs = document.querySelectorAll('.tab-btn');
    const allCards = document.querySelectorAll('.skill-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        const visible = [];

        allCards.forEach(card => {
            const group = card.dataset.group;
            const show = target === 'all' || group === target;
            card.style.display = show ? '' : 'none';
            if (show) {
            card.style.animationName = 'none';
            card.style.animationDelay = (visible.length * 0.06) + 's';
            requestAnimationFrame(() => {
                card.style.animationName = 'fadeUp';
            });
            visible.push(card);
            }
        });

        animateBars(visible);
        });
    });

    // Initial bar animation
    animateBars(document.querySelectorAll('.skill-card'));

// ===== GALERÍA: CARRUSELES =====
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const counter = carousel.querySelector('.slide-counter');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let current = 0;

    // Crear dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goTo(i);
        dotsContainer.appendChild(dot);
    });

    function updateCounter() {
        counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
        updateCounter();
    }

    prevBtn.onclick = e => { e.stopPropagation(); goTo(current - 1); };
    nextBtn.onclick = e => { e.stopPropagation(); goTo(current + 1); };

    // Ocultar flechas si solo hay 1 foto
    if (slides.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    // Swipe táctil
    let startX = 0;
    carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    carousel.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    goTo(0);
});

// ===== LIGHTBOX =====
let lbImages = [];
let lbIndex = 0;

function openLightbox(slide) {
    const carousel = slide.closest('.carousel');
    const allSlides = [...carousel.querySelectorAll('.carousel-slide img')];
    lbImages = allSlides.map(img => ({ src: img.src, alt: img.alt }));
    lbIndex = allSlides.indexOf(slide.querySelector('img'));
    showLightboxImage();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function showLightboxImage() {
    document.getElementById('lightbox-img').src = lbImages[lbIndex].src;
    document.getElementById('lightbox-caption').textContent = lbImages[lbIndex].alt;
}

function lightboxNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    showLightboxImage();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

// Cerrar lightbox con ESC o click en fondo
document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft') lightboxNav(-1);
});