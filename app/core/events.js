var EventableMixin = {
    trigger: function(eventName, params, additionArgs){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            handlers = this._getHandlersWithTag(eventNameSeparated.name, '_noTag'),
            adaptedArgs = this._prepareArgumentsForTrigger(eventName, params),
            handleList = [],
            triggerable;

        for(var i = 0, ii = handlers.length; i<ii; i++){
            handlerTags = handlers[i]._tags;
            triggerable = true;
            for(var tag in tags){
                if( !(tag in handlerTags)){
                    triggerable = false;
                }
            }

            if(triggerable){
                handlers[i](adaptedArgs, additionArgs, handlers[i]._data);
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
    },

    on: function(eventName, handler, data){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            handlers = this._getHandlersByName(eventNameSeparated.name),
            eventsListWithTag;

        tags['_noTag'] = true;
        handler._data = data;
        handler._tags = tags;

        for(var tag in tags){
            eventsListWithTag = this._getHandlersWithTag(eventNameSeparated.name, tag);

            eventsListWithTag.push(handler);
        }
    },

    off: function(eventName, handler){
        var eventNameSeparated = this._separateEventName(eventName),
            tags = eventNameSeparated.tags,
            eventsListWithTag, index;

        if(tags.length == 0){
            tags['_noTag'] = true;
        }


        for(var tag in tags){
            eventsListWithTag = this._getHandlersWithTag(eventNameSeparated.name, tag);

            if(handler){
                index = eventsListWithTag.indexOf(handler);
                if(index > -1){
                    eventsListWithTag.splice(index, 1);
                }
            }else{
                eventsListWithTag.splice(0, eventsListWithTag.length);
            }

        }
    },

    _getHandlersByName: function(eventName){
        this.handlers = this.handlers || {};

        if(!this.handlers[eventName]){
            this.handlers[eventName] = {};
        }

        return this.handlers[eventName];
    },

    _getHandlersWithTag: function(eventName, tagName){
        if(!this.handlers[eventName][tagName]){
            this.handlers[eventName][tagName] = [];
        }

        return this.handlers[eventName][tagName];
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