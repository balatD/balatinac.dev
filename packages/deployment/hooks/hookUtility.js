module.exports = {
    createCommandString: (commands) => {
        return commands.join(' && ');
    }
};