<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>债券查询</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询 -->
    <el-card>
      <h1>债券查询</h1>
      <el-form ref="queryForm" :model="queryFormData" label-width="100px">
        <!-- Bond ID -->
        <el-form-item label="Bond ID" prop="id">
          <el-input
            v-model="queryFormData.id"
            placeholder="请输入Bond ID..."
          ></el-input>
        </el-form-item>

        <!-- time -->
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="queryFormData.time"
            class="date-picker"
            type="date"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <!-- amount -->
        <el-form-item label="金额" prop="amount">
          <el-input
            v-model="queryFormData.amount"
            placeholder="请输入金额..."
          ></el-input>
        </el-form-item>

        <!-- company -->
        <el-form-item label="发行单位" prop="company">
          <el-input
            v-model="queryFormData.company"
            placeholder="请输入发行单位..."
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button type="warning" @click="onResetForm">重置</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryFormData: {
        id: "",
        time: "",
        amount: "",
        company: "",
      },
    };
  },
  methods: {
    onSearch() {
      window.sessionStorage.setItem("search", JSON.stringify(this.form));
      this.$router.push("/queryResult");
    },
    onResetForm() {
      this.$refs["queryForm"].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 30px;
}

.date-picker {
  width: 100% !important;
}
</style>
