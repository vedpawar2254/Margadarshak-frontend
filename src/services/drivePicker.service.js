
/**
 * Service to handle Google Drive Picker interactions
 */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

let tokenClient;
let gapiLoaded = false;
let gisLoaded = false;

export const drivePickerService = {
    loadGoogleScripts: () => {
        return new Promise((resolve) => {
            // Check if already loaded
            if (gapiLoaded && gisLoaded) {
                resolve(true);
                return;
            }

            // Load GAPI
            const script1 = document.createElement('script');
            script1.src = 'https://apis.google.com/js/api.js';
            script1.async = true;
            script1.defer = true;
            script1.onload = () => {
                window.gapi.load('client:picker', async () => {
                    await window.gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                    gapiLoaded = true;
                    if (gisLoaded) resolve(true);
                });
            };
            document.body.appendChild(script1);

            // Load GIS
            const script2 = document.createElement('script');
            script2.src = 'https://accounts.google.com/gsi/client';
            script2.async = true;
            script2.defer = true;
            script2.onload = () => {
                tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: '', // defined at request time
                });
                gisLoaded = true;
                if (gapiLoaded) resolve(true);
            };
            document.body.appendChild(script2);
        });
    },

    openPicker: () => {
        return new Promise((resolve, reject) => {
            if (!gapiLoaded || !gisLoaded) {
                reject(new Error('Google scripts not loaded'));
                return;
            }

            // Request Token
            tokenClient.callback = async (response) => {
                if (response.error) {
                    reject(response);
                    return;
                }
                const accessToken = response.access_token;

                // Show Picker
                const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
                view.setMimeTypes('application/pdf,video/mp4,video/mpeg,image/jpeg,image/png,application/vnd.google-apps.document,application/vnd.google-apps.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint');

                const picker = new window.google.picker.PickerBuilder()
                    .setDeveloperKey(GOOGLE_API_KEY)
                    .setAppId(GOOGLE_CLIENT_ID)
                    .setOAuthToken(accessToken)
                    .addView(view)
                    .setCallback((data) => {
                        if (data.action === window.google.picker.Action.PICKED) {
                            const file = data.docs[0];
                            resolve({
                                fileId: file.id,
                                name: file.name,
                                mimeType: file.mimeType,
                                accessToken: accessToken
                            });
                        } else if (data.action === window.google.picker.Action.CANCEL) {
                            reject(new Error('Picker cancelled'));
                        }
                    })
                    .build();
                picker.setVisible(true);
            };

            // Trigger OAuth flow
            // null implies prompt if not signed in, or reuse session
            tokenClient.requestAccessToken({ prompt: '' });
        });
    }
};
