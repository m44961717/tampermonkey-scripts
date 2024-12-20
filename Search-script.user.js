// ==UserScript==
// @name         Search the Selected Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show a box above the selected text with options to search on Google, Yahoo.
// @author       mark
// @updateURL    https://raw.githubusercontent.com/m44961717/tampermonkey-scripts/refs/heads/main/Search-script.user.js
// @downloadURL  https://raw.githubusercontent.com/m44961717/tampermonkey-scripts/refs/heads/main/Search-script.user.js
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let searchBox;
    let updateNotification;

    // Create the search box element
    function createSearchBox() {
        searchBox = document.createElement('div');
        searchBox.style.position = 'absolute';
        searchBox.style.backgroundColor = '#fff';
        searchBox.style.border = '1px solid #ccc';
        searchBox.style.padding = '10px';
        searchBox.style.borderRadius = '5px';
        searchBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        searchBox.style.zIndex = '9999';
        searchBox.style.display = 'none';

        const googleButton = document.createElement('button');
        googleButton.textContent = 'Search Google';
        googleButton.style.marginRight = '10px';
        googleButton.onclick = () => {
            performSearch('google');
        };

        const yahooButton = document.createElement('button');
        yahooButton.textContent = 'Search Yahoo';
        yahooButton.style.marginRight = '10px';
        yahooButton.onclick = () => {
            performSearch('yahoo');
        };

        searchBox.appendChild(googleButton);
        searchBox.appendChild(yahooButton);
        document.body.appendChild(searchBox);
    }

    // Create the update notification element
    function createUpdateNotification() {
        updateNotification = document.createElement('div');
        updateNotification.style.position = 'fixed';
        updateNotification.style.bottom = '20px';
        updateNotification.style.right = '20px';
        updateNotification.style.backgroundColor = '#fffae6';
        updateNotification.style.border = '1px solid #ffc107';
        updateNotification.style.padding = '15px';
        updateNotification.style.borderRadius = '5px';
        updateNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        updateNotification.style.zIndex = '9999';
        updateNotification.style.display = 'none';
        updateNotification.textContent = 'A new version of the script is available!';

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Now';
        updateButton.style.marginLeft = '10px';
        updateButton.onclick = () => {
            window.open('https://www.tampermonkey.net/dashboard.php', '_blank');
        };

        updateNotification.appendChild(updateButton);
        document.body.appendChild(updateNotification);
    }

    // Show update notification
    function showUpdateNotification() {
        updateNotification.style.display = 'block';
    }

    // Check for updates
    function checkForUpdates() {
        const currentVersion = '1.0';

        fetch('https://raw.githubusercontent.com/m44961717/tampermonkey-scripts/refs/heads/main/Search-script.user.js', { method: 'HEAD' })
            .then(response => {
                const remoteVersion = response.headers.get('script-version'); // Assuming you set this header manually
                if (remoteVersion && remoteVersion !== currentVersion) {
                    showUpdateNotification();
                }
            })
            .catch(err => console.error('Update check failed:', err));
    }

    // Perform the search in a new tab
    function performSearch(engine) {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) return;

        let searchURL = '';
        if (engine === 'google') {
            searchURL = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;
        } else if (engine === 'yahoo') {
            searchURL = `https://search.yahoo.com/search?p=${encodeURIComponent(selectedText)}`;
        }

        window.open(searchURL, '_blank');
        searchBox.style.display = 'none'; // Hide the search box after selection
    }

    // Show the search box near the selection
    function showSearchBox(event) {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) {
            searchBox.style.display = 'none';
            return;
        }

        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        searchBox.style.top = `${window.scrollY + rect.top - searchBox.offsetHeight - 10}px`;
        searchBox.style.left = `${window.scrollX + rect.left}px`;
        searchBox.style.display = 'block';
    }

    // Initialize the script
    function init() {
        createSearchBox();
        createUpdateNotification();

        document.addEventListener('mouseup', (event) => {
            setTimeout(() => showSearchBox(event), 0); // Delay to ensure selection is registered
        });
 
        document.addEventListener('mousedown', (event) => {
            if (!searchBox.contains(event.target)) {
                searchBox.style.display = 'none'; // Hide if clicked outside the box
            }
        });

        checkForUpdates();
    }

    init();
})();
