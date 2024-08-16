/************* Main Js File ************************
    Template Name: Faf
    Author: Themescare
    Version: 1.0
    Copyright 2020
*************************************************************/

(function ($) {
	"use strict";

	jQuery(document).ready(function ($) {

		// Countdown timer
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

		// Google Ad Manager code
		(function() {
			window.googletag = window.googletag || {cmd: []};
			googletag.cmd.push(function() {
				googletag.defineSlot('/23079347111/Displayads', [970, 250], 'div-gpt-ad-1723799147209-0').addService(googletag.pubads());
				googletag.pubads().enableSingleRequest();
				googletag.enableServices();
			});
		})();
		
	});

}(jQuery));
