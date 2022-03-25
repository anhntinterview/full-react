import { getGoogleAuthLocal } from 'utils/handleLocalStorage';
import { PICKER_KEY } from 'constant/google.const';
import 'utils/google-picker';

var developerKey = PICKER_KEY.REACT_APP_DEVELOPER_KEY;

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = PICKER_KEY.REACT_APP_GOOGLE_CLIENT_ID;

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = '416532671191';

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive.file'];

var pickerApiLoaded = false;

// Use the Google API Loader script to load the google.picker script.
export function loadPicker(token, cb) {
    // gapi.load('auth', { callback: onAuthApiLoad });
    gapi.load('picker', { callback: () => onPickerApiLoad(token, cb) });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
            client_id: clientId,
            scope: scope,
            immediate: false,
        },
        handleAuthResult
    );
}

function onPickerApiLoad(token, cb) {
    pickerApiLoaded = true;
    createPicker(token, cb);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for searching images.
function createPicker(token, cb) {
    if (pickerApiLoaded && token) {
        const googleViewId = google.picker.ViewId.FOLDERS;
        const docsView = new google.picker.DocsView(googleViewId)
            .setIncludeFolders(true)
            .setMimeTypes('application/vnd.google-apps.folder')
            .setOwnedByMe(true)
            .setSelectFolderEnabled(true);
        const picker = new window.google.picker.PickerBuilder()
            .addView(docsView)
            .setOAuthToken(token)
            .setDeveloperKey(developerKey)
            .setCallback(cb);

        picker.build().setVisible(true);
    }
}
