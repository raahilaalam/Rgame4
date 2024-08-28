let deferredPrompt;
const pwaPopup = document.getElementById('pwa-popup');
const installButton = document.getElementById('install-button');
const closePopup = document.getElementById('close-popup');

// Show the popup when the user visits the site
window.addEventListener('load', () => {
  pwaPopup.style.display = 'flex';
});

// Handle the install button click
installButton.addEventListener('click', () => {
  pwaPopup.style.display = 'none';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed');
      } else {
        console.log('PWA installation dismissed');
      }
      deferredPrompt = null;
    });
  }
});

// Handle the close button click
closePopup.addEventListener('click', () => {
  pwaPopup.style.display = 'none';
});

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  pwaPopup.style.display = 'flex';
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed');
  // Optionally, you can hide the popup or perform another action here
});
