const production = require('./enviroments/production')
const staging = require('./enviroments/staging')
const backend = require('./apps/backend')
const frontend = require('./apps/frontend')

module.exports = {
    apps: [
        backend,
        frontend
    ],
    deploy: {
        production: production,
        staging: staging,
    }
};
