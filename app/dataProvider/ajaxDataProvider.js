var AjaxDataSource = AbstractDataSource.extend({
    /*
    * pullAddress
    * pushAddress
    * */

    initialize: function(){

    },

    pullValue: function(){
        var answer = $.deferred();

        setTimeout(function(){
            answer.done({

            });
        }, 100);

        return answer;
    },

    pushValue: function(){

    }
});