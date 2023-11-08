const hookUtility = require("./hookUtility");

const commands = [
    // Loads bash configuration to be able to use 'nvm'
    '. ~/.bashrc',
    // Install all node dependencies for current project
    'npm install',
    // Builds every app with turborepo
    'npm run build',
    // Reload pm2 processes
    'pm2 startOrReload ecosystem.config.js'
];

module.exports = hookUtility.createCommandString(commands);