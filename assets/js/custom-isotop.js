$(window).on('load', function () {

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
    const popup = document.getElementById('pwa-popup');
    const installButton = document.getElementById('install-button');
    const closePopupButton = document.getElementById('close-popup');

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent the default prompt
        deferredPrompt = e;
        popup.style.display = 'flex'; // Show the popup
    });

    // Handle the install button click
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
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

});
