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