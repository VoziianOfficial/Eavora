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

    const setupWhyPoints = () => {
        const buttons = qsa('[data-about-point]');
        const answer = qs('.about-why__answer');
        const label = qs('[data-about-point-label]');
        const text = qs('[data-about-point-text]');

        if (!buttons.length || !answer || !label || !text) return;

        const points = [
            {
                label: 'Structured request starting point',
                text: 'Eavora helps turn an unclear gutter concern into a more organized request category before provider contact begins.'
            },
            {
                label: 'Clearer request language',
                text: 'Homeowners can describe what they noticed around the home, choose the closest category, and avoid starting with a vague message.'
            },
            {
                label: 'Provider-supplied options',
                text: 'Participating providers may respond with their own availability, scope details, pricing approach, timing, and service terms.'
            },
            {
                label: 'Homeowner choice stays central',
                text: 'Submitting a request does not require you to hire anyone. You decide whether the provider-supplied details make sense for you.'
            }
        ];

        const setPoint = (index) => {
            const point = points[index];
            if (!point) return;

            answer.classList.add('is-changing');

            window.setTimeout(() => {
                label.textContent = point.label;
                text.textContent = point.text;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });
            }, 120);

            window.setTimeout(() => {
                answer.classList.remove('is-changing');
            }, 260);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-about-point'));

            button.addEventListener('click', () => setPoint(index));

            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setPoint(index);
                }
            });
        });

        setPoint(0);
    };

    const setupModelCards = () => {
        const cards = qsa('.about-model__card');

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

    const setupCategoryPanel = () => {
        const buttons = qsa('[data-about-category]');
        const panel = qs('.about-organize__panel');
        const image = qs('[data-about-category-image]');
        const count = qs('[data-about-category-count]');
        const title = qs('[data-about-category-title]');
        const text = qs('[data-about-category-text]');
        const link = qs('[data-about-category-link]');

        if (!buttons.length || !panel || !image || !count || !title || !text || !link) return;

        const categories = [
            {
                count: '01',
                title: 'New gutter systems',
                text: 'Homeowners can start a request for new gutter system options and review provider-supplied information before continuing.',
                image: 'assets/images/service-1.jpg',
                alt: 'New gutter system on a residential home',
                url: 'gutter-installation.html'
            },
            {
                count: '02',
                title: 'Damaged gutter replacement',
                text: 'Older, rusted, sagging, or repeatedly failing gutter systems may fit a replacement-related provider discussion.',
                image: 'assets/images/service-2.jpg',
                alt: 'Older gutter system on a home exterior',
                url: 'gutter-replacement.html'
            },
            {
                count: '03',
                title: 'Clogged or overflowing gutters',
                text: 'Leaves, debris, overflow, and blocked downspouts can be organized as a cleaning or repair-related request depending on the situation.',
                image: 'assets/images/service-4.jpg',
                alt: 'Leaves and debris near a gutter line',
                url: 'gutter-cleaning.html'
            },
            {
                count: '04',
                title: 'Gutter protection',
                text: 'Homeowners can compare provider-supplied discussions around gutter guard options, debris reduction, and maintenance-focused upgrades.',
                image: 'assets/images/service-5.jpg',
                alt: 'Gutter guard protection detail',
                url: 'gutter-guards.html'
            },
            {
                count: '05',
                title: 'Downspout and drainage concerns',
                text: 'Water draining too close to the foundation, poor flow direction, or extension needs may fit a downspout and drainage-related request.',
                image: 'assets/images/service-6.jpg',
                alt: 'Downspout and exterior drainage near a home',
                url: 'downspout-drainage.html'
            }
        ];

        const setCategory = (index) => {
            const category = categories[index];
            if (!category) return;

            panel.classList.add('is-changing');

            window.setTimeout(() => {
                count.textContent = category.count;
                title.textContent = category.title;
                text.textContent = category.text;
                image.src = category.image;
                image.alt = category.alt;
                link.href = category.url;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });

                refreshUi();
            }, 120);

            window.setTimeout(() => {
                panel.classList.remove('is-changing');
            }, 300);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-about-category'));

            button.addEventListener('click', () => setCategory(index));

            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setCategory(index);
                }
            });
        });

        setCategory(0);
    };

    const setupControlCards = () => {
        const buttons = qsa('[data-about-control]');
        const content = qs('.about-control__content');
        const photo = qs('.about-control__photo');
        const image = qs('[data-about-control-image]');
        const text = qs('[data-about-control-text]');

        if (!buttons.length || !content || !photo || !image || !text) return;

        const controlItems = [
            {
                text: 'Eavora helps homeowners compare available provider-supplied information. You can ask questions, review terms, and decide whether to continue.',
                image: 'assets/images/hero-services.jpg',
                alt: 'Home exterior with gutter and roofline'
            },
            {
                text: 'Before continuing with a provider, you can ask about scope, timing, quote details, materials, cleanup, warranties, and credentials where required.',
                image: 'assets/images/service-3.jpg',
                alt: 'Gutter detail for repair-related provider questions'
            },
            {
                text: 'Provider terms can vary. Homeowners should review pricing, scheduling, warranties, service terms, licensing, insurance, and availability directly with the provider.',
                image: 'assets/images/service-2.jpg',
                alt: 'Residential gutter system for provider term review'
            },
            {
                text: 'The homeowner decides whether to continue with any provider. Eavora does not force a service agreement and does not guarantee provider work.',
                image: 'assets/images/service-1.jpg',
                alt: 'Clean residential gutter system and roofline'
            }
        ];

        const setControl = (index) => {
            const item = controlItems[index];
            if (!item) return;

            content.classList.add('is-changing');
            photo.classList.add('is-changing');

            window.setTimeout(() => {
                text.textContent = item.text;
                image.src = item.image;
                image.alt = item.alt;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });

                refreshUi();
            }, 130);

            window.setTimeout(() => {
                content.classList.remove('is-changing');
                photo.classList.remove('is-changing');
            }, 300);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-about-control'));

            button.addEventListener('click', () => setControl(index));

            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setControl(index);
                }
            });
        });

        setControl(0);
    };

    const setupFactorsAccordion = () => {
        const items = qsa('.about-factors__item');

        if (!items.length) return;

        items.forEach((item) => {
            const button = qs('[data-about-factor]', item);

            if (!button) return;

            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                items.forEach((otherItem) => {
                    otherItem.classList.remove('is-open');
                });

                if (!isOpen) {
                    item.classList.add('is-open');
                }
            });
        });
    };

    const setupTrustDetails = () => {
        const detailsItems = qsa('.about-trust__note');

        if (!detailsItems.length) return;

        detailsItems.forEach((item) => {
            item.addEventListener('toggle', () => {
                refreshUi();
            });
        });
    };

    const init = () => {
        setupWhyPoints();
        setupModelCards();
        setupCategoryPanel();
        setupControlCards();
        setupFactorsAccordion();
        setupTrustDetails();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();