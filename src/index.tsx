import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'translations/i18n';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        console.log('Service worker supported');
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
                // Register service worker
                console.log('Service worker register ...');
                navigator.serviceWorker
                    .register('/sw.1.js')
                    .then((registration) =>
                        console.log('Service worker registered')
                    )
                    .catch((error) => console.log('Register failed: ' + error));
            });
    } else {
        console.log('Service worker not supported');
    }
});
