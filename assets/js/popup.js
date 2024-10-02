let deferredPrompt;
const pwaPopup = document.getElementById('pwa-popup');
const installButton = document.getElementById('install-button');
const closeButton = document.getElementById('close-button');

// Handle the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Only show the popup if not already installed
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    requestAnimationFrame(() => {
      pwaPopup.style.display = 'flex';
    });
  }
});

// Handle the install button click
installButton.addEventListener('click', () => {
  pwaPopup.style.display = 'none'; 
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
});

// Handle the close button click
closeButton.addEventListener('click', () => {
  pwaPopup.style.display = 'none'; 
});

// Hide the popup if the app is already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  pwaPopup.style.display = 'none';
}

// Track the PWA installation
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed');

  // Track the installation with Google Analytics
  gtag('event', 'pwa_install', {
    'event_category': 'PWA',
    'event_label': 'Installation',
    'value': 1
  });
});
