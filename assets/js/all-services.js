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

    const setupCategoryFinder = () => {
        const buttons = qsa('[data-services-finder]');
        const visual = qs('.services-finder__visual');
        const image = qs('[data-services-finder-image]');
        const number = qs('[data-services-finder-number]');
        const topic = qs('[data-services-finder-topic]');
        const title = qs('[data-services-finder-title]');
        const text = qs('[data-services-finder-text]');
        const link = qs('[data-services-finder-link]');

        if (!buttons.length || !visual || !image || !number || !topic || !title || !text || !link) return;

        const items = [
            {
                number: '01',
                topic: 'Gutter Installation',
                title: 'Gutter Installation',
                text: 'A new system request may fit gutter installation options from participating local providers.',
                image: 'assets/images/service-1.jpg',
                alt: 'New gutter system on a residential exterior',
                url: 'gutter-installation.html'
            },
            {
                number: '02',
                topic: 'Gutter Repair',
                title: 'Gutter Repair',
                text: 'Leaks, loose joints, detached sections, or poor water flow may fit a gutter repair-related provider request.',
                image: 'assets/images/service-3.jpg',
                alt: 'Gutter repair related roofline detail',
                url: 'gutter-repair.html'
            },
            {
                number: '03',
                topic: 'Gutter Repair or Drainage',
                title: 'Gutter Repair',
                text: 'Overflow during rain may involve clogs, poor slope, loose sections, downspout issues, or drainage direction concerns.',
                image: 'assets/images/service-6.jpg',
                alt: 'Downspout and drainage detail near a home',
                url: 'gutter-repair.html'
            },
            {
                number: '04',
                topic: 'Gutter Cleaning',
                title: 'Gutter Cleaning',
                text: 'Repeated leaf buildup, debris, and blocked lines often fit a gutter cleaning-related provider request.',
                image: 'assets/images/service-4.jpg',
                alt: 'Leaves and debris near a gutter system',
                url: 'gutter-cleaning.html'
            },
            {
                number: '05',
                topic: 'Downspout & Drainage',
                title: 'Downspout & Drainage',
                text: 'Water draining too close to the foundation may fit a downspout extension, flow direction, or exterior drainage request.',
                image: 'assets/images/service-6.jpg',
                alt: 'Exterior drainage and downspout detail',
                url: 'downspout-drainage.html'
            }
        ];

        const setActive = (index) => {
            const item = items[index];
            if (!item) return;

            visual.classList.add('is-changing');

            window.setTimeout(() => {
                number.textContent = item.number;
                topic.textContent = item.topic;
                title.textContent = item.title;
                text.textContent = item.text;
                image.src = item.image;
                image.alt = item.alt;
                link.href = item.url;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });

                refreshUi();
            }, 120);

            window.setTimeout(() => {
                visual.classList.remove('is-changing');
            }, 300);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-services-finder'));

            button.addEventListener('click', () => setActive(index));

            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setActive(index);
                }
            });
        });

        setActive(0);
    };

    const setupScopeComparison = () => {
        const photos = qsa('[data-scope-photo]');
        const headings = qsa('[data-scope-heading]');

        if (!photos.length || !headings.length) return;

        const setScope = (index) => {
            photos.forEach((photo, photoIndex) => {
                photo.classList.toggle('is-active', photoIndex === index);
            });

            headings.forEach((heading, headingIndex) => {
                heading.classList.toggle('is-active', headingIndex === index);
            });
        };

        headings.forEach((heading) => {
            const index = Number(heading.getAttribute('data-scope-heading'));

            heading.addEventListener('click', () => setScope(index));

            heading.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setScope(index);
                }
            });
        });

        photos.forEach((photo) => {
            const index = Number(photo.getAttribute('data-scope-photo'));

            photo.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setScope(index);
                }
            });

            photo.addEventListener('focusin', () => setScope(index));
        });

        setScope(0);
    };

    const setupBeforeProviderSlider = () => {
        const slide = qs('[data-before-slide]');
        const count = qs('[data-before-count]');
        const title = qs('[data-before-title]');
        const text = qs('[data-before-text]');
        const prev = qs('[data-before-prev]');
        const next = qs('[data-before-next]');
        const dots = qsa('[data-before-dot]');
        const section = qs('.services-before');

        if (!slide || !count || !title || !text || !prev || !next || !dots.length) return;

        const items = [
            {
                count: '01',
                title: 'Estimate details',
                text: 'Ask what is included, what may change after provider review, and whether there are separate material or access considerations.'
            },
            {
                count: '02',
                title: 'Timing',
                text: 'Provider availability may vary by season, location, request category, and current workload. Confirm scheduling directly with the provider.'
            },
            {
                count: '03',
                title: 'Materials',
                text: 'For installation, replacement, guards, or drainage requests, ask what material, size, color, and configuration options the provider discusses.'
            },
            {
                count: '04',
                title: 'Cleanup',
                text: 'Ask whether cleanup, debris handling, old material removal, or site preparation is included in the provider-supplied scope.'
            },
            {
                count: '05',
                title: 'Licensing and insurance',
                text: 'Homeowners are responsible for verifying that any hired provider furnishes the license and insurance required for the work being performed.'
            },
            {
                count: '06',
                title: 'Warranties',
                text: 'Any workmanship, product, maintenance, or follow-up warranty terms are provider-supplied and should be reviewed directly before hiring.'
            }
        ];

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
            }, 5200);
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
                const index = Number(dot.getAttribute('data-before-dot'));

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

    const setupDirectoryHoverFocus = () => {
        const cards = qsa('.services-directory__card');

        cards.forEach((card) => {
            card.addEventListener('focusin', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('focusout', () => {
                card.classList.remove('is-focused');
            });
        });
    };

    const init = () => {
        setupCategoryFinder();
        setupScopeComparison();
        setupBeforeProviderSlider();
        setupDirectoryHoverFocus();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();