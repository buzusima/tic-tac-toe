# Get Started



## TODO
- Frontend
    - Svelte
    - Each datasource config same interface
    - Each element support cypress
- Backend
    - ExpressJs
    - Typeorm
    - Unit test
- Cypress
- Docker build
    - Datasource config is require input
        - if not db, no backend run


## Big picture
- MVP
    - Fully game logic
    - Bot random select
    - Local storage datasource
    - OAuth
    - Run by script
- MVP + C
    - Fully game logic
        - Local storage datasource
        - OAuth
    - Run by script
    - Cypress with run srcipt
- MVP + C + Browser storage
    - Fully game logic
        - Every browser datasource
        - OAuth
    - Run by script
    - Cypress with run srcipt
- MVP + C + Browser storage + DB
    - Fully game logic
        - Every browser datasource + DB
        - OAuth
    - Run by script
    - Cypress with run srcipt
- MVP + C + Browser storage + DB + Docker
    - Fully game logic
        - Every browser datasource + DB
        - OAuth
    - Run by docker
    - Cypress with run srcipt
- Full
    - Fully game logic
        - Every browser datasource + DB
        - OAuth
    - Run by docker
    - Bot selector
    - Game size config
    - Cypress may run after service start if posible

## Detailing
### Fully game logic
- tic tac toe component only with win/lose/drawing trigger [D]
- botting (Random select)
- point collector
- accounting (OAuth)
    - Multiple account
- Continue reset logic
- Decorate
### Cypress
- Test case create to each cypress file
- Implement each test case
### Browser storage
- Implement each browser storage
### DB storage
- Express with SQLite
- Unit testing with run before build
### Docker build 
- Docker file with datasource config

### Future
- bot levels
    - easy (Random bot)
    - medium (Logic bot)
    - hard (AI bot)