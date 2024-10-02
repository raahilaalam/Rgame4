$(window).on('load', function () {

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

    let deferredPrompt;

    // Show install button when the 'beforeinstallprompt' event is fired
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent the default prompt from being shown immediately
        deferredPrompt = e; // Stash the event so it can be triggered later

        // Show the install button (you need to add this button in your HTML)
        const installButton = document.getElementById('installButton');
        installButton.style.display = 'block'; // Show the button to the user

        installButton.addEventListener('click', () => {
            // Hide the button once clicked
            installButton.style.display = 'none';
            // Show the install prompt
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA install prompt');
                    gtag('event', 'PWA Install Accepted', {
                        'event_category': 'PWA',
                        'event_label': 'Install Accepted'
                    });
                } else {
                    console.log('User dismissed the PWA install prompt');
                    gtag('event', 'PWA Install Dismissed', {
                        'event_category': 'PWA',
                        'event_label': 'Install Dismissed'
                    });
                }
                deferredPrompt = null; // Reset the deferred prompt
            });
        });
    });

    // Optionally track when the app is installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        gtag('event', 'PWA Installed', {
            'event_category': 'PWA',
            'event_label': 'PWA Installed'
        });
    });

    // Isotope filtering functionality
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

});
