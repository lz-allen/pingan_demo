<template>
  <div class="table">
    <el-table :data="tableData" height="450" border style="width: 100%">
      <el-table-column prop="APP" label="APP名称"></el-table-column>
      <el-table-column prop="一级分类" label="一级分类"></el-table-column>
      <el-table-column prop="二级分类" label="二级分类"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Table",
  components: {},
  props: ["tableData"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>