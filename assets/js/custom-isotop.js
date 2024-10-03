$(window).on('load', function () {
    // Add the manifest link dynamically
    addManifestLink();

    // Google Analytics tracking setup
    setupGoogleAnalytics();

    // Project filter functionality
    setupProjectFilter();

    // Setup PWA install prompt, ensuring it doesn't show on mobile
    setupPWAInstallPrompt();
});

// Function to dynamically add the manifest link
function addManifestLink() {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'https://faf-games.github.io/manifest.json';
    document.head.appendChild(manifestLink);
}

// Function to setup Google Analytics
function setupGoogleAnalytics() {
    const googleAnalyticsScript = document.createElement('script');
    googleAnalyticsScript.async = true;
    googleAnalyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=G-6BPGNZNTLZ";
    document.head.appendChild(googleAnalyticsScript);

    googleAnalyticsScript.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-6BPGNZNTLZ');
    };
}

// Set up project filter functionality
function setupProjectFilter() {
    $('.projectFilter a').on('click', function () {
        $('.projectFilter .current').removeClass('current');
        $(this).addClass('current');

        const selector = $(this).attr('data-filter');
        requestAnimationFrame(() => {
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
        });
        return false;
    });
}

// Function to setup the PWA install prompt (desktop only)
function setupPWAInstallPrompt() {
    let deferredPrompt;

    // Check if the device is mobile (we don't want to show the prompt on mobile)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // If the device is not mobile, setup the install prompt
    if (!isMobile) {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on desktop
            e.preventDefault();
            deferredPrompt = e;

            // Track prompt availability via Google Analytics
            gtag('event', 'pwa_prompt_available', {
                'event_category': 'PWA',
                'event_label': 'Prompt Available'
            });

            // Show the prompt after a delay or based on custom conditions
            setTimeout(() => {
                showInstallPrompt();
            }, 3000); // Show after 3 seconds delay (or change as needed)
        });
    }

    // Function to show the PWA install prompt
    function showInstallPrompt() {
        deferredPrompt.prompt(); // Show the install prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                // Track install event in Google Analytics
                gtag('event', 'pwa_install', {
                    'event_category': 'PWA',
                    'event_label': 'App Installed'
                });
            } else {
                console.log('User dismissed the install prompt');
                // Track dismiss event in Google Analytics
                gtag('event', 'pwa_dismiss', {
                    'event_category': 'PWA',
                    'event_label': 'Prompt Dismissed'
                });
            }
            deferredPrompt = null; // Reset the deferredPrompt
        });
    }

    // Detect when the app is installed and track it
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA was installed');
        // Track the PWA installation event
        gtag('event', 'pwa_installed', {
            'event_category': 'PWA',
            'event_label': 'App Installed After AppInstalled Event'
        });
    });
}
