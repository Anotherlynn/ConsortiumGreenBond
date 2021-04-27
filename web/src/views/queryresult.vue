<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>债券查询</el-breadcrumb-item>
      <el-breadcrumb-item>查询结果</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="tableData" style="width: 100%" @row-click="showDetail">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- 展开要展示的信息 -->
              <div
                class="item-wrapper"
                v-for="(value, key) in props.row"
                :key="key"
              >
                <el-form-item :label="key">
                  <span>{{ value }}</span>
                </el-form-item>
              </div>
            </el-form>
          </template></el-table-column
        ></el-table
      ></el-card
    >
  </div>
</template>
</el-table-column>
<!-- 主要信息列 -->
<el-table-column label="债券简称" prop="债券简称"></el-table-column>
<el-table-column label="交易代码" prop="交易代码"></el-table-column>
<el-table-column label="GB类型" prop="GB类型"></el-table-column>
<el-table-column label="发行人简称" prop="发行人简称"></el-table-column>
<el-table-column label="发行规模(亿)" prop="发行规模(亿)"></el-table-column>
</el-table>
</el-card>
</div>
</template>

<script>
export default {
  async created() {
    let form = JSON.parse(window.sessionStorage.getItem("search"));
    const response = await this.$http.post("/query", form);
    if (response.status !== 200) {
      return this.$message.error("请求数据失败！请检查网络重试");
    }
    this.tableData = response.data;
  },
  data() {
    return {
      tableData: [
        {
          债券简称: "欧洲工业",
          交易代码: "CB0001",
          GB类型: "一类",
          发行人简称: "王尼玛有限责任公司",
          "发行规模(亿)": 12.56,
          绿债金额: 7,
        },
      ],
    };
  },
  methods: {
    showDetail(row) {
      // 将信息存入 sessionStorage
      let data = {
        债券简称: row["债券简称"],
        绿债金额: row["绿债金额"],
        非绿债金额: row["发行规模(亿)"] - row["绿债金额"],
        "发行规模(亿)": row["发行规模(亿)"],
      };
      window.sessionStorage.setItem("clickedBond", JSON.stringify(data));
      this.$router.push("/detail");
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
