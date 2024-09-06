// Create style element for the CSS
const style = document.createElement('style');
style.textContent = `
  /* CSS for Fullscreen Button */
  .fullscreen-btn {
      display: none; /* Initially hidden */
      align-items: center;
      background-color: #ff6a00; /* Orange color */
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 20px;
      position: relative;
      left: 50%;
      transform: translateX(-50%); /* Center the button horizontally */
  }

  .fullscreen-btn:hover {
      background-color: #ff7a21;
  }

  .fullscreen-btn i {
      margin-right: 8px;
  }

  /* Styling for game iframe (optional) */
  .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  iframe {
      border: none;
  }
`;

// Append the style element to the document's head
document.head.appendChild(style);

// Create the fullscreen button
const fullscreenButton = document.createElement('button');
fullscreenButton.id = 'fullscreenButton';
fullscreenButton.className = 'fullscreen-btn';
fullscreenButton.onclick = open_fullscreen;

// Add icon inside the button
const icon = document.createElement('i');
icon.className = 'fas fa-expand';
fullscreenButton.appendChild(icon);

// Add text to the button
fullscreenButton.appendChild(document.createTextNode(' Fullscreen'));

// Append the button to the body (or any container)
document.body.appendChild(fullscreenButton);

// Show the fullscreen button after loading the game
window.onload = function() {
    document.getElementById('fullscreenButton').style.display = 'inline-flex';
};

// Example fullscreen function
function open_fullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}





// Create a <style> element
var style = document.createElement('style');
style.type = 'text/css';

// Add combined CSS rules and animations
style.innerHTML = `
  #install-button:hover {
    background: linear-gradient(135deg, #ff4500, #ff7f50);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }

  #close-popup:hover {
    color: #555;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseText {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

// Append the <style> element to the document head
document.head.appendChild(style);


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

    // PWA Installation Code
    let deferredPrompt;

    // Check if the PWA is already installed
    const isPwaInstalled = localStorage.getItem('pwaInstalled');

    if (!isPwaInstalled) {
        // Create and append the popup HTML
        const popupHTML = `
            <div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); color: #333; text-align: center; z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="padding: 25px; background: #f5f5f5; border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center;">
                    <h2 style="font-size: 22px; margin-bottom: 15px; color: #2c3e50; animation: fadeInDown 1s;">Hey there! 👋</h2>
                    <p style="font-size: 16px; color: #444; margin-bottom: 25px; font-weight: bold; color: #ff7f50; animation: pulseText 2s infinite;">
                        Don't Miss Out - <span style="color: #ff4500;">Install Our</span> Desktop App!
                    </p>
                    <button id="install-button" style="padding: 12px 28px; font-size: 18px; cursor: pointer; background: linear-gradient(135deg, #ff7f50, #ff4500); color: white; border: none; border-radius: 30px; margin-right: 10px; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); align-items: center;">
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
            localStorage.setItem('pwaInstalled', 'true'); // Save the flag in localStorage
            popup.style.display = 'none'; // Hide the popup
            // Track the PWA installation
            gtag('event', 'PWA Installed', {
                'event_category': 'PWA',
                'event_label': 'PWA Installed'
            });
        });
    }
});
