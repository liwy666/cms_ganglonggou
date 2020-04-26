<template>
  <el-select v-model="tempCatId" placeholder="请选择">
    <el-option-group
        v-for="group in catOption"
        :key="group.label"
        :label="group.label">
      <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
    export default {
        name: "SelectCategory",
        data() {
            return {
                tempCatId: "",

            }
        },
        computed: {
            catOption: {
                get: function () {
                    let result = [];
                    if (this.$store.state.cat_list.length > 0) {
                        //先找出父分组
                        this.$store.state.cat_list.forEach(item => {
                            if (item.parent_id === 0) {
                                result.push({
                                    catId: item.cat_id,
                                    label: item.cat_name,
                                    options: [],
                                });
                            }
                        });
                        //往父分组分配子项
                        result.forEach((item, index) => {
                            this.$store.state.cat_list.forEach(itemSon => {
                                if (itemSon.parent_id === item.catId && itemSon.cat_id !== this.deleteCatId) {
                                    result[index]["options"].push({
                                        value: itemSon.cat_id,
                                        label: itemSon.cat_name,
                                    });
                                }
                            });
                        });
                    }
                    return result;
                }
            },
        },
        model: {
            prop: "catId",
            event: 'change'
        },
        props: {
            catId: {
                type: Number,
            },
            deleteCatId: {
                type: Number,
            },
        },
        watch: {
            tempCatId: function (newVal) {
                this.$emit('change', newVal);
            }
        },
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>