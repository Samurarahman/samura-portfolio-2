gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// === INITIAL SETUP ===
let particles = [];
let currentTypingIndex = 0;

// === CUSTOM CURSOR ===
function initCursor() {
    if (window.innerWidth < 992) return;
    
    const cursor = document.querySelector('.cursor');
    const trail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        trailX += (mouseX - trailX) * 0.05;
        trailY += (mouseY - trailY) * 0.05;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    document.querySelectorAll('a, button, .skill-bar, .certificates-grid img, .contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            trail.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            trail.style.transform = 'scale(1)';
        });
    });
}

// === PARTICLE SYSTEM ===
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = document.body.classList.contains('dark') ? 
                `rgba(0, 255, 204, ${this.size / 10})` : 
                `rgba(255, 255, 255, ${this.size / 15})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    particles = Array.from({ length: 50 }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// === TYPING ANIMATION ===
function initTyping() {
    const typingText = document.getElementById('typing-text');
    const fullText = "Hi, I'm Samura Rahman — a Data Scientist passionate about AI, ML & Deep Learning.\nA Computer Science graduate with hands-on experience in web development & innovative tech.";
    
    function typeWriter() {
        if (currentTypingIndex < fullText.length) {
            typingText.innerHTML += fullText.charAt(currentTypingIndex);
            currentTypingIndex++;
            setTimeout(typeWriter, 50);
        } else {
            typingText.style.borderRight = 'none';
        }
    }

    ScrollTrigger.create({
        trigger: "#intro",
        start: "top 80%",
        once: true,
        onEnter: () => {
            typingText.innerHTML = '';
            typingText.style.borderRight = '2px solid var(--accent)';
            setTimeout(typeWriter, 300);
        }
    });
}

// === STAGGERED ANIMATIONS – GSAP FOR CERTIFICATES, CONTACT, MESSAGE ===
function initStaggeredAnimations() {
    // CERTIFICATES
    ScrollTrigger.create({
        trigger: "#certificates",
        start: "top 85%",
        once: true,
        onEnter: () => {
            gsap.from("#certificates .certificates-grid img", {
                opacity: 0,
                y: 30,
                scale: 0.85,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.6)"
            });
        }
    });

    // CONTACT & MESSAGE
    ScrollTrigger.create({
        trigger: "#contact",
        start: "top 85%",
        once: true,
        onEnter: () => gsap.from("#contact [data-stagger]", { opacity: 0, y: 20, duration: 0.4, stagger: 0.1, ease: "power2.out" })
    });

    ScrollTrigger.create({
        trigger: "#message",
        start: "top 85%",
        once: true,
        onEnter: () => gsap.from("#message [data-stagger]", { opacity: 0, y: 20, duration: 0.4, stagger: 0.1, ease: "power2.out" })
    });
}

// === SKILL BARS ===
function initSkillBars() {
    gsap.utils.toArray(".skill-bar").forEach(bar => {
        const level = bar.getAttribute('data-skill');
        bar.style.setProperty('--skill-width', `${level}%`);
        ScrollTrigger.create({
            trigger: bar,
            start: "top 85%",
            once: true,
            onEnter: () => bar.classList.add("in-view")
        });
    });
}

// === WELCOME + AUTO SCROLL ===
gsap.from("#welcome h1", { opacity: 0, y: -80, duration: 1.5, ease: "back.out(1.7)" });
gsap.from("#welcome p", { opacity: 0, y: 60, duration: 1.5, delay: 0.5, ease: "back.out(1.7)" });
setTimeout(() => gsap.to(window, { duration: 1.8, scrollTo: "#intro", ease: "power2.inOut" }), 4000);

// === SECTION FADE IN ===
gsap.utils.toArray(".section").forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        once: true,
        onEnter: () => {
            section.classList.add("in-view");
            gsap.to(section, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
    });
});

// === THEME TOGGLE ===
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.add('theme-transition');
    setTimeout(() => document.body.classList.remove('theme-transition'), 600);
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

// === HAMBURGER + SMOOTH SCROLL + DOT NAV + TOASTS + FORM + ENLARGE + SWIPE ===
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".hamburger").classList.toggle("active");
    document.querySelector("nav ul").classList.toggle("active");
});

document.querySelectorAll('nav a, .btn[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target === '#') return;
        gsap.to(window, { duration: 1.5, scrollTo: target, ease: "power2.inOut" });
        document.querySelector("nav ul").classList.remove("active");
        document.querySelector(".hamburger").classList.remove("active");
    });
});

function initDotNavigation() {
    const dots = document.querySelectorAll('.dot');
    const sections = ['#intro', '#projects', '#skills', '#education', '#publications', '#certificates', '#contact', '#message'];
    const update = () => {
        sections.forEach((s, i) => {
            const el = document.querySelector(s);
            const rect = el.getBoundingClientRect();
            if (rect.top <= innerHeight * 0.5 && rect.bottom >= innerHeight * 0.5) {
                dots.forEach(d => d.classList.remove('active'));
                dots[i].classList.add('active');
            }
        });
    };
    dots.forEach((d, i) => d.addEventListener('click', () => gsap.to(window, { duration: 1.5, scrollTo: sections[i], ease: "power2.inOut" })));
    window.addEventListener('scroll', update);
    update();
}

document.getElementById('cv-download').addEventListener('click', e => {
    e.preventDefault();
    const a = document.createElement('a'); 
    a.href = 'samuraCV (1).pdf'; 
    a.download = ''; 
    document.body.appendChild(a); 
    a.click(); 
    a.remove();
    const t = document.getElementById('download-toast'); 
    t.classList.add('show'); 
    setTimeout(() => t.classList.remove('show'), 3000);
});

document.getElementById('copy-email').addEventListener('click', () => {
    navigator.clipboard.writeText('samura.rahman14@gmail.com').then(() => {
        const t = document.getElementById('email-toast'); 
        t.classList.add('show'); 
        setTimeout(() => t.classList.remove('show'), 2000);
    });
});

function enlargeImg(img) {
    document.querySelectorAll('.certificates-grid img').forEach(i => { 
        i.classList.remove('enlarged'); 
        i.style = ''; 
    });
    const existing = document.querySelector('.img-backdrop'); 
    if (existing) document.body.removeChild(existing);
    
    img.classList.add('enlarged');
    const backdrop = document.createElement('div'); 
    backdrop.className = 'img-backdrop';
    backdrop.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);z-index:1001;display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(12px);opacity:1;transition:opacity .3s`;
    
    const enlarged = img.cloneNode(); 
    enlarged.style.cssText = `max-width:92vw;max-height:92vh;border-radius:18px;box-shadow:0 0 80px rgba(0,255,204,.6);border:3px solid var(--accent);cursor:default`;
    backdrop.appendChild(enlarged); 
    document.body.appendChild(backdrop); 
    document.body.style.overflow = 'hidden';
    
    const close = () => { 
        backdrop.style.opacity = '0'; 
        setTimeout(() => { 
            if (backdrop.parentNode) document.body.removeChild(backdrop); 
            document.body.style.overflow = 'auto'; 
            img.classList.remove('enlarged'); 
            document.removeEventListener('keydown', esc); 
        }, 300); 
    };
    backdrop.addEventListener('click', close);
    const esc = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.send-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; 
    btn.disabled = true;
    
    fetch(this.action, { 
        method: 'POST', 
        body: new FormData(this), 
        headers: { 'Accept': 'application/json' } 
    })
    .then(r => { 
        if (r.ok) { 
            document.getElementById('form-response').innerHTML = '<i class="fas fa-check-circle"></i> Sent!'; 
            this.reset(); 
        } else throw ''; 
    })
    .catch(() => document.getElementById('form-response').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error. Try email.')
    .finally(() => { 
        btn.innerHTML = orig; 
        btn.disabled = false; 
        setTimeout(() => gsap.to('#form-response', { opacity: 0, scale: 0, duration: 0.3 }), 4000); 
    });
});

function initMobileSwipe() {
    if (window.innerWidth > 768) return;
    let startY = 0;
    document.addEventListener('touchstart', e => startY = e.touches[0].clientY);
    document.addEventListener('touchend', e => {
        const diff = startY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) window.scrollBy(0, diff > 0 ? window.innerHeight : -window.innerHeight);
    });
}

// === INIT ALL ===
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    initTyping();
    initStaggeredAnimations();
    initSkillBars();
    initDotNavigation();
    initMobileSwipe();

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card.querySelector('.project-overlay'), { opacity: 1, duration: 0.3 }));
        card.addEventListener('mouseleave', () => gsap.to(card.querySelector('.project-overlay'), { opacity: 0, duration: 0.3 }));
        card.querySelector('[data-demo]')?.addEventListener('click', e => { 
            e.preventDefault(); 
            alert('Live demo coming soon!'); 
        });
    });

    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', () => gsap.to(link, { scale: 1.3, rotation: 360, duration: 0.6, ease: "power2.inOut" }));
        link.addEventListener('mouseleave', () => gsap.to(link, { scale: 1, rotation: 0, duration: 0.3 }));
    });
});

// === RESIZE CURSOR VISIBILITY ===
window.addEventListener('resize', () => {
    const cursor = document.querySelector('.cursor');
    const trail = document.querySelector('.cursor-trail');
    if (cursor && trail) {
        const show = window.innerWidth >= 992;
        cursor.style.display = show ? 'block' : 'none';
        trail.style.display = show ? 'block' : 'none';
    }
});