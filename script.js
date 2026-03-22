/* ============================================================
   FENNECTRA — Landing Page Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- REVEAL ON SCROLL ---
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // --- NAV SCROLL ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 40);
        lastScroll = scrollY;
    }, { passive: true });

    // --- MOBILE MENU ---
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    // --- TERMINAL TYPING ANIMATION ---
    const heroTerminal = document.querySelector('.hero__terminal');
    if (heroTerminal) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTerminalAnimation();
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        terminalObserver.observe(heroTerminal);
    }

    function startTerminalAnimation() {
        const lines = document.querySelectorAll('.terminal__line');

        lines.forEach(line => {
            const delay = parseInt(line.dataset.delay) || 0;
            const cmd = line.querySelector('.terminal__cmd');

            setTimeout(() => {
                line.classList.add('typed');

                if (cmd) {
                    const text = cmd.dataset.text;
                    let i = 0;
                    const speed = 35;

                    function typeChar() {
                        if (i < text.length) {
                            cmd.textContent = text.substring(0, i + 1);
                            i++;
                            setTimeout(typeChar, speed + Math.random() * 20);
                        } else {
                            cmd.classList.add('done');
                        }
                    }

                    typeChar();
                }
            }, delay);
        });
    }

    // --- CODE TABS ---
    const codeTabs = document.querySelectorAll('.code-tab');
    const codePanels = document.querySelectorAll('.code-panel');

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            codeTabs.forEach(t => t.classList.remove('active'));
            codePanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // --- COPY BUTTONS ---
    document.querySelectorAll('.code-block__copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.code-panel') || btn.closest('.code-block');
            const code = panel.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    const orig = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.style.color = 'var(--success)';
                    setTimeout(() => {
                        btn.textContent = orig;
                        btn.style.color = '';
                    }, 2000);
                });
            }
        });
    });

    // --- CTA COPY ---
    const ctaCopy = document.getElementById('ctaCopy');
    if (ctaCopy) {
        ctaCopy.addEventListener('click', () => {
            navigator.clipboard.writeText('fennectra new my-api').then(() => {
                ctaCopy.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(() => {
                    ctaCopy.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                }, 2000);
            });
        });
    }

    // --- PERFORMANCE BARS ANIMATION ---
    const perfBars = document.querySelectorAll('.perf__bar');
    if (perfBars.length) {
        const perfObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the bar animations
                    const bars = entry.target.querySelectorAll('.perf__bar');
                    bars.forEach((bar, i) => {
                        setTimeout(() => {
                            bar.classList.add('animated');
                        }, i * 200);
                    });
                    perfObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const perfChart = document.querySelector('.perf__chart');
        if (perfChart) perfObserver.observe(perfChart);
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
