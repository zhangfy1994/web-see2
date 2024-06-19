'use strict';

var name = "@websee2/core";
var version = "1.0.0";
var description = "";
var main = "dist/index.esm.js";
var typings = "dist/index.d.ts";
var scripts = {
	test: "echo \"Error: no test specified\" && exit 1"
};
var keywords = [
];
var author = "";
var dependencies = {
	"@websee2/common": "workspace:*",
	"@websee2/types": "workspace:*",
	"@websee2/utils": "workspace:*",
	"ua-parser-js": "^1.0.38"
};
var license = "ISC";
var devDependencies = {
	"@types/ua-parser-js": "^0.7.39"
};
var version$1 = {
	name: name,
	version: version,
	description: description,
	main: main,
	typings: typings,
	scripts: scripts,
	keywords: keywords,
	author: author,
	dependencies: dependencies,
	license: license,
	devDependencies: devDependencies
};

const SDK_NAME = 'web-see';
const SDK_VERSION = version$1.version;
/**
 * 事件类型
 */
exports.EVENTTYPES = void 0;
(function (EVENTTYPES) {
    EVENTTYPES["XHR"] = "xhr";
    EVENTTYPES["FETCH"] = "fetch";
    EVENTTYPES["CLICK"] = "click";
    EVENTTYPES["HISTORY"] = "history";
    EVENTTYPES["ERROR"] = "error";
    EVENTTYPES["HASHCHANGE"] = "hashchange";
    EVENTTYPES["UNHANDLEDREJECTION"] = "unhandledrejection";
    EVENTTYPES["RESOURCE"] = "resource";
    EVENTTYPES["DOM"] = "dom";
    EVENTTYPES["VUE"] = "vue";
    EVENTTYPES["REACT"] = "react";
    EVENTTYPES["CUSTOM"] = "custom";
    EVENTTYPES["PERFORMANCE"] = "performance";
    EVENTTYPES["RECORDSCREEN"] = "recordScreen";
    EVENTTYPES["WHITESCREEN"] = "whiteScreen";
})(exports.EVENTTYPES || (exports.EVENTTYPES = {}));
/**
 * 用户行为
 */
exports.BREADCRUMBTYPES = void 0;
(function (BREADCRUMBTYPES) {
    BREADCRUMBTYPES["HTTP"] = "Http";
    BREADCRUMBTYPES["CLICK"] = "Click";
    BREADCRUMBTYPES["RESOURCE"] = "Resource_Error";
    BREADCRUMBTYPES["CODEERROR"] = "Code_Error";
    BREADCRUMBTYPES["ROUTE"] = "Route";
    BREADCRUMBTYPES["CUSTOM"] = "Custom";
})(exports.BREADCRUMBTYPES || (exports.BREADCRUMBTYPES = {}));
/**
 * 状态
 */
exports.STATUS_CODE = void 0;
(function (STATUS_CODE) {
    STATUS_CODE["ERROR"] = "error";
    STATUS_CODE["OK"] = "ok";
})(exports.STATUS_CODE || (exports.STATUS_CODE = {}));

exports.SDK_NAME = SDK_NAME;
exports.SDK_VERSION = SDK_VERSION;
//# sourceMappingURL=index.cjs.js.map
