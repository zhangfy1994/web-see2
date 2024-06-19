var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var uaParser = {exports: {}};

(function (module, exports) {
	/////////////////////////////////////////////////////////////////////////////////
	/* UAParser.js v1.0.38
	   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
	   MIT License *//*
	   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
	   Supports browser & node.js environment. 
	   Demo   : https://faisalman.github.io/ua-parser-js
	   Source : https://github.com/faisalman/ua-parser-js */
	/////////////////////////////////////////////////////////////////////////////////

	(function (window, undefined$1) {

	    //////////////
	    // Constants
	    /////////////


	    var LIBVERSION  = '1.0.38',
	        EMPTY       = '',
	        UNKNOWN     = '?',
	        FUNC_TYPE   = 'function',
	        UNDEF_TYPE  = 'undefined',
	        OBJ_TYPE    = 'object',
	        STR_TYPE    = 'string',
	        MAJOR       = 'major',
	        MODEL       = 'model',
	        NAME        = 'name',
	        TYPE        = 'type',
	        VENDOR      = 'vendor',
	        VERSION     = 'version',
	        ARCHITECTURE= 'architecture',
	        CONSOLE     = 'console',
	        MOBILE      = 'mobile',
	        TABLET      = 'tablet',
	        SMARTTV     = 'smarttv',
	        WEARABLE    = 'wearable',
	        EMBEDDED    = 'embedded',
	        UA_MAX_LENGTH = 500;

	    var AMAZON  = 'Amazon',
	        APPLE   = 'Apple',
	        ASUS    = 'ASUS',
	        BLACKBERRY = 'BlackBerry',
	        BROWSER = 'Browser',
	        CHROME  = 'Chrome',
	        EDGE    = 'Edge',
	        FIREFOX = 'Firefox',
	        GOOGLE  = 'Google',
	        HUAWEI  = 'Huawei',
	        LG      = 'LG',
	        MICROSOFT = 'Microsoft',
	        MOTOROLA  = 'Motorola',
	        OPERA   = 'Opera',
	        SAMSUNG = 'Samsung',
	        SHARP   = 'Sharp',
	        SONY    = 'Sony',
	        XIAOMI  = 'Xiaomi',
	        ZEBRA   = 'Zebra',
	        FACEBOOK    = 'Facebook',
	        CHROMIUM_OS = 'Chromium OS',
	        MAC_OS  = 'Mac OS';

	    ///////////
	    // Helper
	    //////////

	    var extend = function (regexes, extensions) {
	            var mergedRegexes = {};
	            for (var i in regexes) {
	                if (extensions[i] && extensions[i].length % 2 === 0) {
	                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
	                } else {
	                    mergedRegexes[i] = regexes[i];
	                }
	            }
	            return mergedRegexes;
	        },
	        enumerize = function (arr) {
	            var enums = {};
	            for (var i=0; i<arr.length; i++) {
	                enums[arr[i].toUpperCase()] = arr[i];
	            }
	            return enums;
	        },
	        has = function (str1, str2) {
	            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
	        },
	        lowerize = function (str) {
	            return str.toLowerCase();
	        },
	        majorize = function (version) {
	            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined$1;
	        },
	        trim = function (str, len) {
	            if (typeof(str) === STR_TYPE) {
	                str = str.replace(/^\s\s*/, EMPTY);
	                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
	            }
	    };

	    ///////////////
	    // Map helper
	    //////////////

	    var rgxMapper = function (ua, arrays) {

	            var i = 0, j, k, p, q, matches, match;

	            // loop through all regexes maps
	            while (i < arrays.length && !matches) {

	                var regex = arrays[i],       // even sequence (0,2,4,..)
	                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
	                j = k = 0;

	                // try matching uastring with regexes
	                while (j < regex.length && !matches) {

	                    if (!regex[j]) { break; }
	                    matches = regex[j++].exec(ua);

	                    if (!!matches) {
	                        for (p = 0; p < props.length; p++) {
	                            match = matches[++k];
	                            q = props[p];
	                            // check if given property is actually array
	                            if (typeof q === OBJ_TYPE && q.length > 0) {
	                                if (q.length === 2) {
	                                    if (typeof q[1] == FUNC_TYPE) {
	                                        // assign modified match
	                                        this[q[0]] = q[1].call(this, match);
	                                    } else {
	                                        // assign given value, ignore regex match
	                                        this[q[0]] = q[1];
	                                    }
	                                } else if (q.length === 3) {
	                                    // check whether function or regex
	                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
	                                        // call function (usually string mapper)
	                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
	                                    } else {
	                                        // sanitize match using given regex
	                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
	                                    }
	                                } else if (q.length === 4) {
	                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
	                                }
	                            } else {
	                                this[q] = match ? match : undefined$1;
	                            }
	                        }
	                    }
	                }
	                i += 2;
	            }
	        },

	        strMapper = function (str, map) {

	            for (var i in map) {
	                // check if current value is array
	                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
	                    for (var j = 0; j < map[i].length; j++) {
	                        if (has(map[i][j], str)) {
	                            return (i === UNKNOWN) ? undefined$1 : i;
	                        }
	                    }
	                } else if (has(map[i], str)) {
	                    return (i === UNKNOWN) ? undefined$1 : i;
	                }
	            }
	            return str;
	    };

	    ///////////////
	    // String map
	    //////////////

	    // Safari < 3.0
	    var oldSafariMap = {
	            '1.0'   : '/8',
	            '1.2'   : '/1',
	            '1.3'   : '/3',
	            '2.0'   : '/412',
	            '2.0.2' : '/416',
	            '2.0.3' : '/417',
	            '2.0.4' : '/419',
	            '?'     : '/'
	        },
	        windowsVersionMap = {
	            'ME'        : '4.90',
	            'NT 3.11'   : 'NT3.51',
	            'NT 4.0'    : 'NT4.0',
	            '2000'      : 'NT 5.0',
	            'XP'        : ['NT 5.1', 'NT 5.2'],
	            'Vista'     : 'NT 6.0',
	            '7'         : 'NT 6.1',
	            '8'         : 'NT 6.2',
	            '8.1'       : 'NT 6.3',
	            '10'        : ['NT 6.4', 'NT 10.0'],
	            'RT'        : 'ARM'
	    };

	    //////////////
	    // Regex map
	    /////////////

	    var regexes = {

	        browser : [[

	            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
	            ], [VERSION, [NAME, 'Chrome']], [
	            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
	            ], [VERSION, [NAME, 'Edge']], [

	            // Presto based
	            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
	            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
	            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
	            ], [NAME, VERSION], [
	            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
	            ], [VERSION, [NAME, OPERA+' Mini']], [
	            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
	            ], [VERSION, [NAME, OPERA+' GX']], [
	            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
	            ], [VERSION, [NAME, OPERA]], [

	            // Mixed
	            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
	            ], [VERSION, [NAME, 'Baidu']], [
	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
	            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
	            // Trident based
	            /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,             // Avant/IEMobile/SlimBrowser
	            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

	            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
	            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
	                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
	            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
	            /(weibo)__([\d\.]+)/i                                               // Weibo
	            ], [NAME, VERSION], [
	            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
	            ], [VERSION, [NAME, 'DuckDuckGo']], [
	            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
	            ], [VERSION, [NAME, 'UC'+BROWSER]], [
	            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
	            /\bqbcore\/([\w\.]+).+microm/i,
	            /micromessenger\/([\w\.]+)/i                                        // WeChat
	            ], [VERSION, [NAME, 'WeChat']], [
	            /konqueror\/([\w\.]+)/i                                             // Konqueror
	            ], [VERSION, [NAME, 'Konqueror']], [
	            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
	            ], [VERSION, [NAME, 'IE']], [
	            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
	            ], [VERSION, [NAME, 'Yandex']], [
	            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
	            ], [VERSION, [NAME, 'Smart Lenovo '+BROWSER]], [
	            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
	            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
	            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
	            ], [VERSION, [NAME, FIREFOX+' Focus']], [
	            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
	            ], [VERSION, [NAME, OPERA+' Touch']], [
	            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
	            ], [VERSION, [NAME, 'Coc Coc']], [
	            /dolfin\/([\w\.]+)/i                                                // Dolphin
	            ], [VERSION, [NAME, 'Dolphin']], [
	            /coast\/([\w\.]+)/i                                                 // Opera Coast
	            ], [VERSION, [NAME, OPERA+' Coast']], [
	            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
	            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
	            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
	            ], [VERSION, [NAME, FIREFOX]], [
	            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
	            ], [[NAME, '360 ' + BROWSER]], [
	            /(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i
	            ], [[NAME, /(.+)/, '$1 ' + BROWSER], VERSION], [                    // Oculus/Sailfish/HuaweiBrowser/VivoBrowser
	            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
	            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
	            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
	            ], [[NAME, /_/g, ' '], VERSION], [
	            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
	            ], [VERSION, [NAME, 'Sogou Explorer']], [
	            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
	            ], [[NAME, 'Sogou Mobile'], VERSION], [
	            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
	            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
	            /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i                        // QQBrowser/2345 Browser
	            ], [NAME, VERSION], [
	            /(lbbrowser)/i,                                                     // LieBao Browser
	            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
	            ], [NAME], [

	            // WebView
	            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
	            ], [[NAME, FACEBOOK], VERSION], [
	            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
	            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
	            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
	            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
	            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
	            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
	            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
	            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
	            ], [NAME, VERSION], [
	            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
	            ], [VERSION, [NAME, 'GSA']], [
	            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
	            ], [VERSION, [NAME, 'TikTok']], [

	            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
	            ], [VERSION, [NAME, CHROME+' Headless']], [

	            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
	            ], [[NAME, CHROME+' WebView'], VERSION], [

	            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
	            ], [VERSION, [NAME, 'Android '+BROWSER]], [

	            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
	            ], [NAME, VERSION], [

	            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
	            ], [VERSION, [NAME, 'Mobile Safari']], [
	            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
	            ], [VERSION, NAME], [
	            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
	            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

	            /(webkit|khtml)\/([\w\.]+)/i
	            ], [NAME, VERSION], [

	            // Gecko based
	            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
	            ], [[NAME, 'Netscape'], VERSION], [
	            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
	            ], [VERSION, [NAME, FIREFOX+' Reality']], [
	            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
	            /(swiftfox)/i,                                                      // Swiftfox
	            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
	                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
	            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
	                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
	            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
	            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

	            // Other
	            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
	                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
	            /(links) \(([\w\.]+)/i,                                             // Links
	            /panasonic;(viera)/i                                                // Panasonic Viera
	            ], [NAME, VERSION], [
	            
	            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
	            ], [NAME, [VERSION, /master.|lts./, ""]]
	        ],

	        cpu : [[

	            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
	            ], [[ARCHITECTURE, 'amd64']], [

	            /(ia32(?=;))/i                                                      // IA32 (quicktime)
	            ], [[ARCHITECTURE, lowerize]], [

	            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
	            ], [[ARCHITECTURE, 'ia32']], [

	            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
	            ], [[ARCHITECTURE, 'arm64']], [

	            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
	            ], [[ARCHITECTURE, 'armhf']], [

	            // PocketPC mistakenly identified as PowerPC
	            /windows (ce|mobile); ppc;/i
	            ], [[ARCHITECTURE, 'arm']], [

	            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
	            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

	            /(sun4\w)[;\)]/i                                                    // SPARC
	            ], [[ARCHITECTURE, 'sparc']], [

	            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
	                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
	            ], [[ARCHITECTURE, lowerize]]
	        ],

	        device : [[

	            //////////////////////////
	            // MOBILES & TABLETS
	            /////////////////////////

	            // Samsung
	            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
	            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
	            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
	            /samsung[- ]([-\w]+)/i,
	            /sec-(sgh\w+)/i
	            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

	            // Apple
	            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
	            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
	            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
	            /applecoremedia\/[\w\.]+ \((ipad)/i,
	            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
	            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
	            /(macintosh);/i
	            ], [MODEL, [VENDOR, APPLE]], [

	            // Sharp
	            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
	            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

	            // Huawei
	            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
	            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
	            /(?:huawei|honor)([-\w ]+)[;\)]/i,
	            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
	            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

	            // Xiaomi
	            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
	            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
	            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
	            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
	            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
	            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
	            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
	            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
	            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
	            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

	            // OPPO
	            /; (\w+) bui.+ oppo/i,
	            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
	            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
	            /\b(opd2\d{3}a?) bui/i
	            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, TABLET]], [

	            // Vivo
	            /vivo (\w+)(?: bui|\))/i,
	            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
	            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

	            // Realme
	            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
	            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

	            // Motorola
	            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
	            /\bmot(?:orola)?[- ](\w*)/i,
	            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
	            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
	            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
	            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

	            // LG
	            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
	            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
	            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
	            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
	            /\blg-?([\d\w]+) bui/i
	            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

	            // Lenovo
	            /(ideatab[-\w ]+)/i,
	            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
	            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

	            // Nokia
	            /(?:maemo|nokia).*(n900|lumia \d+)/i,
	            /nokia[-_ ]?([-\w\.]*)/i
	            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

	            // Google
	            /(pixel c)\b/i                                                      // Google Pixel C
	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
	            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

	            // Sony
	            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
	            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
	            /sony tablet [ps]/i,
	            /\b(?:sony)?sgp\w+(?: bui|\))/i
	            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

	            // OnePlus
	            / (kb2005|in20[12]5|be20[12][59])\b/i,
	            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
	            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

	            // Amazon
	            /(alexa)webm/i,
	            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
	            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
	            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
	            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
	            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

	            // BlackBerry
	            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
	            ], [MODEL, VENDOR, [TYPE, TABLET]], [
	            /\b((?:bb[a-f]|st[hv])100-\d)/i,
	            /\(bb10; (\w+)/i                                                    // BlackBerry 10
	            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

	            // Asus
	            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
	            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
	            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
	            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

	            // HTC
	            /(nexus 9)/i                                                        // HTC Nexus 9
	            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
	            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

	            // ZTE
	            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
	            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
	            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

	            // Acer
	            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
	            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

	            // Meizu
	            /droid.+; (m[1-5] note) bui/i,
	            /\bmz-([-\w]{2,})/i
	            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
	                
	            // Ulefone
	            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
	            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

	            // MIXED
	            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
	                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
	            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
	            /(asus)-?(\w+)/i,                                                   // Asus
	            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
	            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
	            /(jolla)/i,                                                         // Jolla
	            /(oppo) ?([\w ]+) bui/i                                             // OPPO
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

	            /(kobo)\s(ereader|touch)/i,                                         // Kobo
	            /(archos) (gamepad2?)/i,                                            // Archos
	            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
	            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
	            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
	            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
	            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
	            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
	            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
	            ], [VENDOR, MODEL, [TYPE, TABLET]], [

	            /(surface duo)/i                                                    // Surface Duo
	            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
	            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
	            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
	            /(u304aa)/i                                                         // AT&T
	            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
	            /\bsie-(\w*)/i                                                      // Siemens
	            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
	            /\b(rct\w+) b/i                                                     // RCA Tablets
	            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
	            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
	            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
	            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
	            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
	            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
	            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
	            /\b(tm\d{3}\w+) b/i
	            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
	            /\b(k88) b/i                                                        // ZTE K Series Tablet
	            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
	            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
	            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
	            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
	            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
	            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
	            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
	            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
	            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
	            /\b([yr]\d{2}) b/i,
	            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
	            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
	            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
	            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
	            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
	            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
	            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
	            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
	            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
	            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
	            /\b(ph-1) /i                                                        // Essential PH-1
	            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
	            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
	            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
	            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
	            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
	            /\btu_(1491) b/i                                                    // Rotor Tablets
	            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
	            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
	            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
	            /(sprint) (\w+)/i                                                   // Sprint Phones
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
	            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
	            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
	            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
	            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

	            ///////////////////
	            // SMARTTVS
	            ///////////////////

	            /smart-tv.+(samsung)/i                                              // Samsung
	            ], [VENDOR, [TYPE, SMARTTV]], [
	            /hbbtv.+maple;(\d+)/i
	            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
	            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
	            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
	            /(apple) ?tv/i                                                      // Apple TV
	            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
	            /crkey/i                                                            // Google Chromecast
	            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
	            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
	            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
	            /\(dtv[\);].+(aquos)/i,
	            /(aquos-tv[\w ]+)\)/i                                               // Sharp
	            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
	            /(bravia[\w ]+)( bui|\))/i                                              // Sony
	            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
	            /(mitv-\w{5}) bui/i                                                 // Xiaomi
	            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
	            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
	            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
	            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
	            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
	            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
	            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
	            ], [[TYPE, SMARTTV]], [

	            ///////////////////
	            // CONSOLES
	            ///////////////////

	            /(ouya)/i,                                                          // Ouya
	            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
	            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
	            /droid.+; (shield) bui/i                                            // Nvidia
	            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
	            /(playstation [345portablevi]+)/i                                   // Playstation
	            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
	            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
	            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

	            ///////////////////
	            // WEARABLES
	            ///////////////////

	            /((pebble))app/i                                                    // Pebble
	            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
	            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
	            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
	            /droid.+; (glass) \d/i                                              // Google Glass
	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
	            /droid.+; (wt63?0{2,3})\)/i
	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
	            /(quest( \d| pro)?)/i                                               // Oculus Quest
	            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

	            ///////////////////
	            // EMBEDDED
	            ///////////////////

	            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
	            ], [VENDOR, [TYPE, EMBEDDED]], [
	            /(aeobc)\b/i                                                        // Echo Dot
	            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

	            ////////////////////
	            // MIXED (GENERIC)
	            ///////////////////

	            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i    // Android Phones from Unidentified Vendors
	            ], [MODEL, [TYPE, MOBILE]], [
	            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
	            ], [MODEL, [TYPE, TABLET]], [
	            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
	            ], [[TYPE, TABLET]], [
	            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
	            ], [[TYPE, MOBILE]], [
	            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
	            ], [MODEL, [VENDOR, 'Generic']]
	        ],

	        engine : [[

	            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
	            ], [VERSION, [NAME, EDGE+'HTML']], [

	            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
	            ], [VERSION, [NAME, 'Blink']], [

	            /(presto)\/([\w\.]+)/i,                                             // Presto
	            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
	            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
	            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
	            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
	            /\b(libweb)/i
	            ], [NAME, VERSION], [

	            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
	            ], [VERSION, NAME]
	        ],

	        os : [[

	            // Windows
	            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
	            ], [NAME, VERSION], [
	            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i             // Windows Phone
	            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
	            /windows nt 6\.2; (arm)/i,                                        // Windows RT
	            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
	            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
	            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

	            // iOS/macOS
	            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
	            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
	            /cfnetwork\/.+darwin/i
	            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
	            /(mac os x) ?([\w\. ]*)/i,
	            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
	            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

	            // Mobile OSes
	            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
	            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
	            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
	            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
	            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
	            /\((series40);/i                                                    // Series 40
	            ], [NAME, VERSION], [
	            /\(bb(10);/i                                                        // BlackBerry 10
	            ], [VERSION, [NAME, BLACKBERRY]], [
	            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
	            ], [VERSION, [NAME, 'Symbian']], [
	            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
	            ], [VERSION, [NAME, FIREFOX+' OS']], [
	            /web0s;.+rt(tv)/i,
	            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
	            ], [VERSION, [NAME, 'webOS']], [
	            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
	            ], [VERSION, [NAME, 'watchOS']], [

	            // Google Chromecast
	            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
	            ], [VERSION, [NAME, CHROME+'cast']], [
	            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
	            ], [[NAME, CHROMIUM_OS], VERSION],[

	            // Smart TVs
	            /panasonic;(viera)/i,                                               // Panasonic Viera
	            /(netrange)mmh/i,                                                   // Netrange
	            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

	            // Console
	            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
	            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

	            // Other
	            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
	            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
	            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
	            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
	                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
	            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
	            /(gnu) ?([\w\.]*)/i,                                                // GNU
	            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
	            /(haiku) (\w+)/i                                                    // Haiku
	            ], [NAME, VERSION], [
	            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
	            ], [[NAME, 'Solaris'], VERSION], [
	            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
	            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
	            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
	            /(unix) ?([\w\.]*)/i                                                // UNIX
	            ], [NAME, VERSION]
	        ]
	    };

	    /////////////////
	    // Constructor
	    ////////////////

	    var UAParser = function (ua, extensions) {

	        if (typeof ua === OBJ_TYPE) {
	            extensions = ua;
	            ua = undefined$1;
	        }

	        if (!(this instanceof UAParser)) {
	            return new UAParser(ua, extensions).getResult();
	        }

	        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined$1;
	        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
	        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined$1;
	        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
	        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

	        this.getBrowser = function () {
	            var _browser = {};
	            _browser[NAME] = undefined$1;
	            _browser[VERSION] = undefined$1;
	            rgxMapper.call(_browser, _ua, _rgxmap.browser);
	            _browser[MAJOR] = majorize(_browser[VERSION]);
	            // Brave-specific detection
	            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
	                _browser[NAME] = 'Brave';
	            }
	            return _browser;
	        };
	        this.getCPU = function () {
	            var _cpu = {};
	            _cpu[ARCHITECTURE] = undefined$1;
	            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
	            return _cpu;
	        };
	        this.getDevice = function () {
	            var _device = {};
	            _device[VENDOR] = undefined$1;
	            _device[MODEL] = undefined$1;
	            _device[TYPE] = undefined$1;
	            rgxMapper.call(_device, _ua, _rgxmap.device);
	            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
	                _device[TYPE] = MOBILE;
	            }
	            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
	            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
	                _device[MODEL] = 'iPad';
	                _device[TYPE] = TABLET;
	            }
	            return _device;
	        };
	        this.getEngine = function () {
	            var _engine = {};
	            _engine[NAME] = undefined$1;
	            _engine[VERSION] = undefined$1;
	            rgxMapper.call(_engine, _ua, _rgxmap.engine);
	            return _engine;
	        };
	        this.getOS = function () {
	            var _os = {};
	            _os[NAME] = undefined$1;
	            _os[VERSION] = undefined$1;
	            rgxMapper.call(_os, _ua, _rgxmap.os);
	            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != 'Unknown') {
	                _os[NAME] = _uach.platform  
	                                    .replace(/chrome os/i, CHROMIUM_OS)
	                                    .replace(/macos/i, MAC_OS);           // backward compatibility
	            }
	            return _os;
	        };
	        this.getResult = function () {
	            return {
	                ua      : this.getUA(),
	                browser : this.getBrowser(),
	                engine  : this.getEngine(),
	                os      : this.getOS(),
	                device  : this.getDevice(),
	                cpu     : this.getCPU()
	            };
	        };
	        this.getUA = function () {
	            return _ua;
	        };
	        this.setUA = function (ua) {
	            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
	            return this;
	        };
	        this.setUA(_ua);
	        return this;
	    };

	    UAParser.VERSION = LIBVERSION;
	    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
	    UAParser.CPU = enumerize([ARCHITECTURE]);
	    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
	    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

	    ///////////
	    // Export
	    //////////

	    // check js environment
	    {
	        // nodejs env
	        if (module.exports) {
	            exports = module.exports = UAParser;
	        }
	        exports.UAParser = UAParser;
	    }

	    // jQuery/Zepto specific (optional)
	    // Note:
	    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
	    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
	    //   and we should catch that.
	    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
	    if ($ && !$.ua) {
	        var parser = new UAParser();
	        $.ua = parser.getResult();
	        $.ua.get = function () {
	            return parser.getUA();
	        };
	        $.ua.set = function (ua) {
	            parser.setUA(ua);
	            var result = parser.getResult();
	            for (var prop in result) {
	                $.ua[prop] = result[prop];
	            }
	        };
	    }

	})(typeof window === 'object' ? window : commonjsGlobal); 
} (uaParser, uaParser.exports));

var uaParserExports = uaParser.exports;

/* eslint-disable @typescript-eslint/no-explicit-any */
function getGlobal() {
    return window;
}
function getGlobalSupport() {
    _global.__websee__ = _global.__websee__ || {};
    return _global.__websee__;
}
const _global = getGlobal();
const _support = getGlobalSupport();
//设备信息
const uaResult = new uaParserExports.UAParser().getResult();
_support.deviceInfo = {
    browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
    browser: uaResult.browser.name, // 浏览器类型 Chrome
    osVersion: uaResult.os.version, // 操作系统 电脑系统 10
    os: uaResult.os.name, // Windows
    ua: uaResult.ua,
    device: uaResult.device.model ? uaResult.device.model : 'Unknown',
    device_type: uaResult.device.type ? uaResult.device.type : 'PC',
};
_support.hasError = false;
// errorMap 存储代码错误的集合
_support.errorMap = new Map();
// 默认配置
_support.flags = _support.flags || {};
function setFlag(type, value) {
    _support.flags[type] = value;
}
function getFlag(type) {
    return _support.flags[type];
}
// 是否存在error has
function hasExitHash(hash) {
    const exit = _support.errorMap.has(hash);
    if (!exit) {
        _support.errorMap.set(hash, true);
    }
    return exit;
}

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

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class Queue {
    constructor() {
        this.stack = [];
        this.isFlushing = false;
    }
    addFn(fn) {
        this.stack.push(fn);
        if (!this.isFlushing) {
            this.isFlushing = true;
            if ('requestIdleCallback' in window) {
                requestIdleCallback(this.flush.bind(this));
            }
            else if ('Promise' in window) {
                Promise.resolve().then(this.flush.bind(this));
            }
            else {
                setTimeout(this.flush.bind(this), 0);
            }
        }
    }
    flush() {
        const temp = this.stack.slice(0);
        this.stack = [];
        this.isFlushing = false;
        temp.forEach((fn) => {
            fn();
        });
    }
    clear() {
        this.stack = [];
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// 获取当前的时间戳
function getTimestamp() {
    return Date.now();
}
// 判断类型
function typeofAny(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
// 设置属性
function bindOptionsHelp(target, key, value, type) {
    if (!target)
        return false;
    if (typeofAny(value) === type) {
        target[key] = value;
        return true;
    }
    return false;
}
// 生成uuid
function generateUUID() {
    return v4();
}
//replaceAop
function replaceAop(target, property, replaceCb) {
    if (!(property in target))
        return;
    const originFn = target[property];
    const wrap = replaceCb(originFn);
    if (typeof wrap === 'function') {
        target[property] = wrap;
    }
}
// 事件监听
function on(target, event, handle, options = false) {
    target.addEventListener(event, handle, options);
}
// 对每一个错误详情，生成唯一的编码
function getErrorUid(input) {
    return window.btoa(encodeURIComponent(input));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class Options {
    constructor() {
        this.dsn = ''; // 监控上报接口的地址
        this.throttleDelayTime = 0; // click事件的节流时长
        this.overTime = 10; // 接口超时时长
        this.whiteBoxElements = ['html', 'body', '#app', '#root']; // // 白屏检测的容器列表
        this.silentWhiteScreen = false; // 是否开启白屏检测
        this.skeletonProject = false; // 项目是否有骨架屏
        this.repeatCodeError = false; // 是否去除重复的代码错误，重复的错误只上报一次
    }
    bindOptions(options) {
        const { dsn, filterXhrUrlRegExp, throttleDelayTime = 0, overTime = 10, silentWhiteScreen = false, whiteBoxElements = ['html', 'body', '#app', '#root'], skeletonProject = false, handleHttpStatus, repeatCodeError = false, } = options;
        bindOptionsHelp(this, 'dsn', dsn, 'string');
        bindOptionsHelp(this, 'filterXhrUrlRegExp', filterXhrUrlRegExp, 'regexp');
        bindOptionsHelp(this, 'throttleDelayTime', throttleDelayTime, 'number');
        bindOptionsHelp(this, 'overTime', overTime, 'number');
        bindOptionsHelp(this, 'whiteBoxElements', whiteBoxElements, 'array');
        bindOptionsHelp(this, 'silentWhiteScreen', silentWhiteScreen, 'boolean');
        bindOptionsHelp(this, 'skeletonProject', skeletonProject, 'boolean');
        bindOptionsHelp(this, 'handleHttpStatus', handleHttpStatus, 'function');
        bindOptionsHelp(this, 'repeatCodeError', repeatCodeError, 'boolean');
    }
}
const globalOptions = _support.options || (_support.options = new Options());
function setGlobalOptions(options) {
    setSilentFlag(options);
}
function setSilentFlag({ silentXhr = true, silentFetch = true, silentClick = true, silentHistory = true, silentError = true, silentHashchange = true, silentUnhandledrejection = true, silentWhiteScreen = false, }) {
    setFlag(EVENTTYPES.XHR, silentXhr);
    setFlag(EVENTTYPES.FETCH, silentFetch);
    setFlag(EVENTTYPES.CLICK, silentClick);
    setFlag(EVENTTYPES.HISTORY, silentHistory);
    setFlag(EVENTTYPES.ERROR, silentError);
    setFlag(EVENTTYPES.HASHCHANGE, silentHashchange);
    setFlag(EVENTTYPES.UNHANDLEDREJECTION, silentUnhandledrejection);
    setFlag(EVENTTYPES.WHITESCREEN, silentWhiteScreen);
}

class Breadcrumb {
    constructor() {
        this.maxBreadcrumbs = 20; // 用户行为存放的最大长度
        this.beforePushBreadcrumb = null;
        this.stack = [];
    }
    /**
     * 添加用户行为栈
     */
    push(data) {
        if (typeof this.beforePushBreadcrumb === 'function') {
            const result = this.beforePushBreadcrumb(data);
            if (result) {
                this.immediatePush(result);
            }
            return;
        }
        this.immediatePush(data);
    }
    immediatePush(data) {
        data.time || (data.time = getTimestamp());
        if (this.stack.length >= this.maxBreadcrumbs) {
            this.stack.shift();
        }
        this.stack.push(data);
    }
    getStack() {
        return this.stack;
    }
    clear() {
        this.stack = [];
    }
    getCategory(type) {
        switch (type) {
            // 接口请求
            case EVENTTYPES.XHR:
            case EVENTTYPES.FETCH:
                return BREADCRUMBTYPES.HTTP;
            // 用户点击
            case EVENTTYPES.CLICK:
                return BREADCRUMBTYPES.CLICK;
            // 路由变化
            case EVENTTYPES.HISTORY:
            case EVENTTYPES.HASHCHANGE:
                return BREADCRUMBTYPES.ROUTE;
            // 加载资源
            case EVENTTYPES.RESOURCE:
                return BREADCRUMBTYPES.RESOURCE;
            // Js代码报错
            case EVENTTYPES.UNHANDLEDREJECTION:
            case EVENTTYPES.ERROR:
                return BREADCRUMBTYPES.CODEERROR;
            // 用户自定义
            default:
                return BREADCRUMBTYPES.CUSTOM;
        }
    }
    bindOptions(options) {
        bindOptionsHelp(this, 'beforePushBreadcrumb', options.beforePushBreadcrumb, 'function');
        bindOptionsHelp(this, 'maxBreadcrumbs', options.maxBreadcrumbs || 20, 'number');
    }
}
const breadcrumb = new Breadcrumb();
_support.breadcrumb = breadcrumb;

class TransportData {
    constructor() {
        this.userId = '';
        this.apikey = '';
        this.dsn = '';
        this.uuid = '';
        this.queue = new Queue();
        this.useImageUpload = false;
        this.uuid = generateUUID();
    }
    beacon(url, data) {
        return navigator.sendBeacon(url, new Blob([JSON.stringify(data)]));
    }
    imgRequest(url, data) {
        const request = () => {
            const img = new Image();
            const spliceStr = url.indexOf('?') > -1 ? '&' : '?';
            img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
        };
        this.queue.addFn(request);
    }
    xhrRequest(url, data) {
        const request = () => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        };
        this.queue.addFn(request);
    }
    // 添加公告信息
    getTransportData(data) {
        return Object.assign(Object.assign({}, data), { uuid: this.uuid, userId: this.getUserId ? this.getUserId() : this.userId, apikey: this.apikey, sdkVersion: SDK_VERSION, pageUrl: location.href || '', deviceInfo: _support.deviceInfo, breadcrumb: breadcrumb.getStack() });
    }
    // 发送数据
    send(data) {
        const { beforeDataReport, useImageUpload, dsn } = this;
        if (!dsn)
            return;
        let transportData = this.getTransportData(data);
        if (typeof beforeDataReport === 'function') {
            transportData = beforeDataReport(data);
        }
        if (!transportData)
            return;
        const beaconResult = this.beacon(dsn, transportData);
        if (!beaconResult) {
            if (useImageUpload) {
                this.imgRequest(this.dsn, data);
            }
            else {
                this.xhrRequest(this.dsn, data);
            }
        }
    }
    bindOptions(options) {
        const { dsn, apikey, userId, beforeDataReport, getUserId, useImgUpload } = options;
        bindOptionsHelp(this, 'dsn', dsn, 'string');
        bindOptionsHelp(this, 'apikey', apikey, 'string');
        bindOptionsHelp(this, 'userId', userId, 'string');
        bindOptionsHelp(this, 'beforeDataReport', beforeDataReport, 'function');
        bindOptionsHelp(this, 'getUserId', getUserId, 'function');
        bindOptionsHelp(this, 'useImgUpload', useImgUpload, 'boolean');
    }
}
const transportData = _support.transportData || (_support.transportData = new TransportData());

const EVENT_MAP = {};
function subscribe(handler) {
    var _a;
    if (!handler)
        return false;
    if (Array.isArray(EVENT_MAP[handler.type])) {
        (_a = EVENT_MAP[handler.type]) === null || _a === void 0 ? void 0 : _a.push(handler.callback);
    }
    else {
        EVENT_MAP[handler.type] = [handler.callback];
    }
    return true;
}
function notify(type, data) {
    var _a, _b;
    if (Array.isArray(EVENT_MAP[type]) && ((_a = EVENT_MAP[type]) === null || _a === void 0 ? void 0 : _a.length)) {
        (_b = EVENT_MAP[type]) === null || _b === void 0 ? void 0 : _b.forEach((f) => f(data));
    }
}

var errorStackParser = {exports: {}};

var stackframe = {exports: {}};

var hasRequiredStackframe;

function requireStackframe () {
	if (hasRequiredStackframe) return stackframe.exports;
	hasRequiredStackframe = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory();
		    }
		}(commonjsGlobal, function() {
		    function _isNumber(n) {
		        return !isNaN(parseFloat(n)) && isFinite(n);
		    }

		    function _capitalize(str) {
		        return str.charAt(0).toUpperCase() + str.substring(1);
		    }

		    function _getter(p) {
		        return function() {
		            return this[p];
		        };
		    }

		    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
		    var numericProps = ['columnNumber', 'lineNumber'];
		    var stringProps = ['fileName', 'functionName', 'source'];
		    var arrayProps = ['args'];
		    var objectProps = ['evalOrigin'];

		    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

		    function StackFrame(obj) {
		        if (!obj) return;
		        for (var i = 0; i < props.length; i++) {
		            if (obj[props[i]] !== undefined) {
		                this['set' + _capitalize(props[i])](obj[props[i]]);
		            }
		        }
		    }

		    StackFrame.prototype = {
		        getArgs: function() {
		            return this.args;
		        },
		        setArgs: function(v) {
		            if (Object.prototype.toString.call(v) !== '[object Array]') {
		                throw new TypeError('Args must be an Array');
		            }
		            this.args = v;
		        },

		        getEvalOrigin: function() {
		            return this.evalOrigin;
		        },
		        setEvalOrigin: function(v) {
		            if (v instanceof StackFrame) {
		                this.evalOrigin = v;
		            } else if (v instanceof Object) {
		                this.evalOrigin = new StackFrame(v);
		            } else {
		                throw new TypeError('Eval Origin must be an Object or StackFrame');
		            }
		        },

		        toString: function() {
		            var fileName = this.getFileName() || '';
		            var lineNumber = this.getLineNumber() || '';
		            var columnNumber = this.getColumnNumber() || '';
		            var functionName = this.getFunctionName() || '';
		            if (this.getIsEval()) {
		                if (fileName) {
		                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		                }
		                return '[eval]:' + lineNumber + ':' + columnNumber;
		            }
		            if (functionName) {
		                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		            }
		            return fileName + ':' + lineNumber + ':' + columnNumber;
		        }
		    };

		    StackFrame.fromString = function StackFrame$$fromString(str) {
		        var argsStartIndex = str.indexOf('(');
		        var argsEndIndex = str.lastIndexOf(')');

		        var functionName = str.substring(0, argsStartIndex);
		        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
		        var locationString = str.substring(argsEndIndex + 1);

		        if (locationString.indexOf('@') === 0) {
		            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
		            var fileName = parts[1];
		            var lineNumber = parts[2];
		            var columnNumber = parts[3];
		        }

		        return new StackFrame({
		            functionName: functionName,
		            args: args || undefined,
		            fileName: fileName,
		            lineNumber: lineNumber || undefined,
		            columnNumber: columnNumber || undefined
		        });
		    };

		    for (var i = 0; i < booleanProps.length; i++) {
		        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
		        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
		            return function(v) {
		                this[p] = Boolean(v);
		            };
		        })(booleanProps[i]);
		    }

		    for (var j = 0; j < numericProps.length; j++) {
		        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
		        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
		            return function(v) {
		                if (!_isNumber(v)) {
		                    throw new TypeError(p + ' must be a Number');
		                }
		                this[p] = Number(v);
		            };
		        })(numericProps[j]);
		    }

		    for (var k = 0; k < stringProps.length; k++) {
		        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
		        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
		            return function(v) {
		                this[p] = String(v);
		            };
		        })(stringProps[k]);
		    }

		    return StackFrame;
		})); 
	} (stackframe));
	return stackframe.exports;
}

(function (module, exports) {
	(function(root, factory) {
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

	    /* istanbul ignore next */
	    {
	        module.exports = factory(requireStackframe());
	    }
	}(commonjsGlobal, function ErrorStackParser(StackFrame) {

	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         *
	         * @param {Error} error object
	         * @return {Array} of StackFrames
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },

	        // Separate line and column numbers from a string of the form: (URI:Line:Column)
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }

	            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
	            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
	            return [parts[1], parts[2] || undefined, parts[3] || undefined];
	        },

	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this);

	            return filtered.map(function(line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
	                }
	                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

	                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
	                // case it has spaces in it, as the string is split on \s+ later on
	                var location = sanitizedLine.match(/ (\(.+\)$)/);

	                // remove the parenthesized location from the line, if it was matched
	                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

	                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
	                // because this line doesn't have function name
	                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
	                var functionName = location && sanitizedLine || undefined;
	                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

	                return new StackFrame({
	                    functionName: functionName,
	                    fileName: fileName,
	                    lineNumber: locationParts[1],
	                    columnNumber: locationParts[2],
	                    source: line
	                });
	            }, this);
	        },

	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this);

	            return filtered.map(function(line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
	                }

	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame({
	                        functionName: line
	                    });
	                } else {
	                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
	                    var matches = line.match(functionNameRegex);
	                    var functionName = matches && matches[1] ? matches[1] : undefined;
	                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

	                    return new StackFrame({
	                        functionName: functionName,
	                        fileName: locationParts[0],
	                        lineNumber: locationParts[1],
	                        columnNumber: locationParts[2],
	                        source: line
	                    });
	                }
	            }, this);
	        },

	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },

	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];

	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame({
	                        fileName: match[2],
	                        lineNumber: match[1],
	                        source: lines[i]
	                    }));
	                }
	            }

	            return result;
	        },

	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];

	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(
	                        new StackFrame({
	                            functionName: match[3] || undefined,
	                            fileName: match[2],
	                            lineNumber: match[1],
	                            source: lines[i]
	                        })
	                    );
	                }
	            }

	            return result;
	        },

	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            var filtered = error.stack.split('\n').filter(function(line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
	            }, this);

	            return filtered.map(function(line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                    .replace(/<anonymous function(: (\w+))?>/, '$2')
	                    .replace(/\([^)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
	                    undefined : argsRaw.split(',');

	                return new StackFrame({
	                    functionName: functionName,
	                    args: args,
	                    fileName: locationParts[0],
	                    lineNumber: locationParts[1],
	                    columnNumber: locationParts[2],
	                    source: line
	                });
	            }, this);
	        }
	    };
	})); 
} (errorStackParser));

var errorStackParserExports = errorStackParser.exports;
var ErrorStackParser = /*@__PURE__*/getDefaultExportFromCjs(errorStackParserExports);

// 过滤不上报接口
function isFilterHttpReq(url) {
    if (globalOptions.filterXhrUrlRegExp && url) {
        return globalOptions.filterXhrUrlRegExp.test(url);
    }
    return false;
}
// 处理接口数据
function handleHttpData(data) {
    let message = '';
    let statusType;
    const { status, response, elapsedTime, statusText, time, requestData, method, type, } = data;
    if (status === 0) {
        statusType = STATUS_CODE.ERROR;
        message =
            elapsedTime > globalOptions.timeout
                ? '请求超时'
                : `请求未响应，status: ${status}`;
    }
    else if (status < 400) {
        statusType = STATUS_CODE.OK;
        if (typeof globalOptions.handleHttpStatus === 'function') {
            if (globalOptions.handleHttpStatus(data)) {
                statusType = STATUS_CODE.OK;
            }
            else {
                statusType = STATUS_CODE.ERROR;
                message = `接口异常，status: ${status}; ${typeof response === 'string' ? response : JSON.stringify(response)}`;
            }
        }
    }
    else {
        statusType = STATUS_CODE.ERROR;
        message = statusText;
    }
    message = `url: ${data.url}; status: ${status}; ${message}`;
    return {
        statusType,
        message,
        status,
        time,
        elapsedTime,
        url: data.url,
        requestData: {
            httpType: type,
            method,
            data: requestData || '',
        },
        response: {
            status,
            data: statusType == STATUS_CODE.ERROR ? response : null,
        },
    };
}

const HandleEvents = {
    handleHttp(data, type) {
        const transformData = handleHttpData(data);
        if (!data.url.includes(globalOptions.dsn)) {
            breadcrumb.push({
                type,
                category: breadcrumb.getCategory(type),
                data: transformData,
                status: transformData.status,
                time: data.time,
            });
        }
        if (transformData.statusType === STATUS_CODE.ERROR) {
            transportData.send(transformData);
        }
    },
    handleError(err) {
        const target = err.target;
        const stackFrame = ErrorStackParser.parse(!target ? err : err.error)[0];
        const { fileName, columnNumber, lineNumber } = stackFrame;
        const errorData = {
            type: EVENTTYPES.ERROR,
            time: getTimestamp(),
            statusType: STATUS_CODE.ERROR,
            fileName,
            col: columnNumber,
            line: lineNumber,
            message: err.message,
            stack: err.error.stack,
        };
        breadcrumb.push({
            type: EVENTTYPES.ERROR,
            category: breadcrumb.getCategory(EVENTTYPES.ERROR),
            data: errorData,
            time: errorData.time,
        });
        const hash = getErrorUid(`${err.message};${fileName}:${columnNumber}:${lineNumber}`);
        if (!hasExitHash(hash)) {
            transportData.send(errorData);
        }
    },
    handleHistory(data) {
        const { from, to } = data;
        breadcrumb.push({
            type: EVENTTYPES.HISTORY,
            category: breadcrumb.getCategory(EVENTTYPES.HISTORY),
            data: {
                from,
                to,
            },
            time: getTimestamp(),
        });
    },
    handleHashChange(data) {
        const { newURL: to, oldURL: from } = data;
        breadcrumb.push({
            type: EVENTTYPES.HASHCHANGE,
            category: breadcrumb.getCategory(EVENTTYPES.HASHCHANGE),
            data: {
                from,
                to,
            },
            time: getTimestamp(),
        });
    },
    handleunrejection(data) {
        if (typeof data.reason === 'string')
            return;
        const stackFrame = ErrorStackParser.parse(data.reason)[0];
        const { fileName, columnNumber, lineNumber } = stackFrame;
        const errorData = {
            type: EVENTTYPES.UNHANDLEDREJECTION,
            time: getTimestamp(),
            statusType: STATUS_CODE.ERROR,
            fileName,
            col: columnNumber,
            line: lineNumber,
            message: data.reason.message,
            stack: data.reason.stack,
        };
        breadcrumb.push({
            type: EVENTTYPES.UNHANDLEDREJECTION,
            category: breadcrumb.getCategory(EVENTTYPES.UNHANDLEDREJECTION),
            data: errorData,
            time: errorData.time,
        });
        const hash = getErrorUid(`${data.reason.message};${fileName}:${columnNumber}:${lineNumber}`);
        if (!hasExitHash(hash)) {
            transportData.send(errorData);
        }
    },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function replace(handler) {
    switch (handler.type) {
        case EVENTTYPES.XHR:
            replaceXHR();
            break;
        case EVENTTYPES.FETCH:
            replaceFetch();
            break;
        case EVENTTYPES.ERROR:
            listenError();
            break;
        case EVENTTYPES.HISTORY:
            historyHandle();
            break;
        case EVENTTYPES.HASHCHANGE:
            hashHandle();
            break;
        case EVENTTYPES.UNHANDLEDREJECTION:
            handlerejection();
            break;
    }
}
function replaceXHR() {
    if (!('XMLHttpRequest' in window))
        return;
    const XMLOriginProto = XMLHttpRequest.prototype;
    // replace open
    replaceAop(XMLOriginProto, 'open', function (originOpen) {
        return function (...args) {
            this.websee_xhr = {
                method: typeof args[0] === 'string' ? args[0].toUpperCase() : args[0],
                url: args[1],
                sTime: getTimestamp(),
                type: EVENTTYPES.XHR,
            };
            originOpen.apply(this, args);
        };
    });
    // replace send
    replaceAop(XMLOriginProto, 'send', function (originSend) {
        return function (...args) {
            const { url } = this.websee_xhr;
            on(this, 'loadend', () => {
                if (isFilterHttpReq(url))
                    return;
                const { response, status, responseType, statusText } = this;
                this.websee_xhr.requestData = args[0];
                const eTime = getTimestamp();
                // 接口执行时间
                this.websee_xhr.elapsedTime = eTime - this.websee_xhr.sTime;
                this.websee_xhr.status = status;
                this.websee_xhr.statusText = statusText;
                if (['', 'json', 'text'].includes(responseType)) {
                    this.websee_xhr.response = response;
                }
                notify(EVENTTYPES.XHR, this.websee_xhr);
            });
            originSend.apply(this, args);
        };
    });
}
function replaceFetch() {
    if (!('fetch' in window))
        return;
    replaceAop(window, EVENTTYPES.FETCH, function (originFetch) {
        return function (url, config = {}) {
            const sTime = getTimestamp();
            let fetchData = {
                type: EVENTTYPES.FETCH,
                method: config.method || 'GET',
                url,
                sTime,
                requestData: config.body,
                response: '',
            };
            return originFetch
                .apply(window, [url, config])
                .then((res) => {
                if (isFilterHttpReq(url))
                    return res;
                const tempRes = res.clone();
                const eTime = getTimestamp();
                fetchData = Object.assign(fetchData, {
                    elapsedTime: eTime - sTime,
                    status: tempRes.status,
                    statusText: tempRes.statusText,
                    time: eTime,
                });
                tempRes.text().then((text) => {
                    fetchData.response = text;
                });
                notify(EVENTTYPES.FETCH, fetchData);
                return res;
            })
                .catch((err) => {
                const eTime = getTimestamp();
                fetchData = Object.assign(fetchData, {
                    elapsedTime: eTime - sTime,
                    time: eTime,
                    status: 0,
                    statusText: err.message,
                });
                notify(EVENTTYPES.FETCH, fetchData);
                throw err;
            });
        };
    });
}
// error
function listenError() {
    on(_global, 'error', (e) => {
        console.log('error>>>>>', e);
        notify(EVENTTYPES.ERROR, e);
    });
}
// history
let lastHref = window.location.href;
function historyHandle() {
    const oldOnpopstate = _global.onpopstate;
    _global.onpopstate = function (...args) {
        const to = window.location.href;
        const from = lastHref;
        lastHref = to;
        notify(EVENTTYPES.HISTORY, {
            from,
            to,
        });
        oldOnpopstate === null || oldOnpopstate === void 0 ? void 0 : oldOnpopstate.apply(this, args);
    };
    function replaceStateFn(originFn) {
        return function (...args) {
            const url = args.length > 2 ? args[2] : '';
            if (url) {
                const to = url;
                const from = lastHref;
                lastHref = to;
                notify(EVENTTYPES.HISTORY, {
                    from,
                    to,
                });
                originFn.apply(this, args);
            }
        };
    }
    replaceAop(_global, 'replaceState', replaceStateFn);
    replaceAop(_global, 'pushState', replaceStateFn);
}
function hashHandle() {
    on(_global, 'hashchange', (e) => {
        notify(EVENTTYPES.HASHCHANGE, e);
    });
}
function handlerejection() {
    on(_global, 'unhandledrejection', (e) => {
        notify(EVENTTYPES.UNHANDLEDREJECTION, e);
    });
}

function setupReplace() {
    // 重写XMLHttpRequest
    addReplaceHandler({
        type: EVENTTYPES.XHR,
        callback: (data) => {
            HandleEvents.handleHttp(data, EVENTTYPES.XHR);
        },
    });
    // 重写fetch
    addReplaceHandler({
        type: EVENTTYPES.FETCH,
        callback: (data) => {
            HandleEvents.handleHttp(data, EVENTTYPES.FETCH);
        },
    });
    // 捕获错误
    addReplaceHandler({
        callback: (error) => {
            HandleEvents.handleError(error);
        },
        type: EVENTTYPES.ERROR,
    });
    // router history
    addReplaceHandler({
        callback: (data) => {
            HandleEvents.handleHistory(data);
        },
        type: EVENTTYPES.HISTORY,
    });
    // router hash
    addReplaceHandler({
        callback: (data) => {
            HandleEvents.handleHashChange(data);
        },
        type: EVENTTYPES.HASHCHANGE,
    });
    // unhandledrejection
    addReplaceHandler({
        callback: (data) => {
            HandleEvents.handleunrejection(data);
        },
        type: EVENTTYPES.UNHANDLEDREJECTION,
    });
}
function addReplaceHandler(handler) {
    subscribe(handler);
    replace(handler);
}

function init(options) {
    if (!options.dsn || !options.apikey) {
        return console.error('options.dsn or options.apikey is required');
    }
    if (!('fetch' in _global) || options.disabled)
        return;
    // 全局标识
    setGlobalOptions(options);
    // 用户行为
    breadcrumb.bindOptions(options);
    // transportData 配置上报的信息
    transportData.bindOptions(options);
    // 其他配置
    globalOptions.bindOptions(options);
    // 重写浏览器原生事件并注册回调
    setupReplace();
}
function install(Vue, options) {
    if (getFlag(EVENTTYPES.VUE))
        return;
    setFlag(EVENTTYPES.VUE, true);
    const errorHandle = Vue.config.errorHandler;
    Vue.config.errorHandler = function (err, vm, info) {
        HandleEvents.handleError(err);
        errorHandle === null || errorHandle === void 0 ? void 0 : errorHandle.apply(null, [err, vm, info]);
    };
    init(options);
}
var index = {
    init,
    install,
};

export { index as default };
//# sourceMappingURL=index.esm.js.map
