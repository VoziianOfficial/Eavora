'use strict';

(function () {
    const CONFIG = window.EAVORA_CONFIG || {};

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const getValue = (path, fallback = '') => {
        if (!path || !CONFIG) return fallback;

        return path.split('.').reduce((acc, key) => {
            if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
                return acc[key];
            }

            return undefined;
        }, CONFIG) ?? fallback;
    };

    const escapeHtml = (value) => {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };

    const currentPage = () => {
        const path = window.location.pathname.split('/').pop();
        return path || 'index.html';
    };

    const isActiveUrl = (url) => {
        const page = currentPage();
        return page === url || (page === '' && url === 'index.html');
    };

    const serviceById = (id) => {
        return (CONFIG.services || []).find((service) => service.id === id);
    };

    const createIcon = (name) => `<i data-lucide="${escapeHtml(name)}" aria-hidden="true"></i>`;

    const createButtonIcon = (name) => createIcon(name);

    const injectConfigText = () => {
        qsa('[data-config]').forEach((element) => {
            const path = element.getAttribute('data-config');
            const value = getValue(path);

            if (value !== undefined && value !== null) {
                element.textContent = value;
            }
        });

        qsa('[data-config-html]').forEach((element) => {
            const path = element.getAttribute('data-config-html');
            const value = getValue(path);

            if (value !== undefined && value !== null) {
                element.innerHTML = escapeHtml(value);
            }
        });
    };

    const updateDynamicLinks = () => {
        const phoneRaw = getValue('contact.phoneRaw');
        const phoneDisplay = getValue('contact.phoneDisplay');
        const email = getValue('contact.email');
        const address = getValue('company.address');

        qsa('[data-phone-link]').forEach((link) => {
            link.setAttribute('href', `tel:${phoneRaw}`);
            if (link.hasAttribute('data-phone-text')) {
                link.textContent = phoneDisplay;
            }
        });

        qsa('[data-email-link]').forEach((link) => {
            link.setAttribute('href', `mailto:${email}`);
            if (link.hasAttribute('data-email-text')) {
                link.textContent = email;
            }
        });

        qsa('[data-address-link]').forEach((link) => {
            const encodedAddress = encodeURIComponent(address);
            link.setAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });

        qsa('[data-url]').forEach((link) => {
            const path = link.getAttribute('data-url');
            const value = getValue(path);

            if (value) {
                link.setAttribute('href', value);
            }
        });
    };

    const getNavLinks = () => {
        return CONFIG.nav || [
            { label: 'Home', url: 'index.html' },
            { label: 'About', url: 'about.html' },
            { label: 'Services', url: 'all-services.html', hasDropdown: true },
            { label: 'Contact', url: 'contact.html' }
        ];
    };

    const createDesktopNav = () => {
        const navItems = getNavLinks();
        const serviceLinks = CONFIG.services || [];

        return navItems.map((item) => {
            if (item.hasDropdown) {
                return `
                    <div class="nav-dropdown">
                        <a class="nav-dropdown__trigger ${isActiveUrl(item.url) ? 'is-active' : ''}"
                           href="${escapeHtml(item.url)}"
                           aria-haspopup="true"
                           aria-expanded="false">
                            ${escapeHtml(item.label)}
                            ${createIcon('chevron-down')}
                        </a>

                        <div class="nav-dropdown__menu" aria-label="Service navigation">
                            ${serviceLinks.map((service) => `
                                <a class="nav-dropdown__link" href="${escapeHtml(service.url)}">
                                    <span>${escapeHtml(service.dropdownLabel || service.title)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            return `
                <a class="nav-link ${isActiveUrl(item.url) ? 'is-active' : ''}" href="${escapeHtml(item.url)}">
                    ${escapeHtml(item.label)}
                </a>
            `;
        }).join('');
    };

    const createMobileNav = () => {
        const navItems = getNavLinks();

        return navItems.map((item) => `
            <a class="mobile-menu__link" href="${escapeHtml(item.url)}">
                <span>${escapeHtml(item.label)}</span>
                ${createIcon('arrow-up-right')}
            </a>
        `).join('');
    };

    const createMobileServiceLinks = () => {
        return (CONFIG.services || []).map((service) => `
            <a class="mobile-menu__link" href="${escapeHtml(service.url)}">
                <span>${escapeHtml(service.dropdownLabel || service.title)}</span>
                ${createIcon(service.icon || 'arrow-up-right')}
            </a>
        `).join('');
    };

    const createFooterServiceLinks = () => {
        return (CONFIG.services || []).map((service) => `
            <li>
                <a href="${escapeHtml(service.url)}">${escapeHtml(service.dropdownLabel || service.title)}</a>
            </li>
        `).join('');
    };

    const createFooterNavLinks = () => {
        return getNavLinks().map((item) => `
            <li>
                <a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>
            </li>
        `).join('');
    };

    const createFooterLegalLinks = () => {
        return `
            <li><a href="${escapeHtml(getValue('urls.privacy'))}">Privacy Policy</a></li>
            <li><a href="${escapeHtml(getValue('urls.terms'))}">Terms of Service</a></li>
            <li><a href="${escapeHtml(getValue('urls.cookies'))}">Cookie Policy</a></li>
        `;
    };

    const renderHeader = () => {
        if (qs('.site-header')) return;

        const header = document.createElement('header');
        header.className = 'site-header';
        header.setAttribute('data-site-header', '');

        header.innerHTML = `
            <div class="site-header__main">
                <div class="container-wide site-header__main-inner">
                    <a class="site-logo" href="${escapeHtml(getValue('urls.home'))}" aria-label="${escapeHtml(getValue('brand.name'))} home">
                        <img src="${escapeHtml(getValue('brand.logo'))}" alt="${escapeHtml(getValue('brand.logoAlt'))}">
                    </a>

                    <div class="site-header__actions">
                        <a class="header-phone" href="tel:${escapeHtml(getValue('contact.phoneRaw'))}" data-phone-link aria-label="Call ${escapeHtml(getValue('brand.name'))}">
                            <span class="header-phone__icon">
                                ${createIcon('phone-call')}
                            </span>
                            <span class="header-phone__text">
                                <span class="header-phone__label">${escapeHtml(getValue('contact.phoneLabel'))}</span>
                                <span class="header-phone__number" data-config="contact.phoneDisplay">${escapeHtml(getValue('contact.phoneDisplay'))}</span>
                            </span>
                        </a>

                        <a class="btn btn-orange site-header__book" href="${escapeHtml(getValue('urls.contact'))}">
                            ${createButtonIcon('calendar-check')}
                            <span>Book Online</span>
                        </a>

                        <button class="burger-btn" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false" data-mobile-open>
                            ${createIcon('menu')}
                        </button>
                    </div>
                </div>
            </div>

            <div class="site-header__nav">
                <div class="container-wide site-header__nav-inner">
                    <nav class="main-nav" aria-label="Primary navigation">
                        ${createDesktopNav()}
                    </nav>

                    <div class="header-trust" aria-label="Platform notes">
                        <span>24/7 request access</span>
                        <span>Compare local gutter provider options</span>
                        <span>Independent platform</span>
                    </div>
                </div>
            </div>
        `;

        document.body.prepend(header);
    };

    const renderMobileMenu = () => {
        if (qs('.mobile-menu')) return;

        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'mobile-menu';
        mobileMenu.setAttribute('aria-hidden', 'true');

        mobileMenu.innerHTML = `
            <div class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                <div class="mobile-menu__top">
                    <a class="mobile-menu__logo" href="${escapeHtml(getValue('urls.home'))}" aria-label="${escapeHtml(getValue('brand.name'))} home">
                        <img src="${escapeHtml(getValue('brand.logo'))}" alt="${escapeHtml(getValue('brand.logoAlt'))}">
                    </a>

                    <button class="mobile-menu__close" type="button" aria-label="Close menu" data-mobile-close>
                        ${createIcon('x')}
                    </button>
                </div>

                <div class="mobile-menu__content">
                    <div>
                        <p class="mobile-menu__label">Navigation</p>
                        <nav class="mobile-menu__nav" aria-label="Mobile primary navigation">
                            ${createMobileNav()}
                        </nav>
                    </div>

                    <div>
                        <p class="mobile-menu__label">Gutter categories</p>
                        <nav class="mobile-menu__services" aria-label="Mobile service navigation">
                            ${createMobileServiceLinks()}
                        </nav>
                    </div>

                    <div>
                        <p class="mobile-menu__label">Contact</p>
                        <div class="mobile-menu__contacts">
                            <a class="mobile-menu__contact" href="tel:${escapeHtml(getValue('contact.phoneRaw'))}" data-phone-link>
                                ${createIcon('phone-call')}
                                <span data-config="contact.phoneDisplay">${escapeHtml(getValue('contact.phoneDisplay'))}</span>
                            </a>

                            <a class="mobile-menu__contact" href="mailto:${escapeHtml(getValue('contact.email'))}" data-email-link>
                                ${createIcon('mail')}
                                <span data-config="contact.email">${escapeHtml(getValue('contact.email'))}</span>
                            </a>

                            <a class="mobile-menu__contact" href="${escapeHtml(getValue('urls.contact'))}">
                                ${createIcon('send')}
                                <span>Start a request</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mobile-menu__bottom">
                    <p class="mobile-menu__note">
                        ${escapeHtml(getValue('legal.shortClarification'))}
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(mobileMenu);
    };

    const renderFooter = () => {
        if (qs('.site-footer')) return;

        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        footer.setAttribute('data-site-footer', '');

        footer.innerHTML = `
            <div class="container-wide">
                <div class="site-footer__top">
                    <div class="site-footer__brand">
                        <a class="site-footer__logo" href="${escapeHtml(getValue('urls.home'))}" aria-label="${escapeHtml(getValue('brand.name'))} home">
                            <img src="${escapeHtml(getValue('brand.logo'))}" alt="${escapeHtml(getValue('brand.logoAlt'))}">
                        </a>

                        <p class="site-footer__description" data-config="footer.description">
                            ${escapeHtml(getValue('footer.description'))}
                        </p>

                        <div class="site-footer__contact-list">
                            <div class="site-footer__contact">
                                ${createIcon('building-2')}
                                <span>
                                    <strong data-config="company.legalName">${escapeHtml(getValue('company.legalName'))}</strong><br>
                                    Company ID: <span data-config="company.companyId">${escapeHtml(getValue('company.companyId'))}</span>
                                </span>
                            </div>

                            <div class="site-footer__contact">
                                ${createIcon('map-pin')}
                                <span data-config="company.address">${escapeHtml(getValue('company.address'))}</span>
                            </div>

                            <a class="site-footer__contact" href="tel:${escapeHtml(getValue('contact.phoneRaw'))}" data-phone-link>
                                ${createIcon('phone-call')}
                                <span data-config="contact.phoneDisplay">${escapeHtml(getValue('contact.phoneDisplay'))}</span>
                            </a>

                            <a class="site-footer__contact" href="mailto:${escapeHtml(getValue('contact.email'))}" data-email-link>
                                ${createIcon('mail')}
                                <span data-config="contact.email">${escapeHtml(getValue('contact.email'))}</span>
                            </a>

                            <div class="site-footer__contact">
                                ${createIcon('navigation')}
                                <span>
                                    Service area: <span data-config="company.serviceArea">${escapeHtml(getValue('company.serviceArea'))}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 class="site-footer__title">Pages</h2>
                        <ul class="site-footer__links">
                            ${createFooterNavLinks()}
                        </ul>
                    </div>

                    <div>
                        <h2 class="site-footer__title">Services</h2>
                        <ul class="site-footer__links">
                            ${createFooterServiceLinks()}
                        </ul>
                    </div>

                    <div>
                        <h2 class="site-footer__title">Legal</h2>
                        <ul class="site-footer__links">
                            ${createFooterLegalLinks()}
                        </ul>
                    </div>
                </div>

                <div class="site-footer__disclaimer">
                    <p data-config="legal.disclaimer">${escapeHtml(getValue('legal.disclaimer'))}</p>
                </div>

                <div class="site-footer__bottom">
                    <span data-config="footer.copyright">${escapeHtml(getValue('footer.copyright'))}</span>

                    <div class="site-footer__bottom-links">
                        <a href="${escapeHtml(getValue('urls.privacy'))}">Privacy</a>
                        <a href="${escapeHtml(getValue('urls.terms'))}">Terms</a>
                        <a href="${escapeHtml(getValue('urls.cookies'))}">Cookies</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(footer);
    };

    const setupMobileMenu = () => {
        const mobileMenu = qs('.mobile-menu');
        const openBtn = qs('[data-mobile-open]');
        const closeBtn = qs('[data-mobile-close]');
        const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

        if (!mobileMenu || !openBtn || !closeBtn) return;

        let previousFocus = null;

        const openMenu = () => {
            previousFocus = document.activeElement;

            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            openBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');

            const firstFocusable = qs(focusableSelector, mobileMenu);
            if (firstFocusable) firstFocusable.focus();
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            openBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');

            if (previousFocus && typeof previousFocus.focus === 'function') {
                previousFocus.focus();
            }
        };

        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                closeMenu();
            }
        });

        qsa('a', mobileMenu).forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }

            if (event.key !== 'Tab' || !mobileMenu.classList.contains('is-open')) return;

            const focusable = qsa(focusableSelector, mobileMenu).filter((element) => !element.disabled);
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }

            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    };

    const setupDropdowns = () => {
        qsa('.nav-dropdown').forEach((dropdown) => {
            const trigger = qs('.nav-dropdown__trigger', dropdown);
            const menu = qs('.nav-dropdown__menu', dropdown);

            if (!trigger || !menu) return;

            let closeTimer = null;

            const open = () => {
                window.clearTimeout(closeTimer);
                trigger.setAttribute('aria-expanded', 'true');
            };

            const close = () => {
                closeTimer = window.setTimeout(() => {
                    trigger.setAttribute('aria-expanded', 'false');
                }, 260);
            };

            dropdown.addEventListener('mouseenter', open);
            dropdown.addEventListener('mouseleave', close);
            trigger.addEventListener('focus', open);
            menu.addEventListener('focusin', open);

            dropdown.addEventListener('focusout', (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    };

    const renderServiceLinks = () => {
        qsa('[data-service-links]').forEach((container) => {
            const variant = container.getAttribute('data-service-links') || 'list';
            const services = CONFIG.services || [];

            if (variant === 'dropdown') {
                container.innerHTML = services.map((service) => `
                    <a class="nav-dropdown__link" href="${escapeHtml(service.url)}">
                        <span>${escapeHtml(service.dropdownLabel || service.title)}</span>
                    </a>
                `).join('');
                return;
            }

            if (variant === 'footer') {
                container.innerHTML = services.map((service) => `
                    <li><a href="${escapeHtml(service.url)}">${escapeHtml(service.dropdownLabel || service.title)}</a></li>
                `).join('');
                return;
            }

            if (variant === 'icons') {
                container.innerHTML = services.map((service) => `
                    <a href="${escapeHtml(service.url)}"
                       class="dark-intro__icon-link"
                       aria-label="${escapeHtml(service.title)}">
                        ${createIcon(service.icon || 'arrow-up-right')}
                    </a>
                `).join('');
                return;
            }

            container.innerHTML = services.map((service) => `
                <a href="${escapeHtml(service.url)}">${escapeHtml(service.dropdownLabel || service.title)}</a>
            `).join('');
        });
    };

    const populateServiceSelects = () => {
        qsa('[data-service-select]').forEach((select) => {
            const currentValue = select.value;
            const placeholder = select.getAttribute('data-placeholder') || 'Select a service category';

            select.innerHTML = `
                <option value="">${escapeHtml(placeholder)}</option>
                ${(CONFIG.services || []).map((service) => `
                    <option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>
                `).join('')}
            `;

            if (currentValue) {
                select.value = currentValue;
            }
        });
    };

    const injectHiddenFormSource = () => {
        qsa('form').forEach((form) => {
            let sourceInput = qs('input[name="sourcePage"]', form);

            if (!sourceInput) {
                sourceInput = document.createElement('input');
                sourceInput.type = 'hidden';
                sourceInput.name = 'sourcePage';
                form.appendChild(sourceInput);
            }

            sourceInput.value = document.title || currentPage();

            let startedInput = qs('input[name="formStartedAt"]', form);

            if (!startedInput) {
                startedInput = document.createElement('input');
                startedInput.type = 'hidden';
                startedInput.name = 'formStartedAt';
                form.appendChild(startedInput);
            }

            startedInput.value = String(Date.now());
        });
    };

    const setupFaqAccordions = () => {
        qsa('.faq-accordion').forEach((accordion) => {
            const items = qsa('.faq-item', accordion);

            items.forEach((item, index) => {
                const button = qs('.faq-question', item);
                const answer = qs('.faq-answer', item);

                if (!button || !answer) return;

                const id = answer.id || `faq-answer-${Math.random().toString(16).slice(2)}`;

                answer.id = id;
                button.setAttribute('aria-controls', id);
                button.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

                if (index === 0 && !items.some((faqItem) => faqItem.classList.contains('is-open'))) {
                    item.classList.add('is-open');
                    button.setAttribute('aria-expanded', 'true');
                }

                button.addEventListener('click', () => {
                    const isOpen = item.classList.contains('is-open');

                    items.forEach((faqItem) => {
                        const faqButton = qs('.faq-question', faqItem);
                        faqItem.classList.remove('is-open');
                        if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
                    });

                    if (!isOpen) {
                        item.classList.add('is-open');
                        button.setAttribute('aria-expanded', 'true');
                    }
                });
            });
        });
    };

    const createFaqSchema = () => {
        const existing = qs('script[data-faq-schema]');
        if (existing) existing.remove();

        const faqItems = qsa('.faq-item');
        if (!faqItems.length) return;

        const entities = faqItems.map((item) => {
            const question = qs('.faq-question span', item)?.textContent?.trim();
            const answer = qs('.faq-answer p', item)?.textContent?.trim();

            if (!question || !answer) return null;

            return {
                '@type': 'Question',
                name: question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: answer
                }
            };
        }).filter(Boolean);

        if (!entities.length) return;

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-faq-schema', '');
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: entities
        });

        document.head.appendChild(script);
    };

    const setupCounters = () => {
        const counters = qsa('.js-counter');

        if (!counters.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const animateCounter = (counter) => {
            const target = Number(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, '') || 0);
            const suffix = counter.getAttribute('data-suffix') || '';
            const prefix = counter.getAttribute('data-prefix') || '';
            const duration = Number(counter.getAttribute('data-duration') || 1200);

            if (!target || prefersReducedMotion) {
                counter.textContent = `${prefix}${target}${suffix}`;
                counter.setAttribute('data-counted', 'true');
                return;
            }

            const startTime = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);

                counter.textContent = `${prefix}${value}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = `${prefix}${target}${suffix}`;
                    counter.setAttribute('data-counted', 'true');
                }
            };

            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                if (counter.getAttribute('data-counted') === 'true') return;

                animateCounter(counter);
                observer.unobserve(counter);
            });
        }, {
            threshold: 0.35
        });

        counters.forEach((counter) => observer.observe(counter));
    };

    const setupScrollToLinks = () => {
        qsa('[data-scroll-to]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetSelector = link.getAttribute('data-scroll-to');
                const target = qs(targetSelector);

                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    };

    const setHeroImages = () => {
        qsa('[data-hero-image]').forEach((hero) => {
            const imagePath = hero.getAttribute('data-hero-image');

            if (!imagePath) return;

            const imageUrl = new URL(imagePath, window.location.href).href;

            hero.style.setProperty('--hero-image', `url("${imageUrl}")`);
        });
    };

    const setActiveServicePageData = () => {
        const page = currentPage();
        const service = (CONFIG.services || []).find((item) => item.url === page);

        if (!service) return;

        document.documentElement.setAttribute('data-current-service', service.id);

        qsa('[data-current-service-title]').forEach((element) => {
            element.textContent = service.title;
        });

        qsa('[data-current-service-summary]').forEach((element) => {
            element.textContent = service.summary;
        });

        qsa('[data-current-service-description]').forEach((element) => {
            element.textContent = service.description;
        });

        qsa('[data-current-service-hero]').forEach((element) => {
            element.textContent = service.heroTitle || service.title;
        });

        qsa('[data-current-service-image]').forEach((image) => {
            image.setAttribute('src', service.image);
            image.setAttribute('alt', service.title);
        });

        qsa('[data-current-service-icon]').forEach((element) => {
            element.innerHTML = createIcon(service.icon || 'droplets');
        });

        qsa('[data-related-service-links]').forEach((container) => {
            container.innerHTML = (service.related || []).map((id) => {
                const relatedService = serviceById(id);
                if (!relatedService) return '';

                return `
                    <a href="${escapeHtml(relatedService.url)}">
                        <span>${escapeHtml(relatedService.dropdownLabel || relatedService.title)}</span>
                        ${createIcon('arrow-up-right')}
                    </a>
                `;
            }).join('');
        });
    };

    const setupCookieBanner = () => {
        if (localStorage.getItem('eavoraCookieChoice')) return;
        if (qs('.cookie-banner')) return;

        const banner = document.createElement('div');
        banner.className = 'cookie-banner is-visible';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent');

        banner.innerHTML = `
            <h2 class="cookie-banner__title">Cookie preferences</h2>
            <p class="cookie-banner__text">
                Eavora uses essential local storage to remember this choice. Optional analytics or tracking should only be used after proper setup and consent.
                Read our
                <a href="${escapeHtml(getValue('urls.privacy'))}">Privacy Policy</a>,
                <a href="${escapeHtml(getValue('urls.cookies'))}">Cookie Policy</a>,
                and <a href="${escapeHtml(getValue('urls.terms'))}">Terms</a>.
            </p>

            <div class="cookie-banner__actions">
                <button class="btn btn-primary" type="button" data-cookie-accept>
                    ${createIcon('check')}
                    <span>Accept</span>
                </button>

                <button class="btn btn-ghost" type="button" data-cookie-decline>
                    ${createIcon('x')}
                    <span>Decline</span>
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        const saveChoice = (choice) => {
            localStorage.setItem('eavoraCookieChoice', choice);
            banner.classList.remove('is-visible');
        };

        qs('[data-cookie-accept]', banner)?.addEventListener('click', () => saveChoice('accepted'));
        qs('[data-cookie-decline]', banner)?.addEventListener('click', () => saveChoice('declined'));
    };

    const setupButtonsIconsFallback = () => {
        qsa('.btn:not([data-no-auto-icon])').forEach((button) => {
            if (qs('[data-lucide]', button)) return;

            const icon = button.getAttribute('data-icon');
            if (!icon) return;

            button.insertAdjacentHTML('afterbegin', createIcon(icon));
        });
    };

    const setupLucide = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    const setupAos = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || !window.AOS) return;

        window.AOS.init({
            duration: 760,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 80,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disableMutationObserver: false
        });

        window.addEventListener('load', () => {
            window.setTimeout(() => {
                if (window.AOS && typeof window.AOS.refreshHard === 'function') {
                    window.AOS.refreshHard();
                }
            }, 220);
        });
    };

    const setupImageLoadRefresh = () => {
        const refresh = () => {
            if (window.AOS && typeof window.AOS.refresh === 'function') {
                window.AOS.refresh();
            }
        };

        qsa('img').forEach((image) => {
            if (image.complete) return;
            image.addEventListener('load', refresh, { once: true });
        });
    };

    const setupCurrentYear = () => {
        qsa('[data-current-year]').forEach((element) => {
            element.textContent = String(new Date().getFullYear());
        });
    };

    const setupLegalDate = () => {
        qsa('[data-current-date]').forEach((element) => {
            element.textContent = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date());
        });
    };

    const hydrate = () => {
        renderHeader();
        renderMobileMenu();
        renderFooter();

        injectConfigText();
        updateDynamicLinks();
        renderServiceLinks();
        populateServiceSelects();
        injectHiddenFormSource();

        setupMobileMenu();
        setupDropdowns();
        setupFaqAccordions();
        createFaqSchema();
        setupCounters();
        setupScrollToLinks();
        setHeroImages();
        setActiveServicePageData();
        setupCookieBanner();
        setupButtonsIconsFallback();
        setupCurrentYear();
        setupLegalDate();

        setupLucide();
        setupAos();
        setupImageLoadRefresh();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hydrate);
    } else {
        hydrate();
    }

    window.EavoraUtils = {
        qs,
        qsa,
        getValue,
        escapeHtml,
        serviceById,
        createIcon,
        injectConfigText,
        updateDynamicLinks,
        renderServiceLinks,
        setupFaqAccordions,
        createFaqSchema,
        setupCounters,
        refreshIcons: setupLucide,
        refreshAos: () => {
            if (window.AOS && typeof window.AOS.refreshHard === 'function') {
                window.AOS.refreshHard();
            }
        }
    };
})();