<template>
  <div>
    <icbc-table thisPath="ghAppliancesMobileList" editPath="ghAppliancesEditMobile" intoType="appliances_mobile"
                ref="icbcTable"></icbc-table>
  </div>
</template>

<script>
    import icbcTable from '../../components/IcbcTable'

    export default {
        name: "appliances",
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.$nextTick(() => {
                    vm.$refs.icbcTable.urlUpdate(to);
                });

            });
        },
        beforeRouteUpdate(to, from, next) {
            this.$nextTick(() => {
                this.$refs.icbcTable.urlUpdate(to);
            });

            next();
        },
        components: {
            "icbc-table": icbcTable
        }
    }
</script>

<style scoped lang="scss">

</style>