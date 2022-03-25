self.importScripts('sw/download/download.1.js');

self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('message', function (evt) {
    if (evt.data.type === 'download') {
        handleDownload(evt);
    }
});
