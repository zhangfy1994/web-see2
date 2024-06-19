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
var EVENTTYPES;
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
})(EVENTTYPES || (EVENTTYPES = {}));
/**
 * 用户行为
 */
var BREADCRUMBTYPES;
(function (BREADCRUMBTYPES) {
    BREADCRUMBTYPES["HTTP"] = "Http";
    BREADCRUMBTYPES["CLICK"] = "Click";
    BREADCRUMBTYPES["RESOURCE"] = "Resource_Error";
    BREADCRUMBTYPES["CODEERROR"] = "Code_Error";
    BREADCRUMBTYPES["ROUTE"] = "Route";
    BREADCRUMBTYPES["CUSTOM"] = "Custom";
})(BREADCRUMBTYPES || (BREADCRUMBTYPES = {}));
/**
 * 状态
 */
var STATUS_CODE;
(function (STATUS_CODE) {
    STATUS_CODE["ERROR"] = "error";
    STATUS_CODE["OK"] = "ok";
})(STATUS_CODE || (STATUS_CODE = {}));

export { BREADCRUMBTYPES, EVENTTYPES, SDK_NAME, SDK_VERSION, STATUS_CODE };
//# sourceMappingURL=index.esm.js.map
