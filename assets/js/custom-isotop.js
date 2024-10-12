$(window).on('load', function () {
    // Add the manifest link dynamically
    addManifestLink();

    // Register the service worker for PWA functionality
    registerServiceWorker();

    // Set up Google Analytics tracking
    setupGoogleAnalytics();

    // Set up project filter functionality
    setupProjectFilter();

    // Set up PWA installation prompt functionality
    setupPwaInstallation();
});

// Function to dynamically add the manifest link
function addManifestLink() {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';  // Ensure the manifest file exists in the root directory

    document.head.appendChild(manifestLink);
    console.log('Manifest added:', manifestLink.href);
}

// Function to register the service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    } else {
        console.warn('Service Worker not supported in this browser.');
    }
}

// Function to set up Google Analytics
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

        console.log('Google Analytics setup complete.');
    };
}

// Function to set up project filter functionality
function setupProjectFilter() {
    const $container = $('.projectContainer');
    $('.projectFilter a').on('click', function () {
        $('.projectFilter .current').removeClass('current');
        $(this).addClass('current');

        const selector = $(this).attr('data-filter');
        requestAnimationFrame(() => {
            if ($container.length) {
                $container.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
            }
        });

        return false;
    });

    console.log('Project filter setup complete.');
}

// Function to set up PWA installation prompt
function setupPwaInstallation() {
    let deferredPrompt;
    const isPwaInstalled = localStorage.getItem('pwaInstalled');

    if (!isPwaInstalled && !isMobileDevice()) {
        const popupHTML = `
            <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); color: #333; text-align: center; z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="padding: 25px; background: #f5f5f5; border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center;">
                    <h2 style="font-size: 22px; margin-bottom: 15px; color: #2c3e50;">Install Our App for a Faster, Seamless Experience!</h2>
                    <button id="install-button" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background: #7f2525; color: white; border: none; border-radius: 30px;">Add to Home Screen</button>
                    <button id="close-popup" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background-color: transparent; color: #888; border: none; border-radius: 30px;">Not Now</button>
                </div>
            </div>
        `;

        $('body').append(popupHTML);

        const popup = document.getElementById('pwa-popup');
        const installButton = document.getElementById('install-button');
        const closePopupButton = document.getElementById('close-popup');

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            popup.style.display = 'flex';  // Show the popup

            console.log('beforeinstallprompt event triggered');
        });

        // Handle install button click
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();  // Show the installation prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installation accepted');
                        localStorage.setItem('pwaInstalled', 'true');
                    } else {
                        console.log('PWA installation dismissed');
                    }
                    deferredPrompt = null;
                    popup.style.display = 'none';  // Hide popup after choice
                }).catch((error) => {
                    console.error('Error during PWA installation:', error);
                });
            }
        });

        // Close the popup
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
            console.log('PWA popup closed.');
        });

        // Handle app installation success
        window.addEventListener('appinstalled', () => {
            localStorage.setItem('pwaInstalled', 'true');
            popup.style.display = 'none';  // Hide popup after installation
            console.log('PWA installed successfully.');
        });
    } else {
        console.log('PWA is already installed or device is mobile.');
    }
}

// Function to detect mobile devices
function isMobileDevice() {
    return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
}
