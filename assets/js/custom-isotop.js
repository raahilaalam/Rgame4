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
    googleAnalyticsScript.async = true;  // Ensure analytics loads async
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
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button after prompt is ready
            $('#installButton').show();

            $('#installButton').on('click', () => {
                deferredPrompt.prompt();  // Trigger the install prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        gtag('event', 'pwa_install', {
                            'event_category': 'PWA',
                            'event_label': 'App Installed'
                        });
                    } else {
                        console.log('User dismissed the install prompt');
                        gtag('event', 'pwa_dismiss', {
                            'event_category': 'PWA',
                            'event_label': 'Prompt Dismissed'
                        });
                    }
                    deferredPrompt = null;
                });
            });
        });
    }
}
