// For additional settings look into the packages/deployment folder
const pm2Configuration = require('./packages/deployment/pm2-config');

module.exports = {
    ...pm2Configuration
}