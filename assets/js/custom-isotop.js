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

    // PWA Popup Code
(function() {
    let deferredPrompt;
    const popup = document.getElementById('pwa-popup');
    const installButton = document.getElementById('install-button');
    const closePopupButton = document.getElementById('close-popup');

    // Create the main popup container
    const pwaPopup = document.createElement('div');
    pwaPopup.id = 'pwa-popup';
    pwaPopup.style.display = 'none';
    pwaPopup.style.position = 'fixed';
    pwaPopup.style.top = '0';
    pwaPopup.style.left = '0';
    pwaPopup.style.width = '100%';
    pwaPopup.style.height = '100%';
    pwaPopup.style.background = 'rgba(255,255,255,0.8)';
    pwaPopup.style.color = '#333';
    pwaPopup.style.textAlign = 'center';
    pwaPopup.style.zIndex = '1000';
    pwaPopup.style.display = 'flex';
    pwaPopup.style.alignItems = 'center';
    pwaPopup.style.justifyContent = 'center';

    // Create the inner content container
    const innerDiv = document.createElement('div');
    innerDiv.style.padding = '25px';
    innerDiv.style.background = '#f5f5f5';
    innerDiv.style.borderRadius = '20px';
    innerDiv.style.width = '90%';
    innerDiv.style.maxWidth = '450px';
    innerDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    innerDiv.style.textAlign = 'center';

    // Create the heading
    const heading = document.createElement('h2');
    heading.style.fontSize = '22px';
    heading.style.marginBottom = '15px';
    heading.style.color = '#2c3e50';
    heading.textContent = "Hey there! 👋";

    // Create the paragraph
    const paragraph = document.createElement('p');
    paragraph.style.fontSize = '16px';
    paragraph.style.color = '#444';
    paragraph.style.marginBottom = '25px';
    paragraph.textContent = "Add to Home Screen for Quick Access to Unblocked Games!";

    // Create the install button
    const installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.style.padding = '12px 28px';
    installButton.style.fontSize = '18px';
    installButton.style.cursor = 'pointer';
    installButton.style.backgroundColor = '#ff7f50';
    installButton.style.color = 'white';
    installButton.style.border = 'none';
    installButton.style.borderRadius = '25px';
    installButton.style.marginRight = '10px';
    installButton.style.transition = 'background-color 0.3s';
    installButton.innerHTML = '<i class="fas fa-heart" style="margin-right: 8px;"></i>Add to Home Screen';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.id = 'close-popup';
    closeButton.style.padding = '12px 28px';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = '#888';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '25px';
    closeButton.style.transition = 'color 0.3s';
    closeButton.textContent = "Not Now";

    // Append all elements to their respective parents
    innerDiv.appendChild(heading);
    innerDiv.appendChild(paragraph);
    innerDiv.appendChild(installButton);
    innerDiv.appendChild(closeButton);
    pwaPopup.appendChild(innerDiv);

    // Append the popup to the body
    document.body.appendChild(pwaPopup);

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
