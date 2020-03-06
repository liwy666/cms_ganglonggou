import Vue from 'vue'
import Vuex from 'vuex'
import {fetch} from './http'
import {Loading} from 'element-ui';

Vue.use(Vuex);


let gl_cms_token_ = JSON.parse(localStorage.getItem('gl_cms_token') || '[]');
let store = new Vuex.Store({
    state: {
        gl_cms_token: gl_cms_token_.token,
    /*     api_url:'https://api.ganglonggou.com/api/v1/',
         img_url: 'https://img-api.ganglonggou.com/',*/
        api_url: 'https://test-api.ganglonggou.com/api/v1/',
        img_url: 'https://test-img-api.ganglonggou.com/',
       /*   api_url: 'http://192.168.0.137:8004/',
         img_url: 'http://192.168.0.137:8002/',*/
        cat_list: [],
        cat_ad_list: [],
        goods_info: {},
        goods_gallery: [],//商品相册
        page_info_cache: {
            page: 1,
            limit: 10,
            goods_name: '',
            cat_id: '',
            into_type: 'wx',
            position_type: '',
            position_type_name: '',
            ad_type: '无响应',
            parent_id: 0,
            group_name: '',
        },
        parent_classify_ad_list: []
    },
    mutations: {},
    actions: {
        getCatList(context, admin_token) {
            let m_loading = Loading.service({
                text: '获取分类列表'
            });
            fetch('cms_get_cat_list', {
                admin_token: admin_token,
            })
                .then((msg) => {
                    Vue.set(context.state, 'cat_list', msg);
                    m_loading.close();
                })
        },
    }
});
// 把对象暴露出去
export default store