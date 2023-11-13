module.exports = {
    name: 'frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './apps/frontend',
    instances: 'max',
    exec_mode: 'cluster'
};