import { initializeGoogle } from "./google-auth"

export const authProviders = {
	google: {
		initialize: initializeGoogle,
	},
	// facebook: {},
}
