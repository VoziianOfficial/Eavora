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

    const setText = (selector, value) => {
        const element = qs(selector);
        if (element) element.textContent = value;
    };

    const setHref = (selector, value) => {
        const element = qs(selector);
        if (element) element.setAttribute('href', value);
    };

    const setupNeedSlider = () => {
        const image = qs('[data-home-need-image]');
        const title = qs('[data-home-need-title]');
        const text = qs('[data-home-need-text]');
        const link = qs('[data-home-need-link]');
        const media = qs('.home-need__photo');
        const content = qs('.home-need__content');
        const prev = qs('[data-home-need-prev]');
        const next = qs('[data-home-need-next]');
        const dots = qsa('[data-home-need-dot]');
        const tabs = qsa('[data-home-need-tab]');

        if (!image || !title || !text || !link || !prev || !next) return;

        const slides = [
            {
                title: 'Gutter Installation',
                text: 'Start a request for new gutter system installation options and review provider-supplied information before continuing.',
                image: 'assets/images/service-1.jpg',
                alt: 'New gutter system on a clean home exterior',
                url: 'gutter-installation.html'
            },
            {
                title: 'Gutter Replacement',
                text: 'Compare provider options for old, rusted, sagging, damaged, or inefficient gutter systems.',
                image: 'assets/images/service-2.jpg',
                alt: 'Existing gutter system on a residential roofline',
                url: 'gutter-replacement.html'
            },
            {
                title: 'Gutter Repair',
                text: 'Organize requests related to leaks, loose sections, sagging gutters, detached pieces, joint issues, or poor water flow.',
                image: 'assets/images/service-3.jpg',
                alt: 'Close view of gutter repair related roofline detail',
                url: 'gutter-repair.html'
            },
            {
                title: 'Gutter Cleaning',
                text: 'Find available local provider options for clogged gutters, leaf buildup, debris removal, and seasonal cleaning requests.',
                image: 'assets/images/service-4.jpg',
                alt: 'Leaves and debris near a gutter system',
                url: 'gutter-cleaning.html'
            },
            {
                title: 'Gutter Guards',
                text: 'Compare provider-supplied gutter guard discussions, leaf protection options, debris reduction, and maintenance-focused upgrades.',
                image: 'assets/images/service-5.jpg',
                alt: 'Gutter guard style exterior detail',
                url: 'gutter-guards.html'
            },
            {
                title: 'Downspout & Drainage',
                text: 'Start a request for downspout extensions, water flow improvement, drainage direction, and foundation water-control concerns.',
                image: 'assets/images/service-6.jpg',
                alt: 'Downspout and exterior drainage detail',
                url: 'downspout-drainage.html'
            }
        ];

        let activeIndex = 0;
        let autoTimer = null;

        const updateActiveControls = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === activeIndex);
            });

            tabs.forEach((tab, index) => {
                tab.classList.toggle('is-active', index === activeIndex);
            });
        };

        const applySlide = (index) => {
            activeIndex = (index + slides.length) % slides.length;
            const slide = slides[activeIndex];

            media?.classList.add('is-changing');
            content?.classList.add('is-changing');

            window.setTimeout(() => {
                image.src = slide.image;
                image.alt = slide.alt;
                title.textContent = slide.title;
                text.textContent = slide.text;
                link.href = slide.url;

                updateActiveControls();
                refreshUi();
            }, 130);

            window.setTimeout(() => {
                media?.classList.remove('is-changing');
                content?.classList.remove('is-changing');
            }, 280);
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
                applySlide(activeIndex + 1);
            }, 5600);
        };

        prev.addEventListener('click', () => {
            stopAuto();
            applySlide(activeIndex - 1);
            startAuto();
        });

        next.addEventListener('click', () => {
            stopAuto();
            applySlide(activeIndex + 1);
            startAuto();
        });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number(dot.getAttribute('data-home-need-dot'));

                stopAuto();
                applySlide(index);
                startAuto();
            });
        });

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const index = Number(tab.getAttribute('data-home-need-tab'));

                stopAuto();
                applySlide(index);
                startAuto();
            });
        });

        const section = qs('.home-need');

        if (section) {
            section.addEventListener('mouseenter', stopAuto);
            section.addEventListener('mouseleave', startAuto);
            section.addEventListener('focusin', stopAuto);
            section.addEventListener('focusout', startAuto);
        }

        applySlide(0);
        startAuto();
    };

    const setupModelTabs = () => {
        const tabs = qsa('[data-home-model-tab]');
        const panel = qs('.home-model__panel');

        if (!tabs.length || !panel) return;

        const data = [
            {
                count: '01',
                title: 'Submit structured gutter request details.',
                text: 'Choose the gutter-related category, share what is happening around the property, and send a clear request through Eavora.',
                note: 'The more clearly your request is described, the easier it is for participating providers to understand the category and context.',
                icon: 'clipboard-list'
            },
            {
                count: '02',
                title: 'Participating providers may respond where available.',
                text: 'Eavora helps route the request as a matching platform. Provider availability, response timing, and category coverage may vary by area.',
                note: 'Eavora does not assign its own crew, perform inspections, provide estimates, or guarantee provider participation.',
                icon: 'network'
            },
            {
                count: '03',
                title: 'Compare provider-supplied options before continuing.',
                text: 'Review the details providers share, ask questions about scope and terms, and decide whether moving forward makes sense for you.',
                note: 'Final pricing, scheduling, warranties, insurance, licensing, and service terms are provided by the provider, not by Eavora.',
                icon: 'messages-square'
            }
        ];

        const setActiveTab = (index) => {
            const item = data[index];
            if (!item) return;

            panel.classList.add('is-changing');

            window.setTimeout(() => {
                setText('[data-home-model-count]', item.count);
                setText('[data-home-model-title]', item.title);
                setText('[data-home-model-text]', item.text);
                setText('[data-home-model-note]', item.note);

                const iconWrap = qs('[data-home-model-icon]');
                if (iconWrap) {
                    iconWrap.setAttribute('data-lucide', item.icon);
                }

                tabs.forEach((tab, tabIndex) => {
                    const isActive = tabIndex === index;
                    tab.classList.toggle('is-active', isActive);
                    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });

                refreshUi();
            }, 130);

            window.setTimeout(() => {
                panel.classList.remove('is-changing');
            }, 280);
        };

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const index = Number(tab.getAttribute('data-home-model-tab'));
                setActiveTab(index);
            });
        });

        setActiveTab(0);
    };

    const setupProblemFinder = () => {
        const buttons = qsa('[data-home-problem]');
        const result = qs('.home-finder__result');
        const image = qs('[data-home-problem-image]');
        const title = qs('[data-home-problem-title]');
        const text = qs('[data-home-problem-text]');
        const link = qs('[data-home-problem-link]');

        if (!buttons.length || !result || !image || !title || !text || !link) return;

        const problems = [
            {
                title: 'Gutter Repair',
                text: 'Overflow can be connected to poor flow, joint issues, slope problems, or blocked sections. A repair-related request may be a useful starting point.',
                image: 'assets/images/service-3.jpg',
                alt: 'Gutter repair category detail',
                url: 'gutter-repair.html'
            },
            {
                title: 'Gutter Repair',
                text: 'Sagging gutters, loose brackets, detached sections, and uneven lines usually fit a repair-related provider discussion.',
                image: 'assets/images/service-3.jpg',
                alt: 'Sagging gutter section on a home',
                url: 'gutter-repair.html'
            },
            {
                title: 'Gutter Cleaning',
                text: 'Leaves, debris, and blocked downspouts may fit a gutter cleaning-related request, especially before or after heavy seasonal buildup.',
                image: 'assets/images/service-4.jpg',
                alt: 'Leaves collected near a gutter line',
                url: 'gutter-cleaning.html'
            },
            {
                title: 'Gutter Repair',
                text: 'Leaking joints, seams, corners, or detached areas can be organized as a gutter repair-related request for provider discussion.',
                image: 'assets/images/service-3.jpg',
                alt: 'Gutter joint detail near a roofline',
                url: 'gutter-repair.html'
            },
            {
                title: 'Gutter Replacement',
                text: 'Old, rusted, bent, or repeatedly failing gutter systems may fit a replacement-related provider request.',
                image: 'assets/images/service-2.jpg',
                alt: 'Older gutter system on a residential exterior',
                url: 'gutter-replacement.html'
            },
            {
                title: 'Downspout & Drainage',
                text: 'Water pooling near the foundation may fit a downspout or drainage-related request involving flow direction and extension discussion.',
                image: 'assets/images/service-6.jpg',
                alt: 'Downspout drainage near a home foundation',
                url: 'downspout-drainage.html'
            }
        ];

        const setProblem = (index) => {
            const problem = problems[index];
            if (!problem) return;

            result.classList.add('is-changing');

            window.setTimeout(() => {
                image.src = problem.image;
                image.alt = problem.alt;
                title.textContent = problem.title;
                text.textContent = problem.text;
                link.href = problem.url;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });

                refreshUi();
            }, 130);

            window.setTimeout(() => {
                result.classList.remove('is-changing');
            }, 300);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-home-problem'));

            button.addEventListener('click', () => setProblem(index));
            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setProblem(index);
                }
            });
        });

        setProblem(0);
    };

    const setupCompareAccordion = () => {
        const items = qsa('.home-compare__item');

        if (!items.length) return;

        items.forEach((item) => {
            const button = qs('[data-home-compare]', item);

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

    const setupSeasonalTabs = () => {
        const tabs = qsa('[data-season-tab]');
        const panel = qs('.home-seasonal__panel');

        if (!tabs.length || !panel) return;

        const seasonal = [
            {
                title: 'Overflow and water direction concerns',
                text: 'Heavy rain can reveal overflowing gutters, poor flow, drainage direction issues, or water collecting near the foundation.',
                url: 'downspout-drainage.html',
                image: 'assets/images/service-6.jpg'
            },
            {
                title: 'Leaves, clogs, and guard discussions',
                text: 'Leaf season can create cleaning requests, blocked downspout concerns, and gutter guard discussions for future debris reduction.',
                url: 'gutter-cleaning.html',
                image: 'assets/images/service-4.jpg'
            },
            {
                title: 'Loose sections and storm-related requests',
                text: 'Storms may lead homeowners to organize requests around loose gutters, detached sections, damaged joints, or downspout issues.',
                url: 'gutter-repair.html',
                image: 'assets/images/service-3.jpg'
            },
            {
                title: 'Pre-season gutter and drainage planning',
                text: 'Before winter, homeowners may compare cleaning, guard, repair, and water-direction options with participating providers.',
                url: 'gutter-guards.html',
                image: 'assets/images/service-5.jpg'
            }
        ];

        const setSeason = (index) => {
            const item = seasonal[index];
            if (!item) return;

            panel.classList.add('is-changing');

            window.setTimeout(() => {
                setText('[data-season-title]', item.title);
                setText('[data-season-text]', item.text);
                setHref('[data-season-link]', item.url);

                panel.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("${item.image}")`;

                tabs.forEach((tab, tabIndex) => {
                    tab.classList.toggle('is-active', tabIndex === index);
                });

                refreshUi();
            }, 130);

            window.setTimeout(() => {
                panel.classList.remove('is-changing');
            }, 300);
        };

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const index = Number(tab.getAttribute('data-season-tab'));
                setSeason(index);
            });
        });

        setSeason(0);
    };

    const setupProcessHover = () => {
        const steps = qsa('.home-process__step');

        if (!steps.length) return;

        steps.forEach((step) => {
            step.addEventListener('mouseenter', () => {
                steps.forEach((item) => item.classList.remove('is-active'));
                step.classList.add('is-active');
            });

            step.addEventListener('focusin', () => {
                steps.forEach((item) => item.classList.remove('is-active'));
                step.classList.add('is-active');
            });
        });
    };

    const init = () => {
        setupNeedSlider();
        setupModelTabs();
        setupProblemFinder();
        setupCompareAccordion();
        setupSeasonalTabs();
        setupProcessHover();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();