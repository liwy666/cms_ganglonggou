<template>
  <div class="mainMain">
    <el-container>
      <el-aside style="background-color:rgb(57,61,73);width: 200px;">
        <el-menu
            mode="vertical"
            router
            :default-active="active"
            background-color="rgb(57,61,73)"
            text-color="rgb(255,255,255)"
            class="el-menu-vertical-demo">
          <el-submenu v-for="(submenusItem,submenusIndex) in submenus" :index="submenusIndex.toString()"
                      :key="submenusIndex">
            <template slot="title">
              <i :class="submenusItem.iconName"></i>
              <span>{{submenusItem.titleName}}</span>
            </template>
            <span v-for="(menuItem,menuIndex) in submenusItem.menuItems" :key="menuIndex">
                     <el-menu-item v-if="menuItem.hasOwnProperty('onClick')" :index="menuItem.routerPath"
                                   @click="menuItem.onClick" :key="menuIndex">{{menuItem.innerText}}</el-menu-item>
                   <el-menu-item v-else :index="menuItem.routerPath"
                                 :key="menuIndex">{{menuItem.innerText}}</el-menu-item>
                </span>

          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!--    <el-row>-->
    <!--      <el-col :span="4">-->
    <!--        <div class="nav-box">-->
    <!--         -->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :span="20">-->
    <!--        -->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>
<script>
    export default {
        name: "Main",
        data() {
            return {
                submenus: [
                    {
                        titleName: "商品管理",
                        iconName: "el-icon-news",
                        menuItems: [
                            {
                                routerPath: "/GoodsList",
                                innerText: "商品列表",
                                onClick: this.iniPageInfoCache,
                            },
                            {
                                routerPath: "/CatList",
                                innerText: "分类列表",
                            },
                            {
                                routerPath: "/SupplierList",
                                innerText: "供应商",
                            },
                        ],
                    },
                    {
                        titleName: "订单管理",
                        iconName: "el-icon-tickets",
                        menuItems: [
                            {
                                routerPath: "/OrderList",
                                innerText: "订单列表",
                            },
                            {
                                routerPath: "/MakeOrderList",
                                innerText: "预约订单列表",
                            },
                            {
                                routerPath: "/ServiceList",
                                innerText: "售后请求",
                            },
                            {
                                routerPath: "/EvaluateList",
                                innerText: "商品评价",
                            },
                        ],
                    },
                    {
                        titleName: "广告促销",
                        iconName: "el-icon-picture",
                        menuItems: [
                            {
                                routerPath: "/CouponList",
                                innerText: "优惠券管理",
                            },
                            {
                                routerPath: "/IndexAdList",
                                innerText: "首页广告管理",
                            },
                            {
                                routerPath: "/ClassifyAdList",
                                innerText: "分类展示",
                            },
                            {
                                routerPath: "/ArticleList",
                                innerText: "文章管理",
                            },
                            {
                                routerPath: "/SearchLogList",
                                innerText: "搜索管理",
                            },
                        ],
                    },
                    {
                        titleName: "工行融易购",
                        iconName: "el-icon-goods",
                        menuItems: [
                            {
                                routerPath: "/ghDigitalProduct",
                                innerText: "新3C数码馆",
                            },
                            {
                                routerPath: "/ghFashionSciTech",
                                innerText: "潮流科技zone",
                            },
                            {
                                routerPath: "/ghKettleMobileList",
                                innerText: "水具厨具馆",
                            },
                            {
                                routerPath: "/ghAppliancesMobileList",
                                innerText: "家电馆",
                            },
                        ],
                    },
                    {
                        titleName: "活动页",
                        iconName: "el-icon-menu",
                        menuItems: [
                            {
                                routerPath: "/ArticleSign",
                                innerText: "文章打卡",
                            },
                        ],
                    },
                    {
                        titleName: "其他",
                        iconName: "el-icon-setting",
                        menuItems: [
                            {
                                routerPath: "/UserList",
                                innerText: "用户管理",
                            },
                            {
                                routerPath: "/intoCountList",
                                innerText: "流量查看",
                            },
                            {
                                routerPath: "/AppUpdate",
                                innerText: "应用更新",
                            },
                            {
                                routerPath: "/FeedBack",
                                innerText: "意见反馈",
                            },
                            {
                                routerPath: "/UserList",
                                innerText: "退出登录",
                                onClick: this.outLogin,
                            },
                        ],
                    },
                ],
                menuItemsRouterPaths: [],
            };
        },
        computed: {
            active: {
                get: function () {
                    const path = this.$route.path;
                    let index = "";
                    this.menuItemsRouterPaths.some((routerPath) => {
                        if (routerPath === path) {
                            index = path;
                            return true;
                        } else if (path === "/") {
                            index = "/GoodsList";
                            return true;
                        }
                    });
                    return index;
                },
                set: function () {

                }
            },
        },
        created() {
            //添加路由地址
            this.submenus.forEach((submenuItem) => {
                submenuItem.menuItems.forEach((menuItem) => {
                    this.menuItemsRouterPaths.push(menuItem.routerPath);
                })
            });
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
<style lang="scss">
  .mainMain {
    .el-container {
      height: 100vh;
    }
  }

</style>