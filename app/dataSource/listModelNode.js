var ListModelNode = AbstractModelNode.extend({
    model: AbstractModelNode
});

var ListDataSource = AbstractDataSource.extend({
    initialize: function(){
        var args = _.toArray(arguments);
        AbstractDataSource.prototype.initialize.apply(this, args);

        this.set('list', new CollectionfListDataSource());
    },

    remove: function(){
        this.get('list').each(function(child){
            child.remove();
        });

        AbstractDataSource.prototype.remove.apply(this);
    }

    //remove
});
