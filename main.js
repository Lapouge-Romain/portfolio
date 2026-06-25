/* ────────────────────────────────────────────────────────────
   PORTFOLIO — main.js
   Animations & interactions — thème terminal
──────────────────────────────────────────────────────────── */

'use strict';

/* ── UTILS ───────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. NAVBAR : scroll shadow + toggle mobile ───────────── */
(function initNavbar() {
  const nav = $('#navbar');
  const toggle = $('#navToggle');
  const links = $('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Ferme le menu mobile au clic sur un lien
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ── 2. HERO : typewriter terminal ──────────────────────────
   Chaque ligne est un tableau de "tokens" : { type, text }
   Les types correspondent aux classes CSS du span.
──────────────────────────────────────────────────────────── */
(function initTypewriter() {
  const container = $('#typedBlock');
  if (!container) return;

  const SPEED_CHAR = 35;   // ms par caractère
  const LINE_PAUSE = 400;  // ms entre les lignes

  const lines = [
    [{ t: 'cmd', v: '$ ' }, { t: 'val', v: 'Qui suis-je ?' }],
    [{ t: 'str', v: '→ Romain Lapouge — Développeur Web · Étudiant BUT MMI' }],
    [{ t: 'blank' }],
    [{ t: 'cmd', v: '$ ' }, { t: 'val', v: 'cat profil.json' }],
    [{ t: 'cmt', v: '{' }],
    [{ t: 'cmt', v: '  ' }, { t: 'kw', v: '"nom"' }, { t: 'cmt', v: ': ' }, { t: 'str', v: '"Romain Lapouge"' }, { t: 'cmt', v: ',' }],
    [{ t: 'cmt', v: '  ' }, { t: 'kw', v: '"formation"' }, { t: 'cmt', v: ': ' }, { t: 'str', v: '"BUT MMI — IUT de Haguenau (3ème année)"' }, { t: 'cmt', v: ',' }],
    [{ t: 'cmt', v: '  ' }, { t: 'kw', v: '"statut"' }, { t: 'cmt', v: ': ' }, { t: 'str', v: '"disponible immédiatement"' }, { t: 'cmt', v: ',' }],
    [{ t: 'cmt', v: '  ' }, { t: 'kw', v: '"localisation"' }, { t: 'cmt', v: ': ' }, { t: 'str', v: '"Val de Moder, Alsace"' }, { t: 'cmt', v: ',' }],
    [{ t: 'cmt', v: '  ' }, { t: 'kw', v: '"compétences"' }, { t: 'cmt', v: ': ' }, { t: 'str', v: '"front-end · back-end · maquettage"' }],
    [{ t: 'cmt', v: '}' }],
    [{ t: 'blank' }],
    [{ t: 'cmd', v: '$ ' }, { t: 'cmt', v: '# scroll ↓ pour en savoir plus' }],
  ];

  let lineIdx = 0;

  function typeLine(lineTokens, callback) {
    const lineEl = document.createElement('span');
    lineEl.className = 'typed-line';
    container.appendChild(lineEl);

    // Si c'est une ligne vide
    if (lineTokens.length === 1 && lineTokens[0].t === 'blank') {
      lineEl.classList.add('blank');
      setTimeout(callback, LINE_PAUSE / 2);
      return;
    }

    let tokenIdx = 0;
    let charIdx = 0;
    let currentSpan = null;

    // Curseur clignotant temporaire
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    lineEl.appendChild(cursor);

    function typeNext() {
      if (tokenIdx >= lineTokens.length) {
        // Ligne terminée
        cursor.remove();
        setTimeout(callback, LINE_PAUSE);
        return;
      }

      const token = lineTokens[tokenIdx];

      if (!currentSpan || charIdx === 0) {
        currentSpan = document.createElement('span');
        currentSpan.className = token.t;
        lineEl.insertBefore(currentSpan, cursor);
      }

      currentSpan.textContent += token.v[charIdx];
      charIdx++;

      if (charIdx >= token.v.length) {
        tokenIdx++;
        charIdx = 0;
        currentSpan = null;
      }

      setTimeout(typeNext, SPEED_CHAR);
    }

    typeNext();
  }

  function nextLine() {
    if (lineIdx >= lines.length) return;
    typeLine(lines[lineIdx++], nextLine);
  }

  // Lance la frappe dès que la page est prête
  setTimeout(nextLine, 300);
})();

/* ── 3. REVEAL ON SCROLL ─────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal-up').forEach(el => observer.observe(el));
})();

/* ── 4. TIMELINE : entrée décalée au scroll ──────────────── */
(function initTimeline() {
  const items = $$('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();

/* ── 5. SKILLS TABS (compétences / projets) ──────────────── */
(function initTabs() {
  const tabs = $$('.skill-tab');
  const panels = $$('.skill-panel');

  function activateTab(targetId) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === targetId));

    panels.forEach(p => {
      if (p.id === 'tab-' + targetId) {
        p.classList.add('active');
        // Petit délai pour que display:block soit pris en compte avant l'animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => p.classList.add('fade-in'));
        });
      } else {
        p.classList.remove('active', 'fade-in');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // Active le premier onglet au chargement
  if (tabs.length) {
    activateTab(tabs[0].dataset.tab);
  }
})();

/* ── 6. MODAL PROJETS ────────────────────────────────────── */
(function initModal() {
  const backdrop  = $('#projectModal');
  const closeBtn  = $('#modalClose');
  const title     = $('#modalTitle');
  const desc      = $('#modalDesc');
  const langsWrap = $('#modalLangs');
  const track     = $('#carouselTrack');
  const dotsWrap  = $('#carouselDots');
  const prevBtn   = $('#carouselPrev');
  const nextBtn   = $('#carouselNext');

  if (!backdrop) return;

  // Nom affiché pour chaque langage
  const LANG_LABELS = {
    html:   'HTML',
    css:    'CSS',
    js:     'JavaScript',
    react:  'React',
    php:    'PHP',
    python: 'Python',
    mysql:  'MySQL',
    figma:  'Figma',
    ts:     'TypeScript',
    sass:   'Sass',
    vue:    'Vue.js',
  };

  let currentIdx = 0;
  let images     = [];

  /* ── Carrousel ── */
  function goTo(idx) {
    currentIdx = idx;
    track.style.transform = `translateX(-${idx * 100}%)`;
    $$('.carousel-dot', dotsWrap).forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
    prevBtn.hidden = idx === 0;
    nextBtn.hidden = idx === images.length - 1;
  }

  function buildCarousel(imgs) {
    images = imgs;
    track.innerHTML  = '';
    dotsWrap.innerHTML = '';

    imgs.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src.trim();
      img.alt = `Screenshot ${i + 1}`;
      track.appendChild(img);

      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    // Cacher les boutons si une seule image
    prevBtn.hidden = true;
    nextBtn.hidden = imgs.length <= 1;
    dotsWrap.hidden = imgs.length <= 1;
    goTo(0);
  }

  prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
  nextBtn.addEventListener('click', () => goTo(currentIdx + 1));

  // Glisser au clavier (touches fléchées)
  backdrop.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIdx > 0)               goTo(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < images.length - 1) goTo(currentIdx + 1);
    if (e.key === 'Escape') closeModal();
  });

  /* ── Pastilles langages ── */
  function buildLangs(langsStr) {
    langsWrap.innerHTML = '';
    langsStr.split(',').map(l => l.trim()).filter(Boolean).forEach(key => {
      const pill = document.createElement('span');
      pill.className = 'lang-pill';
      pill.innerHTML = `<span class="dot ${key}"></span>${LANG_LABELS[key] || key}`;
      langsWrap.appendChild(pill);
    });
  }

  /* ── Ouvrir / fermer ── */
  function openModal(card) {
    const imgs  = (card.dataset.imgs  || '').split('|').filter(Boolean);
    const langs = card.dataset.langs  || '';

    title.textContent = card.dataset.title || '';
    desc.textContent  = card.dataset.desc  || '';
    buildCarousel(imgs.length ? imgs : [card.querySelector('.project-img').src]);
    buildLangs(langs);

    backdrop.classList.add('open');
    backdrop.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Clic sur les cartes projet
  $$('.project-card').forEach(card => {
    card.addEventListener('click',  () => openModal(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(card); });
  });

  // Fermeture
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
})();

/* ── 7. FORMULAIRE CONTACT : validation légère ───────────── */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const successBox = $('#formSuccess');

  function getField(name) {
    return form.querySelector(`[name="${name}"]`);
  }
  function getError(name) {
    return $(`#err-${name}`);
  }

  function setError(name, msg) {
    const el = getField(name);
    const err = getError(name);
    el.classList.toggle('error', !!msg);
    if (err) err.textContent = msg || '';
  }

  function validate() {
    let valid = true;

    const name = getField('name').value.trim();
    if (!name) {
      setError('name', 'Le nom est requis.');
      valid = false;
    } else {
      setError('name', '');
    }

    const email = getField('email').value.trim();
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', "L'adresse email est requise.");
      valid = false;
    } else if (!emailReg.test(email)) {
      setError('email', "Format d'email invalide.");
      valid = false;
    } else {
      setError('email', '');
    }

    const msg = getField('message').value.trim();
    if (!msg) {
      setError('message', 'Le message ne peut pas être vide.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // ─── Remplacez ici par votre appel API / fetch réel ───
    // Exemple : fetch('/api/contact', { method:'POST', body: new FormData(form) })

    // Simulation d'envoi
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Envoi…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = '↗ Envoyer le message';
      btn.disabled = false;
      successBox.classList.add('show');
      setTimeout(() => successBox.classList.remove('show'), 5000);
    }, 1200);
  });

  // Effacer l'erreur en direct
  $$('.form-input').forEach(input => {
    input.addEventListener('input', () => setError(input.name, ''));
  });
})();

/* ── 8. FOOTER : année dynamique ────────────────────────────── */
(function initFooter() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── 9. NAVIGATION ACTIVE au scroll ─────────────────────────── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.dataset.section === entry.target.id
            ? 'var(--accent-blue)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
