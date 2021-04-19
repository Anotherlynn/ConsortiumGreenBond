/*
* 用户页面根组件
* Author: Maoqi he
* time: 2020-02-10
*/

<template>
  <div>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="words">欢迎使用联盟链<span>绿色债券</span>管理系统</div>
        <div class="onLogout">
          <el-button class="primary" @click="onLogout">退出</el-button>
        </div>
      </el-header>
    

      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!-- 侧边栏菜单 -->
          <el-menu default-active="management" router>
            <!-- 用户管理 -->
            <el-menu-item
              id="user-management"
              index="userManagement"
              v-if="isAdmin"
            >
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>

            <!-- 债券管理 -->
            <el-menu-item index="management">
              <i class="el-icon-menu"></i>
              <span slot="title">债券管理</span>
            </el-menu-item>

            <!-- 债券查询 -->
            <el-menu-item index="query">
              <i class="el-icon-search"></i>
              <span slot="title">债券查询</span>
            </el-menu-item>

            <!-- 公司管理 -->
            <el-menu-item index="companyManagement">
              <i class="el-icon-office-building"></i>
              <span slot="title">公司管理</span>
            </el-menu-item>

            <!-- 发起交易 -->
            <el-menu-item index="transaction">
              <i class="el-icon-bank-card"></i>
              <span slot="title">发起交易</span>
            </el-menu-item>

            <!-- 交易数据 -->
            <el-menu-item index="transactionData">
              <i class="el-icon-data-analysis"></i>
              <span slot="title">交易数据</span>
            </el-menu-item>

            <!-- 市场监控 -->
            <el-menu-item index="marketMonitoring">
              <i class="el-icon-s-marketing"></i>
              <span slot="title">市场监控</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主界面 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    // 如果用户是管理员, 则设置 this.isAdmin 为 true
    const isAdmin = window.sessionStorage.getItem("isAdmin");
    if (isAdmin === true) {
      this.isAdmin = true;
    }
    // 注销 window.sessionStorage 中存储的数据
    window.sessionStorage.removeItem("isAdmin");
  },
  data() {
    return {
      // 用户是否为管理员
      // TODO: 上线改为 false
      isAdmin: true,
      placeholder: true,
    };
  },
  methods: {
    onLogout() {
      window.sessionStorage.removeItem("token");
      this.$message.success("交易失败");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  border-bottom: 1px solid #eaecef;
  .words {
    display: inline-block;
    line-height: 60px;
    font-weight: 1200;
    font-size: 20px;
    span {
      color: #65b687;
    }
  }
  .onLogout {
    float: right;
    margin: 10px 0;
  }
}

.el-aside {
  border-right: 1px solid #eaecef;
  .el-menu {
    border: none;
    .el-menu-item {
      height: 80px;
      display: flex;
      align-items: center;
    }
  }
}

#user-management {
  border-left: 4px solid #65b687;
  padding-left: 16px !important;
}

.onLogout .primary {
  margin: 0;
}
</style>
