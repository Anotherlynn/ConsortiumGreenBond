<template>
  <div id="wrapper">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 展示用户信息 -->
      <el-table
        :data="userManagementData"
        style="width: 100%"
        @row-click="showDetail"
      >
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
<el-table-column label="用户名称" prop="用户名称"></el-table-column>
<el-table-column label="用户id" prop="用户id"></el-table-column>
<el-table-column label="用户密码" prop="用户密码"></el-table-column>
<el-table-column label="所属公司" prop="所属公司"></el-table-column>
<el-table-column label="授权状态" prop="授权状态"></el-table-column>
<el-table-column label="是否授权" prop="是否授权"></el-table-column>
</el-table>
</el-card>
</div>
</template>

<script>
export default {
  async created() {
    const response = await this.$http.get("/api/usermanagement", {
      token: window.sessionStorage.getItem("token"),
    });
    if (response.status !== 200) {
      return this.$message.error("请求数据失败！请检查网络重试");
    }
    this.userManagementData = response.data;
  },
  data() {
    return {
      userManagementData: [
        {
          用户名称: "欧洲工业",
          用户id: "CB0001",
          用户密码: "一类",
          所属公司: "王尼玛有限责任公司",
          授权状态: 12.56,
          绿债金额: 7,
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
</style>
