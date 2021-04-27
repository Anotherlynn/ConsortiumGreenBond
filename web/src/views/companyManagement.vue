<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <h1>修改注册公司信息</h1>
      <el-form
        ref="companyManagementFormRef"
        :model="companyManagementForm"
        label-width="100px"
      >
        <!-- 发行人简称 -->
        <el-form-item label="发行人简称" prop="发行人简称">
          <el-input
            v-model="companyManagementForm['发行人简称']"
            placeholder="发行人简称"
          ></el-input>
        </el-form-item>

        <!-- 发行人全称 -->
        <el-form-item label="发行人全称" prop="发行人全称">
          <el-input
            v-model="companyManagementForm['发行人全称']"
            placeholder="发行人全称"
          ></el-input>
        </el-form-item>

        <!-- 公司介绍 -->
        <el-form-item label="公司介绍" prop="公司介绍">
          <el-input
            v-model="companyManagementForm['公司介绍']"
            placeholder="公司介绍"
          ></el-input>
        </el-form-item>

        <!-- 主要产品及类型 -->
        <el-form-item label="产品及类型" prop="主要产品及类型">
          <el-input
            v-model="companyManagementForm['主要产品及类型']"
            placeholder="主要产品及类型"
          ></el-input>
        </el-form-item>

        <!-- 发行人行业(二级) -->
        <el-form-item label="发行人行业" prop="发行人行业(二级)">
          <el-input
            v-model="companyManagementForm['发行人行业二级']"
            placeholder="发行人行业(二级)"
          ></el-input>
        </el-form-item>

        <!-- 发行人企业性质wind -->
        <el-form-item label="企业性质" prop="发行人企业性质wind">
          <el-input
            v-model="companyManagementForm['发行人企业性质wind']"
            placeholder="发行人企业性质wind"
          ></el-input>
        </el-form-item>

        <!-- 发行人企业性质2 -->
        <el-form-item label="企业性质" prop="发行人企业性质2">
          <el-input
            v-model="companyManagementForm['发行人企业性质2']"
            placeholder="发行人企业性质2"
          ></el-input>
        </el-form-item>

        <!-- 发行人省份 -->
        <el-form-item label="发行人省份" prop="发行人省份">
          <el-input
            v-model="companyManagementForm['发行人省份']"
            placeholder="发行人省份"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click.native="onSubmit">修改信息</el-button>
      <el-button type="warning" @click.native="onResetFields"
        >重置表单</el-button
      >
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companyManagementForm: {
        token: window.sessionStorage.getItem("token"),
        发行人简称: "",
        发行人全称: "",
        公司介绍: "",
        主要产品及类型: "",
        发行人行业二级: "",
        发行人企业性质wind: "",
        发行人企业性质2: "",
        发行人省份: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      // 提交用户填写的表单
      const res = await this.$http.post(
        "/api/companyManagement",
        this.companyManagementForm
      );

      // 判断提交的成功与否
      if (res.status !== 200) {
        this.$message.error("提交失败，请稍后重试");
      } else {
        this.$message.success("提交成功");
      }

      // 重置表单数据
      this.onResetFields();
    },
    onResetFields() {
      this.$refs.companyManagementFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
h1 {
  margin-bottom: 30px;
}
</style>
