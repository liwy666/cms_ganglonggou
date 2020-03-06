<template>
	<div class="main">
		<div id="into-count" style="width: 1400px;height: 800px">
		</div>
	</div>
</template>
<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                echarts: echarts,
                echarts_info: [],
                into_type_array: [
                    'wx',
                    'abc',
                    '3c_mobile'
                ],
                number: 15,
            };
        },
        computed: {
            series_data: {
                get: function () {
                    let result = [];
                    if (this.echarts_info) {
                        this.echarts_info.forEach(item => {
                            let son_result = {
                                name: item.name,
                                type: 'line',
                                stack: '总量',
                                data: []
                            };
                            item.data.forEach(item2 => {
                                son_result.data.push(item2.into_count);
                            });
                            son_result.data.reverse();
                            result.push(son_result);
                        })
                    }
                    return result;
                }
            }
            , xAxis_data: {
                get: function () {
                    let result = [];
                    if (this.echarts_info) {
                        this.echarts_info.some(item => {
                            item.data.forEach(item2 => {
                                result.push(item2.into_date);
                                return true;
                            });
                            return true;
                        })
                    }
                    return result.reverse();
                }
            }
        },
        created() {

        },
        mounted() {
            this.getInfo();
        },
        methods: {
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.echarts.init(document.getElementById('into-count'));
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '首页流量统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.into_type_array
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis_data,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.series_data,
                });
            },
            getInfo() {
                this.$fetch('cms_get_into_count', {
                    admin_token: this.$store.state.gl_cms_token,
                    number: this.number,
                    into_type_array: this.into_type_array
                })
                    .then((msg) => {
                        this.echarts_info = msg;
                        this.drawLine();
                    })
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>