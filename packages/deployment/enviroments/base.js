const postDeployHook = require("../hooks/postDeploy");
const preDeployHook = require("../hooks/preDeploy");

module.exports = {
    "user": "root",
    "host": "49.13.69.55",
    "repo": "git@github.com:balatD/balatinac.dev.git",
    "post-deploy": postDeployHook,
    "pre-deploy": preDeployHook
}