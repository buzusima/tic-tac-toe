import { processAfterGoogleLogin, type GoogleAccountProfile } from '../services/player.svelte'

export function initializeGoogle(clientId: string, callback: any) {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
        google.accounts.id.initialize({
            client_id: clientId,
            callback,
        })
    }
    document.body.appendChild(script)
}

export function renderGoogleButton(buttonId: string) {
    google.accounts.id.renderButton(document.getElementById(buttonId), { theme: 'outline', size: 'large' })
}

export function handleGoogleCredential(response: any) {
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
