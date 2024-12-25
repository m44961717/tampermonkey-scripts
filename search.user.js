// ==UserScript==
// @name         Search Text
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  update checker has been fixed.
// @author       mark
// @updateURL    https://raw.githubusercontent.com/m44961717/tampermonkey-scripts/refs/heads/main/search.user.js
// @downloadURL  https://raw.githubusercontent.com/m44961717/tampermonkey-scripts/refs/heads/main/search.user.js
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let searchBox;

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

        const bingButton = document.createElement('button');
        bingButton.textContent = 'Search Bing';
        bingButton.onclick = () => {
            performSearch('bing');
        };

        searchBox.appendChild(googleButton);
        searchBox.appendChild(yahooButton);
        searchBox.appendChild(bingButton);
        document.body.appendChild(searchBox);
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
        } else if (engine === 'bing') {
            searchURL = `https://www.bing.com/search?q=${encodeURIComponent(selectedText)}`;
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
        searchBox.style.top = `${window.scrollY + rect.bottom + 10}px`; // Below the selection
        searchBox.style.left = `${window.scrollX + rect.left}px`;
        searchBox.style.display = 'block';
    }

    // Initialize the script
    function init() {
        createSearchBox();

        document.addEventListener('mouseup', (event) => {
            setTimeout(() => showSearchBox(event), 0); // Delay to ensure selection is registered
        });

        document.addEventListener('mousedown', (event) => {
            if (!searchBox.contains(event.target)) {
                searchBox.style.display = 'none'; // Hide if clicked outside the box
            }
        });
    }

    init();
})();
