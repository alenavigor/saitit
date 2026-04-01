(function () {
    // ========== ГОЛОСОВАНИЕ (без изменений) ==========
    const STORAGE_VOTES_KEY = "future_robot_human_votes";
    const STORAGE_USER_VOTE_KEY = "user_vote";

    let votes = { for: 0, against: 0, unsure: 0 };

    const forBtn = document.getElementById('vote-for');
    const againstBtn = document.getElementById('vote-against');
    const unsureBtn = document.getElementById('vote-unsure');

    const forPercentSpan = document.getElementById('for-percent');
    const againstPercentSpan = document.getElementById('against-percent');
    const unsurePercentSpan = document.getElementById('unsure-percent');
    const forFillDiv = document.getElementById('for-fill');
    const againstFillDiv = document.getElementById('against-fill');
    const unsureFillDiv = document.getElementById('unsure-fill');
    const voteCountText = document.getElementById('vote-count-text');

    function loadVotes() {
        const stored = localStorage.getItem(STORAGE_VOTES_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (typeof parsed.for === 'number' && typeof parsed.against === 'number' && typeof parsed.unsure === 'number') {
                    votes = parsed;
                }
            } catch (e) { }
        }
        updateUI();
    }

    function persistVotes() {
        localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(votes));
    }

    function updateUI() {
        const total = votes.for + votes.against + votes.unsure;
        if (total === 0) {
            forPercentSpan.innerText = '0%';
            againstPercentSpan.innerText = '0%';
            unsurePercentSpan.innerText = '0%';
            forFillDiv.style.width = '0%';
            againstFillDiv.style.width = '0%';
            unsureFillDiv.style.width = '0%';
            voteCountText.innerText = 'Всего голосов: 0';
            return;
        }

        const forPerc = (votes.for / total) * 100;
        const againstPerc = (votes.against / total) * 100;
        const unsurePerc = (votes.unsure / total) * 100;

        forPercentSpan.innerText = `${forPerc.toFixed(1)}%`;
        againstPercentSpan.innerText = `${againstPerc.toFixed(1)}%`;
        unsurePercentSpan.innerText = `${unsurePerc.toFixed(1)}%`;

        forFillDiv.style.width = `${forPerc}%`;
        againstFillDiv.style.width = `${againstPerc}%`;
        unsureFillDiv.style.width = `${unsurePerc}%`;

        voteCountText.innerText = `Всего голосов: ${total}`;
    }

    function hasUserVoted() {
        return localStorage.getItem(STORAGE_USER_VOTE_KEY) !== null;
    }

    function getUserVote() {
        return localStorage.getItem(STORAGE_USER_VOTE_KEY);
    }

    function updateButtonsState() {
        const userVoted = hasUserVoted();
        forBtn.disabled = userVoted;
        againstBtn.disabled = userVoted;
        unsureBtn.disabled = userVoted;

        if (userVoted) {
            const userChoice = getUserVote();
            forBtn.classList.remove('voted');
            againstBtn.classList.remove('voted');
            unsureBtn.classList.remove('voted');
            if (userChoice === 'for') forBtn.classList.add('voted');
            if (userChoice === 'against') againstBtn.classList.add('voted');
            if (userChoice === 'unsure') unsureBtn.classList.add('voted');
        } else {
            forBtn.classList.remove('voted');
            againstBtn.classList.remove('voted');
            unsureBtn.classList.remove('voted');
        }
    }

    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = isError ? '#b23c1c' : '#1e2f3e';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '40px';
        toast.style.fontSize = '0.9rem';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.backdropFilter = 'blur(8px)';
        toast.style.fontWeight = '500';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2200);
    }

    function addVote(type) {
        if (hasUserVoted()) {
            showToast('❌ Вы уже проголосовали. Изменить свой выбор нельзя.', true);
            return;
        }

        if (type === 'for') votes.for += 1;
        else if (type === 'against') votes.against += 1;
        else if (type === 'unsure') votes.unsure += 1;

        persistVotes();
        updateUI();

        localStorage.setItem(STORAGE_USER_VOTE_KEY, type);
        updateButtonsState();

        let message = '';
        if (type === 'for') message = '✔️ Вы проголосовали: мы сможем отличить робота от человека.';
        else if (type === 'against') message = '🤖 Вы проголосовали: мы НЕ сможем отличить.';
        else message = '🧠 Вы выбрали: сомневаюсь / сложный вопрос.';
        showToast(message);
    }

    forBtn.addEventListener('click', () => addVote('for'));
    againstBtn.addEventListener('click', () => addVote('against'));
    unsureBtn.addEventListener('click', () => addVote('unsure'));

    loadVotes();
    updateButtonsState();

    // ========== АККОРДЕОН (плавное раскрытие) ==========
    document.querySelectorAll('.argument-card').forEach(card => {
        const title = card.querySelector('.argument-title');
        if (!title) return;
        card.classList.remove('expanded');
        title.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.toggle('expanded');
        });
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

    // ========== БОКОВОЕ МЕНЮ ==========
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

    // Закрытие меню при клике на ссылку и плавная прокрутка к якорю
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

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
            closeMenu();
        }
    });
})();