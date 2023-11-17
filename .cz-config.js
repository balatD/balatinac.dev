module.exports = {
    types: [
        { value: 'feat', name: 'feat: A new feature' },
        { value: 'fix', name: 'fix: A bug fix' },
        { value: 'docs', name: 'docs: Documentation only changes' },
        {
            value: 'refactor',
            name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        },
        {
            value: 'perf',
            name: 'perf: A code change that improves performance',
        },
        { value: 'test', name: 'test: Adding missing tests' },
        {
            value: 'chore',
            name: 'chore: Changes to the build process or auxiliary tools and libraries such as documentation generation',
        },
        { value: 'revert', name: 'revert: Revert to a commit' },
        { value: 'WIP', name: 'WIP: Work in progress' },
    ],

    scopes: [],

    usePreparedCommit: false,
    allowTicketNumber: false,
    isTicketNumberRequired: false,

    messages: {
        type: "Select the type of change that you're committing:",
        scope: '\nDenote the SCOPE of this change (optional):',
        subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
        body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
        confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },

    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix'],
    skipQuestions: ['scope', 'body', 'breaking', 'footer'],
    subjectLimit: 300
};