import { GOOGLE, LOCAL_STORAGE_GOOGLE } from 'constant/google.const';
import { GoogleOAuth2ArgsType } from 'types/GoogleType';

const YOUR_CLIENT_ID = GOOGLE.API_AND_SERVICES.CREDENTIALS.OAUTH2.CLIENT_ID;
const YOUR_REDIRECT_URI =
    GOOGLE.API_AND_SERVICES.CREDENTIALS.OAUTH2.AUTHORIZED_REDIRECT_URIs;

// Otherwise, start OAuth 2.0 flow.
export default function oauth2Request(id: string) {
    let params;
    const oauth2Params = localStorage.getItem(
        LOCAL_STORAGE_GOOGLE.OAUTH2_PARAMS
    );
    if (oauth2Params) {
        params = JSON.parse(oauth2Params);
    }

    if (params && params['access_token']) {
        const xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            `${GOOGLE.API_AND_SERVICES.API.USER}&` +
                'access_token=' +
                params['access_token']
        );
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.response);
            } else if (xhr.readyState === 4 && xhr.status === 401) {
                // Token invalid, so prompt for user permission.
                oauth2SignIn(id);
            }
        };
        xhr.send(null);
    } else {
        oauth2SignIn(id);
    }
}
/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauth2SignIn(id: string) {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = GOOGLE.API_AND_SERVICES.API.OAUTH2;

    // Create element to open OAuth 2.0 endpoint in new window.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params: GoogleOAuth2ArgsType = {
        client_id: YOUR_CLIENT_ID,
        redirect_uri: YOUR_REDIRECT_URI,
        scope: GOOGLE.API_AND_SERVICES.SCOPE.DRIVE.METADATA_READONLY,
        state: id,
        include_granted_scopes: 'true',
        response_type: 'token',
    };

    // Add form parameters as hidden input values.
    for (const p in params) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}
