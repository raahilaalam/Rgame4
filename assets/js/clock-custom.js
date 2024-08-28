/************* Main Js File ************************
    Template Name: Faf
    Author: Themescare
    Version: 1.0
    Copyright 2020
*************************************************************/






(function ($) {
	"use strict";

	jQuery(document).ready(function ($) {

		const second = 1000,
			minute = second * 60,
			hour = minute * 60,
			day = hour * 24;

		let countDown = new Date('Dec 30, 2022 00:00:00').getTime(),
			x = setInterval(function () {

				let now = new Date().getTime(),
					distance = countDown - now;

				document.getElementById('days').innerText = Math.floor(distance / (day)),
					document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
					document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
					document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

			}, second);

		// Google Analytics code
		(function() {
			$.getScript('https://www.googletagmanager.com/gtag/js?id=G-6BPGNZNTLZ', function() {
				window.dataLayer = window.dataLayer || [];
				function gtag(){ dataLayer.push(arguments); }
				gtag('js', new Date());
				gtag('config', 'G-6BPGNZNTLZ');
			});
		})();
	});

}(jQuery));

<link rel="manifest" href="https://faf-games.github.io/manifest.json">

	<!-- Popup HTML -->
<div id="pwa-popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); color: white; text-align: center; z-index: 1000;  flex-wrap: wrap; flex-direction: row;">
  <div style="margin: 20% auto; padding: 20px; background: #333; border-radius: 10px; width: 80%; max-width: 600px;">
    <h2>Install our FAF Games to Play Unblocked Games</h2>
    <p style="color: white;">For a better experience, install our site on your device.</p>
    <button id="install-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Install FAF Games</button>
    <button id="close-popup" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">Close</button>
  </div>
</div>

	<script>

		// JavaScript to manage PWA installation popup

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

// Optionally, you might want to check if the PWA is already installed
// You can check for the existence of the installed app using navigator.standalone
// if (window.navigator.standalone) {
//   popup.style.display = 'none'; // Hide the popup if app is installed
// }
	</script>




