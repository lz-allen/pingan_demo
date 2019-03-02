<template>
  <div class="index">
    <div class="upload">
      <el-button type="primary" icon="el-icon-upload2" @click="uploadFile">请上传excel文件</el-button>
      <input id="file" ref="file" v-show="false" type="file" @change="getFile">
      <div class="fileName">{{excelName}}</div>
    </div>
    <div class="listInfo">
      <el-button class="item" disabled>app总数：{{total}}</el-button>
      <el-button class="item" @click="findFirst">一级分类数：{{first}}</el-button>
      <el-button class="item" @click="findSecond">二级分类数：{{second}}</el-button>
      <el-button class="item" v-show="third>0" @click="findThird">三级分类数：{{third}}</el-button>
      <el-button class="item" @click="findFinance">金融app数：{{financeNum}}</el-button>
    </div>
    <div class="chart">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="pie">
            <my-pie :option="pieOption" ref="pie" @clickVal="chatClickVal"></my-pie>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <my-table :tableData="tableData"></my-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MyPie from "@/components/Pie";
import MyTable from "@/components/Table";
import { debounce, importExcel } from "../../utils/util";
export default {
  name: "Index",
  components: {
    MyPie,
    MyTable
  },
  props: {},
  data() {
    return {
      excelName: "",
      all: [],
      tree: [],
      index: 0,
      firstIndex: 0,
      secondIndex: 0,
      thirdIndex: 0,
      depth: 0,
      financeData: {},
      firstData: [],
      secondData: [],
      thirdData: [],
      fourthData: "",
      pieOption: {},
      tableData: []
    };
  },
  computed: {
    total() {
      let total = this.all.length;
      return total ? total : 0;
    },
    first() {
      let first = this.tree.length;
      return first ? first : 0;
    },
    second() {
      let second = this.secondData.length;
      return second ? second : 0;
    },
    third() {
      let third = this.thirdData.length;
      return third > 1 ? third : 0;
    },
    financeNum() {
      let num = this.financeData.length;
      return num > 0 ? num : 0;
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.chatResize();
  },
  methods: {
    findFirst() {
      this.depth = 0;
      this.setPieOption();
    },
    findSecond() {
      this.depth = 1;
      this.thirdData = [];
      this.fourthData = [];
      this.setPieOption(true);
    },
    findThird() {
      this.depth = 2;
      this.fourthData = [];
      this.setPieOption(true);
    },
    findFinance() {
      if (!this.financeData || !this.financeData.length) {
        return;
      }
      const option = {
        title: {
          text: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      let legendData = [];
      let seriesData = [];
      let tabData = [];
      this.financeData.forEach(item => {
        tabData.push(item);
        legendData.push(item.APP);
        seriesData.push({
          value: 1,
          name: item.APP
        });
      });
      option.legend.data = legendData;
      option.series[0].data = seriesData;
      option.title.text = "app详情";
      option.series[0].name = "app详情";
      this.depth = 4;
      this.pieOption = option;
      this.tableData = tabData;
    },
    uploadFile() {
      this.$refs.file.dispatchEvent(new MouseEvent("click"));
    },
    getFile() {
      importExcel("file")
        .then(data => {
          let list = data.list;
          this.excelName = data.name;
          this.tableData = list;
          this.all = list;
          this.handleData(list);
          this.index = 0;
          this.depth = 0;
          this.firstData = [];
          this.secondData = [];
          this.thirdData = [];
          this.fourthData = "";
          this.setPieOption();
        })
        .catch(err => {
          this.$message.error("获取失败");
        });
    },
    chatResize() {
      window.onresize = debounce(() => {
        this.$refs.pie.resize();
      }, 500);
    },
    chatClickVal(val) {
      let { dataIndex, seriesName } = val;
      this.index = dataIndex;
      this.depth = this.depth + 1;
      if (this.depth > 3) this.depth = 4;
      this.setPieOption();
    },
    setPieOption(flag) {
      if (this.fourthData.length === 1 || this.depth > 3) {
        return;
      }
      const option = {
        title: {
          text: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      let legendData = [];
      let seriesData = [];
      if (this.depth === 0) {
        this.firstData = this.tree;
        this.firstData.forEach(item => {
          if (item.id === "金融理财") {
            this.financeData = item.children.slice(0);
          }
          legendData.push(item.id);
          seriesData.push({
            value: item.children.length,
            name: item.id
          });
        });
        this.tableData = this.all;
      }
      if (this.depth === 1) {
        let index = null;
        if (flag) {
          index = this.firstIndex;
        } else {
          this.firstIndex = this.index;
          index = this.index;
        }
        this.tableData = this.firstData[index].children.slice(0);
        this.secondData = this.firstData[index].children.filter(item => {
          return item.children && item.children.length > 0;
        });
        this.secondData.forEach(item => {
          legendData.push(item.id);
          seriesData.push({
            value: item.children.length,
            name: item.id
          });
        });
      }
      if (this.depth === 2) {
        let index = null;
        if (flag) {
          index = this.secondIndex;
        } else {
          this.secondIndex = this.index;
          index = this.index;
        }
        this.thirdData = this.secondData[index].children;
        this.tableData = this.secondData[index].children;
        this.thirdData.forEach(item => {
          legendData.push(item.APP);
          seriesData.push({
            value: 1,
            name: item.APP
          });
        });
      }
      if (this.depth === 3) {
        this.thirdIndex = this.index;
        this.fourthData = this.thirdData[this.index];
        this.tableData = [this.fourthData];
        legendData.push(this.fourthData.APP);
        seriesData.push({
          value: 1,
          name: this.fourthData.APP
        });
      }
      option.legend.data = legendData;
      option.series[0].data = seriesData;
      option.title.text = ["一级分类", "二级分类", "三级分类", "app详情"][
        this.depth
      ];
      option.series[0].name = ["一级分类", "二级分类", "三级分类", "app详情"][
        this.depth
      ];
      if (this.depth === 2 && !this.fourthData && this.thirdData.length === 1) {
        option.title.text = "app详情";
        option.series[0].name = "app详情";
      }
      this.pieOption = option;
    },
    handleData(arr) {
      let list = [];
      let first = null;
      let second = null;
      arr.forEach((item, index) => {
        first = item["一级分类"];
        second = item["二级分类"];
        list.push({
          id: first,
          pid: "0"
        });
        list.push({
          id: second,
          pid: first,
          一级分类: first,
          二级分类: second,
          APP: item["APP"]
        });
        list.push({
          id: index + 1,
          pid: second,
          一级分类: first,
          二级分类: second,
          APP: item["APP"]
        });
      });
      removeRepeatArr(list);
      this.tree = createTree(list, "id", "pid", "children");
      function removeRepeatArr(array) {
        //从后遍历，数组不用移动位置
        let sameKey = [];
        for (let i = array.length - 1; i >= 0; i--) {
          for (let j = i - 1; j >= 0; j--) {
            if (
              array[i].id === array[j].id &&
              array[i].pid === array[j].pid &&
              !array[i].APP
            ) {
              array.splice(i, 1);
            }
          }
          if (array[i].id === array[i].pid) {
            sameKey.push(array[i].id);
            array[i].id = array[i].id + " ";
          }
        }
        array.forEach(item => {
          for (let i = 0, len = sameKey.length; i < len; i++)
            if (
              typeof item.id === "number" &&
              item.id > 0 &&
              item.pid === sameKey[i]
            ) {
              item.pid = sameKey[i] + " ";
            }
        });
      }
      function createTree(a, idStr, pidStr, chindrenStr) {
        var r = [],
          hash = {},
          id = idStr,
          pid = pidStr,
          children = chindrenStr,
          i = 0,
          j = 0,
          len = a.length;
        for (; i < len; i++) {
          hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
          var aVal = a[j],
            hashVP = hash[aVal[pid]];
          if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
          } else {
            r.push(aVal);
          }
        }
        return r;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.index {
  .upload {
    display: flex;
    padding: 0.6rem;
    justify-content: center;
    align-items: center;
    .fileName {
      font-size: 0.3rem;
      margin-left: 0.5rem;
    }
  }
  .listInfo {
    display: flex;
    font-size: 0.3rem;
    flex-wrap: wrap;
    justify-content: center;
    .item {
      margin: 0 0.1rem;
      padding: 0.2rem 0.4rem;
      border: 1px solid #ddd;
    }
  }
  .chart {
    max-width: 1200px;
    box-sizing: border-box;
    margin: 1rem auto;
    padding: 0.1rem;
    font-size: 0.16rem;
    .pie {
      width: 100%;
      height: 400px;
    }
  }
}
@media only screen and (max-width: 768px) {
  .index {
    .listInfo {
      display: flex;
      font-size: 0.3rem;
      flex-wrap: wrap;
      justify-content: center;
      .item {
        width: 100%;
        box-sizing: border-box;
        margin: 0.1rem 0.1rem;
        padding: 0.2rem 0.4rem;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>
