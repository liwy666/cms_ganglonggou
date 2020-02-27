<template>
	<div class="index-main">
		<el-row>
			<el-col :span="3">
				<div class="grid-content bg-purple">
					<div class="nav-box">
						<el-menu
							mode="vertical"
							router
							:default-active="active"
							background-color="rgb(57,61,73)"
							text-color="rgb(255,255,255)"
							class="el-menu-vertical-demo">
							<el-submenu index="1">
								<template slot="title">
									<i class="el-icon-news"></i>
									<span>商品管理</span>
								</template>
								<el-menu-item index="/GoodsList" @click="iniPageInfoCache">商品列表</el-menu-item>
								<el-menu-item index="/CatList">分类列表</el-menu-item>
								<el-menu-item index="/SupplierList">供应商</el-menu-item>
							</el-submenu>
							<el-submenu index="2">
								<template slot="title">
									<i class="el-icon-tickets"></i>
									<span>订单管理</span>
								</template>
								<el-menu-item index="/OrderList">订单列表</el-menu-item>
								<el-menu-item index="/MakeOrderList">预约订单列表</el-menu-item>
								<el-menu-item index="/ServiceList">售后请求</el-menu-item>
								<el-menu-item index="/EvaluateList">商品评价</el-menu-item>
							</el-submenu>
							<el-submenu index="3">
								<template slot="title">
									<i class="el-icon-picture"></i>
									<span>广告促销</span>
								</template>
								<el-menu-item index="/CouponList">优惠券管理</el-menu-item>
								<el-menu-item index="/IndexAdList" @click="iniPageInfoCache">首页广告管理</el-menu-item>
								<el-menu-item index="/ClassifyAdList" @click="iniPageInfoCache">分类展示</el-menu-item>
								<el-menu-item index="/ArticleList">文章管理</el-menu-item>
								<el-menu-item index="/SearchLogList">搜索管理</el-menu-item>
							</el-submenu>
							<el-submenu index="4">
								<template slot="title">
									<i class="el-icon-goods"></i>
									<span>工行融易购</span>
								</template>
								<el-menu-item index="/gh3CMobileList" @click="iniPageInfoCache">3C数码馆手机端</el-menu-item>
								<el-menu-item index="/ghNew3cMobileList" @click="iniPageInfoCache">新3C数码馆手机端
								</el-menu-item>
								<el-menu-item index="/ghTMTMobileList" @click="iniPageInfoCache">酷玩科技馆手机端</el-menu-item>
								<el-menu-item index="/ghComputerMobileList" @click="iniPageInfoCache">电脑办公馆手机端
								</el-menu-item>
								<el-menu-item index="/ghKettleMobileList" @click="iniPageInfoCache">水具厨具馆手机端
								</el-menu-item>
								<el-menu-item index="/ghAppliancesMobileList" @click="iniPageInfoCache">家电馆手机端
								</el-menu-item>
								<el-menu-item index="/ghNewIphone" @click="iniPageInfoCache">新Iphone手机端
								</el-menu-item>
								<el-menu-item index="/ghNewIphoneTwentyFour" @click="iniPageInfoCache">新Iphone24期手机端
								</el-menu-item>
								<el-menu-item index="/ghNewIphoneDrop" @click="iniPageInfoCache">新Iphone降价手机端
								</el-menu-item>
								<el-menu-item index="/ghDoubleElevenList" @click="iniPageInfoCache">双11
								</el-menu-item>
								<el-menu-item index="/ghDoubleElevenListBurst" @click="iniPageInfoCache">6周年庆
								</el-menu-item>
								<!--<el-menu-item index = "/618Mobile">618-手机</el-menu-item>-->
								<!--<el-menu-item index = "/618PC">618-PC</el-menu-item>-->
							</el-submenu>
							<el-submenu index="5">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>活动页</span>
								</template>
								<el-menu-item index="/ArticleSign">文章打卡</el-menu-item>
							</el-submenu>
							<el-submenu index="6">
								<template slot="title">
									<i class="el-icon-setting"></i>
									<span>其他</span>
								</template>
								<el-menu-item index="/UserList">用户管理</el-menu-item>
								<el-menu-item index="/intoCountList">流量查看</el-menu-item>
								<el-menu-item index="/AppUpdate">应用更新</el-menu-item>
								<el-menu-item index="/FeedBack">意见反馈</el-menu-item>
								<el-menu-item @click="outLogin"><i class="el-icon-back"></i>退出登录</el-menu-item>
							</el-submenu>
						</el-menu>
					</div>
				</div>
			</el-col>
			<el-col :span="21">
				<div class="grid-content bg-purple-light">
					<router-view></router-view>
				</div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                default_active: '/GoodsList'
            };
        },
        computed: {
            active: {
                get: function () {
                    let path = this.$route.path,
                        index = 0;
                    switch (path) {
                        case "/":
                            index = '/GoodsList';
                            break;
                        case "/GoodsList":
                            index = '/GoodsList';
                            break;
                        case "/CatList":
                            index = '/CatList';
                            break;
                        case "/SupplierList":
                            index = '/SupplierList';
                            break;
                        case "/OrderList":
                            index = '/OrderList';
                            break;
                        case "/MakeOrderList":
                            index = '/MakeOrderList';
                            break;
                        case "/ServiceList":
                            index = '/ServiceList';
                            break;
                        case "/CouponList":
                            index = '/CouponList';
                            break;
                        case "/IndexAdList":
                            index = '/IndexAdList';
                            break;
                        case "/618Mobile":
                            index = '/618Mobile';
                            break;
                        case "/618PC":
                            index = '/618PC';
                            break;
                        case "/gh3CMobileList":
                            index = '/gh3CMobileList';
                            break;
                        case "/ghNew3cMobileList":
                            index = '/ghNew3cMobileList';
                            break;
                        case "/ghTMTMobileList":
                            index = '/ghTMTMobileList';
                            break;
                        case "/ghComputerMobileList":
                            index = '/ghComputerMobileList';
                            break;
                        case "/ghKettleMobileList":
                            index = '/ghKettleMobileList';
                            break;
                        case "/ghAppliancesMobileList":
                            index = '/ghAppliancesMobileList';
                            break;
                        case "/ghDoubleElevenList":
                            index = '/ghDoubleElevenList';
                            break;
                        case "/ghDoubleElevenListBurst":
                            index = '/ghDoubleElevenListBurst';
                            break;
                        case "/ghNewIphone":
                            index = '/ghNewIphone';
                            break;
                        case "/ghNewIphoneTwentyFour":
                            index = '/ghNewIphoneTwentyFour';
                            break;
                        case "/ghNewIphoneDrop":
                            index = '/ghNewIphoneDrop';
                            break;
                        case "/EvaluateList":
                            index = '/EvaluateList';
                            break;
                        case "/UserList":
                            index = '/UserList';
                            break;
                        case "/intoCountList":
                            index = '/intoCountList';
                            break;
                        case "/ArticleList":
                            index = '/ArticleList';
                            break;
                        case "/SearchLogList":
                            index = '/SearchLogList';
                            break;
                        case "/ArticleSign":
                            index = '/ArticleSign';
                            break;
                        case "/AppUpdate":
                            index = '/AppUpdate';
                            break;
                        case "/FeedBack":
                            index = '/FeedBack';
                            break;
                        default:
                            index = '';
                            break;
                    }
                    return index;
                },
                set: function () {

                }
            },
        },
        created() {

        },
        methods: {
            iniPageInfoCache() {
                this.$store.state.page_info_cache = {
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
                }
            },
            outLogin() {
                localStorage.removeItem('gl_cms_token');
                this.$router.push('/login');
            }
        },
    };
</script>
<style lang="scss" scoped>
	.index-main {
		height: 100%;
	}

	.el-row {
		height: 100%;

		.el-col {
			height: 100%;
			overflow: auto;

			.bg-purple {
				height: 100%;

				.nav-box {
					height: 100%;
					background-color: rgb(57, 61, 73);
				}
			}

		}
	}
</style>