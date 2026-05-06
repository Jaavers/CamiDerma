document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, Draggable);

    // ── HAMBURGER MENU ──────────────────────────────────────
    const toggle = document.getElementById('menu-toggle');
    const menu   = document.getElementById('nav-menu');

    toggle?.addEventListener('click', () => {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            menu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── HEADER SCROLL ────────────────────────────────────────
    window.addEventListener('scroll', () => {
        document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── HERO ENTRANCE ────────────────────────────────────────
    gsap.timeline()
        .from('#hero-title',     { y:30, autoAlpha:0, duration:1,   ease:'power4.out' })
        .from('.hero-text p',    { y:20, autoAlpha:0, duration:.8,  ease:'power3.out' }, '-=.7')
        .from('.hero-btns',      { y:20, autoAlpha:0, duration:.8,  ease:'power3.out' }, '-=.6')
        .from('.hero-img-wrap',  { scale:1.06, autoAlpha:0, duration:1.4, ease:'power2.out' }, 0);

    // ── TABS (SOBRE MÍ) ───────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // active button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // find current active panel and animate out, then animate in
            const current = document.querySelector('.tab-panel.active');
            const next    = document.getElementById(target);

            if (current === next) return;

            gsap.to(current, {
                autoAlpha: 0, x: -15, duration: .25, ease: 'power2.in',
                onComplete: () => {
                    current.classList.remove('active');
                    next.classList.add('active');
                    gsap.fromTo(next,
                        { autoAlpha: 0, x: 20 },
                        { autoAlpha: 1, x: 0,  duration: .35, ease: 'power2.out' }
                    );
                }
            });
        });
    });

    // ── SERVICE CARD MICRO-INTERACTION ───────────────────────
    document.querySelectorAll('.svc-card').forEach(card => {
        card.addEventListener('mouseenter', () =>
            gsap.to(card, { borderLeftColor:'#8A0B51', duration:.2, ease:'power1.out' }));
        card.addEventListener('mouseleave', () =>
            gsap.to(card, { borderLeftColor:'transparent', duration:.2, ease:'power1.in' }));
    });

    // ── BEFORE / AFTER SLIDER ────────────────────────────────
    const slider   = document.getElementById('compare-slider');
    const handle   = document.getElementById('cmp-handle');
    const afterImg = document.querySelector('.cmp-after');

    if (slider && handle && afterImg) {
        const updateClip = (x) => {
            const pct = (x / slider.offsetWidth) * 100 + 50;
            gsap.set(afterImg, { clipPath: `inset(0 0 0 ${pct}%)` });
        };

        Draggable.create(handle, {
            type: 'x',
            bounds: slider,
            onDrag() { updateClip(this.x); }
        });

        // Entrance bounce
        ScrollTrigger.create({
            trigger: slider,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.from(handle, {
                    x: -180, duration: 1.5, ease: 'back.out(1.7)',
                    onUpdate() { updateClip(gsap.getProperty(handle, 'x')); }
                });
            }
        });
    }

    // ── FAQ ACCORDION ─────────────────────────────────────────
    document.querySelectorAll('.faq-item').forEach(item => {
        const q    = item.querySelector('.faq-q');
        const a    = item.querySelector('.faq-a');
        const icon = item.querySelector('.faq-icon');
        let open   = false;

        q.addEventListener('click', () => {
            open = !open;
            gsap.to(a,    { height: open ? 'auto' : 0, duration:.45, ease:'power3.inOut' });
            gsap.to(icon, { rotation: open ? 45 : 0,   duration:.3 });
            gsap.to(item, { borderBottomColor: open ? '#8A0B51' : 'transparent', duration:.3 });
        });
    });

    // ── SCROLL REVEALS (matchMedia) ──────────────────────────
    const mm = gsap.matchMedia();

    // Desktop
    mm.add('(min-width:800px)', () => {
        gsap.utils.toArray('.cat-box, .sobre-layout, .faq-item').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                y: 30, autoAlpha: 0, duration: .8, ease: 'power3.out'
            });
        });
    });

    // Mobile
    mm.add('(max-width:799px)', () => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        gsap.utils.toArray('.cat-box, .sobre-layout, .faq-item').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%' },
                y: 20, 
                autoAlpha: 0, 
                duration: reducedMotion ? 0 : 0.5, 
                stagger: 0.1,
                ease: 'power2.out'
            });
        });

        // Carousel Dots Sync
        const grid = document.querySelector('.cat-grid');
        const dots = document.querySelectorAll('#svc-dots .dot');
        if (grid && dots.length) {
            grid.addEventListener('scroll', () => {
                const scrollLeft = grid.scrollLeft;
                const width = grid.offsetWidth;
                const index = Math.round(scrollLeft / width);
                dots.forEach(d => d.classList.remove('active'));
                if(dots[index]) dots[index].classList.add('active');
            });
        }
    });
});
