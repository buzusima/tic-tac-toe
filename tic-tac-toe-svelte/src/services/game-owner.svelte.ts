import { writable, type Writable } from "svelte/store"

const PLAYER_LOCAL_STORAGE_KEY = "player-profile"

const getGameOwnerProfileFromLocalStorage = () =>
	localStorage.getItem(PLAYER_LOCAL_STORAGE_KEY)

const setGameOwnerProfileToLocalStorage = (
	gameOwnerProfile: GameOwnerProfile | undefined
) => {
	if (gameOwnerProfile)
		localStorage.setItem(
			PLAYER_LOCAL_STORAGE_KEY,
			JSON.stringify(gameOwnerProfile)
		)
	else localStorage.removeItem(PLAYER_LOCAL_STORAGE_KEY)
}

export const gameOwnerProfile: Writable<GameOwnerProfile | undefined> =
	writable()

export const getGameOwnerProfile = (): GameOwnerProfile | undefined => {
	const playProfileJson = getGameOwnerProfileFromLocalStorage()

	let pProfile: GameOwnerProfile | undefined = undefined

	if (playProfileJson) pProfile = JSON.parse(playProfileJson)

	if (pProfile && !pProfile.reference) return undefined
	return pProfile
}

export const processAfterGoogleLogin = (
	gameOwnerProfileFromIdp: GoogleAccountProfile
) => {
	const pProfile: GameOwnerProfile = {
		reference: gameOwnerProfileFromIdp.sub,
		email: gameOwnerProfileFromIdp.email,
		name: gameOwnerProfileFromIdp.name,
		picture: gameOwnerProfileFromIdp.picture,
	}

	gameOwnerProfile.set(pProfile)
	setGameOwnerProfileToLocalStorage(pProfile)
}

export const logout = () => {
	gameOwnerProfile.set(undefined)
	setGameOwnerProfileToLocalStorage(undefined)
}

export interface GameOwnerProfile {
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
