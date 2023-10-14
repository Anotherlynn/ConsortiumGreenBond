<template>
  <div>
    <div class="title">
      <h1>{{ data["债券简称"] }}</h1>
      <el-button @click="goBack">回到上一页</el-button>
    </div>

    <!-- canvas 绘图区域 -->
    <div class="pie" ref="pie"></div>
    <div class="graph-words">绿债与非绿债的比例</div>
  </div>
</template>

<script>
export default {
  created() {
    this.data = JSON.parse(window.sessionStorage.getItem("clickedBond"));
  },
  mounted() {
    let pie = this.$echarts.init(this.$refs["pie"]);
    pie.setOption({
      series: [
        {
          name: this.data["债券简称"],
          type: "pie",
          radius: "55%",
          data: [
            { value: this.data["绿债金额"], name: "绿债金额" },
            { value: this.data["非绿债金额"], name: "非绿债金额" },
          ],
        },
      ],
    });
  },
  data() {
    return {
      data: {},
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.title {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 0;
  h1 {
    display: inline-block;
    font-size: 24px;
  }
  .el-button {
    width: 120px;
    margin-left: 10px;
    display: inline-block;
  }
}

.pie {
  height: 300px;
}

.graph-words {
  font-size: 12px;
  font-weight: 100px;
  text-align: center;
}
</style>
