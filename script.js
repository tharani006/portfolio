/**
 * Tharani.U - Portfolio Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initThemeToggle();
  initScrollEffects();
  initSkillBarAnimations();
  initProjectModals();
  initContactUtilities();
});

/* ==========================================================================
   1. Dynamic Background Particle Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting line network
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.querySelector('.typewriter-text');
  if (!target) return;

  const phrases = [
    "CS Engineering Student",
    "Full Stack Web Developer",
    "AI & ML Enthusiast",
    "Hackathon Finalist"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. Theme Toggler
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(toggleBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
  }
}

/* ==========================================================================
   4. Scroll Effects & Navigation
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollPos / docHeight) * 100;

    if (progressBar) progressBar.style.width = `${progress}%`;

    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('active') ? 'ri-close-line' : 'ri-menu-line';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-line';
      });
    });
  }
}

/* ==========================================================================
   5. Skill Bar Animations
   ========================================================================== */
function initSkillBarAnimations() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillPercent = entry.target.getAttribute('data-percentage') || '85%';
        entry.target.style.width = fillPercent;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   6. Project Modals
   ========================================================================== */
const projectDetails = {
  cropprofit: {
    title: "Smart CropProfit Advisor",
    category: "AI & Machine Learning",
    description: "An intelligent crop recommendation and profit forecasting system powered by machine learning algorithms. The system analyzes soil composition, weather parameters, rainfall data, and market pricing trends to suggest optimal crops for farmers, maximizing overall yield and profitability.",
    features: [
      "AI-driven soil & climate suitability analysis",
      "Real-time market price trend prediction",
      "Interactive crop selection dashboard for farmers",
      "Resource allocation and cost estimation matrix"
    ],
    tech: ["Python", "Machine Learning", "Data Science", "HTML5", "CSS3"]
  },
  fooddelivery: {
    title: "Food Delivery Web App",
    category: "Full Stack Web Application",
    description: "A comprehensive full-stack food ordering and delivery management system built with Flask backend and MongoDB database. Features real-time menu browsing, cart management, order checkout, and order status tracking.",
    features: [
      "RESTful API backend architecture using Python Flask",
      "NoSQL database schema design with MongoDB",
      "Dynamic menu rendering with category filtering",
      "User authentication and order history tracking"
    ],
    tech: ["Python", "Flask", "MongoDB", "JavaScript", "CSS3"]
  },
  campusai: {
    title: "AI Campus Innovation Assistance",
    category: "Automated Resume & Profile Generator",
    description: "An intelligent academic assistant platform that automatically parses and structures student data—including skills, coursework, project experience, certifications, and achievements—into high-impact professional resumes.",
    features: [
      "Automated skill & project taxonomy classification",
      "Dynamic resume layout generation",
      "Custom section builder for Hackathons & academic achievements",
      "One-click PDF preview and download pipeline"
    ],
    tech: ["Python", "AI Automation", "Web Development", "HTML/CSS", "JavaScript"]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const actionBtns = document.querySelectorAll('.project-action-btn');

  if (!modalOverlay) return;

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetails[projectId];

      if (data) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-description').textContent = data.description;

        const featureList = document.getElementById('modal-features');
        featureList.innerHTML = data.features.map(f => `<li>▹ ${f}</li>`).join('');

        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

        modalOverlay.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

/* ==========================================================================
   7. Contact Utilities & Toast Notifications
   ========================================================================== */
function initContactUtilities() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast-notification');
  const contactForm = document.getElementById('contact-form');
  const printBtn = document.querySelector('.btn-print-resume');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Copied to clipboard!`);
        });
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thank you! Your message has been sent successfully.");
      contactForm.reset();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-msg');
  if (msgSpan) msgSpan.textContent = msg;

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}
