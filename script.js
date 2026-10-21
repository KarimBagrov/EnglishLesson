document.addEventListener('DOMContentLoaded', () => {
  
  // ---------- 1. Главная ----------
  const progressFill = document.getElementById('progress-fill');
  const progressCount = document.getElementById('progress-count');

  if (progressFill && progressCount) {
    const progress = JSON.parse(localStorage.getItem('efwd-progress')) || {};
    const done = Object.values(progress).filter(Boolean).length;
    const percent = Math.min(100, Math.round((done / 6) * 100));

    progressFill.style.width = percent + '%';
    progressCount.textContent = done;

    document.querySelectorAll('.lesson-card').forEach(card => {
      const href = card.getAttribute('href');
      if (!href) return;
      const match = href.match(/lesson-(\d+)\.html/);
      if (match && progress[`lesson-${match[1]}`]) {
        card.classList.add('is-done');
        const num = card.querySelector('.lesson-card__num');
        if (num) num.textContent = '✓';
      }
    });
  }

  // ---------- 2. Урок ----------
  const lessonPage = document.querySelector('[data-lesson-id]');
  if (lessonPage) {
    const lessonId = lessonPage.dataset.lessonId;
    const btn = document.getElementById('complete-btn');

    if (btn) {
      // Блок с автопроверкой удален. Кнопка всегда синяя при загрузке.

      // Логика при клике на кнопку
      btn.addEventListener('click', () => {
        const p = JSON.parse(localStorage.getItem('efwd-progress')) || {};
        p[lessonId] = true;
        localStorage.setItem('efwd-progress', JSON.stringify(p));
        
        btn.textContent = '✅ Урок пройден';
        btn.classList.add('is-done');
      });
    }
  }

  // ---------- 3. Кнопка "Наверх" ----------
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- 4. Меню и Кнопки ----------
  const menuToggle = document.getElementById('menu-toggle');
  const menuToggleInside = document.getElementById('menu-toggle-inside');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // Функция для синхронизации иконки внешней кнопки
  function updateMenuIcon() {
    if (!menuToggle || !sidebar) return;
    // Если меню открыто, ставим крестик, если закрыто - бургер
    menuToggle.innerHTML = sidebar.classList.contains('open') ? '×' : '☰';
  }

  if (sidebar) {
    // На ПК по умолчанию открываем панель
    if (window.innerWidth >= 1024) {
      sidebar.classList.add('open');
    }
    
    // Синхронизируем иконку при первой загрузке
    updateMenuIcon();

    // Функция закрытия (вызывается внутренней кнопкой на ПК)
    function closeDesktopMenu() {
      document.body.classList.add('sidebar-closed');
      sidebar.classList.remove('open');
      updateMenuIcon();
    }

    function toggleSidebar() {
      const isDesktop = window.innerWidth >= 1024;
      let isOpen = false;
      
      if (isDesktop) {
        const isClosed = document.body.classList.contains('sidebar-closed');
        if (isClosed) {
          document.body.classList.remove('sidebar-closed');
          sidebar.classList.add('open');
          isOpen = true;
        } else {
          closeDesktopMenu();
          isOpen = false;
        }
      } else {
        isOpen = sidebar.classList.contains('open');
        if (isOpen) {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
          isOpen = false;
        } else {
          sidebar.classList.add('open');
          overlay.classList.add('open');
          isOpen = true;
        }
      }

      // Обновляем иконку у внешней кнопки
      updateMenuIcon();
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    if (menuToggleInside) {
      menuToggleInside.addEventListener('click', closeDesktopMenu);
    }

    document.querySelectorAll('.sidebar__nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024 && sidebar.classList.contains('open')) {
          toggleSidebar();
        }
      });
    });
  }

  // ---------- 5. ScrollSpy ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar__nav a');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }
});