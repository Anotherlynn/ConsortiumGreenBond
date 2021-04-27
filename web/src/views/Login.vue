/*
登陆界面
*/
<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">欢迎使用联盟链<span>绿色债券</span>管理系统</h1>

      <!-- 登录表单 -->
      <el-form
        ref="loginForm"
        :model="form"
        label-width="50px"
        :rules="formRules"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="id">
          <el-input v-model="form['用户id']"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form['cardid']" show-password></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <div class="submit-area">
          <el-form-item class="submit-item">
            <el-button class="submit" type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button class="submit" type="warning" @click="onRegister"
              >注册</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        用户id: "",
        cardid: "",
      },
      formRules: {
        id: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    async onLogin() {
      this.$refs["registerForm"].validate(async (isValid) => {
        if (isValid) {
          const response = await this.$http.get("/api/login");
          if (response.status !== 200) {
            return this.$message.error("登录失败，请重试");
          }
          // 将 token 存入 window.sessionStorage
          window.sessionStorage.setItem("token", response.data.token);
          // 判断用户是否为管理员
          if (this.form["用户id"] === "admin") {
            window.sessionStorage.setItem("isAdmin", true);
          } else {
            window.sessionStorage.setItem("isAdmin", false);
          }
          // 页面跳转到主页
          if (response.data.userIdentity === "admin") {
            this.$route.push("/admin");
          } else {
            this.$route.push("/user");
          }
        }
      });
    },
    onRegister() {
      // 页面跳转到注册
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #cfeae0;
  height: 100%;
}

.login-box {
  width: 600px;
  height: 344px;
  background-color: #fff;
  border-radius: 12px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

h1 {
  text-align: center;
  font-size: 28px;
  margin: 60px 0 40px 0;
}

.el-form {
  max-width: 500px;
  margin: auto;
}

.submit-area {
  text-align: center;
  margin-top: 40px;
}

.submit-item {
  display: inline-block;
}

.el-button {
  display: inline-block;
  width: 180px !important;
}
</style>
