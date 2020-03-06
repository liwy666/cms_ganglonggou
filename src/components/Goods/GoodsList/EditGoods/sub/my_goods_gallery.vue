<template>
	<div class="main">
		<el-upload
						:action="$store.state.api_url + 'cms/cms_upload_goods_img'"
						:on-success="uploadSuccess"
						:on-remove="remove"
						accept="image/jpeg,image/gif,image/png"
						name='portrait_img'
						:file-list="file_list"
						:before-upload="beforeAvatarUpload"
						list-type="picture-card">
			<i class="el-icon-plus"></i>
		</el-upload>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                //file_list: [],
            };
        },
        computed: {
            file_list:{
                get:function () {
					return this.$store.state.goods_gallery;
                },
                set:function (val) {
					this.$set(this.$store.state,'goods_gallery',val);
                }
			}
		},
        props: ["edit_type"],
        created() {
            //清空商品相册
            this.$set(this.$store.state,'goods_gallery',[]);

            if (this.edit_type === 'upd'||this.edit_type === 'copy') {
                let goods_gallery = this.$store.state.goods_info.goods_gallery;
                if (goods_gallery.length > 0) {
                    goods_gallery.forEach(item => {
                        let file_list_object = {
                            name: item.img_url,
                            url: item.img_url,
                            original_url: item.img_original
                        };
                        this.file_list.push(file_list_object);
                    })
                }
            }
        },
        methods: {
            /*上传前处理*/
            beforeAvatarUpload(file) {
                let check_flag = true;
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.error('上传图片只能是 JPG 或PNG格式!');
                    check_flag = false;
                }
                if (!isLt1M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                    check_flag = false;
                }
                return check_flag;
            },
            /*上传成功回调*/
            uploadSuccess(response, file, fileList) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.file_list.push(img_info);
            },
            /*删除成功回调*/
            remove(file, fileList) {
                //  清空file_list
                if (this.file_list.length > 0 && file.status === 'success') {
                    this.file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.file_list.splice(i, 1);
                        }
                    });
                }
            },
        },
    };
</script>

<style lang="scss" scoped>

</style>