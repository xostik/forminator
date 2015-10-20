var ElementModel = Backbone.Model.extend({
    defaults: {
        name: null,
        text: null,
        enabled: true,
        visible: true,
        align: 'stretch',
        isReady: false,

        root: null,
        parent: null,
        nodeOnMap: null
    },

    initialize: function(){
        var parent = this.get('parent'),
            name = this.get('name'),
            nodeOnMap;

        if(parent === null){
            this.set('nodeOnMap', $('<div id="root-node"></div>'));
        }else{
            if(name === null){
                throw ('У элемента не задано имя ElementModel.initialize()');
            }

            nodeOnMap = $('<div class="frm-' + name + '"></div>');
            nodeOnMap.data('element', this);
            parent.get('nodeOnMap').append(nodeOnMap);
            this.set('nodeOnMap', nodeOnMap);
        }
    },

    remove: function(){
        /*var node = this.get('nodeOnMap'),
            children = node.children();
        for( var i = 0, ii = children.length; i < ii; i++){
            children[i].remove();
        }*/
        var node = this.get('nodeOnMap');
        this.trigger('remove');
        node.remove();
    }
});


var Element = Backbone.View.extend({

    initialize: function () {
        this.wasRendered = false;

        this.initName();
        //this.initText();
        this.initEnabled();
        this.initVisible();
        this.initAlign();


    },

    // +++ API +++

    getName: function(){
        return this.model.get('name');
    },

    setName: function(name){
        this.model.set('name', name);
    },

    getText: function(){
        return this.model.get('name');
    },

    setText: function(text){
        this.model.set('text', text);
    },

    getEnabled: function(){
        return this.model.get('enabled');
    },

    setEnabled: function(enabled){
        this.model.set('enabled', enabled);
    },

    getVisible: function(){
        return this.model.get('visible');
    },

    setVisible: function(visible){
        this.model.set('visible', visible);
    },

    getAlign: function(){
        return this.model.get('align');
    },

    setAlign: function(align){
        this.model.set('align', align);
    },

    // --- API ---

    initVisible: function () {
        this.listenTo(this.model, 'change:visible', this.updateVisible);
        this.updateVisible();
    },

    updateVisible: function () {
        var isVisible = this.model.get('visible');
        this.$el
            .toggleClass('hidden', !isVisible);
    },

    initAlign: function () {
        this.listenTo(this.model, 'change:align', this.updateHorizontalAlignment);
        this.updateHorizontalAlignment();
    },

    updateAlign: function () {
        var horizontalAlignment = this.model.get('horizontalAlignment');
        switch (horizontalAlignment) {
            case 'Left':
            {
                this.$el
                    .removeClass('center-block pull-right')
                    .addClass('pull-left');
                break;
            }
            case 'Right':
            {
                this.$el
                    .removeClass('pull-left center-block')
                    .addClass('pull-right');
                break;
            }
            case 'Center':
            {
                this.$el
                    .removeClass('pull-left pull-right')
                    .addClass('center-block');
                break;
            }
            case 'Stretch':
            {
                this.$el.removeClass('pull-left pull-right center-block');
                break;
            }
        }
    },

    initEnabled: function () {
        this.listenTo(this.model, 'change:enabled', this.updateEnabled);
        this.updateEnabled();
    },

    updateEnabled: function () {
        var isEnabled = this.model.get('enabled');
        this.$el
            .toggleClass('pl-disabled', !isEnabled);
    },

    initName: function () {
        this.listenTo(this.model, 'change:name', this.updateName);
        this.updateName();
    },

    updateName: function () {
        var newName = this.model.get('name'),
            currentName = this.$el.attr('data-pl-name');
        if (newName != currentName && typeof newName == 'string') {
            this.$el.attr('data-pl-name', newName);
        }
    },

    rerender: function () {
        if (this.wasRendered) {
            this.render();
        }
    },

    prerenderingActions: function () {
        this.wasRendered = true;
    },

    postrenderingActions: function () {
        this.model.set('isReady', true);
        this.trigger('onReady');
    },

    /**
     * Сохраняет в поле ui элементы по селектору в UI
     *
     * UI: {"name1": "selector1", "name2": "selector2"}
     */
    bindUIElements: function () {
        this.ui = {};

        if (typeof this.UI === 'undefined') {
            return;
        }

        for (var i in this.UI) {
            if (!this.UI.hasOwnProperty(i)) continue;

            this.ui[i] = this.$(this.UI[i]);
        }
    },

    remove: function(){
        Backbone.View.prototype.remove.apply(this);
    }
});

