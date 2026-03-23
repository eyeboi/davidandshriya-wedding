/* ============================================
   David & Shriya — Wedding
   Cinematic interactions & ambient effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Ambient Canvas: Floating gold particles ---
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor(window.innerWidth / 25);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.2 + 0.3,
          speedY: Math.random() * 0.15 + 0.02,
          speedX: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.15 + 0.03,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += Math.sin(time + p.phase) * 0.15;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        const pulse = Math.sin(time * 0.5 + p.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const colors = [
          [232, 168, 50],   // gold
          [196, 168, 216],  // lavender
          [240, 136, 90],   // coral
        ];
        const c = colors[Math.floor(p.phase) % 3];
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${p.opacity * pulse * 1.4})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        drawParticles();
      }
    });
  }

  // --- Cursor Glow ---
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }

    updateGlow();
  }

  // --- Mobile Nav ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  // --- Scroll Reveal with stagger ---
  const srEls = document.querySelectorAll('.sr');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = [...parent.children].filter(c => c.classList.contains('sr'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  srEls.forEach(el => revealObserver.observe(el));

  // --- Parallax on hero lotus (subtle) ---
  const heroLotus = document.querySelector('.hero-lotus');
  if (heroLotus) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroLotus.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.15}px))`;
        heroLotus.style.opacity = 1 - scroll / window.innerHeight;
      }
    }, { passive: true });
  }

  // --- Active nav highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAs.forEach(a => {
          a.style.opacity = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.opacity = '1';
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => secObserver.observe(s));

  // --- RSVP Form ---
  const rsvpForm = document.getElementById('rsvpForm');
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(rsvpForm);
    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      guests: fd.get('guests'),
      attending: fd.get('attending'),
      events: fd.getAll('events'),
      dietary: fd.get('dietary'),
      message: fd.get('message')
    };

    // TODO: Wire to Google Sheets backend
    console.log('RSVP:', data);

    // Animated success
    rsvpForm.style.opacity = '0';
    rsvpForm.style.transform = 'translateY(12px)';
    rsvpForm.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      rsvpForm.innerHTML = `
        <div style="text-align: center; padding: 56px 0; opacity: 0; transform: translateY(12px); transition: all 0.5s ease;">
          <p style="font-family: 'Noto Serif Devanagari', serif; font-size: 1rem; color: var(--gold); opacity: 0.5; margin-bottom: 16px; letter-spacing: 4px;">धन्यवाद</p>
          <h3 style="font-family: 'Cormorant', serif; font-size: 2rem; font-weight: 300; color: var(--cream); margin-bottom: 12px; letter-spacing: 1px;">
            Thank you, ${data.name}.
          </h3>
          <p style="color: var(--text-muted-dk); font-size: 0.9rem; line-height: 1.7;">
            ${data.attending === 'yes'
              ? "We're so excited to celebrate with you."
              : "We'll miss you — thank you for letting us know."}
          </p>
        </div>
      `;
      rsvpForm.style.opacity = '1';
      rsvpForm.style.transform = 'translateY(0)';

      // Reveal inner content
      setTimeout(() => {
        const inner = rsvpForm.querySelector('div');
        if (inner) {
          inner.style.opacity = '1';
          inner.style.transform = 'translateY(0)';
        }
      }, 50);
    }, 400);
  });

});
