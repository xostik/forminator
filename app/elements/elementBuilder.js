var ElementBuilder = Backbone.Model.extend({
    /*
     Data for init

     builder: null,
     parent: null,
     scheme: null
     */
    /*
     Properties

     element
     */

    initialize: function(options){
        // перебрасываем свойства в this, для аскетичности кода
        this.builder = options.builder;
        this.parent = options.parent;
        this.parentFrame = options.parentFrame;
        this.scheme = options.scheme;
    },

    build: function(){
        this.element = this.createElement();
        this.
        this.applyScheme();
    },

    createElement: function(){
        throw ('Не перегружен абстрактный метод ElementBuilder.createElement()');
    },

    applyScheme: function () {

        var scheme = this.scheme,
            element = this.element;

        if(typeof scheme.name == 'string'){
            element.setName(scheme.name);
        }
        if(typeof scheme.text == 'string'){
            element.setText(scheme.text);
        }
        if(typeof scheme.enabled == 'boolean'){
            element.setEnabled(scheme.enabled);
        }
        if(typeof scheme.visible == 'boolean'){
            element.setVisible(scheme.visible);
        }
        if(typeof scheme.align == 'string'){
            element.setAlign(scheme.align);
        }

    },

    bindWithDataSource: function(propertyName, address){
        this.parentFrame.dataTree.findDataSource
    },

    a: {
        data: {
            todoField:{
                type: 'field',
                default: ''
            },
            todoList:{
                type: 'list',
                default: [],
                dataItemTemplate:{ // конкретные данные или ссылка типа '@data-link:111-223-4'
                    description: {
                        type: 'field',
                        default: ''
                    },
                    isDone: {
                        type: 'field',
                        default: false
                    }
                }
            }
        },

        elements: [
            {
                type: 'column',
                name: 'todo',
                body: [
                    {
                        type: 'row',
                        name: 'createTodo',
                        body: [
                            {
                                type: 'textField',
                                width: '8clm',
                                name: 'createTodoField',
                                placeholder: 'Введите новое задание',
                                binding: '~(todoField)'

                            },
                            {
                                type: 'button',
                                width: '4clm',
                                name: 'createTodoButton',
                                onClick: [
                                    {
                                        type: 'action:addItemAction',
                                        source: '~(todoList)', // $(@this/..**/list)   ~(@root/**/todoList/i/montro)  @this @root @item @list @in-list @in-item
                                        value: {
                                            description: '~(createTodoField)'
                                        }
                                    },
                                    {
                                        type: 'action:clearFieldAction',
                                        list: '$(createTodoField)'
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        type: 'list',
                        name: 'todoList',
                        binding: '~(todoList)', //'~(@root/todo/todoList/@i/isDone)',
                        params: {
                            user: '~(user)'
                        },
                        template: {
                            type: 'row',
                            name: 'todoItem',
                            body: [
                                {
                                    type: 'checkbox',
                                    name: 'isDone',
                                    value: '~(isDone)',
                                    onChange: function(value, e){
                                        if(value){
                                            e.$el.addClass('is-done');
                                        }else{
                                            e.$el.removeClass('is-done');
                                        }
                                    }
                                },
                                {
                                    type: 'label',
                                    name: 'description',
                                    binding: ''//'~(@root/todo/todoList/@i/description)'
                                },
                                {
                                    type: 'button',
                                    name: 'removeItem',
                                    onClick: {
                                        type: 'removeItemAction',
                                        item: '$(@this/..**/todoItem)'
                                    }
                                }

                            ]
                        }
                    }

                ]
            }
        ]
    },

    b: {
        type: 'button',
        name: 'editItem',
        onClick: {
            type: 'changeUrlAction',
            newState: {
                name: 'todoEditItem',
                itemNumber: function(context){
                    return context.findElement('$(@this/..**/todoItem)').getData().get('id');
                }
            }
        }
    }
});

var modelForminator = {
    model: {
        _viewModel:{
            todoField:{
                type: 'field',
                default: ''
            }
        },


        todoList:{
            type: 'list',
            default: [],
            dataItemTemplate:{ // конкретные данные или ссылка типа '@data-link:111-223-4'
                description: {
                    type: 'field',
                    default: ''
                },
                isDone: {
                    type: 'field',
                    default: false
                }
            },

            addNewItemFromUser: {
                type: 'method',
                args:[],
                func: function(){
                    var itemBody = this.find('todoField').getValue();
                    if(itemBody != ''){
                        this.addItemAction({
                            description: itemBody
                        });

                        this.find('todoField').clearValue();
                    }
                }
            },

            addItem: { // alt
                type: 'method',
                args:['description'],
                func: function(){
                    if(description != ''){
                        this.addItemAction({
                            description: description
                        });

                        this.find('todoField').clearValue();
                    }
                }
            }
        }

    },

    elements: [
        {
            type: 'column',
            name: 'todo',
            body: [
                {
                    type: 'row',
                    name: 'createTodo',
                    body: [
                        {
                            type: 'textField',
                            width: '8clm',
                            name: 'createTodoField',
                            placeholder: 'Введите новое задание',
                            binding: '~(todoField)'

                        },
                        {
                            type: 'button',
                            width: '4clm',
                            name: 'createTodoButton',
                            onClick: [
                                {
                                    type: 'action:addNewItemFromUser',
                                    source: '~(todoList)', // $(@this/..**/list)   ~(@root/**/todoList/i/montro)  @this @root @item @list @in-list @in-item
                                    params:{
                                        value: {
                                            description: '~(createTodoField)'
                                        }
                                    }

                                },
                                {// alt
                                    type: 'action:addItem',
                                    source: '~(todoList)', // $(@this/..**/list)   ~(@root/**/todoList/i/montro)  @this @root @item @list @in-list @in-item
                                    params:{
                                        description: '~(createTodoField)'
                                    }

                                },
                                {
                                    type: 'action:clearFieldAction',
                                    list: '$(createTodoField)'
                                }
                            ]
                        }
                    ]
                },

                {
                    type: 'list',
                    name: 'todoList',
                    binding: '~(todoList)', //'~(@root/todo/todoList/@i/isDone)',
                    params: {
                        user: '~(user)'
                    },
                    template: {
                        type: 'row',
                        name: 'todoItem',
                        body: [
                            {
                                type: 'checkbox',
                                name: 'isDone',
                                value: '~(isDone)',
                                onChange: function(value, e){
                                    if(value){
                                        e.$el.addClass('is-done');
                                    }else{
                                        e.$el.removeClass('is-done');
                                    }
                                }
                            },
                            {
                                type: 'label',
                                name: 'description',
                                binding: ''//'~(@root/todo/todoList/@i/description)'
                            },
                            {
                                type: 'button',
                                name: 'removeItem',
                                onClick: {
                                    type: 'removeItemAction',
                                    item: '$(@this/..**/todoItem)'
                                }
                            }

                        ]
                    }
                }

            ]
        }
    ]
};

var components = {
    main:{
        data:{},
        body:{}
    },

    data_uid_anon1224_1:{
        name:'Данные для элемента todo',
        body:{
            title: {
                type: 'field',
                default: '-'
            },
            status: {
                type: 'field',
                default: 'open' // close, archive
            },
            isEditMode: {
                type: 'field',
                default: false
            }
        }
    },

    layout_anon1224_1:{
        name: 'Элемент todo',
        data: 'data_anon1224_1',
        body: {
            type: 'switchPanel',
            conditionBinding: '~(isEditMode)',
            cases:{ // conditionals
                true:{
                    body:{
                        type: 'row',
                        body: [
                            {
                                type: 'textbox',
                                binding: '~(title)',
                                width: '8clm'
                            },
                            {
                                type: 'button',
                                text: 'Ок',
                                width: '4clm',
                                onClick: [{
                                        type: 'action:edit',
                                        value:{
                                            isEditMode: false
                                        }
                                    },
                                    {
                                        type: 'action:save'
                                    }]
                            }
                        ]
                    }
                },
                false:{
                    body:{
                        type: 'row',
                        body: [
                            {
                                type: 'label',
                                binding: '~(title)',
                                width: '8clm'
                            },
                            {
                                type: 'button',
                                text: 'i',
                                width: '2clm',
                                onClick: [{
                                    type: 'action:edit',
                                    value:{
                                        isEditMode: true
                                    }
                                }]
                            },
                            {
                                type: 'button',
                                text: 'x',
                                width: '2clm',
                                onClick: [{
                                    type: 'action:delete'
                                }]
                            }
                        ]
                    }
                }
            }
        }
    }

};

var urls = {
    read: 'site.ru/items',
    edit: 'site.ru/items/edit/{id}'
};

var componentsURL = {
    main:{
        data:{
            __GLOBAL__:{
                url:{
                    route: {
                        type: 'field',
                        default: null
                    },
                    id:{
                        type: 'field',
                        default: null
                    }
                }
            }
        },
        body:{}
    },

    data_uid_anon1224_1:{
        name:'Данные для элемента todo',
        body:{
            id:{
                type: 'field',
                default: null
            },
            title: {
                type: 'field',
                default: '-'
            },
            status: {
                type: 'field',
                default: 'open' // close, archive
            },
            isEditMode: {
                type: 'field',
                default: false
            }
        }
    },

    layout_anon1224_1:{
        name: 'Элемент todo',
        data: 'data_anon1224_1',
        visible: '~()',
        body: {
            type: 'switchPanel',
            cases:[
                {
                    condition: function(context){
                        var route = context.getData('@global/url/route'),
                            editId = context.getData('@global/url/id'),
                            id = context.getData('id');
                        return route == 'edit' && editId == id;
                    },
                    body: {
                        //editBody
                    }
                },
                {
                    condition: 'default',
                    body: {
                        //readBody
                    }
                }
            ]
        }
    }

};

/**
 * 1) данные с ограниченной областью видимости
 * 2) передаваемые параметры @params/url/id
 * 3) глобальные данные @global/url/id или глобальные сервисы @services
 * 4) работа с url
 *
 */



var foreveroomPersonPage = {

    layout:{

    },

    model: {
        __GLOBAL__:{
            requests:{

                type: 'collection',
                id: 'name',
                uniqItems: true,
                itemTemplate: {
                    __modelId__: 'data_modelId-1112',

                    name:{
                        type: 'field',
                        default: 'default'
                    },
                    url:{
                        type: 'field',
                        default: null
                    },
                    type:{
                        type: 'field',
                        default: 'GET'
                    },
                    params: {
                        type: 'field',
                        default: []
                    }
                },

                defaultValue: [
                    {
                        name: 'getComment',
                        url: 'http://site.ru/comment/:id',//'http://site.ru/comment/:id', // 5 -> http://site.ru/comment/5
                        type: 'GET',
                        params: ['id']
                    },{
                        name: 'getComments',
                        url: 'http://site.ru/comments/', // 5, 10 -> http://site.ru/comments?page=5&pageSize=10
                        type: 'GET',
                        params: ['page', 'pageSize']
                    },{
                        name: 'updateComment',
                        url: 'http://site.ru/comment/:id',
                        type: 'SET',
                        params: ['comment']
                    }
                ]
            },
            url:{
                routeName: {
                    type: 'field',
                    default: null
                },
                params:{
                    type: 'field',
                    default: {}
                },

                setRoute: function(newUrlParams){
                    this.setValue('params', newUrlParams);
                    this.setValue('routeName', newUrlParams.routeName); // this.mergeValue()
                },

                onValueChange: function(){
                    
                }
            }
        },

        main:{
            person:{
                fname: {
                    type: 'field',
                    default: 'Имя'
                },
                sname: {
                    type: 'field',
                    default: 'Отчество'
                },
                lname: {
                    type: 'field',
                    default: 'Фамилия'
                },
                mainFotoUrl: {
                    type: 'field',
                    default: 'https://vk.com/images/deactivated_100.png'
                }
            },
            personExtendedData: {
                story: {
                    type: 'field',
                    default: 'История.....'
                },
                note: {
                    type: 'field',
                    default: 'Ремарка.....'
                },
                // not real
                __mapFrom__: {
                    source: '@this.@parent.persData',
                    map: {
                        'a': 'b',
                        'aa.a': 'ab',
                        'ab': 'c'
                    },
                    // or
                    converters:[{
                        fromPath: '@this',
                        toPath: '@this',

                        converters:{
                            type: 'direct',
                            to: function(v){
                                return {
                                    storyD: v.story,
                                    noteD: v.note
                                };
                            },
                            from: function(v){
                                return {
                                    story: v.storyD,
                                    note: v.noteD
                                };
                            }
                        }
                    }],

                    // or
                    converters2: [
                        {
                            type: 'direct',
                            fromPath: '@this.story',
                            toPath: '@this.storyD',
                            converters:{
                                to: function(v){
                                    return v;
                                },
                                from: function(v){
                                    return v;
                                }
                            }
                        }
                    ],

                    // or
                    converters3: [
                        {
                            type: 'free',
                            fromPath: '@this.story',
                            converter: function(event, v){
                                if(event.source == 'kjfkjsd'){
                                    this.source.get('@this.some.2.storyD').set(event.val);
                                }
                            }
                        }
                    ]
                }
            },
            someField: {

            },
            comments:{
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
                list: {
                    type: 'collection',
                    id: 'id',
                    uniqItems: true,
                    itemTemplate: {
                        modelId: 'data_modelId-1111',
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
            },

            users:{
                type: 'collection',
                id: 'uid',
                uniqItems: true,
                itemTemplate: 'data_model-user-1111',
                addUser: function(user){
                    /*var uid = user.id,
                        usersById = this.find('@this.cacheById').value(); // '@parent^3.id'
                    if(! uid in usersById){

                    }*/
                },
                getUserDeferred: function(uid){
                    var userDeferred = $.Deferred(),
                        that = this;
                    if(this.getById(uid)){
                        userDeferred.resolve(this.getById(uid));
                    }else{
                        this.trigger('needData', {
                            source: this,
                            onDataReady: function(data){
                                userDeferred.resolve(that.getById(uid));
                            }
                        });
                    }

                    return userDeferred;
                }

            },
            videoPreviews: {
                type: 'list',
                itemTemplate:{
                    type: {
                        type: 'field',
                        default: 'youtube'
                    },
                    href: {
                        type: 'field',
                        default: 'http://..'
                    },
                    img: {
                        type: 'field',
                        default: 'http://..'
                    }
                }
            }
        },

        'data_model-user-1111':{
            uid: '...987',
            name: 'Petr',
            accountSource: 'vk',

            requestAdditionalInfo: function(){
                this.trigger('needAdditionInfo');
            }
        }
    },

    providers: {
        comment: {
            path: 'comments',
            bindings:[
                {
                    listenPath: 'list',
                    applyOnEvent: 'needData',
                    request: 'getComments',
                    params: {
                        page: 'pageNumber',
                        pageSize: 'pageSize'
                    },

                    injectingData: {
                        type: 'adding',
                        map:{
                            /*
                            '@all': 'list',
                            'count': 'list.count'
                            * */

                            '': 'list'
                        }
                    }
                }
            ],
            requests: [
                {
                    name: 'getComment',
                    url: '@global.urls.getComment',//'http://site.ru/comment/:id', // 5 -> http://site.ru/comment/5
                    type: 'GET',
                    params: ['id']
                },{
                    name: 'getComments',
                    url: 'http://site.ru/comments/', // 5, 10 -> http://site.ru/comments?page=5&pageSize=10
                    type: 'GET',
                    params: ['page', 'pageSize']
                },{
                    name: 'updateComment',
                    url: 'http://site.ru/comment/:id',
                    type: 'SET',
                    params: ['comment']
                }
            ]
        }


    }

}


