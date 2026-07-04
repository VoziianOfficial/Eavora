'use strict';

window.EAVORA_CONFIG = {
    brand: {
        name: 'Eavora',
        tagline: 'Independent Gutter Matching Platform',
        logo: 'assets/images/logo.svg',
        logoAlt: 'Eavora independent gutter matching platform logo'
    },

    company: {
        name: 'Eavora',
        legalName: 'Eavora Provider Matching Platform',
        companyId: 'Company information available upon request',
        address: 'Service area: United States',
        serviceArea: 'Selected local areas across the United States'
    },

    contact: {
        phoneRaw: '+18005550194',
        phoneDisplay: '(800) 555-0194',
        phoneLabel: 'Call Us',
        phoneButtonLabel: 'Call Eavora',
        email: 'support@eavora.com',
        emailLabel: 'Email Eavora'
    },

    urls: {
        home: 'index.html',
        about: 'about.html',
        services: 'all-services.html',
        contact: 'contact.html',
        privacy: 'privacy-policy.html',
        terms: 'terms-of-service.html',
        cookies: 'cookie-policy.html'
    },

    form: {
        action: 'contact.php',
        method: 'POST',
        recipient: 'support@eavora.com',
        successMessage: 'Thank you. Your request has been received.',
        errorMessage: 'Please check the required fields and try again.',
        consentText: 'I agree that my submitted request details may be used to help connect me with participating local providers. Provider availability, pricing, scheduling, warranties, and service terms may vary.'
    },

    legal: {
        disclaimer: 'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.',
        shortClarification: 'Eavora is an independent provider-matching platform. Eavora does not perform gutter work directly.',
        providerTerms: 'Final pricing, scheduling, warranties, availability, and service terms are provided by participating providers.',
        homeownerChoice: 'Homeowners choose whether to continue with any provider after reviewing provider-supplied information.'
    },

    footer: {
        description: 'Eavora helps homeowners start structured gutter-related requests and compare available local provider options. Eavora is not a gutter contractor, installer, repair crew, cleaning company, manufacturer, retailer, inspector, or warranty provider.',
        copyright: '© 2026 Eavora. All rights reserved.'
    },

    nav: [
        {
            label: 'Home',
            url: 'index.html'
        },
        {
            label: 'About',
            url: 'about.html'
        },
        {
            label: 'Services',
            url: 'all-services.html',
            hasDropdown: true
        },
        {
            label: 'Contact',
            url: 'contact.html'
        }
    ],

    services: [
        {
            id: 'gutter-installation',
            title: 'Gutter Installation',
            shortTitle: 'Installation',
            dropdownLabel: 'Gutter Installation',
            url: 'gutter-installation.html',
            image: 'assets/images/service-1.jpg',
            icon: 'badge-plus',
            heroTitle: 'Installation Options',
            summary: 'Start a request for new gutter system installation options from participating local providers.',
            description: 'Homeowners can use Eavora to submit project details for new gutter system needs and review available provider-supplied options before deciding whether to continue.',
            related: ['gutter-replacement', 'gutter-guards']
        },
        {
            id: 'gutter-replacement',
            title: 'Gutter Replacement',
            shortTitle: 'Replacement',
            dropdownLabel: 'Gutter Replacement',
            url: 'gutter-replacement.html',
            image: 'assets/images/service-2.jpg',
            icon: 'refresh-cw',
            heroTitle: 'Replacement Options',
            summary: 'Compare provider options for old, damaged, sagging, rusted, or inefficient gutter systems.',
            description: 'Eavora helps homeowners begin a structured request when an existing gutter system may need replacement discussion with participating providers.',
            related: ['gutter-installation', 'gutter-repair']
        },
        {
            id: 'gutter-repair',
            title: 'Gutter Repair',
            shortTitle: 'Repair',
            dropdownLabel: 'Gutter Repair',
            url: 'gutter-repair.html',
            image: 'assets/images/service-3.jpg',
            icon: 'wrench',
            heroTitle: 'Repair Options',
            summary: 'Start a request related to leaks, loose sections, sagging gutters, detached pieces, joint issues, or poor water flow.',
            description: 'Homeowners can use Eavora to organize gutter repair-related details and compare participating provider options where available.',
            related: ['gutter-replacement', 'downspout-drainage']
        },
        {
            id: 'gutter-cleaning',
            title: 'Gutter Cleaning',
            shortTitle: 'Cleaning',
            dropdownLabel: 'Gutter Cleaning',
            url: 'gutter-cleaning.html',
            image: 'assets/images/service-4.jpg',
            icon: 'sparkles',
            heroTitle: 'Cleaning Options',
            summary: 'Find available local provider options for clogged gutters, leaf buildup, debris removal, and seasonal cleaning requests.',
            description: 'Eavora gives homeowners a simple way to start a gutter cleaning-related request and review provider-supplied availability information.',
            related: ['gutter-guards', 'downspout-drainage']
        },
        {
            id: 'gutter-guards',
            title: 'Gutter Guards',
            shortTitle: 'Guards',
            dropdownLabel: 'Gutter Guards',
            url: 'gutter-guards.html',
            image: 'assets/images/service-5.jpg',
            icon: 'shield-check',
            heroTitle: 'Gutter Guard Options',
            summary: 'Compare provider options for gutter guard discussions, leaf protection, debris reduction, and maintenance-focused upgrades.',
            description: 'Homeowners can use Eavora to begin a request for gutter guard options and compare provider-supplied information before continuing.',
            related: ['gutter-cleaning', 'gutter-installation']
        },
        {
            id: 'downspout-drainage',
            title: 'Downspout & Drainage Solutions',
            shortTitle: 'Drainage',
            dropdownLabel: 'Downspout & Drainage',
            url: 'downspout-drainage.html',
            image: 'assets/images/service-6.jpg',
            icon: 'waves',
            heroTitle: 'Drainage Options',
            summary: 'Start a request for downspout extensions, water flow improvement, drainage direction, and foundation water-control concerns.',
            description: 'Eavora helps homeowners structure exterior drainage-related requests and review available local provider options where offered.',
            related: ['gutter-repair', 'gutter-cleaning']
        }
    ],

    social: {
        facebook: '',
        instagram: '',
        linkedin: ''
    },

    tracking: {
        analyticsEnabled: false,
        analyticsDescription: 'Optional analytics may be added only after proper consent and configuration.'
    }
};