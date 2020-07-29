Vue.component('menu-item', {

            data: function () {
                return {
                    title: '我是组件A',
                }
            },
            props: {
                content: String,

            },
            methods: {

            },
            template: '<div><h3>{{title}}</h3>{{content}}</div>'
        })