# Tic Tac Toe
Experience the classic game of Tic Tac Toe with customizable options! Choose your board size for varied challenges, and decide whether to play against a friend or a bot. With adjustable bot difficulty levels from easy to medium.

### Prerequisite
The game uses an OAuth login system, requiring game owner to sign in using Google. To enable this feature, obtain the GOOGLE_CLIENT_ID from Google and add it to the configuration file before running the game.

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
1. Create a board with empty value
2. Generate winning combination
    - Rows: Any of the three horizontal rows filled by the same game owner's mark.
    - Columns: Any of the three vertical columns filled by the same game owner's mark.
    - Diagonals: Either of the two diagonals filled by the same game owner's mark.
3. Check with winning combination every cell selected

# Improvement target
- Logic Bot
- Change get game setting by game id
- Responsive & decoration of History
- Unit testing
- AI Bot
- Backend server integration with an SQLite database
- Docker setup
- UI Improvements

- Fix createEventDispatcher deprecated
