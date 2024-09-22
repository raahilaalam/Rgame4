// Create a <style> element
var style = document.createElement('style');
style.type = 'text/css';

// Add combined CSS rules and animations with optimized performance
style.innerHTML = `
  #install-button:hover {
    background: linear-gradient(135deg, #ff4500, #ff7f50);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  #close-popup:hover {
    color: #555;
    transition: color 0.2s;
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

// Function to detect if it's a mobile device
function isMobileDevice() {
    return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
}

$(window).on('load', function () {
    // Dynamically add the manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'https://faf-games.github.io/manifest.json';
    document.head.appendChild(manifestLink);

    // PWA Installation Code
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

        // Listen for the 'beforeinstallprompt' event after site has fully loaded
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
            // Immediately hide the popup before prompting the user
            popup.style.display = 'none';

            if (deferredPrompt) {
                deferredPrompt.prompt(); // Show the install prompt

                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                        gtag('event', 'PWA Install Accepted', {
                            'event_category': 'PWA',
                            'event_label': 'Install Accepted'
                        });
                    } else {
                        console.log('User dismissed the A2HS prompt');
                        gtag('event', 'PWA Install Dismissed', {
                            'event_category': 'PWA',
                            'event_label': 'Install Dismissed'
                        });
                    }
                    deferredPrompt = null;
                });
            }
        });

        // Handle the close popup button click
        closePopupButton.addEventListener('click', () => {
            // Hide the popup immediately without lag
            popup.style.display = 'none';

            // Set a timeout to ensure it's fully removed from the display stack
            setTimeout(() => {
                popup.style.display = 'none';
            }, 10); // small delay to ensure DOM update

            // Log and track the close event
            gtag('event', 'PWA Popup Closed', {
                'event_category': 'PWA',
                'event_label': 'Popup Closed'
            });
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            localStorage.setItem('pwaInstalled', 'true'); // Save the flag in localStorage
            popup.style.display = 'none'; // Hide the popup
            gtag('event', 'PWA Installed', {
                'event_category': 'PWA',
                'event_label': 'PWA Installed'
            });
        });
    }
});
