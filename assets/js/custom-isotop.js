$(window).on('load', function () {
    // Add the manifest link dynamically
    addManifestLink();

    // Google Analytics tracking setup
    setupGoogleAnalytics();

    // PWA installation logic
    handlePwaInstallation();

    // Project filter functionality
    setupProjectFilter();
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

// Function to detect if it's a mobile device
function isMobileDevice() {
    return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
}

// PWA installation logic
function handlePwaInstallation() {
    let deferredPrompt;
    const isPwaInstalled = localStorage.getItem('pwaInstalled');
    const popupShownThisSession = sessionStorage.getItem('popupShown');

    if (!isPwaInstalled && !popupShownThisSession && !isMobileDevice()) {
        showPwaPopup();

        // Listen for the 'beforeinstallprompt' event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            if (!sessionStorage.getItem('popupShown')) {
                document.getElementById('pwa-popup').style.display = 'block';
                sessionStorage.setItem('popupShown', 'true');
            }

            trackEvent('PWA Install Prompt', 'Install Prompt Shown');
        });

        handleInstallButtonClick(deferredPrompt);
        handleClosePopupButtonClick();
        handleAppInstalledEvent();
    }
}

// Show PWA popup for desktop installation
function showPwaPopup() {
    const popupHTML = `
        <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; background: #ff7f50; color: white; text-align: center; z-index: 1000; padding: 15px;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                <p style="font-size: 16px; margin: 0;">
                    <strong>Install Our App!</strong> - Get the full experience on your desktop.
                </p>
                <div>
                    <button id="install-button" style="padding: 10px 20px; background: #ff4500; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                        Add to Home Screen
                    </button>
                    <button id="close-popup" style="padding: 10px 20px; background: transparent; color: white; border: 1px solid white; border-radius: 5px; cursor: pointer;">
                        Not Now
                    </button>
                </div>
            </div>
        </div>
    `;
    $('body').prepend(popupHTML);
}

// Handle install button click for PWA installation
function handleInstallButtonClick(deferredPrompt) {
    const installButton = document.getElementById('install-button');
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            installButton.innerHTML = 'Installing...';

            // Defer prompt interaction to avoid UI blocking
            const userChoice = await showInstallPrompt(deferredPrompt);
            processInstallChoice(userChoice);

            deferredPrompt = null;
            document.getElementById('pwa-popup').style.display = 'none';
        }
    });
}

// Show install prompt asynchronously
async function showInstallPrompt(deferredPrompt) {
    deferredPrompt.prompt();
    return deferredPrompt.userChoice;
}

// Process the user's choice after prompting
function processInstallChoice(choiceResult) {
    if (choiceResult.outcome === 'accepted') {
        trackEvent('PWA Install Accepted', 'Install Accepted');
        localStorage.setItem('pwaInstalled', 'true');
    } else {
        trackEvent('PWA Install Dismissed', 'Install Dismissed');
    }
}

// Handle close button click on PWA popup
function handleClosePopupButtonClick() {
    const closePopupButton = document.getElementById('close-popup');
    closePopupButton.addEventListener('click', () => {
        document.getElementById('pwa-popup').style.display = 'none';
        sessionStorage.setItem('popupShown', 'true');
        trackEvent('PWA Popup Closed', 'Popup Closed');
    });
}

// Handle app installed event
function handleAppInstalledEvent() {
    window.addEventListener('appinstalled', () => {
        trackEvent('PWA Installed', 'PWA Installed');
        localStorage.setItem('pwaInstalled', 'true');
        document.getElementById('pwa-popup').style.display = 'none';
    });
}

// Track events using Google Analytics
function trackEvent(eventCategory, eventLabel) {
    try {
        gtag('event', eventCategory, {
            'event_category': 'PWA',
            'event_label': eventLabel
        });
    } catch (e) {
        console.error('Google Analytics tracking failed', e);
    }
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
