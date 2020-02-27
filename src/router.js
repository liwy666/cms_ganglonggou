import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/*导入对应的路由组件*/
import Index from './components/Index'
import Login from './components/Login/Login'
/*关于商品*/
import GoodsList from './components/Goods/GoodsList/GoodsList'//商品列表
import EditGoods from './components/Goods/GoodsList/EditGoods/EditGoods'//编辑商品
import BatchUpdGoodsHeadName from './components/Goods/GoodsList/EditGoods/BatchUpdGoodsHeadName'//编辑商品
import CopyGoodsByParentId from './components/Goods/GoodsList/EditGoods/CopyGoodsByParentId'//通过父级分类复制商品
/*关于分类*/
import CatList from './components/Goods/CatList/CatList'//分类列表
import EditCat from './components/Goods/CatList/EditCat/EditCat'//编辑分类
import ShearOrCopyGoods from './components/Goods/CatList/EditCat/ShearOrCopyGoods'//转移分类
/*关于供应商*/
import SupplierList from './components/Goods/SupplierList/SupplierList'
import EditSupplier from './components/Goods/SupplierList/EditSupplier'
/*关于订单*/
import OrderList from './components/Order/OrderList/OrderList'//订单列表
import MakeOrderList from './components/Order/MakeOrderList/MakeOrderList'//订单列表
import EditLogistics from './components/Order/OrderList/EditLogistics'//编辑物流
import seeOrder from './components/Order/OrderList/SeeOrder'//查看订单
/*关于售后*/
import ServiceList from './components/Order/ServiceList/ServiceList'//售后列表
/*关于优惠券*/
import CouponList from './components/Ad/Coupon/CouponList'//优惠券列表
import EditCoupon from './components/Ad/Coupon/EditCoupon'//编辑优惠券
/*关于广告*/
import IndexAdList from './components/Ad/IndexAd/IndexAdList'//广告列表
import EditRedBullGoodsIndexAd from './components/Ad/IndexAd/EditRedBullGoodsIndexAd'//红牛商品首页广告编辑
import EditRedBullHWGoodsIndexAd from './components/Ad/IndexAd/EditRedBullHWGoodsIndexAd'//红牛商品-华为首页广告编辑
import EditWxIndexAd from './components/Ad/IndexAd/EditWxIndexAd'//微信首页广告编辑
import EditAbcIndexAd from './components/Ad/IndexAd/EditAbcIndexAd'//农行首页广告编辑
/*关于分类展示*/
import ClassifyAdList from './components/Ad/Classify/ClassifyAdList'//广告列表
import EditClassifyAd from './components/Ad/Classify/EditClassifyAd'//编辑广告

/*关于3C*/
import gh_618_mobile from './components/3c/618moblie/618mobile'//3c-618手机广告
import Edit618mobile from './components/3c/618moblie/Edit618mobile'//3c-618手机广告
import gh_618_pc from './components/3c/618pc/618pc'//3c-618电脑广告
import Edit618pc from './components/3c/618pc/Edit618pc'//3c-618电脑广告
import gh3CMobileList from './components/3c/Mobile/Mobile'//3c手机端
import gh3CEditMobile from './components/3c/Mobile/EditMobile'//新3c手机端
import ghNew3cMobile from './components/3c/New3cMobile/New3cMobile'//新3c手机端
import ghEditNew3cMobile from './components/3c/New3cMobile/EditNew3cMobile'//3c手机端
import ghTMTMobileList from './components/3c/TMTMobile/Mobile'//科技手机端
import ghTMTEditMobile from './components/3c/TMTMobile/EditMobile'//科技手机端
import ghComputerMobileList from './components/3c/Computer/Computer'//电脑馆手机端
import ghComputerEditMobile from './components/3c/Computer/EditComputer'//电脑馆手机端
import ghKettleMobileList from './components/3c/KettleMobile/KettleMobile'//水具手机端
import ghKettleEditMobile from './components/3c/KettleMobile/EditKettleMobile'//水具手机端
import ghAppliancesMobileList from './components/3c/AppliancesMobile/AppliancesMobile'//家电手机端
import ghAppliancesEditMobile from './components/3c/AppliancesMobile/EditAppliancesMobile'//家电手机端
import ghDoubleEleven from './components/3c/DoubleEleven/DoubleEleven'//双11
import ghDoubleElevenEdit from './components/3c/DoubleEleven/EditDoubleEleven'//双11
import ghDoubleElevenBurst from './components/3c/DoubleElevenBurst/DoubleEleven'//双11爆发
import ghDoubleElevenEditBurst from './components/3c/DoubleElevenBurst/EditDoubleEleven'//双11爆发
import ghNewIphone from './components/3c/NewIphone/NewIphone'//新Iphone
import ghEditNewIphone from './components/3c/NewIphone/EditNewIphone'//新Iphone
import ghNewIphoneTwentyFour from './components/3c/NewIphoneTwentyFour/NewIphone'//新Iphone
import ghEditNewIphoneTwentyFour from './components/3c/NewIphoneTwentyFour/EditNewIphone'//新Iphone
import ghNewIphoneDrop from './components/3c/NewIphoneDrop/NewIphone'//新Iphone
import ghEditNewIphoneDrop from './components/3c/NewIphoneDrop/EditNewIphone'//新Iphone
/*评价*/
import EvaluateList from './components/Order/EvaluateList/EvaluateList'//评价列表
import AddEvaluate from './components/Order/EvaluateList/AddEvaluate' //添加评价
/*用户*/
import UserList from './components/Other/UserList/UserList'//用户列表
/*文章*/
import ArticleList from './components/Ad/Article/AriticleList'
import EditedArticle from './components/Ad/Article/EditedArticle'
/*搜索历史*/
import SearchLogList from './components/Ad/SearchLog/SearchLogList'
import EditedSearchLog from './components/Ad/SearchLog/EditedSearchLog'
/*统计*/
import IntoCountList from './components/Other/IntoCountList/IntoCountList'
/*文章打卡*/
import ArticleSign from './components/ArticleSign/ArticleSign'
import CreateShareUrl from './components/ArticleSign/CreateShareUrl'
/*应用更新*/
import AppUpdate from './components/Other/AppUpdate/AppUpdate'
/*意见反馈*/
import FeedBack from './components/Other/FeedBack/FeedBack'

var router = new Router({
    routes: [
        {
            path: '/index', component: Index, children: [
                /*子路由*/
                {path: '/', redirect: '/GoodsList'},
                {path: '/GoodsList', component: GoodsList},
                {path: '/EditGoods', component: EditGoods},
                {path: '/BatchUpdGoodsHeadName', component: BatchUpdGoodsHeadName},
                {path: '/CopyGoodsByParentId', component: CopyGoodsByParentId},
                {path: '/CatList', component: CatList},
                {path: '/EditCat', component: EditCat},
                {path: '/SupplierList', component: SupplierList},
                {path: '/EditSupplier', component: EditSupplier},
                {path: '/ShearOrCopyGoods', component: ShearOrCopyGoods},
                {path: '/OrderList', component: OrderList},
                {path: '/seeOrder', component: seeOrder},
                {path: '/MakeOrderList', component: MakeOrderList},
                {path: '/EditLogistics', component: EditLogistics},
                {path: '/ServiceList', component: ServiceList},
                {path: '/CouponList', component: CouponList},
                {path: '/EditCoupon', component: EditCoupon},
                {path: '/IndexAdList', component: IndexAdList},
                {path: '/EditRedBullGoodsIndexAd', component: EditRedBullGoodsIndexAd},
                {path: '/EditRedBullHWGoodsIndexAd', component: EditRedBullHWGoodsIndexAd},
                {path: '/EditWxIndexAd', component: EditWxIndexAd},
                {path: '/EditAbcIndexAd', component: EditAbcIndexAd},
                {path: '/618Mobile', component: gh_618_mobile},
                {path: '/Edit618mobile', component: Edit618mobile},
                {path: '/618PC', component: gh_618_pc},
                {path: '/Edit618PC', component: Edit618pc},
                {path: '/gh3CMobileList', component: gh3CMobileList},
                {path: '/gh3CEditMobile', component: gh3CEditMobile},
                {path: '/ghTMTMobileList', component: ghTMTMobileList},
                {path: '/ghTMTEditMobile', component: ghTMTEditMobile},
                {path: '/ghComputerMobileList', component: ghComputerMobileList},
                {path: '/ghComputerEditMobile', component: ghComputerEditMobile},
                {path: '/ghKettleMobileList', component: ghKettleMobileList},
                {path: '/ghKettleEditMobile', component: ghKettleEditMobile},
                {path: '/ghAppliancesMobileList', component: ghAppliancesMobileList},
                {path: '/ghAppliancesEditMobile', component: ghAppliancesEditMobile},
                {path: '/ghDoubleElevenList', component: ghDoubleEleven},
                {path: '/ghDoubleElevenEdit', component: ghDoubleElevenEdit},
                {path: '/ghDoubleElevenListBurst', component: ghDoubleElevenBurst},
                {path: '/ghDoubleElevenEditBurst', component: ghDoubleElevenEditBurst},
                {path: '/ghNew3cMobileList', component: ghNew3cMobile},
                {path: '/ghEditNew3cMobile', component: ghEditNew3cMobile},
                {path: '/ghNew3cMobileList', component: ghNew3cMobile},
                {path: '/ghEditNew3cMobile', component: ghEditNew3cMobile},
                {path: '/ghNewIphone', component: ghNewIphone},
                {path: '/ghEditNewIphone', component: ghEditNewIphone},
                {path: '/ghNewIphoneTwentyFour', component: ghNewIphoneTwentyFour},
                {path: '/ghEditNewIphoneTwentyFour', component: ghEditNewIphoneTwentyFour},
                {path: '/ghNewIphoneDrop', component: ghNewIphoneDrop},
                {path: '/ghEditNewIphoneDrop', component: ghEditNewIphoneDrop},
                {path: '/EvaluateList', component: EvaluateList},
                {path: '/AddEvaluate', component: AddEvaluate},
                {path: '/UserList', component: UserList},
                {path: '/intoCountList', component: IntoCountList},
                {path: '/ClassifyAdList', component: ClassifyAdList},
                {path: '/EditClassifyAd', component: EditClassifyAd},
                {path: '/ArticleList', component: ArticleList},
                {path: '/EditedArticle', component: EditedArticle},
                {path: '/SearchLogList', component: SearchLogList},
                {path: '/EditedSearchLog', component: EditedSearchLog},
                {path: '/ArticleSign', component: ArticleSign},
                {path: '/CreateShareUrl', component: CreateShareUrl},
                {path: '/AppUpdate', component: AppUpdate},
                {path: '/FeedBack', component: FeedBack},
            ]
        },
        {path: '/', redirect: '/index'},
        {path: '/login', component: Login},
    ]
});

router.beforeEach((to, from, next) => {
    let gl_cms_token_ = JSON.parse(localStorage.getItem('gl_cms_token') || '[]');
    //获取当前时间时间戳
    let now_time = (new Date()).getTime();
    let over_time = gl_cms_token_.over_time;
    if (gl_cms_token_.length < 1 && to.path !== '/login') {
        // 第一次进入项目
        localStorage.setItem('beforeLoginUrl', to.fullPath);// 保存用户进入的url
        next('/login');
        return false
    } else if (parseInt(now_time) >= parseInt(over_time) && to.path !== '/login') {
        //删除token
        localStorage.removeItem('gl_cms_token');
        //进入登录页面
        localStorage.setItem('beforeLoginUrl', to.fullPath);// 保存用户进入的url
        next('/login');
        return false
    }
    next()
});

// 把路由对象暴露出去
export default router
