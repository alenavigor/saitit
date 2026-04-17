// Плавное раскрытие
const argumentCards = document.querySelectorAll('.argument-card');

function expandCard(card) {
    const parentColumn = card.closest('.column');

    // Закрываем другие карточки в этой колонке
    parentColumn.querySelectorAll('.argument-card').forEach(c => {
        if (c !== card && c.classList.contains('expanded')) {
            c.classList.remove('expanded');
        }
    });

    // Переключаем текущую
    card.classList.toggle('expanded');
}

argumentCards.forEach(card => {
    const title = card.querySelector('.argument-title');
    if (!title) return;
    title.addEventListener('click', (e) => {
        e.stopPropagation();
        expandCard(card);
    });
});

// Боковое меню
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const menuLinks = document.querySelectorAll('.menu-link');

function openMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle) menuToggle.addEventListener('click', openMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMenu();
            }
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) closeMenu();
});

// Анимация появления карточек
const cards = document.querySelectorAll('.argument-card');
if (cards.length) {
    cards.forEach((card, idx) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, idx * 50);
    });
}
