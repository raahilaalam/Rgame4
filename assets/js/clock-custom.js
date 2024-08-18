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

        // AdBlock detection script
        function detectAdBlock(callback) {
            var adBlockEnabled = false;
            var testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox';
            testAd.style.display = 'none';
            document.body.appendChild(testAd);

            window.setTimeout(function () {
                if (testAd.offsetHeight === 0) {
                    adBlockEnabled = true;
                }
                testAd.remove();
                callback(adBlockEnabled);
            }, 100);
        }

        detectAdBlock(function (adBlockEnabled) {
            if (adBlockEnabled) {
                showAdBlockDialog();
            }
        });

        // Show AdBlock Dialog
        function showAdBlockDialog() {
            var dialogHtml = `
                <div id="adBlockDialog" style="display:block;">
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;">
                        <div style="position: relative; margin: 10% auto; padding: 20px; background: white; width: 300px; text-align: center; border-radius: 8px;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Information_or_notice_icon.png/120px-Information_or_notice_icon.png" style="width: 50px;">
                            <h3>Please allow ads on our site</h3>
                            <p>Looks like you're using an ad blocker. We rely on advertising to help fund our site.</p>
                            <button id="closeAdBlockDialog" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Allow ads</button>
                        </div>
                    </div>
                </div>`;
            
            $('body').append(dialogHtml);

            $('#closeAdBlockDialog').click(function() {
                $('#adBlockDialog').remove();
            });
        }

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
