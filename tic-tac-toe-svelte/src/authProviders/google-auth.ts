import { processAfterGoogleLogin, type GoogleAccountProfile } from '../services/game-owner.svelte'

export const initializeGoogle = (clientId: string, renderButtonId: string) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
        if (google) {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCredential,
            })
            const googleButton = document.getElementById(renderButtonId)
            if (googleButton) google.accounts.id.renderButton(googleButton, { theme: 'outline', size: 'large' })
            // google.accounts.id.prompt()
        }
    }
    document.body.appendChild(script)
}

const handleGoogleCredential = (response: any): void => {
    const accountProfile: GoogleAccountProfile = jwt_decode(response.credential)

    processAfterGoogleLogin(accountProfile)
}

const jwt_decode = (token: string) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join('')
    )

    return JSON.parse(jsonPayload)
}

declare namespace google {
    namespace accounts {
        namespace id {
            function initialize(options: { client_id: string; callback: (response: any) => void }): void;
            function renderButton(element: HTMLElement, options: { theme: string; size: string }): void;
            function prompt(): void;
        }
    }
}