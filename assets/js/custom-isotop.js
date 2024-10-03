$(window).on('load', function () {
    // Add the manifest link dynamically
    addManifestLink();

    // Google Analytics tracking setup
    setupGoogleAnalytics();

    // Project filter functionality
    setupProjectFilter();

    // PWA installation prompt setup
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

// PWA Installation setup
function setupPwaInstallation() {
    let deferredPrompt;
    const isPwaInstalled = localStorage.getItem('pwaInstalled');

    // Display the install button if the PWA is not already installed
    if (!isPwaInstalled && !isMobileDevice()) {
        const popupHTML = `
            <div id="pwa-popup" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); color: #333; text-align: center; z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="padding: 25px; background: #f5f5f5; border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center;">
                    <h2 style="font-size: 22px; margin-bottom: 15px; color: #2c3e50;">Install the app</h2>
                    <button id="install-button" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background: #7f2525; color: white; border: none; border-radius: 30px;">Install Now</button>
                    <button id="close-popup" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background-color: transparent; color: #888; border: none; border-radius: 30px;">Not Now</button>
                </div>
            </div>
        `;
        $('body').append(popupHTML);

        const popup = document.getElementById('pwa-popup');
        const installButton = document.getElementById('install-button');
        const closePopupButton = document.getElementById('close-popup');

        // Handle the install button click with countdown logic
        installButton.addEventListener('click', () => {
            let countdown = 3; // Set countdown to 3 seconds
            installButton.disabled = true; // Disable button during countdown

            const countdownInterval = setInterval(() => {
                installButton.textContent = `Installing in ${countdown}...`; // Update button text with countdown
                countdown--;

                if (countdown < 0) {
                    clearInterval(countdownInterval); // Stop the countdown
                    installButton.textContent = "Installing..."; // Final text after countdown

                    if (deferredPrompt) {
                        deferredPrompt.prompt(); // Trigger the PWA installation prompt
                    } else {
                        // If no 'beforeinstallprompt' event has fired yet, show an alert or handle accordingly
                        alert("Installation prompt is not available.");
                    }
                }
            }, 1000); // 1 second interval for countdown
        });

        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
            gtag('event', 'pwa_popup_closed', {
                'event_category': 'PWA',
                'event_label': 'PWA Popup Closed'
            });
        });

        // Listen for the 'beforeinstallprompt' event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent the default prompt
            deferredPrompt = e;

            // You can track this event if needed
            gtag('event', 'pwa_install_prompt_available', {
                'event_category': 'PWA',
                'event_label': 'PWA Install Prompt Available'
            });
        });

        // Hide the popup when the app is installed
        window.addEventListener('appinstalled', () => {
            localStorage.setItem('pwaInstalled', 'true');
            popup.style.display = 'none';
            gtag('event', 'pwa_installed', {
                'event_category': 'PWA',
                'event_label': 'PWA Installed'
            });
        });
    }
}

