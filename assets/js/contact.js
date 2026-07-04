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

    const setFieldError = (field, hasError) => {
        const wrapper = field.closest('.form-field') || field.closest('.checkbox-field');

        if (wrapper) {
            wrapper.classList.toggle('has-error', hasError);
        }

        field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    };

    const showFormMessage = (form, message, type) => {
        const messageBox = qs('[data-form-message]', form);

        if (!messageBox) return;

        messageBox.textContent = message;
        messageBox.className = `form-message is-visible is-${type}`;
    };

    const clearFormMessage = (form) => {
        const messageBox = qs('[data-form-message]', form);

        if (!messageBox) return;

        messageBox.textContent = '';
        messageBox.className = 'form-message';
    };

    const validateForm = (form) => {
        let isValid = true;

        const fullName = qs('[name="fullName"]', form);
        const email = qs('[name="email"]', form);
        const service = qs('[name="service"]', form);
        const consent = qs('[name="privacyConsent"]', form);

        if (fullName) {
            const hasError = fullName.value.trim().length < 2;
            setFieldError(fullName, hasError);
            if (hasError) isValid = false;
        }

        if (email) {
            const hasError = !isValidEmail(email.value);
            setFieldError(email, hasError);
            if (hasError) isValid = false;
        }

        if (service) {
            const hasError = !service.value.trim();
            setFieldError(service, hasError);
            if (hasError) isValid = false;
        }

        if (consent) {
            const hasError = !consent.checked;
            setFieldError(consent, hasError);
            if (hasError) isValid = false;
        }

        return isValid;
    };

    const setupLiveValidation = (form) => {
        const fields = qsa('input, select, textarea', form);

        fields.forEach((field) => {
            field.addEventListener('input', () => {
                if (field.name === 'fullName') {
                    setFieldError(field, field.value.trim().length < 2);
                }

                if (field.name === 'email') {
                    setFieldError(field, !isValidEmail(field.value));
                }

                if (field.name === 'service') {
                    setFieldError(field, !field.value.trim());
                }
            });

            field.addEventListener('change', () => {
                if (field.name === 'privacyConsent') {
                    setFieldError(field, !field.checked);
                }

                if (field.name === 'service') {
                    setFieldError(field, !field.value.trim());
                }
            });
        });
    };

    const setupContactForm = () => {
        const form = qs('[data-contact-form]');

        if (!form) return;

        const startedAt = qs('[name="formStartedAt"]', form);
        if (startedAt && !startedAt.value) {
            startedAt.value = String(Date.now());
        }

        setupLiveValidation(form);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearFormMessage(form);

            const isValid = validateForm(form);

            if (!isValid) {
                showFormMessage(form, 'Please check the required fields and try again.', 'error');

                const firstInvalid = qs('[aria-invalid="true"]', form);
                if (firstInvalid) firstInvalid.focus();

                return;
            }

            const submitButton = qs('[type="submit"]', form);
            const originalButtonText = submitButton ? submitButton.textContent.trim() : '';

            form.classList.add('is-submitting');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.querySelector('span').textContent = 'Sending';
            }

            try {
                const formData = new FormData(form);

                const response = await fetch(form.getAttribute('action') || 'contact.php', {
                    method: form.getAttribute('method') || 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                let result = null;

                try {
                    result = await response.json();
                } catch (jsonError) {
                    result = {
                        success: false,
                        message: 'Please check the required fields and try again.'
                    };
                }

                if (!response.ok || !result.success) {
                    showFormMessage(
                        form,
                        result.message || 'Please check the required fields and try again.',
                        'error'
                    );
                    return;
                }

                showFormMessage(
                    form,
                    result.message || 'Thank you. Your request has been received.',
                    'success'
                );

                form.reset();

                if (startedAt) {
                    startedAt.value = String(Date.now());
                }

                qsa('.has-error', form).forEach((element) => {
                    element.classList.remove('has-error');
                });

                qsa('[aria-invalid="true"]', form).forEach((element) => {
                    element.setAttribute('aria-invalid', 'false');
                });
            } catch (error) {
                showFormMessage(
                    form,
                    'Please check your connection and try again. The form requires a PHP-enabled server to send.',
                    'error'
                );
            } finally {
                form.classList.remove('is-submitting');

                if (submitButton) {
                    submitButton.disabled = false;

                    const span = submitButton.querySelector('span');
                    if (span) {
                        span.textContent = originalButtonText || 'Submit Request';
                    }
                }
            }
        });
    };

    const setupCategoryHelper = () => {
        const buttons = qsa('[data-contact-helper]');
        const panel = qs('.contact-helper__panel');
        const label = qs('[data-contact-helper-label]');
        const title = qs('[data-contact-helper-title]');
        const text = qs('[data-contact-helper-text]');
        const serviceSelect = qs('[name="service"]');

        if (!buttons.length || !panel || !label || !title || !text) return;

        const categories = [
            {
                label: 'Installation',
                title: 'New gutter system request',
                text: 'Use this category when you want to start a request for a new gutter system discussion with participating providers.',
                value: 'Gutter Installation'
            },
            {
                label: 'Replacement',
                title: 'Old or damaged gutter system',
                text: 'Use this category for old, rusted, sagging, damaged, or inefficient gutter systems that may need replacement discussion.',
                value: 'Gutter Replacement'
            },
            {
                label: 'Repair',
                title: 'Leaks, sagging, joints, or loose sections',
                text: 'Use this category for repair-related concerns such as leaking joints, loose sections, sagging gutters, detached areas, or poor flow.',
                value: 'Gutter Repair'
            },
            {
                label: 'Cleaning',
                title: 'Clogs, leaves, or seasonal debris',
                text: 'Use this category for clogged gutters, leaf buildup, blocked downspouts, debris removal, and seasonal gutter cleaning requests.',
                value: 'Gutter Cleaning'
            },
            {
                label: 'Guards',
                title: 'Leaf protection or debris reduction',
                text: 'Use this category for gutter guard discussions, leaf protection, debris reduction, and maintenance-focused upgrade requests.',
                value: 'Gutter Guards'
            },
            {
                label: 'Drainage',
                title: 'Downspout and water direction concerns',
                text: 'Use this category for downspout extensions, water flow direction, foundation water-control concerns, and exterior drainage requests.',
                value: 'Downspout & Drainage Solutions'
            }
        ];

        const setCategory = (index, shouldFillSelect = false) => {
            const category = categories[index];

            if (!category) return;

            panel.classList.add('is-changing');

            window.setTimeout(() => {
                label.textContent = category.label;
                title.textContent = category.title;
                text.textContent = category.text;

                buttons.forEach((button, buttonIndex) => {
                    button.classList.toggle('is-active', buttonIndex === index);
                });

                if (shouldFillSelect && serviceSelect) {
                    serviceSelect.value = category.value;

                    if (!serviceSelect.value) {
                        const matchingOption = Array.from(serviceSelect.options).find((option) => {
                            return option.textContent.trim() === category.value;
                        });

                        if (matchingOption) {
                            serviceSelect.value = matchingOption.value;
                        }
                    }

                    serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }

                refreshUi();
            }, 120);

            window.setTimeout(() => {
                panel.classList.remove('is-changing');
            }, 300);
        };

        buttons.forEach((button) => {
            const index = Number(button.getAttribute('data-contact-helper'));

            button.addEventListener('click', () => {
                setCategory(index, true);

                const formSection = qs('#request-form');
                if (formSection) {
                    window.setTimeout(() => {
                        formSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 160);
                }
            });

            button.addEventListener('mouseenter', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    setCategory(index, false);
                }
            });
        });

        setCategory(0, false);
    };

    const setupAfterSubmitCards = () => {
        const cards = qsa('.contact-after-card');

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

    const setupServiceParam = () => {
        const params = new URLSearchParams(window.location.search);
        const service = params.get('service');
        const serviceSelect = qs('[name="service"]');

        if (!service || !serviceSelect) return;

        const decodedService = service.replaceAll('-', ' ').trim().toLowerCase();

        const matchingOption = Array.from(serviceSelect.options).find((option) => {
            const optionText = option.textContent.trim().toLowerCase();
            const optionValue = option.value.trim().toLowerCase();

            return optionText.includes(decodedService) || optionValue.includes(decodedService);
        });

        if (matchingOption) {
            serviceSelect.value = matchingOption.value;
            serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const initTwoDigitCounters = () => {
        const counters = document.querySelectorAll('.js-count-two');

        if (!counters.length) return;

        const animateCounter = (counter) => {
            const target = Number(counter.dataset.countTwo || 0);
            const duration = 1200;
            const startTime = performance.now();

            const update = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);

                counter.textContent = String(value).padStart(2, '0');

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = String(target).padStart(2, '0');
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.45
        });

        counters.forEach((counter) => observer.observe(counter));
    };


    const init = () => {
        setupContactForm();
        setupCategoryHelper();
        setupAfterSubmitCards();
        setupServiceParam();
        initTwoDigitCounters();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();