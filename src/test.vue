<template>
	<div class="m">
		<el-container>
			<el-header>
				<el-row>
					<el-col :span="20">链接监控系统</el-col>
					<el-col :span="4">
						<el-popover
							ref="popover"
							placement="top"
							width="160">
							<p>这是一段内容这是一段内容确定删除吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button type="primary" size="mini" @click="openmore">查看更多</el-button>
							</div>
						</el-popover>
						<el-badge class="item">
							<el-button v-popover:popover icon="el-icon-bell" type="text" size="big">通知({{count}})
							</el-button>
						</el-badge>
						&nbsp;
						<el-dropdown @command="handleCommand">
                     <span class="el-dropdown-link">
                         <el-button type="text">
                        {{user}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </el-button>
                    </span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="openxgmm">修改密码</el-dropdown-item>
								<el-dropdown-item command="quit">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-row>
			</el-header>
			<el-container>
				<el-aside width="200px">
					<!--                    <el-menu router>-->
					<!--                    <el-submenu index='/home'>-->
					<!--                        <template slot="title"><i class="el-icon-setting"></i>链接管理</template>-->
					<!--                        <el-menu-item index='/home'> <i class="el-icon-star-on"></i>添加链接队列管理</el-menu-item>-->
					<!--                        <el-menu-item index='/Goodsurl'> <i class="el-icon-star-on"></i>监控链接管理</el-menu-item>-->
					<!--&lt;!&ndash;                        <el-menu-item index='/test'> <i class="el-icon-star-on"></i>测试</el-menu-item>&ndash;&gt;-->
					<!--                    </el-submenu>-->
					<!--                </el-menu>-->
					<el-menu router>
						<el-menu-item index='/home'><i class="el-icon-menu"></i>首页</el-menu-item>
						<label v-for="(item,index) in config" :key="index">
							<el-submenu :index=item.value>
								<template slot="title"><i :class=item.icon></i>{{item.name}}</template>
								<label v-for="(child,indexR) in item.childs" :key="indexR">
									<el-menu-item :index=child.value><i :class=child.icon></i>{{child.name}}
									</el-menu-item>
								</label>
							</el-submenu>
						</label>
					</el-menu>
				</el-aside>
				<el-main>
					<el-dialog title="修改密码" :visible.sync="xgmmVisible" width="40%">
						<el-form label-position="right" label-width="80px" :model="xgmmForm" ref="xgmmFormName">
							<el-form-item label="旧密码" prop="oldpassword">
								<el-input v-model.number="xgmmForm.oldpassword"></el-input>
							</el-form-item>
							<el-form-item label="新密码" prop="newpassword">
								<el-input v-model.number="xgmmForm.newpassword"></el-input>
							</el-form-item>
							<el-form-item label="再输一次新密码" prop="newpassword1">
								<el-input v-model.number="xgmmForm.newpassword1"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button @click="resetForm('xgmmFormName')">重置</el-button>
								<el-button type="primary" @click="xgmm">确 定</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                count: 0,
                user: null,
                xgmmVisible: false,//编辑窗口可见
                xgmmForm: {
                    oldpassword: null,
                    newpassword: null,
                    newpassword1: null,
                },
                config: [{
                    "createUserId": 0,
                    "parentMenuId": 0,
                    "icon": "el-icon-setting",
                    "name": "链接管理",
                    "id": 1,
                    "sort": 0,
                    "value": "/addurl",
                    "childs": [
                        {
                            "createUserId": 0,
                            "parentMenuId": 1,
                            "icon": "el-icon-star-on",
                            "name": "添加链接队列管理",
                            "id": 3,
                            "sort": 0,
                            "value": "/addurl",
                            "childs": [],
                        },
                        {
                            "createUserId": 0,
                            "parentMenuId": 1,
                            "icon": "el-icon-star-on",
                            "name": "监控链接管理",
                            "alias": "监控链接管理",
                            "id": 3,
                            "sort": 1,
                            "state": "ENABLE",
                            "type": "LINK",
                            "value": "/Goodsurl",
                            "childs": []
                        }
                    ]
                }]

            };
        },
        computed: {},
        beforeRouteUpdate(to, from, next) {
            let x = 0;
            let p = "/Goodsurl";
            let p1 = "/Urlmonitor";
            let p2 = "/home";
            for (var i = 0; i < this.config.length; i++) {
                for (var j = 0; j < this.config[i].childs.length; j++) {
                    if (to.path == this.config[i].childs[j].value) {
                        x = 1
                    } else if (p == this.config[i].childs[j].value && to.path == p1) {
                        x = 1
                    } else if (to.path == p2) {
                        x = 1
                    }
                }
            }
            if (x == 1) {
                next()
            } else {
                alert("没有权限，请用管理员登录");
                next({path: '/home'})
            }


        },
        created() {
            this.getuser();
        },
        methods: {
            getuser: function () {
                this.user = this.$route.query.user;
            },

            openmore: function () {

            },
            openxgmm: function () {
                this.xgmmForm = {
                    oldpassword: null,
                    newpassword: null,
                    newpassword1: null,
                };
                this.xgmmVisible = true;//打开窗口
            },
            xgmm() {
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //     let m_loading = this.$loading({
                //         text: '添加中'
                //     });
                //     let post_url = 'cms_add_addurl';
                //     this.$post(post_url, {
                //         url_code:this.addForm.url_code,
                //         type_code: this.addForm.type_code,
                //     }).then((msg)=>{
                //         if(msg){
                //             let type_c='';
                //             for(var i=0;i<this.options.length;i++){
                //                 if(this.options[i].type_code===this.addForm.type_code){
                //                     type_c=this.options[i].type_name;
                //                 }
                //             }
                //             var temp = {
                //                 url_code: this.addForm.url_code,
                //                 type_code: type_c,
                //                 responsenode: "待爬取"};
                //             this.tableData.splice(0, 0, temp);
                //             this.count = this.count + 1;
                //             m_loading.close();
                this.xgmmVisible = false;//关闭窗口
                this.$notify({
                    type: 'success',
                    title: '通知',
                    message: '修改成功',
                    position: 'top-right',
                    duration: 2000
                });
                // }});
                //     } else {
                //         // console.log('error submit!!');
                //         return false;
                //     }
                // });
            },
            quit: function () {
            },
            handleCommand(command) {
                switch (command) {
                    case "openxgmm":
                        this.openxgmm();
                        break;
                    case "quit":
                        this.quit();
                        break;
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
	.m {
		height: 900px;
		width: 100%;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.el-header {
		height: 10%;
		background-color: #303133;
		color: #409EFF;
		font-family: "Microsoft YaHei";
		font-size: 32px;
		padding: 10px;

	}

	.el-aside {
		width: 20%;
		height: 100%;
	}

	.el-main {
		width: 80%;

	}
</style>