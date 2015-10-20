var ValueModelNode = AbstractModelNode.extend({

    initialize: function(){
        var args = _.toArray(arguments);
        AbstractDataSource.prototype.initialize.apply(this, args);
    },

    pullValue: function(){
        var provider = this.get('dataProvider'),
            promise = $.deferred(),
            that = this;

        if(provider){
            provider.pullValue(function(value){
                that.set('value', value);
                promise.done(this, value);
            });
        }

        return promise;
    },

    pushValue: function(){
        var provider = this.get('dataProvider');

        if(provider){
            provider.pushValue(this.get('value'));
        }
    }

});
