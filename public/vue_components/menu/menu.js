var myMenu={
    data:function(){
        return{
        }
    },
    props:{
        username:String,

    },
    methods:{
    },
    template:`<div id="open">
        <div id="openbutten" class="navH">
            <div id="user_header_info">
                <div class="header_photo" id="header_photos">
                    <img id="header_photo" src="" alt="">
                </div>
                <p id="username_under_header" class="account">{{username}}</p>
            </div>
        </div>
        <div class="navBox">
            <ul>
                <li>
                    <h2 class="obtain">北京景点<i></i></h2>
                    <div class="secondary">
                        <h3>故宫</h3>
                        <h3>十三陵</h3>
                        <h3>圆明园</h3>
                        <h3>长城</h3>
                        <h3>雍和宫</h3>
                        <h3>天坛公园</h3>
                    </div>
                </li>
                <li>
                    <h2 class="obtain">南京景点<i></i></h2>
                    <div class="secondary">
                        <h3>栖霞寺</h3>
                        <h3>夫子庙</h3>
                        <h3>海底世界</h3>
                        <h3>中山陵</h3>
                        <h3>乌衣巷</h3>
                        <h3>音乐台</h3>
                    </div>
                </li>
                <li>
                    <h2 class="obtain">上海景点<i></i></h2>
                    <div class="secondary">
                        <h3>东方明珠</h3>
                        <h3>外滩</h3>
                        <h3>豫园</h3>
                        <h3>文庙</h3>
                        <h3>世博园</h3>
                        <h3>田子坊</h3>
                    </div>
                </li>
                <li>
                    <h2 class="obtain">深圳景点<i></i></h2>
                    <div class="secondary">
                        <h3>华侨城</h3>
                        <h3>观澜湖</h3>
                        <h3>世界之窗</h3>
                        <h3>东门老街</h3>
                        <h3>七娘山</h3>
                        <h3>光明农场</h3>
                    </div>
                </li>
                
            </ul>
        </div>
    </div>`
}