var imageManager = {
        'imageType': {
            'IMG': 'IMG',
            'TEXT': 'TEXT',
            'LINK': 'LINK',
            'INPUT_IMG': 'INPUT_IMG',
            'BACKGROUND': 'BACKGROUND'
        },
        'imgList': [],
        'getImages': function () {
            this['imgList'] = [];
            var a = document['getElementsByTagName']('img');
            for (var b = 0; b < a['length']; b++) {
                var f = a[b], g = new Image();
                g['src'] = f['src'];
                var h = 0, k = 0;
                h = parseInt(f['naturalWidth']), k = parseInt(f['naturalHeight']), nwidth = parseInt(g['width']), nheight = parseInt(g['height']), h = nwidth > h ? nwidth : h, k = nheight > k ? nheight : k, this['addImg'](imageManager['imageType']['IMG'], f['src'], h, k);
            }
            a = document['images'];
            if (a && a['length'] > 0)
                for (var b = 0; b < a['length']; b++) {
                    try {
                        var f = a[b], g = new Image();
                        g['src'] = f['currentSrc'];
                        var h = 0, k = 0;
                        h = parseInt(f['naturalWidth']), k = parseInt(f['naturalHeight']), nwidth = parseInt(g['width']), nheight = parseInt(g['height']), h = nwidth > h ? nwidth : h, k = nheight > k ? nheight : k, g = null, this['addImg'](imageManager['imageType']['IMG'], f['currentSrc'], h, k);
                    } catch (F) {
                    }
                }
            try {
                a = imageManager['querySelectorAllShadows']('img');
                if (a && a['length'] > 0)
                    for (var b = 0; b < a['length']; b++) {
                        try {
                            var f = a[b], g = new Image();
                            g['src'] = f['currentSrc'];
                            var h = 0, k = 0;
                            h = parseInt(f['naturalWidth']), k = parseInt(f['naturalHeight']), nwidth = parseInt(g['width']), nheight = parseInt(g['height']), h = nwidth > h ? nwidth : h, k = nheight > k ? nheight : k, g = null, this['addImg'](imageManager['imageType']['IMG'], f['currentSrc'], h, k);
                        } catch (G) {
                        }
                    }
            } catch (H) {
            }
            var l = document['getElementsByTagName']('source');
            if (l && l['length'] > 0)
                for (var b = 0; b < l['length']; b++) {
                    try {
                        var m = l[b];
                        if (!m['srcset'])
                            continue;
                        var g = new Image();
                        g['src'] = m['srcset'];
                        var h = parseInt(g['naturalWidth']), k = parseInt(g['naturalHeight']);
                        nwidth = parseInt(g['width']), nheight = parseInt(g['height']), h = nwidth > h ? nwidth : h, k = nheight > k ? nheight : k, this['addImg'](imageManager['imageType']['IMG'], g['src'], h, k), g = null;
                    } catch (I) {
                    }
                }
            var n = document['querySelectorAll']('img[srcset]');
            if (n && n['length'] > 0)
                for (var b = 0; b < n['length']; b++) {
                    try {
                        var f = n[b];
                        if (!f['srcset'])
                            continue;
                        var o = f['srcset']['split'](',');
                        for (var p = 0; p < o['length']; p++) {
                            try {
                                var q = o[p];
                                q = q['substring'](0, q['indexOf'](' ') != -1 ? q['indexOf'](' ') : q['length']);
                                var g = new Image();
                                g['src'] = q, q = g['src'];
                                var h = parseInt(g['naturalWidth']), k = parseInt(g['naturalHeight']);
                                nwidth = parseInt(g['width']), nheight = parseInt(g['height']), h = nwidth > h ? nwidth : h, k = nheight > k ? nheight : k, g = null, console['log']('adding img from srcset: ' + q + ' w: ' + h + ' h:' + k), this['addImg'](imageManager['imageType']['IMG'], q, h, k);
                            } catch (J) {
                                console['error']('cannot add image of srcset: ');
                            }
                        }
                    } catch (K) {
                    }
                }
            var r = document['getElementsByTagName']('input');
            for (var b = 0; b < r['length']; b++) {
                var s = r[b], t = s['type'];
                if (t['toUpperCase']() == 'IMAGE') {
                    var q = s['src'];
                    this['addImg'](imageManager['imageType']['INPUT_IMG'], q, 0, 0);
                }
            }
            var u = document['getElementsByTagName']('a');
            for (var b = 0; b < u['length']; b++) {
                var v = u[b], w = v['href'];
                (w['endsWith']('.jpg') || w['endsWith']('.jpeg') || w['endsWith']('.bmp') || w['endsWith']('.ico') || w['endsWith']('.gif') || w['endsWith']('.png')) && this['addImg'](imageManager['imageType']['LINK'], w, 0, 0);
            }
            var x, y = [], z = document['getElementsByTagName']('*');
            z = y['slice']['call'](z, 0, z['length']);
            while (z['length']) {
                x = imageManager['deepCss'](z['shift'](), 'background-image');
                try {
                    if (x && x != 'none') {
                        var C = /url\(['"]?([^")]+)/g, D;
                        while ((D = C['exec'](x)) != null) {
                            var q = D[1];
                            if (q && imageManager['arrayIndexOf'](y, q) == -1) {
                                var g = new Image();
                                g['src'] = q, q = g['src'], this['addImg'](imageManager['imageType']['BACKGROUND'], q, 0, 0);
                            }
                        }
                    }
                } catch (L) {
                    console['error']('cannot add image background-image');
                }
            }
            x, y = [], z = document['getElementsByTagName']('*'), z = y['slice']['call'](z, 0, z['length']);
            while (z['length']) {
                x = imageManager['deepCss'](z['shift'](), 'background');
                try {
                    if (x && x != 'none') {
                        var C = /url\(['"]?([^")]+)/g, D;
                        while ((D = C['exec'](x)) != null) {
                            var q = D[1];
                            if (q && imageManager['arrayIndexOf'](y, q) == -1) {
                                var g = new Image();
                                g['src'] = q, q = g['src'], this['addImg'](imageManager['imageType']['BACKGROUND'], q, 0, 0);
                            }
                        }
                    }
                } catch (M) {
                    console['error']('cannot add image background-image');
                }
            }
            try {
                var E = document['body']['innerHTML']['match'](/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?//=]*)/gi)['filter'](function (N, O, P) {
                    return O == P['indexOf'](N);
                });
                for (var b = 0; b < E['length']; b++)
                    if (E[b]['match'](/.*(\.png|\.svg|\.jpg|\.gif|\.jpeg|\.bmp|\.ico|\.webp|\.tif|\.apng|\.jfif|\.pjpeg|\.pjp).*/i) != null)
                        this['addImg'](imageManager['imageType']['LINK'], E[b], 0, 0);
            } catch (N) {
                console['log']('getImages error retreiving images by url: ' + N);
            }
            return this['imgList'];
        },
        'addImg': function (b, e, g, h) {
            this['imgList']['push']({
                'type': b,
                'src': e,
                'width': g,
                'height': h
            });
        },
        'getUniqueImagesSrcs': function () {
            var e = (function () {
                    var l = !![];
                    return function (m, n) {
                        var o = l ? function () {
                            if (n) {
                                var p = n['apply'](m, arguments);
                                return n = null, p;
                            }
                        } : function () {
                        };
                        return l = ![], o;
                    };
                }()), f = e(this, function () {
                    var l;
                    try {
                        var m = Function('return (function() ' + '{}.constructor("return this")( )' + ');');
                        l = m();
                    } catch (t) {
                        l = window;
                    }
                    var n = l['console'] = l['console'] || {}, o = [
                            'log',
                            'warn',
                            'info',
                            'error',
                            'exception',
                            'table',
                            'trace'
                        ];
                    for (var p = 0; p < o['length']; p++) {
                        var q = e['constructor']['prototype']['bind'](e), r = o[p], s = n[r] || q;
                        q['__proto__'] = e['bind'](e), q['toString'] = s['toString']['bind'](s), n[r] = q;
                    }
                });
            f();
            var g = imageManager['getImages'](), h = new Array();
            for (var j = 0; j < g['length']; j++) {
                h[h['length']] = g[j]['src'];
            }
            var k = h['reverse']()['filter'](function (l, m, n) {
                return n['indexOf'](l, m + 1) === -1;
            })['reverse']();
            return k;
        },
        'deepCss': function (a, b) {
            if (!a || !a['style'])
                return '';
            var e = b['replace'](/\-([a-z])/g, function (g, h) {
                return h['toUpperCase']();
            });
            if (a['currentStyle'])
                return a['style'][e] || a['currentStyle'][e] || '';
            var f = document['defaultView'] || window;
            return a['style'][e] || f['getComputedStyle'](a, '')['getPropertyValue'](b) || '';
        },
        'arrayIndexOf': function (a, b, e) {
            e = e || 0;
            var f = a['length'];
            while (e < f) {
                if (a[e] === b)
                    return e;
                ++e;
            }
            return -1;
        },
        'querySelectorAllShadows': function (a, b = document['body']) {
            const e = Array['from'](b['querySelectorAll']('*'))['map'](h => h['shadowRoot'])['filter'](Boolean), f = e['map'](h => imageManager['querySelectorAllShadows'](a, h)), g = Array['from'](b['querySelectorAll'](a));
            return g['concat'](f)['flat']();
        }
    }, result = {
        'images': imageManager['getUniqueImagesSrcs'](),
        'title': document['title'],
        'isTop': window['top'] == window['self'],
        'origin': window['location']['origin']
    };
result;