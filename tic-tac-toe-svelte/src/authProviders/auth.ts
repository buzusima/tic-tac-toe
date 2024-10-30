import { handleGoogleCredential, initializeGoogle, renderGoogleButton } from './google-auth'

export const authProviders = {
    google: {
        initialize: initializeGoogle,
        renderButton: renderGoogleButton,
        handleCredential: handleGoogleCredential,
    },
    // facebook: {},
}
