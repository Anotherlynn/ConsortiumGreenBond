<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>交易数据</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="transactionData">
        <el-table-column prop="债券信息" label="债券信息"></el-table-column>
        <el-table-column prop="操作人id" label="操作人id"></el-table-column>
        <el-table-column prop="操作时间" label="操作时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  async created() {
    // 获取交易数据
    const response = await this.$http.request("/api/transactionData", {
      token: window.sessionStorage.getItem("token"),
    });
    if (response.status !== 200) {
      return this.$message.error("请求数据失败！请检查网络重试");
    }
    this.transactionData = response.data;
  },
  data() {
    return {
      transactionData: [],
    };
  },
};
</script>

<style lang="less" scoped>
</style>
