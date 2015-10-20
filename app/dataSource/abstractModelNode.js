var NewModelNode = function(props){
    this.parent = props.parent;
    this.name = props.name;
    this.path = this.parent.path + '.' + this.name;
    this.value = props.value;
    this.type = this.getType();

    this.nodeOnMap = null;


    this.initialize();
};

_.extend(NewModelNode.prototype, {
    initialize: function(){
        this.children = {};
    },

    getValue: function(){
        return this.value;
    },

    setValue: function(value, args){
        var isCanBeChaned, isChildrenChanged;

        if(value != this.value){

            isCanBeChaned = this._notifyOnBeforeChanging(value);
            if(isCanBeChaned){
                this.value = value;
                this._notifyOnChanged();
            }
            //this._tryChangeChildren(value);
        }
    },

    mergeValue: function(value, args){

    },

    findNode: function(path){
        var pathItems = path.split('.');
        var nodeStep = this;

        for(var i = 0, ii = pathItems.length; i<ii; i++){
            nodeStep = this._findNodeByDirective(pathItems[i]);
            if(!nodeStep){
                return undefined;
            }
        }

        return nodeStep;
    },

    getType: function(){
        throw 'AbstractDataSource.getType(): not implemented method getType in descendant of AbstractDataSource';
    },

    getParent: function(){
        return this.parent;
    },

    _findNodeByDirective: function(stepDirective){
        if(stepDirective in this.directives){
            return this.directives[stepDirective].applyDirective(this);
        }else{
            return this.children[stepDirective];
        }
    },

    _notifyOnBeforeChanging: function(newValue){
        if(stepDirective in this.directives){
            return this.directives[stepDirective].applyDirective(this);
        }else{
            return this.children[stepDirective];
        }
    },

    directives: {
        '@this': {
            applyDirective: function(start){
                return start;
            }
        },

        '@parent': {
            applyDirective: function(start){
                return start.getParent();
            }
        }
    }
}, EventableMixin);



var AbstractModelNode = function(props){
    this.isRoot = !props.parent;
    this.parent = props.parent;
    this.name = props.name;
    this.value = props.value;
    this.type = this.getType();

    this.nodeOnMap = null;


    this.initialize();
};

_.extend( AbstractModelNode.prototype, {

    initialize: function(){
        this.initNodeOnMap();
        this.initValue();
    },

    getType: function(){
        throw 'AbstractDataSource.getType(): not implemented method getType in descendant of AbstractDataSource';
    },

    initNodeOnMap: function(){
        if(this.isRoot){
            this.nodeOnMap = $('<div id="root-node"></div>');
        }else{
            if(!this.name){
                throw ('AbstractDataSource.initialize(): not set the name');
            }

            this.nodeOnMap = $('<div class="frm-' + this.name + '"></div>');
            this.nodeOnMap.data('element', this);
            this.parent.getNodeOnMap().append(this.nodeOnMap);
        }
    },


    initValue: function(){
        throw ('AbstractDataSource.initValue(): not implemented method initValue in descendant of AbstractDataSource');
    },

    stepTo: function(address){
        var result =  elementByAddress(this.get('nodeOnMap'), address);
        if(result.length == 0){
            throw ('Неверный адресс "' + address + '" относительно элемента ' + this.get('name'));
        }

        return result.data('element');
    },

    setValue: function(value){
        // beforeSetValue с возможностью отменить присвоение
        this.value = value;
    },

    getValue: function(){
        return this.value;
    },

    getNodeOnMap: function(){
        return this.nodeOnMap;
    },

    remove: function(){
        var $node = this.get('nodeOnMap');

        this.trigger('remove');

        $node.remove();
    }

});
