<template>
	<div class="app-update-main">
		<div class="left">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
				<el-form-item label="更新平台:" prop="platform">
					<el-select v-model="form.platform" placeholder="请选择" @change="getAppVersionInfo">
						<el-option
							v-for="item in platform_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="版本号:" prop="app_version">
					<el-input v-model="form.app_version"></el-input>
					<el-alert
						title="he package version. `CFBundleShortVersionString` on iOS, `versionName` on Android."
						type="success">
					</el-alert>
				</el-form-item>
				<el-form-item label="构建号:" prop="build_number">
					<el-input-number v-model="form.build_number" :min="1" :precision="0"
						:controls="false"></el-input-number>
					<el-alert
						title="The build number. `CFBundleVersion` on iOS, `versionCode` on Android."
						type="success">
					</el-alert>
				</el-form-item>
				<el-form-item label="下载地址:">
					<el-input v-model="form.download_url"></el-input>
				</el-form-item>
				<el-form-item label="IosAppId:">
					<el-input v-model="form.ios_app_id"></el-input>
				</el-form-item>
				<el-form-item label="更新说明:" prop="describe">
					<el-input v-model="form.describe"></el-input>
					<el-alert
						title="以符号“|”作为换行符"
						type="success">
					</el-alert>
				</el-form-item>
				<el-form-item label="安装包">
					<el-upload
						:action="$store.state.api_url + 'cms/cms_upload_app'"
						:on-success="uploadSuccess"
						:on-remove="remove"
						:data="{'admin_token':$store.state.gl_cms_token}"
						:limit="1"
						name='app'
						:file-list="file_list"
					>
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit('form')">确认保存</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="right">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="font-weight: bolder">最近一次更新</span>
				</div>
				<p class="card-item">更新时间：{{app_version_info.add_time}}</p>
				<p class="card-item">平台：{{app_version_info.platform}}</p>
				<p class="card-item">下载链接：{{app_version_info.download_url}}</p>
				<p class="card-item">说明：{{app_version_info.describe}}</p>
				<p class="card-item">版本号：{{app_version_info.app_version}}</p>
				<p class="card-item">构建号：{{app_version_info.build_number}}</p>
				<p class="card-item">IosAppId：{{app_version_info.ios_app_id}}</p>
			</el-card>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    platform: "android",
                    download_url: "",
                    file_size: 0,
                    describe: "",
                    app_version: "",
                    build_number: 1,
					ios_app_id:"",
                },
                rules: {
                    platform: [
                        {required: true, message: '请选择更新平台', trigger: 'blur'},
                    ],
                    describe: [
                        {required: true, message: '请输入新版本特性', trigger: 'blur'},
                    ],
                    app_version: [
                        {required: true, message: '请输入版本号', trigger: 'blur'},
                        {min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur'}
                    ],
                    build_number: [
                        {required: true, message: '请输入构建号', trigger: 'blur'},
                    ],
                },
                platform_options: [
                    {
                        value: 'android',
                        label: '安卓'
                    },
                    {
                        value: 'ios',
                        label: '苹果'
                    },
                ],
                file_list: [],
                app_version_info: {
                    add_time: "",
                    platform: "",
                    download_url: "",
                    describe: "",
                    app_version: "",
                    build_number: 1,
					ios_app_id:"",
                }
            };
        },
        computed: {},
        created() {
            this.getAppVersionInfo();
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let post_info = this.form;
                        post_info.admin_token = this.$store.state.gl_cms_token;

                        window.console.log(post_info);
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        this.$post('cms_add_new_version_app', post_info)
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.form = {
                                        platform: "android",
                                        download_url: "",
                                        file_size: 0,
                                        describe: "",
                                        app_version: "",
                                        build_number: 0,
										ios_app_id:"",
                                    };
                                    this.getAppVersionInfo();
                                }
                                m_loading.close();
                            })
                    } else {
                        return false;
                    }
                });


            },
            getAppVersionInfo() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_app_version_info', {"platform": this.form.platform}).then((msg) => {
                    if (msg["result_code"] === "success") {
                        this.app_version_info = msg;
                    } else {
                        this.app_version_info = {
                            add_time: "",
                            platform: "",
                            download_url: "",
                            describe: "",
                            app_version: "",
                            build_number: 1,
							ios_app_id:"",
                        }
                    }
                    m_loading.close();
                })
            },
            /*上传成功回调*/
            uploadSuccess(response) {
                let download_path_info = {
                    name: response.download_path,
                    url: response.download_path,
                    file_size: response.file_size,
                };
                this.file_list.push(download_path_info);
                this.form.download_url = download_path_info.url;
                this.form.file_size = download_path_info.file_size;
            },
            /*删除成功回调*/
            remove(file) {
                //  清空file_list
                if (this.file_list.length > 0 && file.status === 'success') {
                    this.file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.file_list.splice(i, 1);
                        }
                    });
                    this.form.download_url = "";
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
	.app-update-main {
		padding: 30px;
		display: flex;

		.left {
			flex: 1;
		}

		.right {
			flex: 1;
			padding-left: 30px;

			.card-item {
				margin-bottom: 10px;
			}
		}
	}
</style>