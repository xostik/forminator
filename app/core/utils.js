_.extend( kulibin.utils, {
    findObjectPropertyByPath: function(object, path){
        if(!path){
            return object;
        }

        var paths = path.split('.');
        var key;
        var result = object;

        if($.isPlainObject(object)){

            for(var i = 0, ii = paths.length; i < ii; i++){
                key = paths[i];
                result = result[key];

                if(result === undefined){
                    return undefined;
                }
            }

            return result;

        }else{
            return undefined;
        }
    },

    setValueToObjectByPath: function(object, path, value){
        if(!path){
            this.replaceObject(object, value);
            return;
        }

        var paths = path.split('.');
        var key;
        var result = object;

        for(var i = 0, ii = paths.length - 1; i < ii; i++){
            key = paths[i];
            result = result[key];

            if(result === undefined){
                result[key] = {};
                result = result[key];
            }
        }

        key = paths[paths.length - 1];
        result[key] = value;
    },

    replaceObject: function(o1, o2){
        if(o1 != o2){
            for(var k in o1){
                delete o1[k];
            }

            if(o2){
                for(var k in o2){
                    o1[k] = o2[k];
                }
            }
        }
    }
});


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