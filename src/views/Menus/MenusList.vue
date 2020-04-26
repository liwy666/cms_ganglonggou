<template>
  <div class="menus-list-main">
    <div class="form-box">
      <el-button type="primary" @click="addMenu">添加菜单</el-button>
    </div>
    <div class="table-box">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="titleName"
            label="标题名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="parentId"
            label="父级分类"
            width="180">
        </el-table-column>
        <el-table-column
            prop="actionCode"
            label="地址">
        </el-table-column>
        <el-table-column
            prop="iconName"
            label="地址">
        </el-table-column>
        <el-table-column
            prop="routerPath"
            label="地址">
        </el-table-column>
        <el-table-column
            prop="onClickName"
            label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script>
    /* titleName: "",
                        parentId: 0,
                        actionCode: 10,
                        iconName: "",
                        routerPath: "",
                        onClickName: "",*/
    export default {
        name: "MumsList",
        data() {
            return {
                tableData: null,
            }
        },
        methods: {
            addMenu() {
                this.$router.push('/editMenu');
            }
        }
    }
</script>

<style scoped lang="scss">
  .menus-list-main {

  }
</style>