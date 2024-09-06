// Create a <style> element for combined CSS rules and animations
var style = document.createElement('style');
style.type = 'text/css';
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
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  /* Fullscreen button style */
  .fullscreen-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 10px 20px;
    background-color: #ff7f50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1001;
  }

  .fullscreen-btn i {
    margin-right: 5px;
  }

  .fullscreen-btn:hover {
    background-color: #ff4500;
  }
`;
// Append the <style> element to the document head
document.head.appendChild(style);

// Fullscreen toggle function for a specific element (game container)
function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Check if there are games on the page
var games = document.querySelectorAll('.gameContainer'); // Adjust this to match your game container class

if (games.length > 0) {
  // Create fullscreen button and append it dynamically
  var fullscreenButton = document.createElement('button');
  fullscreenButton.id = 'fullscreenButton';
  fullscreenButton.className = 'fullscreen-btn';
  fullscreenButton.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';

  // Attach fullscreen toggle to the first game container (or adjust as needed)
  fullscreenButton.onclick = function () {
    var gameContainer = document.querySelector('.gameContainer'); // Adjust to your game's container class
    toggleFullscreen(gameContainer);
  };

  // Append fullscreen button to the body
  document.body.appendChild(fullscreenButton);
}

// Additional logic for Google Analytics, PWA installation, Isotope, etc.
$(window).on('load', function () {
  // Google Analytics code
  (function () {
    $.getScript('https://www.googletagmanager.com/gtag/js?id=G-6BPGNZNTLZ', function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-6BPGNZNTLZ');
    });
  })();

  // Dynamically add the manifest link
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = 'https://faf-games.github.io/manifest.json';
  document.head.appendChild(manifestLink);

  // Initialize Isotope for filtering game elements
  var $container = $('.gamesContainer');
  $container.isotope({
    filter: '*',
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });

  // Filter projects based on user selection
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
  const isPwaInstalled = localStorage.getItem('pwaInstalled');

  if (!isPwaInstalled) {
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

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      popup.style.display = 'flex';

      gtag('event', 'PWA Install Prompt', {
        'event_category': 'PWA',
        'event_label': 'Install Prompt Shown'
      });
    });

    installButton.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            gtag('event', 'PWA Install Accepted', {
              'event_category': 'PWA',
              'event_label': 'Install Accepted'
            });
          } else {
            gtag('event', 'PWA Install Dismissed', {
              'event_category': 'PWA',
              'event_label': 'Install Dismissed'
            });
          }
          deferredPrompt = null;
          popup.style.display = 'none';
        });
      }
    });

    closePopupButton.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
      localStorage.setItem('pwaInstalled', 'true');
      popup.style.display = 'none';
      gtag('event', 'PWA Installed', {
        'event_category': 'PWA',
        'event_label': 'PWA Installed'
      });
    });
  }
});
