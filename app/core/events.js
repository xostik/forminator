var EventableMixin = {
    trigger: function(eventName, params, additionArgs){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            handlers = this._getHandlersByName(eventNameSeparated.name),
            adaptedArgs = this._prepareArgumentsForTrigger(eventName, params),
            result = true,
            result_i, handlerTags, triggerable;

        for(var i = 0, ii = handlers.length; i<ii; i++){
            handlerTags = handlers[i]._tags;
            triggerable = true;
            for(var tag in tags){
                if( !(tag in handlerTags)){
                    triggerable = false;
                }
            }

            if(handlers[i]._owner && handlers[i]._owner.isRemoved && handlers[i]._owner.isRemoved()){
                handlers.splice(i, 1);
                i--;
                continue;
            }

            if(triggerable){
                result_i = handlers[i](adaptedArgs, additionArgs, handlers[i]._data);
                if( result_i !== false ){
                    result_i = true;
                }
                result = result && result_i;
            }
        }

        if(params && params.direction){
            if(params.direction == 'bubbling'){
                this._bubblingEvent(eventName, adaptedArgs);
            }
            if(params.direction == 'capturing'){
                this._capturingEvent(eventName, adaptedArgs);
            }
        }

        return result;
    },

    on: function(eventName, handler, data, owner){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            handlers = this._getHandlersByName(eventNameSeparated.name),
            eventsListWithTag;

        handler._data = data;
        handler._tags = tags;
        handler._owner = owner;

        handlers.push(handler);
    },

    off: function(eventName, handler){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            handlers = this._getHandlersByName(eventNameSeparated.name),
            removeList = [],
            handlerTags, removable;

        for(var i = 0, ii = handlers.length; i<ii; i++){
            handlerTags = handlers[i]._tags;
            removable = true;
            for(var tag in tags){
                if( !(tag in handlerTags)){
                    removable = false;
                }
            }

            if(removable){
                handlers.splice(i, 1);
                i--;
                ii--;
            }
        }
    },

    _getHandlersByName: function(eventName){
        this.handlers = this.handlers || {};

        if(!this.handlers[eventName]){
            this.handlers[eventName] = [];
        }

        return this.handlers[eventName];
    },


    _bubblingEvent: function(eventName, sourceEventData){
        if(!this.getParent){
            throw 'EventableMixin._bubblingEvent(): attempt to bubble a event on structure not supported bubbling (not implemented method getParent)';
        }

        var parent = this.getParent(),
            args = {
                sourceEventData: sourceEventData,
                direction: sourceEventData.direction,
                type: sourceEventData.type
            };

        if('value' in  sourceEventData){
            params.value = sourceEventData.value;
        }

        parent.trigger(sourceEventData.type, args);
    },

    _capturingEvent: function(eventName, sourceEventData){
        if(!this.getChildren){
            throw 'EventableMixin._capturingEvent(): attempt to capturing a event on structure not supported capturing (not implemented method getChildren)';
        }

        var children = this.getChildren(),
            args = {
                sourceEventData: sourceEventData,
                direction: sourceEventData.direction,
                type: sourceEventData.type
            };

        if('value' in  sourceEventData){
            params.value = sourceEventData.value;
        }

        for(var i = 0, ii = children.length; i < ii; i++){
            children[i].trigger(sourceEventData.type, args);
        }

    },

    _prepareArgumentsForTrigger: function(eventName, args){
        var result = {};
        args = args || {};

        result.currentTarget = this;
        result.type = eventName;

        if('value' in args){ result.value = args.value; }
        if('direction' in args){ result.direction = args.direction; }

        if(args.sourceEventData){
            result.parentEvent = args.sourceEventData;
            result.historySize = args.sourceEventData.historySize + 1;
            result.target = args.sourceEventData.target;
        }else{
            result.target = this;
            result.historySize = 0;
        }

        return result;
    },

    _separateEventName: function(name){
        var paths = name.split('.'),
            result = {
                name: paths[0]
            };

        paths.splice(0, 1);
        result.tags = {};

        for(var i = 0, ii = paths.length; i<ii; i++){
            result.tags[paths[i]] = true;
        }

        return result;
    }
};

var TreeEventableMixin = {
    on: function(eventName, handler, data, owner){
        var nodeWithHandlers = this._getHandlersByEventName(eventName);
        var bindId;

        nodeWithHandlers._counter = nodeWithHandlers._counter || 1;
        bindId = nodeWithHandlers._counter;
        nodeWithHandlers._counter++;

        handler._data = data;
        handler._owner = owner;
        handler._bindId = bindId;

        nodeWithHandlers[bindId] = handler;

        return bindId;
    },

    off: function(eventName, bindId){
        var nodeWithHandlers = this._getHandlersByEventName(eventName);

        if(bindId){
            if(nodeWithHandlers[bindId]){
                delete nodeWithHandlers[bindId];
            }
        }else{
            this._clearObject(nodeWithHandlers);
        }
    },

    trigger: function(eventName, data, params){
        var nodeWithHandlers = this._getHandlersByEventName(eventName);
        var deindexedEventName;

        for(var k in nodeWithHandlers){
            if(typeof nodeWithHandlers[k] == 'function'){
                nodeWithHandlers[k](data, nodeWithHandlers[k]._data);
            }
        }

        deindexedEventName = this._deindexEventName(eventName);

        if(deindexedEventName != eventName){
            nodeWithHandlers = this._getHandlersByEventName(deindexedEventName);

            for(var k in nodeWithHandlers){
                if(typeof nodeWithHandlers[k] == 'function'){
                    nodeWithHandlers[k](data, nodeWithHandlers[k]._data);
                }
            }
        }
    },

    triggerTree: function(eventName, data, params){
        var splitted = this._splitEventName(eventName);
        var paths = splitted.path;
        var eventName = splitted.eventName;

        for(var i = paths.length-1; i>=0; i++){
            if(this._isIntegerInString(paths[i])){
                break;
            }else{

            }
        }
        // идти от последнего до первого path и ттриггерить события, если не цифра
        // взять дерево хендлеров и сделать обход останавливаясь на цифрах
    },

    _getHandlersByEventName: function(eventName){ // eventName:path.path.path...
        var splitted = this._splitEventName(eventName);
        var paths = splitted.path;
        var eventName = splitted.eventName;
        var nodeWithHandlers;


        this._handlers = this._handlers || {};
        nodeWithHandlers = this._handlers;

        for(var i = 0, ii = paths.length; i<ii; i++){
            if(!nodeWithHandlers[paths[i]]){
                nodeWithHandlers[paths[i]] = {};
            }
            nodeWithHandlers = nodeWithHandlers[paths[i]];
        }

        if(!nodeWithHandlers[eventName]){
            nodeWithHandlers[eventName] = {};
        }
        nodeWithHandlers = nodeWithHandlers[eventName];

        return nodeWithHandlers;
    },

    _splitEventName: function(eventName){
        var paths = eventName.split('.');
        var firstPaths = paths[0].split(':');
        var eventName;

        eventName = firstPaths[0] + ':';
        if(firstPaths.length == 2){
            paths[0] = firstPaths[1];
        }else{
            paths = [];
        }

        return {
            eventName: eventName,
            paths: paths
        };
    },

    _deindexEventName: function(eventName){
        var result = '.' + eventName + '.';
        result = result.replace(/\.\d+\./g, '.@i.');
        return result.substr(1, result.length-2);
    },

    _clearObject: function(obj){
        for(var k in obj){
            delete obj[k];
        }
    },

    _isIntegerInString: function(s){
        return /^\d+$/.test(s);
    }
};

