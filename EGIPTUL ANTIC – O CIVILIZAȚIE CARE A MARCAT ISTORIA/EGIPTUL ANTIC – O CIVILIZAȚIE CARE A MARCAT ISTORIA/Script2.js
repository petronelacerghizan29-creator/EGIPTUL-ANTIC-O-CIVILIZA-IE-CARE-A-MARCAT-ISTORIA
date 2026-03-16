document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.dark-center .slide'));
  if (slides.length) {
    let idx = 0;
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 5000);
  }
  const navLinks = Array.from(document.querySelectorAll('.pink-rect'));
  const sections = Array.from(document.querySelectorAll('.orange-content .section'));
  const orangeRect = document.querySelector('.orange-rect');

  function setActiveLink(key) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${key}`);
    });
  }

  function setHighlightedSection(key) {
    sections.forEach(s => s.classList.toggle('highlight', s.id === key));
    if (orangeRect) {
      orangeRect.classList.toggle('shift-left', !!key);
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      setHighlightedSection(id);
      setActiveLink(id);

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(id);
        }
      });
    }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.15 });
    sections.forEach(s => observer.observe(s));
  } else {
    window.addEventListener('scroll', () => {
      let found = null;
      let min = Infinity;
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const d = Math.abs(rect.top);
        if (d < min) { min = d; found = s; }
      });
      if (found) setActiveLink(found.id);
    });
  }

  const helpBtn = document.getElementById('help-btn');
  const helpPanel = document.getElementById('help-panel');
  const helpClose = document.getElementById('help-close');
  const helpDemoBtn = document.getElementById('help-demo-btn');
  const navButtons = Array.from(document.querySelectorAll('.red-bar .pink-rect'));

  function clearHighlights() {
    sections.forEach(s => s.classList.remove('highlight'));
  }
  function setPanelOpen(open) {
    if (open) {
      helpPanel.classList.add('open');
      helpPanel.setAttribute('aria-hidden', 'false');
      helpBtn.setAttribute('aria-expanded', 'true');
      demoHighlightSection(document.getElementById('home'), 2500);
    } else {
      helpPanel.classList.remove('open');
      helpPanel.setAttribute('aria-hidden', 'true');
      helpBtn.setAttribute('aria-expanded', 'false');
    }
  }

  helpBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setPanelOpen(!helpPanel.classList.contains('open'));
  });

  helpClose.addEventListener('click', function () {
    setPanelOpen(false);
  });

  helpDemoBtn.addEventListener('click', function () {
    const target = document.getElementById('home') || sections[0];
    demoHighlightSection(target, 2500);
  });

  document.addEventListener('click', function (e) {
    const outside = !helpPanel.contains(e.target) && e.target !== helpBtn;
    if (outside) setPanelOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setPanelOpen(false);
  });

  function demoHighlightSection(sectionEl, duration = 2500) {
    if (!sectionEl) return;
    clearHighlights();
    sectionEl.classList.add('highlight');
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      sectionEl.classList.remove('highlight');
    }, duration);
  }
  navButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const href = btn.getAttribute('href') || btn.dataset.target;
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      clearHighlights();
      target.classList.add('highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => target.classList.remove('highlight'), 3000);
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const mediaVideos = Array.from(document.querySelectorAll('.media-video'));
  const videoIntervals = [];
  mediaVideos.forEach((v, i) => {
    v.muted = true;
    v.playsInline = true;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    v.addEventListener('loadedmetadata', tryPlay);
    tryPlay();
    const id = setInterval(() => {
      try {
        v.currentTime = 0;
        v.play().catch(() => {});
      } catch (err) {}
    }, 10000);
    videoIntervals.push(id);
  });
  window.addEventListener('beforeunload', () => {
    videoIntervals.forEach(id => clearInterval(id));
  });
});