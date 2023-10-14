/*
* 注册页面
* Author: Maoqi he
* time: 2020-02-09
*/

<template>
  <div>
    <!-- 外包 div, 整体居中 -->
    <div class="wrapper">
      <h1 class="title">欢迎注册联盟链<span>绿色债券</span>管理系统</h1>

      <!-- 注册表单 -->
      <el-form
        ref="registerForm"
        :model="form"
        label-width="100px"
        :rules="formRules"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="id">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>

        <!-- 公司名 -->
        <el-form-item label="公司名" prop="company">
          <el-input v-model="form.company"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.pwd" show-password></el-input>
        </el-form-item>

        <!-- 密码确认框 -->
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input v-model="form.checkPwd" show-password></el-input>
        </el-form-item>

        <!-- 图片上传(异步) -->
        <el-form-item label="上传营业执照">
          <el-upload
            v-show="!isLicenceUploadSuccessful"
            drag
            name="licence"
            :action="licenceRequestUrl"
            :data="licenceRequestData"
            :on-success="licenceRequestSuccess"
            ::limit="1"
            accept="image/png,image/jpg,image/jpeg"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <div class="upload-successful" v-show="isLicenceUploadSuccessful">
            <span>上传成功 &nbsp;</span>
            <i class="el-icon-circle-check"></i>
          </div>
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="submit" type="primary" @click="onSubmit"
            >立即注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // 请求初始数据
  async created() {
    const response = await this.$http.get("/api/generate");
    if (response.status === 200) {
      const id = response.data.id;
      this.id = id;
      this.licenceRequestData.id = id;
      this.form.id = id;
    }
  },
  data() {
    // 密码的验证函数
    const validatePwd = (rule, value, callback) => {
      if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 初始请求获得的账号
      id: "",
      // 营业执照的上传地址
      licenceRequestUrl: "http://localhost:9000/api/uploadlicence",
      // 图片上传携带的信息
      licenceRequestData: {
        id: "",
      },
      // 是否成功上传
      isLicenceUploadSuccessful: false,
      // 表单信息
      form: {
        id: "",
        company: "",
        pwd: "",
        checkPwd: "",
      },
      // 表单规则
      formRules: {
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    licenceRequestSuccess() {
      this.isLicenceUploadSuccessful = true;
    },
    // 提交
    onSubmit() {
      // 图片上传失败 || 未上传图片
      if (!this.isLicenceUploadSuccessful) {
        return this.$message.error("图片上传失败或未上传图片");
      }
      this.$refs["registerForm"].validate(async (isValid) => {
        // 表单数据合法, 提交
        if (isValid) {
          // 请求数据
          const response = await this.$http.get("/api/register", this.form);
          if (response.status !== 200) {
            this.$refs["registerForm"].resetField();
            return this.$message.error("请求数据失败！请重新填写表单");
          }
          this.$message.success("注册成功！");
          // 页面跳转到登录
          this.$router.push("/login");
        }
      });
    },
  },
};
</script>

<style lang='less'>
.wrapper {
  margin: 50px auto;
  max-width: 600px;
}

.title {
  margin: 30px 0;
}

.title span {
  color: #65b687;
}

.el-upload-dragger {
  width: 500px !important;
}

.submit {
  width: 500px !important;
}

.upload-successful {
  color: #65b687;
}
</style>
