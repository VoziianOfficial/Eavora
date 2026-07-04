'use strict';

(function () {
    const utils = window.EavoraUtils || {};
    const qs = utils.qs || ((selector, scope = document) => scope.querySelector(selector));
    const qsa = utils.qsa || ((selector, scope = document) => Array.from(scope.querySelectorAll(selector)));

    const refreshUi = () => {
        if (utils.refreshIcons) utils.refreshIcons();

        window.setTimeout(() => {
            if (utils.refreshAos) utils.refreshAos();
        }, 80);
    };

    const setupLegalDate = () => {
        const dateTargets = qsa('[data-legal-date]');

        if (!dateTargets.length) return;

        const now = new Date();

        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        dateTargets.forEach((target) => {
            target.textContent = formattedDate;
        });
    };

    const setupSidebarActiveState = () => {
        const links = qsa('.legal-sidebar__nav a[href^="#"]');

        if (!links.length) return;

        const sections = links
            .map((link) => {
                const id = link.getAttribute('href');
                const section = id ? qs(id) : null;

                return {
                    link,
                    section,
                    id
                };
            })
            .filter((item) => item.section && item.id);

        if (!sections.length) return;

        const setActive = (id) => {
            links.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === id);
            });
        };

        links.forEach((link) => {
            link.addEventListener('click', () => {
                setActive(link.getAttribute('href'));
            });
        });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (!visibleEntries.length) return;

                const activeSection = visibleEntries[0].target;
                setActive(`#${activeSection.id}`);
            }, {
                root: null,
                rootMargin: '-22% 0px -62% 0px',
                threshold: [0.05, 0.12, 0.25, 0.4]
            });

            sections.forEach(({ section }) => observer.observe(section));
            setActive(sections[0].id);

            return;
        }

        let ticking = false;

        const updateActiveOnScroll = () => {
            const headerHeight = Number(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--header-height')
                    .replace('px', '')
            ) || 120;

            const offset = headerHeight + 60;
            let activeId = sections[0].id;

            sections.forEach(({ section, id }) => {
                const rect = section.getBoundingClientRect();

                if (rect.top - offset <= 0) {
                    activeId = id;
                }
            });

            setActive(activeId);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateActiveOnScroll);
            }
        }, { passive: true });

        updateActiveOnScroll();
    };

    const setupLegalCardsHover = () => {
        const cards = qsa('.legal-cookie-grid article, .legal-hero__card, .legal-disclaimer-card');

        if (!cards.length) return;

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('is-active');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-active');
            });

            card.addEventListener('focusin', () => {
                card.classList.add('is-active');
            });

            card.addEventListener('focusout', () => {
                card.classList.remove('is-active');
            });
        });
    };

    const setupLegalExternalLinks = () => {
        const legalDocument = qs('.legal-document');

        if (!legalDocument) return;

        const links = qsa('a[href^="http"]', legalDocument);

        links.forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', `${link.textContent.trim()} opens in a new tab`);
            }
        });
    };

    const setupPrintShortcut = () => {
        const documentCard = qs('.legal-document');

        if (!documentCard) return;

        const printButton = document.createElement('button');
        printButton.className = 'legal-print-button';
        printButton.type = 'button';
        printButton.innerHTML = `
            <i data-lucide="printer" aria-hidden="true"></i>
            <span>Print Page</span>
        `;

        printButton.addEventListener('click', () => {
            window.print();
        });

        const sidebar = qs('.legal-sidebar');

        if (sidebar) {
            sidebar.appendChild(printButton);
            refreshUi();
        }
    };

    const setupPolicyPageClass = () => {
        const path = window.location.pathname.split('/').pop() || '';

        document.body.classList.toggle('is-privacy-page', path.includes('privacy'));
        document.body.classList.toggle('is-terms-page', path.includes('terms'));
        document.body.classList.toggle('is-cookie-page', path.includes('cookie'));
    };

    const injectPrintButtonStyles = () => {
        if (qs('#legal-print-button-styles')) return;

        const style = document.createElement('style');
        style.id = 'legal-print-button-styles';
        style.textContent = `
            .legal-print-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                min-height: 46px;
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--color-border);
                border-radius: 999px;
                color: var(--color-text);
                background: var(--color-premium-white);
                font-size: 14px;
                font-weight: 750;
                transition:
                    transform var(--transition),
                    color var(--transition),
                    border-color var(--transition),
                    background-color var(--transition);
            }

            .legal-print-button:hover {
                transform: translateY(-2px);
                color: var(--color-white);
                border-color: var(--color-green);
                background: var(--color-green);
            }

            .legal-print-button svg {
                width: 18px;
                height: 18px;
            }

            @media print {
                .site-header,
                .site-footer,
                .cookie-banner,
                .legal-sidebar,
                .legal-disclaimer-section,
                .legal-cta {
                    display: none !important;
                }

                .legal-hero {
                    padding: 24px 0 !important;
                    color: #000 !important;
                    background: #fff !important;
                }

                .legal-hero::before,
                .legal-hero::after {
                    display: none !important;
                }

                .legal-hero h1,
                .legal-hero__card h2 {
                    color: #000 !important;
                }

                .legal-hero__content > p,
                .legal-hero__card p,
                .legal-hero__meta span {
                    color: #333 !important;
                }

                .legal-hero__layout,
                .legal-layout {
                    display: block !important;
                }

                .legal-document {
                    padding: 0 !important;
                    border: 0 !important;
                    box-shadow: none !important;
                }

                .section {
                    padding: 24px 0 !important;
                }
            }
        `;

        document.head.appendChild(style);
    };

    const init = () => {
        setupPolicyPageClass();
        setupLegalDate();
        setupSidebarActiveState();
        setupLegalCardsHover();
        setupLegalExternalLinks();
        injectPrintButtonStyles();
        setupPrintShortcut();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();