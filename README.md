# Tic Tac Toe
This game mode features Player vs. Bot only. The player is designated as "X," and the bot is designated as "O."

### Prerequisite
The game uses an OAuth login system, requiring players to sign in using Google. To enable this feature, obtain the GOOGLE_CLIENT_ID from Google and add it to the configuration file before running the game.

For guidance on obtaining the GOOGLE_CLIENT_ID, please follow this link: https://support.google.com/cloud/answer/6158849?hl=en

If a GOOGLE_CLIENT_ID is not provided, the game will not require authentication, and the accountability feature will be disabled.

# Get Started
1. Navigate to the tic-tac-toe-svelte folder. (This folder is organized as a sub-folder to support a backend project within this repository.)
2. Run npm install to install the necessary dependencies.
3. (Optional) To enable the accountability feature, open vite.config.ts and set your Google Client ID by inserting it into OAUTH_GOOGLE_CLIENT_ID: JSON.stringify('').
4. Start the development server with npm run dev.

### Game rules
    If the owner wins:
        ownerPoint increases by 1.
        consecutiveWin increases by 1.
        If consecutiveWin reaches 3:
            ownerPoint increases by an additional 1.
            consecutiveWin resets to 0.
    If the challenger wins:
        challengerPoint increases by 1.
        ownerPoint decreases by 1.
        consecutiveWin resets to 0.
    If there’s a draw:
        consecutiveWin resets to 0.

# Coding concept
TODO

# Disclaimer
This project is currently at the MVP (Minimum Viable Product) stage. Planned features and improvements include:
1. Adjustable game size - Done
2. Bot difficulty levels
3. Game owner vs challenger concept to support multiple user and bot
4. Game history
5. Unit testing
6. Backend server integration with an SQLite database
7. Docker setup
8. UI Improvements

