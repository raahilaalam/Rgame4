$(window).on('load', function () {
    // Add the manifest link dynamically
    addManifestLink();

    // Google Analytics tracking setup
    setupGoogleAnalytics();

    // Project filter functionality
    setupProjectFilter();

    // PWA Installation Code with popup and tracking
    setupPwaInstallation();
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

// PWA Installation Code with Analytics Tracking
function setupPwaInstallation() {
    let deferredPrompt;
    const isPwaInstalled = localStorage.getItem('pwaInstalled');

    if (!isPwaInstalled && !isMobileDevice()) {
        // Create and append the popup HTML (desktop only)
        const popupHTML = `
            <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); color: #333; text-align: center; z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="padding: 25px; background: #f5f5f5; border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center;">
                    <h2 style="font-size: 22px; margin-bottom: 15px; color: #2c3e50; animation: fadeInDown 1s;">Hey there! 👋</h2>
                    <p style="font-size: 16px; color: #444; margin-bottom: 25px; font-weight: bold; color: #ff7f50; animation: pulseText 2s infinite;">
                        Don't Miss Out - <span style="color: #ff4500;">Install Our</span> Desktop App!
                    </p>
                    <button id="install-button" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background: #7f2525; color: white; border: none; border-radius: 30px; margin-right: 10px; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); align-items: center;">
                        <i class="fas fa-download" style="margin-right: 10px; font-size: 20px;"></i>Add to Home Screen
                    </button>
                    <button id="close-popup" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background-color: transparent; color: #888; border: none; border-radius: 30px; transition: color 0.3s ease;">
                        Not Now
                    </button>
                </div>
            </div>
        `;
        $('body').append(popupHTML);

        const popup = document.getElementById('pwa-popup');
        const installButton = document.getElementById('install-button');
        const closePopupButton = document.getElementById('close-popup');

        // Listen for the 'beforeinstallprompt' event after site has fully loaded
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent the default prompt
            deferredPrompt = e;
            popup.style.display = 'flex'; // Show the popup

            // Google Analytics event to track popup being shown
            gtag('event', 'pwa_install_prompt_shown', {
              'event_category': 'PWA',
              'event_label': 'PWA Install Prompt'
            });
        });

        // Handle the install button click with countdown logic
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                let countdown = 3; // Set countdown to 3 seconds
                installButton.innerHTML = `Installing in ${countdown}s...`;

                const countdownInterval = setInterval(() => {
                    countdown--;
                    installButton.innerHTML = `Installing in ${countdown}s...`;

                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        installButton.innerHTML = 'Installing...'; // Show installing status

                        deferredPrompt.prompt(); // Show the install prompt

                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('User accepted the A2HS prompt');
                                
                                // Google Analytics event to track PWA installation
                                gtag('event', 'pwa_installed', {
                                  'event_category': 'PWA',
                                  'event_label': 'PWA Installed'
                                });
                            } else {
                                console.log('User dismissed the A2HS prompt');
                                
                                // Google Analytics event to track PWA cancellation
                                gtag('event', 'pwa_install_dismissed', {
                                  'event_category': 'PWA',
                                  'event_label': 'PWA Install Dismissed'
                                });
                            }
                            deferredPrompt = null;
                            popup.style.display = 'none'; // Hide the popup
                        });
                    }
                }, 1000); // Update every second
            }
        });

        // Handle the close popup button click
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';

            // Google Analytics event to track the closing of the popup
            gtag('event', 'pwa_popup_closed', {
              'event_category': 'PWA',
              'event_label': 'PWA Popup Closed'
            });
        });

        // Hide popup when app is installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            localStorage.setItem('pwaInstalled', 'true'); // Save the flag in localStorage
            popup.style.display = 'none'; // Hide the popup

            // Google Analytics event to track successful PWA installation
            gtag('event', 'pwa_installed', {
              'event_category': 'PWA',
              'event_label': 'PWA Installed'
            });
        });
    }
}

// Function to detect if it's a mobile device
function isMobileDevice() {
    return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
}
