document.addEventListener('DOMContentLoaded', () => {
  // 1. القائمة الجانبية (Mobile Drawer)
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  function toggleDrawer() {
    const isOpen = mobileDrawer.classList.contains('is-open');

    menuToggle.classList.toggle('is-active');
    mobileDrawer.classList.toggle('is-open');
    drawerOverlay.classList.toggle('is-open');

    menuToggle.setAttribute('aria-expanded', !isOpen);
    mobileDrawer.setAttribute('aria-hidden', isOpen);

    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  if (menuToggle) menuToggle.addEventListener('click', toggleDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('is-open')) {
        toggleDrawer();
      }
    });
  });

  // 2. التمرير السلس (Smooth Scroll)
  const allNavLinks = [...navLinks, ...mobileLinks];
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. السلايدر والتمرير الأفقي البارز (Active Carousel Center Observer)
  function initCarousel(trackId, prevBtnId, nextBtnId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!track) return;

    const cards = track.querySelectorAll('.carousel-card');

    // تحديد الكارت المتواجد في المنتصف وإضافة class للتكبير
    function updateActiveCard() {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(trackCenter - cardCenter);

        // إذا كان مركز الكارت قريباً جداً من منتصف الحاوية
        if (distance < cardRect.width / 2) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    // التنقل باستخدام الأسهم
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cardWidth = cards[0].getBoundingClientRect().width;
        track.scrollBy({ left: -(cardWidth + 15), behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = cards[0].getBoundingClientRect().width;
        track.scrollBy({ left: (cardWidth + 15), behavior: 'smooth' });
      });
    }

    // متابعة التمرير (Scroll) وإعادة الحساب
    track.addEventListener('scroll', updateActiveCard);
    window.addEventListener('resize', updateActiveCard);
    
    // تشغيل الحساب لأول مرة
    updateActiveCard();
  }

  // تهيئة السلايدر للأقسام والمنتجات
  initCarousel('deptTrack', 'deptPrev', 'deptNext');
  initCarousel('prodTrack', 'prodPrev', 'prodNext');

  // 4. تفعيل الرابط النشط عند التمرير (Active Link)
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
});
