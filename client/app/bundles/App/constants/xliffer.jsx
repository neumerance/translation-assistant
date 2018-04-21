import { cleanString } from '../constants/color';

let parseXML = null;

if (typeof window.DOMParser != "undefined") {
    parseXML = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
    new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXML = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}

export default class Xliffer {

    constructor() {
    }

    parseStringXliff2Json(xliff) {
        const self = this
        const data = JSON.parse(xml2json($.parseXML(cleanString(xliff)), ''))
        return self.cleanString(data)
    }

    isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        )
    }

    tagNonHtmlStrings(string, baseID) {
        // const self = this
        // const wrapper = $('<div>')
        // const arrString = $.parseHTML(string)
        // $.each(arrString, function(idx, o) {
        //     if(!self.isElement(o)) {
        //         wrapper.append( $('<i class="noselect nonHtml">').html(o).attr('id', baseID+'_'+idx) )
        //     } else {
        //         wrapper.append($(o))
        //     }
        // })
        // return wrapper.html()
        return string
    }

    replaceHtmlEntity(string) {
        return string.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g,"")
    }

    concatinateGandXtag(mrk) {
        let text = mrk['#text'] ? mrk['#text'] : ''
        let g = []
        let x = []
        if (mrk.g) {
            g = Array.isArray(mrk.g) ? g.concat(mrk.g) : g.concat([mrk.g])
        }
        if (mrk.x) {
            x = Array.isArray(mrk.x) ? x.concat(mrk.x) : g.concat([mrk.x])
        }
        $.each(g, function(idx, tag) {
            const wrapper = $('<div>').html(
                $('<g>').attr({
                    ctype: tag['@ctype'],
                    id: tag['@id']
                }).text( tag['#text'] )
            )
            text += ' ' + wrapper.html()
        })
        $.each(x, function(idx, tag) {
            const wrapper = $('<div>').html(
                $('<x>').attr({
                    ctype: tag['@ctype'],
                    id: tag['@id'],
                    'xhtml:class': tag['@xhtml:class']
                }).text( tag['#text'] )
            )
            text += ' ' + wrapper.html()
        })
        return text
    }

    cleanString(xliff) {
        const self = this
        if(Array.isArray(xliff.xliff.file.body['trans-unit'])) {
            $.each(xliff.xliff.file.body['trans-unit'], function(idx, unit) {
                if(unit['seg-source']) {
                    if(Array.isArray(unit['seg-source'].mrk)) {
                        $.each(['seg-source', 'target'], function(idx, node) {
                            $.each(unit[node].mrk, function(midx, mrk) {
                                mrk['#text'] = self.replaceHtmlEntity(self.concatinateGandXtag(mrk))
                                delete mrk.g
                                delete mrk.x
                            })
                        })
                    } else {
                        $.each(['seg-source', 'target'], function(idx, node) {
                            unit[node].mrk['#text'] = self.replaceHtmlEntity(self.concatinateGandXtag(unit[node].mrk))
                            delete unit[node].mrk.g
                            delete unit[node].mrk.x
                        })
                    }
                }
            })
        } else {
            if(xliff.xliff.file.body['trans-unit']['seg-source']) {
                if(Array.isArray(xliff.xliff.file.body['trans-unit']['seg-source'].mrk)) {
                    $.each(['seg-source', 'target'], function(idx, node) {
                        $.each(xliff.xliff.file.body['trans-unit'][node].mrk, function(midx, mrk) {
                            mrk['#text'] = self.replaceHtmlEntity(self.concatinateGandXtag(mrk))
                            delete mrk.g
                            delete mrk.x
                        })
                    })
                } else {
                    $.each(['seg-source', 'target'], function(idx, node) {
                        xliff.xliff.file.body['trans-unit'][node].mrk['#text'] = self.replaceHtmlEntity(self.concatinateGandXtag(xliff.xliff.file.body['trans-unit'][node].mrk))
                        delete xliff.xliff.file.body['trans-unit'][node].mrk.g
                        delete xliff.xliff.file.body['trans-unit'][node].mrk.x
                    })
                }
            }
        }
        return xliff
    }

    parseJson2XliffString(jsonXliff) {
        return json2xml(jsonXliff)
    }

}