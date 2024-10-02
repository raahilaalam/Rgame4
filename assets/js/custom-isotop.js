$(window).on('load', function () {
    // Dynamically add the manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'https://faf-games.github.io/manifest.json';
    document.head.appendChild(manifestLink);

    // Google Analytics Tracking
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

    // Function to detect if it's a mobile device
    function isMobileDevice() {
        return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
    }

    // PWA Installation Code
    let deferredPrompt;
    const isPwaInstalled = localStorage.getItem('pwaInstalled');
    const popupShownThisSession = sessionStorage.getItem('popupShown');

    if (!isPwaInstalled && !popupShownThisSession && !isMobileDevice()) {
        // Create and append the popup HTML (header popup)
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
        $('body').prepend(popupHTML); // Prepend to body to ensure it's in the header

        const popup = document.getElementById('pwa-popup');
        const installButton = document.getElementById('install-button');
        const closePopupButton = document.getElementById('close-popup');

        // Listen for the 'beforeinstallprompt' event after the site has fully loaded
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent the default prompt
            deferredPrompt = e;

            if (!sessionStorage.getItem('popupShown')) {
                popup.style.display = 'block'; // Show the popup immediately
                sessionStorage.setItem('popupShown', 'true'); // Mark the popup as shown for this session
            }

            try {
                gtag('event', 'PWA Install Prompt', {
                    'event_category': 'PWA',
                    'event_label': 'Install Prompt Shown'
                });
            } catch (e) {
                console.error('Google Analytics tracking failed', e);
            }
        });

        // Handle the install button click
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                installButton.innerHTML = 'Installing...'; // Show installing status immediately

                deferredPrompt.prompt(); // Show the install prompt

                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                        try {
                            gtag('event', 'PWA Install Accepted', {
                                'event_category': 'PWA',
                                'event_label': 'Install Accepted'
                            });
                        } catch (e) {
                            console.error('Google Analytics tracking failed', e);
                        }
                        localStorage.setItem('pwaInstalled', 'true');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                        try {
                            gtag('event', 'PWA Install Dismissed', {
                                'event_category': 'PWA',
                                'event_label': 'Install Dismissed'
                            });
                        } catch (e) {
                            console.error('Google Analytics tracking failed', e);
                        }
                    }
                    deferredPrompt = null;
                    popup.style.display = 'none'; // Hide the popup
                });
            }
        });

        // Handle the close popup button click
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
            sessionStorage.setItem('popupShown', 'true'); // Mark popup as closed
            try {
                gtag('event', 'PWA Popup Closed', {
                    'event_category': 'PWA',
                    'event_label': 'Popup Closed'
                });
            } catch (e) {
                console.error('Google Analytics tracking failed', e);
            }
        });

        // Hide popup when the app is installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            localStorage.setItem('pwaInstalled', 'true'); // Save the flag in localStorage
            popup.style.display = 'none'; // Hide the popup
            try {
                gtag('event', 'PWA Installed', {
                    'event_category': 'PWA',
                    'event_label': 'PWA Installed'
                });
            } catch (e) {
                console.error('Google Analytics tracking failed', e);
            }
        });
    }

        $('.projectFilter a').on('click', function () {
        $('.projectFilter .current').removeClass('current');
        $(this).addClass('current');

        var selector = $(this).attr('data-filter');
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
});
