const hookUtility = require("./hookUtility");

const commands = [
    // Loads bash configuration to be able to use 'nvm'
    '. ~/.bashrc',
    "echo ' && 'echo '  ○ Finished: setting bashrc settings into current deployment session' && echo ' '",
    // Install all node dependencies for current project
    'npm install',
    "echo ' && 'echo '  ○ Finished: installing all dependencies' && echo ' '",
    // Builds every app with turborepo
    'npm run build',
    "echo ' && 'echo '  ○ Finished: building all dependencies with optional turborepo cache' && echo ' '",
    // Reload pm2 processes
    'pm2 startOrReload ecosystem.config.js',
    "echo ' && 'echo '  ○ Started: all apps in pm2 configuration' && echo ' '",
];

module.exports = hookUtility.createCommandString(commands);