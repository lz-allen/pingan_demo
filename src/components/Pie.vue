<template>
  <div id="pie" ref="myPie"></div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie.js");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");

export default {
  name: "Pie",
  props: ["option"],
  data() {
    return {
      myChart: null
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init();
    this.chooseType();
  },
  watch: {
    option: function(newVal, oldVal){
      this.draw()
    }
  },
  methods: {
    init() {
      this.myChart = echarts.init(this.$refs.myPie);
    },
    draw() {
      this.myChart.setOption(this.option, true);
    },
    resize() {
      this.myChart.resize();
    },
    chooseType() {
      this.myChart.on("click", params => {
        this.$emit("clickVal", params);
      });
    }
  }
};
</script>
<style lang="less" scoped>
#pie {
  width: 100%;
  height: 100%;
}
</style>