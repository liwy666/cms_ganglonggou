<template>
  <div class="edit-menu-main">
    <el-form :model="form" label-width="auto">
      <el-form-item label="菜单名称">
        <el-input v-model="form.titleName"></el-input>
      </el-form-item>
      <el-form-item label="图标名称">
        <el-input v-model="form.iconName"></el-input>
        <el-alert
            title="参考：https://element.eleme.cn/#/zh-CN/component/icon"
            type="success">
        </el-alert>
      </el-form-item>
      <el-form-item label="路径名称" v-show="form.parentId !== 0">
        <el-input v-model="form.routerPath"></el-input>
      </el-form-item>
      <el-form-item label="执行方法名称" v-show="form.parentId !== 0">
        <el-input v-model="form.onClickName"></el-input>
        <el-alert
            title="目前支持：iniPageInfoCache（初始化页面缓存），outLogin（退出登录）"
            type="success">
        </el-alert>
      </el-form-item>
      <el-form-item label="权限数值" v-show="form.parentId !== 0">
        <el-input-number v-model="form.actionCode" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-select v-model="form.parentId" placeholder="请选择">
          <el-option
              v-for="item in parentIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addMenu" v-if="menuId === 0">立即创建</el-button>
        <el-button type="primary" @click="updateMenu" v-else>确认更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "EditMenu",
        data() {
            return {
                form: {
                    titleName: "",
                    parentId: 0,
                    actionCode: 10,
                    iconName: "",
                    routerPath: "",
                    onClickName: "",
                },
                menuId: 0,
                parentIdOptions: [
                    {
                        value: 0,
                        label: "顶级菜单",
                    }
                ],
            }
        },
        methods: {
            addMenu() {
                let submitForm = this.form;
                submitForm['admin_token'] = this.$store.state.gl_cms_token;
                let loadingInstance = this.$loading();
                this.$post('add_menu', submitForm).then((msg) => {
                    if (msg) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.$router.go(-1);
                    }
                    loadingInstance.close();
                });
            },
            updateMenu() {
            },
        },
    }
</script>

<style scoped lang="scss">
  .edit-menu-main {
    width: 50%;
    padding: 25px;
  }
</style>