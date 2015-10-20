function elementByAddress($el, address){
    var rx = /^[~\$]\(([\s\S]+)\)$/,
        cleanAddress = rx.exec( address )[1],
        paths = cleanAddress.split('/'),
        selector = '',
        $res = $el,
        pathI;

    for( var i = 0, ii = paths.length; i < ii; i++ ){
        pathI = paths[i];
        switch(pathI){
            case '@this':{

            }break;

            case '@root':{
                $res = $res.parents().last();
            }break;

            case '**':{
                i++;
                pathI = paths[i];
                selector += ' .frm-' + pathI;
            }break;

            case '..':{
                $res = $res.parent();
            }break;

            case '..**':{
                i++;
                pathI = paths[i];
                if(selector.length > 0){
                    $res = $res.find(selector);
                    selector = '';
                }
                $res = upUntilPath(pathI);
            }break;

            default: { // name
                selector += ' > .frm-' + pathI;
            }
        }
    }

    if(selector.length > 0){
        $res = $res.find(selector);
    }

    return $res;
}

function upUntilPath($el, path){
    switch(pathI){
        case '@i':{
            return $el.parents('.frm-list-item');
        }break;

        case '@list':{
            return $el.parents('.frm-list');
        }break;

        default: { // name
            return $el.parents('.frm-' + path).eq(0);
        }
    }
}