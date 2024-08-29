$(window).on('load', function () {

    // Google Analytics code
    (function() {
        $.getScript('https://www.googletagmanager.com/gtag/js?id=G-6BPGNZNTLZ', function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-6BPGNZNTLZ');
        });
    })();

    // Dynamically add the manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'https://faf-games.github.io/manifest.json';
    document.head.appendChild(manifestLink);

    // Initialize Isotope
    var $container = $('.gamesContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });

    $('.projectFilter a').on('click', function () {
        $('.projectFilter .current').removeClass('current');
        $(this).addClass('current');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });

    // PWA Installation Code
    let deferredPrompt;

    // Create and append the popup HTML
    const popupHTML = `
        <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); color: white; text-align: center; z-index: 1000;  flex-wrap: wrap; flex-direction: row;">
            <div style="margin: 20% auto; padding: 20px; background: #333; border-radius: 10px; width: 80%; max-width: 600px;">
                <h2>Install our FAF Games to Play Unblocked Games</h2>
                <p style="color: white;">For a better experience, install our site on your device.</p>
                <button id="install-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Install FAF Games</button>
                <button id="close-popup" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
        </div>
    `;
    $('body').append(popupHTML);

    const popup = document.getElementById('pwa-popup');
    const installButton = document.getElementById('install-button');
    const closePopupButton = document.getElementById('close-popup');

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent the default prompt
        deferredPrompt = e;
        popup.style.display = 'flex'; // Show the popup

        // Track that the install prompt was shown
        gtag('event', 'PWA Install Prompt', {
            'event_category': 'PWA',
            'event_label': 'Install Prompt Shown'
        });
    });

    // Handle the install button click
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    // Track acceptance
                    gtag('event', 'PWA Install Accepted', {
                        'event_category': 'PWA',
                        'event_label': 'Install Accepted'
                    });
                } else {
                    console.log('User dismissed the A2HS prompt');
                    // Track dismissal
                    gtag('event', 'PWA Install Dismissed', {
                        'event_category': 'PWA',
                        'event_label': 'Install Dismissed'
                    });
                }
                deferredPrompt = null;
                popup.style.display = 'none'; // Hide the popup
            });
        }
    });

    // Handle the close popup button click
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none'; // Hide the popup
    });

    // Listen for the 'appinstalled' event
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        // Track the PWA installation
        gtag('event', 'PWA Installed', {
            'event_category': 'PWA',
            'event_label': 'PWA Installed'
        });
    });
});
