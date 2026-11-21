document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Barre de progression + navbar */
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    const navbar = document.querySelector('.navbar');

    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Lien actif dans le menu */
    const links = document.querySelectorAll('.navbar ul a');
    const sections = document.querySelectorAll('main section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                links.forEach((l) =>
                    l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id)
                );
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((s) => navObserver.observe(s));

    if (reduceMotion) return;

    /* Effet machine à écrire sur le sous-titre */
    const role = document.querySelector('.home-info h2');
    if (role) {
        const text = role.textContent.trim().replace(/\s+/g, ' ');
        role.style.minHeight = role.offsetHeight + 'px';
        role.textContent = '';

        const typed = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        role.append(typed, cursor);

        let i = 0;
        const type = () => {
            typed.textContent = text.slice(0, ++i);
            if (i < text.length) {
                setTimeout(type, 55);
            } else {
                cursor.classList.add('done');
            }
        };
        setTimeout(type, 1000);
    }

    /* Apparition au scroll */
    const groups = [
        ['.section-heading', ''],
        ['.about-card', ''],
        ['.skills h3', ''],
        ['.skill-list span', ''],
        ['.project-card', ''],
        ['.project-note', ''],
        ['.contact-item', 'from-left'],
        ['.contact-message', 'from-right']
    ];

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    groups.forEach(([selector, direction]) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            const isTag = selector.includes('span');
            el.classList.add('reveal');
            if (direction) el.classList.add(direction);
            el.style.setProperty('--delay', (index * (isTag ? 0.08 : 0.15)) + 's');
            revealObserver.observe(el);
        });
    });
});