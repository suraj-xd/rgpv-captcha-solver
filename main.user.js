// ==UserScript==
// @name         RGPV Captcha Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solve captcha on RGPV Student Login page
// @author       You
// @match        https://www.rgpv.ac.in/Login/StudentLogin.aspx
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert data URL to Blob
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    // Function to solve the captcha and fill the form
    function solveCaptcha() {
        // API is free, make an account on API-NINJA , and put your api key.
        const api_ninjas_api_key = 'F6HWjTsDTAYn8ANGu4AAKg==nkpgbzy9AuVAcdJQ';
        // if u want to use this in other sites, just trigger the image element here,
        // in case of RGPV Student login, on this page, we trigger it like this.
        var captchaImageElement = document.querySelector('.captcha img');

        // Check if the image element is found
        if (captchaImageElement) {
            // Create a canvas element
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            // Set the canvas dimensions to match the image dimensions
            canvas.width = captchaImageElement.width;
            canvas.height = captchaImageElement.height;

            // Draw the image onto the canvas
            context.drawImage(captchaImageElement, 0, 0);

            // Convert the canvas content to a data URL
            var dataUrl = canvas.toDataURL('image/png');

            // Convert the data URL to a Blob
            var blobData = dataURItoBlob(dataUrl);

            // Create a FormData object and append the image blob
            var formData = new FormData();
            formData.append('image', blobData, 'captcha.png'); // Adjust the file name if needed

            // Make the API request
            fetch('https://api.api-ninjas.com/v1/imagetotext', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Api-Key': api_ninjas_api_key
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result[0].text);
                document.querySelectorAll('.form-control')[2].value = result[0].text;
                // Handle the result as needed
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error('Image element not found.');
        }
    }

    // Run the captcha solving function when the page is loaded
    window.addEventListener('load', solveCaptcha);
})();
