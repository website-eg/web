(function () {
  // عناصر
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const links = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const scroller =
    document.scrollingElement || document.documentElement || document.body;

  // easing
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // animation scroll to Y
  function smoothScrollTo(targetY, duration = 600) {
    const startY = scroller.scrollTop;
    const diff = targetY - startY;
    let startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutQuad(t);
      scroller.scrollTo(0, Math.round(startY + diff * eased));
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // عند الضغط على الروابط
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;

      const targetY =
        target.getBoundingClientRect().top + scroller.scrollTop - headerHeight;

      smoothScrollTo(targetY, 650);
      // حدث الـ URL بدون قفزة
      history.replaceState(null, "", id);
    });
  });

  // active link باستخدام IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`nav a[href="#${id}"]`);
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          if (link) link.classList.add("active");
        }
      });
    },
    {
      root: null,
      rootMargin: `-${headerHeight}px 0px -40% 0px`,
      threshold: 0.25,
    }
  );

  sections.forEach((s) => observer.observe(s));
})();

const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('show');
    
    burger.querySelector('i').classList.toggle('fa-bars');
    burger.querySelector('i').classList.toggle('fa-xmark');
  });
}

const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('show');
    burger.querySelector('i').classList.add('fa-bars');
    burger.querySelector('i').classList.remove('fa-xmark');
  });
});
