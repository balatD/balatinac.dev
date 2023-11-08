const hookUtility = require("./hookUtility");

const commands = [
    // Check if app folders exist and create them if not
    "[ -d apps/backend ] || mkdir -p apps/backend",
    "[ -d apps/backend ] || mkdir -p apps/backend",
    "[ -d apps/backend ] || mkdir -p apps/backend",
    "[ -d apps/frontend ] || mkdir -p apps/frontend",
    "echo ' ' && echo '  ○ Finished: creating app folders' && echo ' '",

    // Creates a .env if not present in source folder
    "[ -h .env ] || ln -s ../shared/.env .env",
    "[ -h apps/backend/.env ] || ln -s ../../.env apps/backend/.env",
    "[ -h apps/frontend/.env ] || ln -s ../../.env apps/frontend/.env",
    "echo ' ' && echo '  ○ Finished: creating .env symlinks for apps' && echo ' '",

    // Check nvm version
    '. ~/.bashrc',
    "nvm list",
    "echo ' ' && echo '  ○ Check: nvm versions' && echo ' '",
];

module.exports = hookUtility.createCommandString(commands);