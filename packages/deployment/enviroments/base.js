const postDeployHook = require("../hooks/postDeploy");
const preDeployHook = require("../hooks/preDeploy");

module.exports = {
    "user": "",
    "host": "",
    "repo": "",
    "post-deploy": postDeployHook,
    "pre-deploy": preDeployHook
}