describe('Event', function () {

    describe('Events', function () {

        function genHierarchy(){
            var els = [];

            for(var i = 0; i < 5; i++){
                els.push( new FakeEventWithHierarchy());
            }

            els[0].children.push(els[1]);
            els[1].parent = els[0];

            els[0].children.push(els[2]);
            els[2].parent = els[0];

            els[1].children.push(els[3]);
            els[3].parent = els[1];

            els[3].children.push(els[4]);
            els[4].parent = els[3];

            return els[0];
        }

        it('Simplest event', function (done) {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler);

            //When
            ev.trigger('test');

            function testHandler(args){

                // Then
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.type, 'test', 'type of event is right');
                assert.equal(args.historySize, 0, 'history is empty');
                done();
            }
        });

        it('Unsubscribe event', function () {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler);
            ev.off('test', testHandler);

            //When
            ev.trigger('test');

            function testHandler(args){

                // Then
                assert.isTrue(false,'handler should not be callad');
            }
        });

        it('Unsubscribe namespace event', function () {
            // Given
            var ev = new FakeEvent(),
                wasCalled = false;
            ev.on('test', testHandler);
            ev.on('test.ns', testHandler2);
            ev.off('test.ns');

            //When
            ev.trigger('test');

            function testHandler(args){
                wasCalled = true;
            }

            function testHandler2(args){

                // Then
                assert.isTrue(false,'this callback should not be callad');
            }

            assert.isTrue(wasCalled,'one callback should  be callad');
        });

        it('Data in trigger', function (done) {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler);

            //When
            ev.trigger('test', undefined, 1);

            function testHandler(args, additionArgs){

                // Then
                assert.equal(additionArgs, 1, 'additional argument was passed right');
                done();
            }
        });

        it('Data in subscribe', function (done) {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler, 4);

            //When
            ev.trigger('test');

            function testHandler(args, triggerArgs, handleArgs){

                // Then
                assert.equal(handleArgs, 4, 'argument was passed right');
                done();
            }
        });


        it('Namespace event', function (done) {
            // Given
            var ev = new FakeEvent(),
                counter_1, counter_2;

            ev.on('test', testHandler);
            ev.on('test.ns', testHandler2);

            //When
            ev.trigger('test');
            ev.trigger('test.ns');

            function testHandler(args){
                counter_1++;

                // Then
                assert.isTrue(args.type == 'test', 'event type is right');
                done();
            }

            function testHandler2(args){
                counter_2++;

                // Then
                assert.isTrue(args.type == 'test' || args.type == 'test.ns', 'event type is right');
                done();
            }

            // Then
            assert.equal(counter_1, 1, 'event triggered once');
            assert.equal(counter_2, 1, 'event triggered twice');
        });


        it('Event with history and value', function (done) {
            // Given
            var ev = new FakeEvent(),
                params = {
                    direction: 'none',
                    target: 0,
                    currentTarget: 1,
                    type: 'test2',
                    parentEvent: {
                        direction: 'none',
                        target: 0,
                        currentTarget: 0,
                        type: 'test1',
                        historySize: 0,
                        value:3
                    },
                    historySize: 1,
                    value:4
                };
            ev.on('test3', testHandler);

            //When
            ev.trigger('test3', {sourceEventData: params, value: 4});

            function testHandler(args){

                // Then
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev, 'currentTarget is right');
                assert.equal(args.target, 0, 'target is right');
                assert.equal(args.value, 4, 'value is right');
                assert.equal(args.type, 'test3', 'event type is right');

                assert.equal(args.historySize, 2, 'history has 2 elements');
                assert.isDefined(args.parentEvent, 'has parent event');
                assert.isDefined(args.parentEvent.parentEvent, 'has parent event of parent event');
                assert.isUndefined(args.parentEvent.parentEvent.parentEvent, 'has not parent on 3 level of event hierarchy');
                done();
            }
        });

        it('Hierarchy simplest event', function (done) {
            // Given
            var ev = genHierarchy(),
                iterator = 0;
            ev = ev.children[0].children[0];

            ev.on('test', testHandler);
            ev.parent.on('test', testHandler2);
            ev.parent.parent.on('test', testHandler3);

            //When
            ev.trigger('test', {direction: 'bubbling'});

            // Then
            function testHandler(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 0, 'history is empty');
                assert.isUndefined(args.parentEvent, 'has not parent event');
                assert.equal(iterator, 0, 'this handler call first');
                iterator++;
            }
            function testHandler2(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev.parent, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 1, 'history has 1 element');
                assert.equal(iterator, 1, 'this handler call second');
                iterator++;
            }
            function testHandler3(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev.parent.parent, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 2, 'history has 2 element');
                assert.isDefined(args.parentEvent.parentEvent, 'has parent event of parent event');
                assert.isUndefined(args.parentEvent.parentEvent.parentEvent, 'has not parent on 3 level of event hierarchy');
                assert.equal(args.type, 'test', 'right type of event');
                assert.equal(iterator, 2, 'this handler call second');

                done();
            }
        });
    });


    describe('TreeEventableMixin', function () {

        function genHierarchy(){
            var els = [];

            for(var i = 0; i < 5; i++){
                els.push( new FakeEventWithHierarchy());
            }

            els[0].children.push(els[1]);
            els[1].parent = els[0];

            els[0].children.push(els[2]);
            els[2].parent = els[0];

            els[1].children.push(els[3]);
            els[3].parent = els[1];

            els[3].children.push(els[4]);
            els[4].parent = els[3];

            return els[0];
        }

        it('Simplest event', function (done) {
            // Given
            var ev = new FakeTreeEvent();
            var counter = 0;
            ev.on('change', testHandler);

            //When
            ev.trigger('change');

            function testHandler(){

                counter++;

                // Then
                assert.equal(counter, 1, 'testHandler callad in right order');
            }

            assert.equal(counter, 1, 'handlers is been called');
            done();
        });

        it('Event with path', function (done) {
            // Given
            var ev = new FakeTreeEvent();
            var counter = 0;
            ev.on('change:a', testHandler);
            ev.on('change:a.b', testHandler2);

            //When
            ev.trigger('change:a');
            ev.trigger('change:a.b');

            function testHandler(){

                counter++;

                // Then
                assert.equal(counter, 1, 'testHandler callad in right order');
            }

            function testHandler2(){

                counter++;

                // Then
                assert.equal(counter, 2, 'testHandler2 callad in right order');
            }

            assert.equal(counter, 2, 'handlers is been called');
            done();
        });

        it('Different events with one path', function (done) {
            // Given
            var ev = new FakeTreeEvent();
            var counter = 0;
            ev.on('change:a', testHandler);
            ev.on('click:a', testHandler2);

            //When
            ev.trigger('change:a');
            ev.trigger('click:a');

            function testHandler(){

                counter++;

                // Then
                assert.equal(counter, 1, 'testHandler callad in right order');
            }

            function testHandler2(){

                counter++;

                // Then
                assert.equal(counter, 2, 'testHandler2 callad in right order');
            }

            assert.equal(counter, 2, 'handlers is been called');
            done();
        });

        it('Unsubscribe simple event', function (done) {
            // Given
            var ev = new FakeTreeEvent();
            var counter = 0;
            ev.on('change', testHandler);

            //When
            ev.trigger('change');

            ev.off('change');

            ev.trigger('change');

            function testHandler(){

                counter++;

                // Then
                assert.equal(counter, 1, 'testHandler callad in right order');
            }

            assert.equal(counter, 1, 'handlers is been called');
            done();
        });

        it('Unsubscribe event from path', function (done) {
            // Given
            var ev = new FakeTreeEvent();
            var counter = 0;
            ev.on('change:a', testHandler);
            ev.on('change:a.b', testHandler2);

            //When
            ev.trigger('change:a');
            ev.trigger('change:a.b');

            ev.off('change:a');

            ev.trigger('change:a');
            ev.trigger('change:a.b');

            function testHandler(){

                counter++;

                // Then
                assert.equal(counter, 1, 'testHandler callad in right order');
            }

            assert.equal(counter, 1, 'handlers is been called');
            done();
        });

        it('Data in trigger', function (done) {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler);

            //When
            ev.trigger('test', undefined, 1);

            function testHandler(args, additionArgs){

                // Then
                assert.equal(additionArgs, 1, 'additional argument was passed right');
                done();
            }
        });

        it('Data in subscribe', function (done) {
            // Given
            var ev = new FakeEvent();
            ev.on('test', testHandler, 4);

            //When
            ev.trigger('test');

            function testHandler(args, triggerArgs, handleArgs){

                // Then
                assert.equal(handleArgs, 4, 'argument was passed right');
                done();
            }
        });


        it('Namespace event', function (done) {
            // Given
            var ev = new FakeEvent(),
                counter_1, counter_2;

            ev.on('test', testHandler);
            ev.on('test.ns', testHandler2);

            //When
            ev.trigger('test');
            ev.trigger('test.ns');

            function testHandler(args){
                counter_1++;

                // Then
                assert.isTrue(args.type == 'test', 'event type is right');
                done();
            }

            function testHandler2(args){
                counter_2++;

                // Then
                assert.isTrue(args.type == 'test' || args.type == 'test.ns', 'event type is right');
                done();
            }

            // Then
            assert.equal(counter_1, 1, 'event triggered once');
            assert.equal(counter_2, 1, 'event triggered twice');
        });


        it('Event with history and value', function (done) {
            // Given
            var ev = new FakeEvent(),
                params = {
                    direction: 'none',
                    target: 0,
                    currentTarget: 1,
                    type: 'test2',
                    parentEvent: {
                        direction: 'none',
                        target: 0,
                        currentTarget: 0,
                        type: 'test1',
                        historySize: 0,
                        value:3
                    },
                    historySize: 1,
                    value:4
                };
            ev.on('test3', testHandler);

            //When
            ev.trigger('test3', {sourceEventData: params, value: 4});

            function testHandler(args){

                // Then
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev, 'currentTarget is right');
                assert.equal(args.target, 0, 'target is right');
                assert.equal(args.value, 4, 'value is right');
                assert.equal(args.type, 'test3', 'event type is right');

                assert.equal(args.historySize, 2, 'history has 2 elements');
                assert.isDefined(args.parentEvent, 'has parent event');
                assert.isDefined(args.parentEvent.parentEvent, 'has parent event of parent event');
                assert.isUndefined(args.parentEvent.parentEvent.parentEvent, 'has not parent on 3 level of event hierarchy');
                done();
            }
        });

        it('Hierarchy simplest event', function (done) {
            // Given
            var ev = genHierarchy(),
                iterator = 0;
            ev = ev.children[0].children[0];

            ev.on('test', testHandler);
            ev.parent.on('test', testHandler2);
            ev.parent.parent.on('test', testHandler3);

            //When
            ev.trigger('test', {direction: 'bubbling'});

            // Then
            function testHandler(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 0, 'history is empty');
                assert.isUndefined(args.parentEvent, 'has not parent event');
                assert.equal(iterator, 0, 'this handler call first');
                iterator++;
            }
            function testHandler2(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev.parent, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 1, 'history has 1 element');
                assert.equal(iterator, 1, 'this handler call second');
                iterator++;
            }
            function testHandler3(args){
                assert.isDefined(args,'args is defined');
                assert.equal(args.currentTarget, ev.parent.parent, 'currentTarget is right');
                assert.equal(args.target, ev, 'target is right');
                assert.equal(args.historySize, 2, 'history has 2 element');
                assert.isDefined(args.parentEvent.parentEvent, 'has parent event of parent event');
                assert.isUndefined(args.parentEvent.parentEvent.parentEvent, 'has not parent on 3 level of event hierarchy');
                assert.equal(args.type, 'test', 'right type of event');
                assert.equal(iterator, 2, 'this handler call second');

                done();
            }
        });
    });

});

describe('Model', function () {
//
    function genHierarchy(){
        var els = [];

        /**
            {
                __GLOBAL__: {
                    a: {
                        type_: 'field',
                        default_: 'val_1'
                    },
                    b: {
                        type_: 'field',
                        default_: 2
                    }
                },

                __APPLICATION__:{
                    person: {
                        fname: {
                            type_: 'field',
                            default_: 'Имя'
                        },
                        sname: {
                            type_: 'field',
                            default_: 'Отчество'
                        },
                        lname: {
                            type_: 'field',
                            default_: 'Фамилия'
                        },
                        mainFotoUrl: {
                            type_: 'field',
                            default_: 'https://vk.com/images/deactivated_100.png'
                        }
                    },

                    test: {
                        __MODEL_ID__: 'model-124',
                        someField:{
                            type_: 'field',
                            default_: 0
                        }
                    },

                    commentsPager:{
                        dataPage: {
                            type_: 'field',
                            default_: 0
                        },
                        dataPageSize:{
                            type_: 'field',
                            default_: 100
                        },
                        dataCount: {
                            type_: 'field',
                            default_: null
                        }
                    },

                    originalComments: {

                        list: {
                            type_: 'collection',
                            id_: 'id',
                            isUniqItems_: true,
                            itemTemplate_: {
                                modelId_: 'data_modelId-1111',
                                cid:{
                                    type_: 'field',
                                    default_: null
                                },
                                userId: {
                                    type_: 'field',
                                    default_: null
                                },
                                parentId: {
                                    type_: 'field',
                                    default_: null
                                },
                                date: {
                                    type_: 'field',
                                    default_: null
                                },
                                text: {
                                    type_: 'field',
                                    default_: 'Comment text'
                                }
                            }
                        }
                    },

                    test2: {
                        type_: 'linkedModel',
                        link_: 'model-124'
                    },

                    comments: {
                        type_: 'linkedModel',
                        link_: 'model-123',

                        mapFrom_:[{
                            source_: '@this.@parent.commentsPager',
                            toProperty_: '',
                            map_: {
                                'dataPage': 'page',
                                'dataPageSize': 'pageSize',
                                'dataCount': 'count'
                            }

                        },{
                            source_: '@this.@parent.originalComments.@i',
                            toProperty_: '@this.@i',
                            map_: {
                                'cid': 'id'
                            }
                        }, {
                            source_: '@this.@parent.test',
                            toProperty_: '',
                            converters:{
                                type: 'direct',
                                to: function(v){
                                    return {
                                        smFld: v.someField
                                    };
                                },
                                from: function(v){
                                    return {
                                        someField: v.smFld
                                    };
                                }
                            }
                        }]
                    }
                }
            }

           {
                __MODEL_ID__: 'model-123',
                page: {
                    type: 'field',
                    default: 0
                },
                pageSize:{
                    type: 'field',
                    default: 100
                },
                count: {
                    type: 'field',
                    default: null
                },
                smFld: {

                },
                list: {
                    type: 'collection',
                    id: 'id',
                    uniqItems: true,
                    itemTemplate: {
                        id:{
                            type: 'field',
                            default: null
                        },
                        userId: {
                            type: 'field',
                            default: null
                        },
                        parentId: {
                            type: 'field',
                            default: null
                        },
                        date: {
                            type: 'field',
                            default: null
                        },
                        text: {
                            type: 'field',
                            default: 'Comment text'
                        }
                    }
                }
         * }
         *
         *
         *
         *  {
         *      root_: {
         *          list_1:[
         *              {
         *                  node_1_i1_1:{
         *                      value: 4
         *                  }
         *              },
         *
         *             {
         *                  node_2_2_i2_1:{
         *                      value: 6
         *                  }
         *              }
         *          ],
         *          node_2:{
         *              node_2_1:{
         *                  value: 4
         *              },
         *
         *              list_2_2: [
         *                  {
         *                      node_2_2_1:{
         *                          value: 4
         *                      }
         *                  },
         *
         *                  {
         *                      node_2_2_1:{
         *                          value: 6
         *                      }
         *                  }
         *              ]
         *          }
         *      }
         *  }
         */


        for(var i = 0; i < 5; i++){
            els.push( new FakeEventWithHierarchy());
        }

        els[0].children.push(els[1]);
        els[1].parent = els[0];

        els[0].children.push(els[2]);
        els[2].parent = els[0];

        els[1].children.push(els[3]);
        els[3].parent = els[1];

        els[3].children.push(els[4]);
        els[4].parent = els[3];

        return els[0];
    }

    describe('Value and Abstract Model', function () {
        it('found node', function () {
            // Given
            var model = genModel(),
                data = genData(),
                node1, node2, node3;

            //When
            node1 = model.getDataTree().find('@this.__APPLICATION__.person.fname');
            node2 = model.getDataTree().find('@this.__APPLICATION__.person');

            // Then
            assert.isUndefined(node1.getValue(), 'found node by name without data (is undefined result)');
            assert.isUndefined(node2.getValue(), 'found node (2) by name without data (is undefined result)');

            assert.isTrue(node1.isEmptyNode(), 'found node is empty');
            assert.isTrue(node2.isEmptyNode(), 'found node (2) is empty');


            //When
            model.getDataTree().setValue(data);
            node1 = model.getDataTree().find('@this.__APPLICATION__.person.fname');
            node2 = model.getDataTree().find('@this.__APPLICATION__.person');
            node3 = model.getDataTree().find('@this.__APPLICATION__.person.sname');

            // Then
            assert.equal(node1.getValue(), 'Петров', 'found node by name has data');
            assert.equal(node2.getValue().fname, 'Петров', 'found node (2) by name has data');

            assert.isFalse(node1.isEmptyNode(), 'found node is not empty');
            assert.isFalse(node2.isEmptyNode(), 'found node (2) is not empty');

        });


        it('event in node', function () {
            // Given
            var model = genModel(),
                data = genData(),
                node1, node2, node3;

            //When
            model.getDataTree().setValue(data);
            node1 = model.getDataTree().find('@this.__APPLICATION__.person.fname');
            node2 = model.getDataTree().find('@this.__APPLICATION__.person');
            node3 = model.getDataTree().find('@this.__APPLICATION__.person.sname');

            // Then
            assert.equal(node1.getValue(), 'Петров', 'found node by name has data');
            assert.equal(node2.getValue().fname, 'Петров', 'found node (2) by name has data');

            assert.isFalse(node1.isEmptyNode(), 'found node is not empty');
            assert.isFalse(node2.isEmptyNode(), 'found node (2) is not empty');


            //When
            var flags = {
                f1: false,
                f2: false,
                f3: false,
                f4: false
            };
            node1.on('change.test', function(args){
                assert.equal(args.value, 'Иванов', 'right data in onChange handler');
                flags.f1 = true;
            });

            node1.setValue('Иванов');

            // Then
            assert.isTrue(flags.f1, 'onChange handler was called');

            //When
            node1.off('change.test');

            node2.on('change.test', function(args){
                assert.equal(args.value.lname, 'Тира', 'right data in onChange handler 2');
                flags.f2 = true;
            });

            node1.on('change.test', function(args){
                assert.equal(args.value, 'Вася', 'right data in onChange handler 3');
                flags.f3 = true;
            });

            node2.setValue({fname: 'Вася', lname: 'Тира', sname:'сатира', mainFotoUrl: '-'});

            // Then
            assert.isTrue(flags.f2, 'onChange handler was called 2');
            assert.isTrue(flags.f3, 'onChange handler was called 3');

            //When
            node1.off('change.test');
            node2.off('change.test');

            node1.on('change.test', function(args){
                assert.equal(args.value, 'Иванов', 'right data in onChange handler 4');
                flags.f4 = true;
            });
            node2.on('change.test', function(args){
                assert.isTrue(false, 'onChange handler should not be called');
            });
            node3.on('change.test', function(args){
                assert.isTrue(false, 'onChange handler should not be called 2');
            });

            node2.mergeValue({fname: 'Вася', lname: 'Тира', mainFotoUrl: '-'});

            // Then
            assert.isTrue(flags.f4, 'onChange handler was called 4');

            /* change:bubbled
             * node1.on('change', function)
             * node1.set('prop1/prop1-2', 4) == node1.find('prop1/prop1-2').set(4) == node1.set({prop1:{prop1-2:4}})
             * node1.get('prop1/prop1-2') == node1.find('prop1/prop1-2').get()
             * */
        });
    });

});