const hookUtility = require("./hookUtility");

const commands = [
    // Creates a .env if not present in source folder
    "[ -h .env ] || ln -s ../shared/.env .env",
    "[ -h apps/backend/.env ] || ln -s ../../.env apps/backend/.env",
    "[ -h apps/frontend/.env ] || ln -s ../../.env apps/frontend/.env"
];

module.exports = hookUtility.createCommandString(commands);