function FakeEvent(){
}

_.extend(FakeEvent.prototype, EventableMixin);

function FakeEventWithHierarchy(){
    this.children = [];
    this.parent = null
}

_.extend(FakeEventWithHierarchy.prototype, EventableMixin, {
    getChildren: function(){
        return this.children;
    },

    getParent: function(){
        return this.parent;
    }
});