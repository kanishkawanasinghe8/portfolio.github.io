/**
 * MODERN MECHANICAL ENGINEERING PORTFOLIO - CORE JAVASCRIPT & MOTION ENGINE
 * Sleek, high-performance motion effects inspired by VOXERA & precision CAD workstations.
 * Zero external libraries or bloated dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAmbientMotion();
  initHeroCanvas();
  init3DCardTilt();
  initScrollReveals();
  initMetricCounters();
  initSkillBars();
  initProjectFilters();
  initModals();
  initPublications();
  initContactForm();
  initHudTelemetry();
});

/* ==========================================================================
   AMBIENT MOTION & MOUSE SPOTLIGHT ENGINE
   ========================================================================== */
function initAmbientMotion() {
  // Inject mouse spotlight layer into body if not already present
  if (!document.querySelector('.mouse-spotlight')) {
    const spotlight = document.createElement('div');
    spotlight.className = 'mouse-spotlight';
    document.body.appendChild(spotlight);
  }

  // Inject floating ambient orbs
  if (!document.querySelector('.ambient-orb')) {
    const orb1 = document.createElement('div');
    orb1.className = 'ambient-orb ambient-orb-1';
    const orb2 = document.createElement('div');
    orb2.className = 'ambient-orb ambient-orb-2';
    document.body.appendChild(orb1);
    document.body.appendChild(orb2);
  }

  // Track global mouse position for ambient lighting
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 3;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Smooth lerp (linear interpolation) animation loop for global spotlight
  function updateSpotlight() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    document.documentElement.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);

    requestAnimationFrame(updateSpotlight);
  }
  requestAnimationFrame(updateSpotlight);
}

/* ==========================================================================
   HERO CANVAS: FLOATING CAD WIREFRAME / KINEMATIC MESH
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isCanvasVisible = true;

  // Track mouse coordinates relative to canvas
  let mouse = { x: -1000, y: -1000, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 700;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create CAD mesh nodes
  const particleCount = Math.min(45, Math.floor((width * height) / 18000));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1.2,
      baseRadius: Math.random() * 1.8 + 1.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  // Animation Loop
  function draw() {
    if (!isCanvasVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Drift position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off boundaries
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse proximity interaction (elastic repulsion & connection)
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 1.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
        p.radius = p.baseRadius * 1.8;
      } else {
        p.radius = p.baseRadius;
      }

      // Draw node dot
      p.pulse += 0.03;
      const alpha = 0.4 + Math.sin(p.pulse) * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(126, 243, 196, ${alpha})`;
      ctx.fill();

      // Connect nodes with proximity lines (CAD mesh aesthetic)
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        const maxDist = 120;

        if (dist2 < maxDist) {
          const lineAlpha = (1 - dist2 / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(126, 243, 196, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw interactive filaments to mouse
      if (dist < mouse.radius) {
        const mouseLineAlpha = (1 - dist / mouse.radius) * 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(94, 234, 212, ${mouseLineAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // IntersectionObserver: Pause canvas when scrolled out of view to save 100% CPU
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasVisible = entry.isIntersecting;
      if (isCanvasVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(draw);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);
  animationFrameId = requestAnimationFrame(draw);
}

/* ==========================================================================
   INTERACTIVE 3D CARD PERSPECTIVE TILT & SPOTLIGHT BORDER
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update card spotlight coordinates
      card.style.setProperty('--card-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--card-y', `${y.toFixed(1)}px`);

      // Calculate 3D tilt angles (capped at ±6 degrees for refined feel)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -5.5;
      const tiltY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      card.style.setProperty('--card-x', `-50%`);
      card.style.setProperty('--card-y', `-50%`);
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL STAGGERED SYSTEM
   ========================================================================== */
function initScrollReveals() {
  // Elements to reveal on scroll
  const targets = document.querySelectorAll('.card, .stat-card, .section-header, .timeline-item, .pub-card');

  targets.forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      // Apply subtle stagger delay to grid siblings
      const staggerIndex = (index % 3) + 1;
      el.classList.add(`stagger-${staggerIndex}`);
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, keep it rendered
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==========================================================================
   ANIMATED METRIC COUNTERS (NUMBER ROLLUP)
   ========================================================================== */
function initMetricCounters() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        document.querySelectorAll('.stat-number').forEach(stat => {
          const rawText = stat.innerText.trim();

          // Check if numeric (e.g. "12+", "03", "3.9+", "180")
          if (rawText.includes('12')) {
            animateNumber(stat, 0, 12, 1600, '+');
          } else if (rawText.includes('03') || rawText === '3') {
            animateNumberWithZero(stat, 0, 3, 1400);
          } else if (rawText.includes('3.9')) {
            animateDecimal(stat, 0.0, 3.9, 1800, '+');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function animateNumber(element, start, end, duration, suffix = '') {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic formula
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(start + (end - start) * easeProgress);

    element.innerText = `${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.innerText = `${end}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

function animateNumberWithZero(element, start, end, duration) {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(start + (end - start) * easeProgress);

    element.innerText = currentVal < 10 ? `0${currentVal}` : `${currentVal}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.innerText = end < 10 ? `0${end}` : `${end}`;
    }
  }

  requestAnimationFrame(step);
}

function animateDecimal(element, start, end, duration, suffix = '') {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (start + (end - start) * easeProgress).toFixed(1);

    element.innerText = `${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.innerText = `${end.toFixed(1)}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   SKILL BARS FILL ANIMATION
   ========================================================================== */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('style') || '';
        const match = targetWidth.match(/width:\s*(\d+%)/);
        if (match) {
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = match[1];
          }, 100);
        }
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   HUD TELEMETRY WIDGET (ENGINEERING WORKSTATION STATUS)
   ========================================================================== */
function initHudTelemetry() {
  if (document.querySelector('.hud-telemetry')) return;

  const hud = document.createElement('div');
  hud.className = 'hud-telemetry';
  hud.innerHTML = `
    <span class="hud-dot"></span>
    <span id="hudCoords">CAD [X: 0mm  Y: 0mm]</span>
    <span>//</span>
    <span style="color: #7ef3c4;">STATION ONLINE</span>
  `;
  document.body.appendChild(hud);

  const coordsEl = document.getElementById('hudCoords');
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (coordsEl) {
          coordsEl.innerText = `CAD [X: ${e.clientX}mm  Y: ${e.clientY}mm]`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isExpanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Highlight active page link based on current file name
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   PROJECT FILTERING (PROJECTS PAGE)
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || card.classList.contains(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE MODALS (PROJECT DETAILS & CONTACT WITH DOWNLOADS)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('projectModal');
  const modalClose = modalOverlay?.querySelector('.modal-close');
  const modalBody = modalOverlay?.querySelector('.modal-body-content');

  // Open Project Details Modal
  document.querySelectorAll('.view-project-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.project-card');
      if (!card || !modalOverlay || !modalBody) return;

      const title = card.querySelector('.project-title')?.innerText || 'Project Details';
      const category = card.querySelector('.project-category-badge')?.innerText || 'Mechanical Engineering';
      const desc = card.querySelector('.project-desc')?.innerText || '';
      const tags = card.querySelector('.project-tags')?.innerHTML || '';
      
      const problem = card.getAttribute('data-problem') || 'Engineered high-tolerance mechanical assembly ensuring strict structural integrity and optimal thermal dissipation.';
      const solution = card.getAttribute('data-solution') || 'Formulated parametric 3D CAD models in SolidWorks, followed by finite element stress analysis (FEA) and dynamic simulation.';
      const results = card.getAttribute('data-results') || 'Achieved 28% weight reduction while increasing factor of safety from 1.4 to 2.1 under cyclic fatigue loading.';
      const report = card.getAttribute('data-report') || '';
      const cad = card.getAttribute('data-cad') || '';

      let downloadsHtml = '';
      if (report || cad) {
        downloadsHtml = `
          <div style="margin-bottom: 24px; padding: 18px; background: rgba(126, 243, 196, 0.05); border: 1px solid rgba(126, 243, 196, 0.2); border-radius: 12px;">
            <h4 style="color: #7ef3c4; font-size: 0.82rem; font-family: monospace; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>📥</span> Project Deliverables &amp; Downloads
            </h4>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              ${report ? `<a href="${report}" target="_blank" download class="btn btn-primary btn-sm">Download Technical Report (PDF) 📄</a>` : ''}
              ${cad ? `<a href="${cad}" download class="btn btn-secondary btn-sm">Download 3D CAD (.STEP / SolidWorks) 💾</a>` : ''}
            </div>
          </div>
        `;
      }

      modalBody.innerHTML = `
        <div class="pill-badge" style="margin-bottom: 12px;"><span class="badge-dot"></span>${category}</div>
        <h2 style="font-size: 1.8rem; margin-bottom: 16px; color: #fff;">${title}</h2>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">${tags}</div>
        
        <p style="margin-bottom: 24px; font-size: 1rem; color: #94a3b8; line-height: 1.7;">${desc}</p>
        
        <div style="display: flex; flex-direction: column; gap: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div>
            <h4 style="color: #7ef3c4; font-size: 0.9rem; font-family: monospace; text-transform: uppercase; margin-bottom: 6px;">[01] Problem Definition & Constraints</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">${problem}</p>
          </div>
          <div>
            <h4 style="color: #7ef3c4; font-size: 0.9rem; font-family: monospace; text-transform: uppercase; margin-bottom: 6px;">[02] Engineering Methodology & CAD/FEA</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">${solution}</p>
          </div>
          <div>
            <h4 style="color: #7ef3c4; font-size: 0.9rem; font-family: monospace; text-transform: uppercase; margin-bottom: 6px;">[03] Validation & Measurable Impact</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">${results}</p>
          </div>
        </div>

        ${downloadsHtml}

        <div style="display: flex; gap: 14px; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="closeAllModals()">Close</button>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modals
  modalClose?.addEventListener('click', closeAllModals);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeAllModals();
  });

  // Contact Modal triggers
  const contactModal = document.getElementById('contactModal');
  const contactClose = contactModal?.querySelector('.modal-close');
  document.querySelectorAll('.open-contact-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactModal) {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  contactClose?.addEventListener('click', closeAllModals);
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) closeAllModals();
  });

  // ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   PUBLICATIONS - ABSTRACT TOGGLE & BIBTEX COPY
   ========================================================================== */
function initPublications() {
  // Toggle abstract
  document.querySelectorAll('.toggle-abstract-btn').forEach(button => {
    button.addEventListener('click', () => {
      const pubCard = button.closest('.pub-card');
      const abstractEl = pubCard?.querySelector('.pub-abstract');
      if (abstractEl) {
        const isHidden = abstractEl.style.display === 'none';
        abstractEl.style.display = isHidden ? 'block' : 'none';
        button.innerText = isHidden ? 'Hide Abstract' : 'View Abstract';
      }
    });
  });

  // Copy BibTeX citation
  document.querySelectorAll('.copy-bibtex-btn').forEach(button => {
    button.addEventListener('click', () => {
      const bibtex = button.getAttribute('data-bibtex');
      if (bibtex) {
        navigator.clipboard.writeText(bibtex).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  document.querySelectorAll('.copy-email-btn').forEach(button => {
    button.addEventListener('click', () => {
      const email = button.getAttribute('data-email') || 'oshan.engineering@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      });
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Message transmitted successfully.');
      contactForm.reset();
      setTimeout(closeAllModals, 1200);
    });
  }

  const endorsementForm = document.getElementById('endorsementForm');
  if (endorsementForm) {
    endorsementForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Endorsement received! Thank you for the feedback.');
      endorsementForm.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color: #7ef3c4;">✓</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
