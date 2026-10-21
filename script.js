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
      updateMenuIcon(); // <--- Обновляем иконку
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
      updateMenuIcon(); // <--- Обновляем иконку
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