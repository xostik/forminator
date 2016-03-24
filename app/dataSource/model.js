var DataModel = function(){
    this.data = {};

    this.cacheOfProxyByPath = {};
};

_.extend(DataModel.prototype, {

    getProperty: function(property){
        return kulibin.utils.findObjectPropertyByPath(this.data, property);
    },

    setProperty: function(property, propertyValue){
        var currentValue = this.getProperty(property);
        kulibin.utils.setValueToObjectByPath(this.data, property, propertyValue);
        
        this._notifyAboutPropertyChanged(property, propertyValue, currentValue);
    },

    getProxy: function(path){
        if(this.cacheOfProxyByPath[path]){
            this.cacheOfProxyByPath[path] = new DataRelativeProxy(this, path);
        }

        return this.cacheOfProxyByPath[path];
    },

//    mergeToProperty: function(property, mergedValue){
//
//        this._notifyAboutPropertyChanged(property, mergedValue, 'merge');
//    },

    _notifyAboutPropertyChanged: function(property, propertyValue, oldValue){
        var args = {
            value: propertyValue,
            oldValue: oldValue
        };
        //this.triggerTree('propertyChanged:' + property, args);
        this.trigger('propertyChanged:' + property, args);
    }

}, TreeEventableMixin);



var DataRelativeProxy = function(model, path){
    this.model = model;
    this.path = path;
};

_.extend(DataRelativeProxy.prototype, {

    getProperty: function(property){
        var fullProperty = this._calcFullProperty(property);
        return this.model.getProperty(fullProperty);
    },

    setProperty: function(property, propertyValue){
        var fullProperty = this._calcFullProperty(property);
        this.model.setProperty(fullProperty, propertyValue);
    },

    getProxy: function(path){
        var fullProperty = this._calcFullProperty(path);
        return this.model.getProxy(fullProperty);
    },

    _calcFullProperty: function(property){
        if (!property){
            return this.path;
        }else if (!this.path){
            return property;
        }else{
            return this.path + '.' + property;
        }
    }
});