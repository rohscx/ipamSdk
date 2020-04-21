const { netboxAuth, infobloxAuth } = require('./serverAuth.js');
const { netboxUrls, infobloxUrls } = require('./serverUrls.js');
const genPostObject = require('./lib/genPostObject.js');
const genPostObjectSingleton = require('./lib/genPostObjectSingleton.js');
const genPatchVlan = require('./lib/genPatchVlan.js');
const objectViewer = require('./lib/objectViewer.js');
const bentPost = require('./lib/bentPost.js');
const bentPatch = require('./lib/bentPatch.js');
const bentDelete = require('./lib/bentDelete.js');
const bentGet = require('./lib/bentGet.js');

const { networkScope, flattenArray } = require('nodeutilz');

module.exports = {
    netboxAuth,
    infobloxAuth,
    genPostObject,
    genPostObjectSingleton,
    genPatchVlan,
    objectViewer,
    bentPost,
    bentPatch,
    bentDelete,
    networkScope,
    flattenArray,
    netboxUrls,
    infobloxUrls,
    bentGet,
};
