'use strict';

(function () {
    const utils = window.EavoraUtils || {};
    const config = window.EAVORA_CONFIG || {};

    const qs = utils.qs || ((selector, scope = document) => scope.querySelector(selector));
    const qsa = utils.qsa || ((selector, scope = document) => Array.from(scope.querySelectorAll(selector)));
    const escapeHtml = utils.escapeHtml || ((value) => String(value || ''));

    const services = Array.isArray(config.services) ? config.services : [];

    const refreshUi = () => {
        if (utils.refreshIcons) utils.refreshIcons();

        window.setTimeout(() => {
            if (utils.refreshAos) utils.refreshAos();
        }, 80);
    };

    const getCurrentService = () => {
        const bodyServiceId = document.body.getAttribute('data-service-id');

        if (bodyServiceId) {
            return services.find((service) => service.id === bodyServiceId) || null;
        }

        const path = window.location.pathname.split('/').pop() || 'index.html';

        return services.find((service) => {
            const servicePath = String(service.url || '').split('/').pop();
            return servicePath === path;
        }) || null;
    };

    const createIcon = (name) => {
        return `<i data-lucide="${escapeHtml(name || 'arrow-up-right')}" aria-hidden="true"></i>`;
    };

    const setText = (selector, value) => {
        qsa(selector).forEach((element) => {
            element.textContent = value || '';
        });
    };

    const setAttribute = (selector, attribute, value) => {
        qsa(selector).forEach((element) => {
            if (value) element.setAttribute(attribute, value);
        });
    };

    const toRootAssetPath = (value) => {
        if (!value) return '';
        return value.startsWith('/') ? value : `/${String(value).replace(/^\.?\//, '')}`;
    };

    const hydrateServiceData = () => {
        const service = getCurrentService();

        if (!service) return;

        setText('[data-current-service-title]', service.title);
        setText('[data-current-service-hero-title]', service.heroTitle || service.title);
        setText('[data-current-service-summary]', service.summary);
        setText('[data-current-service-description]', service.description);
        setAttribute('[data-current-service-link]', 'href', service.url);

        qsa('[data-current-service-image]').forEach((image) => {
            if (service.image) image.src = service.image;
            image.alt = service.title || 'Gutter service image';
        });

        qsa('[data-current-service-icon]').forEach((element) => {
            element.innerHTML = createIcon(service.icon);
        });

        qsa('.service-photo-cta').forEach((element) => {
            if (service.image) {
                element.style.setProperty('--service-final-image', `url('${toRootAssetPath(service.image)}')`);
            }
        });

        document.documentElement.style.setProperty('--active-service-accent', 'var(--color-green)');

        refreshUi();
    };

    const renderRelatedLinks = () => {
        const service = getCurrentService();
        const containers = qsa('[data-related-service-links]');

        if (!service || !containers.length) return;

        const relatedIds = Array.isArray(service.related) ? service.related : [];
        const relatedServices = relatedIds
            .map((id) => services.find((item) => item.id === id))
            .filter(Boolean);

        containers.forEach((container) => {
            const limit = Number(container.getAttribute('data-related-limit')) || relatedServices.length || 2;
            const selected = relatedServices.slice(0, limit);

            if (!selected.length) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = selected.map((item) => {
                return `
                    <a href="${escapeHtml(item.url)}">
                        <span>${escapeHtml(item.title)}</span>
                        ${createIcon('arrow-up-right')}
                    </a>
                `;
            }).join('');
        });

        refreshUi();
    };

    const setupReasonCards = () => {
        const cards = qsa('.service-reason-card');

        if (!cards.length) return;

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                cards.forEach((item) => item.classList.remove('is-active'));
                card.classList.add('is-active');
            });

            card.addEventListener('focusin', () => {
                cards.forEach((item) => item.classList.remove('is-active'));
                card.classList.add('is-active');
            });
        });
    };

    const setupInsightSlider = () => {
        const slide = qs('[data-service-insight-slide]');
        const count = qs('[data-service-insight-count]');
        const title = qs('[data-service-insight-title]');
        const text = qs('[data-service-insight-text]');
        const prev = qs('[data-service-insight-prev]');
        const next = qs('[data-service-insight-next]');
        const dots = qsa('[data-service-insight-dot]');
        const section = qs('.service-insight');

        if (!slide || !count || !title || !text || !prev || !next || !dots.length) return;

        const service = getCurrentService();

        const defaultItems = [
            {
                count: '01',
                title: 'Start with the request category.',
                text: 'A clear category helps participating providers understand the general request focus before they respond.'
            },
            {
                count: '02',
                title: 'Compare provider-supplied details.',
                text: 'Ask about scope, timing, pricing approach, materials, access needs, cleanup, warranties, and service terms.'
            },
            {
                count: '03',
                title: 'Choose whether to continue.',
                text: 'Submitting a request does not require you to hire anyone. The homeowner decides what happens next.'
            }
        ];

        const serviceSpecific = {
            'gutter-installation': [
                {
                    count: '01',
                    title: 'New-system details matter.',
                    text: 'For installation requests, homeowners may compare provider-supplied information about layout, material type, color, size, downspout placement, and timing.'
                },
                {
                    count: '02',
                    title: 'Property access can affect discussion.',
                    text: 'Roofline height, ground access, landscaping, fascia condition, and home shape may influence what providers ask before offering details.'
                },
                {
                    count: '03',
                    title: 'Confirm what is included.',
                    text: 'Ask whether removal, cleanup, downspouts, extensions, fastening, sealant, and warranty terms are included in the provider-supplied scope.'
                }
            ],
            'gutter-replacement': [
                {
                    count: '01',
                    title: 'Old-system condition can vary.',
                    text: 'Replacement discussions may involve rust, sagging, separation, repeated leaks, poor slope, fascia concerns, or outdated materials.'
                },
                {
                    count: '02',
                    title: 'Ask about removal and disposal.',
                    text: 'Before continuing, confirm whether old gutter removal, disposal, cleanup, and site protection are included in provider-supplied terms.'
                },
                {
                    count: '03',
                    title: 'Review new-system options.',
                    text: 'Providers may discuss different materials, colors, sizes, downspout layouts, guards, and drainage add-ons depending on availability.'
                }
            ],
            'gutter-repair': [
                {
                    count: '01',
                    title: 'Repair requests need clear symptoms.',
                    text: 'Describe leaks, sagging, detached sections, overflowing areas, loose fasteners, joint issues, or water flow concerns as clearly as possible.'
                },
                {
                    count: '02',
                    title: 'Some issues may require replacement.',
                    text: 'Providers may determine that a repair, partial replacement, adjustment, or other option is more suitable after reviewing the condition.'
                },
                {
                    count: '03',
                    title: 'Ask what the repair includes.',
                    text: 'Confirm whether sealing, fastening, slope adjustment, section replacement, downspout work, or follow-up terms are included.'
                }
            ],
            'gutter-cleaning': [
                {
                    count: '01',
                    title: 'Cleaning depends on debris conditions.',
                    text: 'Leaves, roof debris, blocked downspouts, overflow points, and property access can affect provider-supplied cleaning discussions.'
                },
                {
                    count: '02',
                    title: 'Ask about downspout clearing.',
                    text: 'Some cleaning requests may include downspout clearing, debris removal, flushing, or inspection-style observations depending on the provider.'
                },
                {
                    count: '03',
                    title: 'Consider maintenance timing.',
                    text: 'Season, nearby trees, roof shape, and previous overflow may influence how often homeowners choose to request cleaning.'
                }
            ],
            'gutter-guards': [
                {
                    count: '01',
                    title: 'Guard options can vary.',
                    text: 'Providers may discuss different guard styles, fit, material compatibility, cleaning needs, and whether the current gutter system is suitable.'
                },
                {
                    count: '02',
                    title: 'Existing gutters may need review.',
                    text: 'Before guard installation discussions, providers may consider gutter condition, slope, fastening, debris level, and downspout flow.'
                },
                {
                    count: '03',
                    title: 'Clarify maintenance expectations.',
                    text: 'Ask what maintenance, cleaning, product terms, and warranty information apply to any provider-supplied gutter guard option.'
                }
            ],
            'downspout-drainage': [
                {
                    count: '01',
                    title: 'Water direction is the focus.',
                    text: 'Drainage requests may involve downspout placement, extensions, discharge direction, splash blocks, pooling, or foundation-adjacent water concerns.'
                },
                {
                    count: '02',
                    title: 'Property layout matters.',
                    text: 'Slope, landscaping, walkways, soil, basement concerns, and nearby surfaces may affect the provider-supplied discussion.'
                },
                {
                    count: '03',
                    title: 'Confirm the provider scope.',
                    text: 'Ask whether the provider discusses only downspout adjustments or broader exterior drainage options, and what is included.'
                }
            ]
        };

        const items = service && serviceSpecific[service.id]
            ? serviceSpecific[service.id]
            : defaultItems;

        let activeIndex = 0;
        let autoTimer = null;

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === activeIndex);
            });
        };

        const setSlide = (index) => {
            activeIndex = (index + items.length) % items.length;
            const item = items[activeIndex];

            slide.classList.add('is-changing');

            window.setTimeout(() => {
                count.textContent = item.count;
                title.textContent = item.title;
                text.textContent = item.text;

                updateDots();
                refreshUi();
            }, 120);

            window.setTimeout(() => {
                slide.classList.remove('is-changing');
            }, 300);
        };

        const stopAuto = () => {
            if (autoTimer) {
                window.clearInterval(autoTimer);
                autoTimer = null;
            }
        };

        const startAuto = () => {
            stopAuto();

            autoTimer = window.setInterval(() => {
                setSlide(activeIndex + 1);
            }, 5600);
        };

        prev.addEventListener('click', () => {
            stopAuto();
            setSlide(activeIndex - 1);
            startAuto();
        });

        next.addEventListener('click', () => {
            stopAuto();
            setSlide(activeIndex + 1);
            startAuto();
        });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number(dot.getAttribute('data-service-insight-dot'));

                stopAuto();
                setSlide(index);
                startAuto();
            });
        });

        if (section) {
            section.addEventListener('mouseenter', stopAuto);
            section.addEventListener('mouseleave', startAuto);
            section.addEventListener('focusin', stopAuto);
            section.addEventListener('focusout', startAuto);
        }

        setSlide(0);
        startAuto();
    };

    const setupDecisionContactLinks = () => {
        const service = getCurrentService();

        if (!service) return;

        qsa('[data-service-contact-link]').forEach((link) => {
            const url = new URL('contact.html', window.location.href);
            url.searchParams.set('service', service.id);
            link.href = url.pathname.split('/').pop() + url.search;
        });
    };

    const setupPhotoHover = () => {
        const groups = qsa('.service-overview__photos, .service-decision__photo, .service-insight__photo-card');

        groups.forEach((group) => {
            group.addEventListener('mouseenter', () => {
                group.classList.add('is-hovered');
            });

            group.addEventListener('mouseleave', () => {
                group.classList.remove('is-hovered');
            });
        });
    };

    const init = () => {
        hydrateServiceData();
        renderRelatedLinks();
        setupReasonCards();
        setupInsightSlider();
        setupDecisionContactLinks();
        setupPhotoHover();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
