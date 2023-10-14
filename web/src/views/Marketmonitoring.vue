<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>市场监控</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 下拉框 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select
            v-model="graphOptions.statisticAttribute"
            placeholder="请选择统计属性"
          >
            <el-option label="统计交易数" value="transaction"></el-option>
            <el-option label="统计发行数" value="release"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <div class="space"></div>
        </el-col>
        <el-col :span="6">
          <div class="space"></div>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="graphOptions.timeRange"
            placeholder="请选择时间粒度"
          >
            <el-option label="日" value="day"></el-option>
            <el-option label="月" value="month"></el-option>
            <el-option label="年" value="year"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <div id="graph"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    // 引入 echarts
    let echarts = require("echarts/lib/echarts");
    require("echarts/lib/chart/bar");
    require("echarts/lib/component/tooltip");
    require("echarts/lib/component/title");
    let graph = document.getElementById("graph");
    let chart = echarts.init(graph);
    chart.setOption({
      title: {
        text: "市场监控",
      },
      tooltip: {},
      legend: {
        data: ["交易数量"],
      },
      xAxis: {
        data: ["2013", "2014", "2015", "2016", "2017", "2018"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "line",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });
  },
  data() {
    return {
      graphOptions: {
        statisticAttribute: "",
        timeRange: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
#graph {
  width: 800px;
  height: 400px;
  margin: auto;
}

.el-row {
  margin-bottom: 30px;
}

.space {
  width: 100%;
  min-height: 36px;
}
</style>
