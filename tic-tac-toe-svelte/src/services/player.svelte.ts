import { writable, type Writable } from 'svelte/store'

const PLAYER_LOCAL_STORAGE_KEY = 'player-profile'

const getPlayerProfileFromLocalStorage = () => localStorage.getItem(PLAYER_LOCAL_STORAGE_KEY)

const setPlayerProfileToLocalStorage = (playerProfile: PlayerProfile | undefined) => {
    if (playerProfile) localStorage.setItem(PLAYER_LOCAL_STORAGE_KEY, JSON.stringify(playerProfile))
    else localStorage.removeItem(PLAYER_LOCAL_STORAGE_KEY)
}

export const playerProfile: Writable<PlayerProfile | undefined> = writable()

export const getPlayerProfile = (): PlayerProfile | undefined => {
    const playProfileJson = getPlayerProfileFromLocalStorage()

    let pProfile: PlayerProfile | undefined = undefined

    if (playProfileJson) pProfile = JSON.parse(playProfileJson)

    if (pProfile && !pProfile.reference) return undefined
    return pProfile
}

export const processAfterGoogleLogin = (playerProfileFromIdp: GoogleAccountProfile) => {
    const pProfile: PlayerProfile = {
        reference: playerProfileFromIdp.sub,
        email: playerProfileFromIdp.email,
        name: playerProfileFromIdp.name,
        picture: playerProfileFromIdp.picture,
    }

    playerProfile.set(pProfile)
    setPlayerProfileToLocalStorage(pProfile)
}

export const logout = () => {
    playerProfile.set(undefined)
    setPlayerProfileToLocalStorage(undefined)
}

export interface PlayerProfile {
    reference: string
    email: string
    name: string
    picture: string
}

export interface GoogleAccountProfile {
    iss: string
    azp: string
    aud: string
    sub: string
    email: string
    email_verified: boolean
    nbf: number
    name: string
    picture: string
    given_name: string
    family_name: string
    iat: number
    exp: number
    jti: string
}
