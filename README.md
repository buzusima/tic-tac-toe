# Tic Tac Toe
This game mode features Player vs. Bot only. The player is designated as "X," and the bot is designated as "O."

### Prerequisite
The game uses an OAuth login system, requiring players to sign in using Google. To enable this feature, obtain the GOOGLE_CLIENT_ID from Google and add it to the configuration file before running the game.

For guidance on obtaining the GOOGLE_CLIENT_ID, please follow this link: https://support.google.com/cloud/answer/6158849?hl=en

### Game Logic
    if player win
        playerPoint++
        consecutiveWin++
        if Player consecutiveWin == 3
            playerPoint++
            consecutiveWin = 0
    else if bot win
        botPoint++
        playerPoint--
        consecutiveWin = 0
    else (draw)
        consecutiveWin = 0

# Get Started
1. npm install
2. Go to vite.config.ts and put the GOOGLE_CLIENT_ID into '' in OAUTH_GOOGLE_CLIENT_ID: JSON.stringify('')
3. npm run dev

# Disclaimer
This project is currently at the MVP (Minimum Viable Product) stage. Planned features and improvements include:
1. Unit testing
2. Game history
3. Adjustable game size
4. Bot difficulty levels
5. Backend server integration with an SQLite database
6. Docker setup
7. UI Improvements
