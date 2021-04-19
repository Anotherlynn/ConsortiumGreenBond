<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>发起交易</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 用户提交表单 -->
    <el-card>
      <h1>填写债券信息</h1>
      <el-form
        ref="bondDataRef"
        :model="transactionForm.bondData"
        label-width="100px"
      >
        <!-- 第一行 -->
        <el-row>
          <!-- 交易代码 -->
          <el-col :span="8">
            <el-form-item label="交易代码" prop="交易代码">
              <el-input
                v-model="transactionForm.bondData['交易代码']"
                placeholder="交易代码"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 债券全称 -->
          <el-col :span="8">
            <el-form-item label="债券全称" prop="债券全称">
              <el-input
                v-model="transactionForm.bondData['债券全称']"
                placeholder="债券全称"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 债券简称 -->
          <el-col :span="8">
            <el-form-item label="债券简称" prop="债券简称">
              <el-input
                v-model="transactionForm.bondData['债券简称']"
                placeholder="债券简称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 资金用途 -->
        <el-form-item label="资金用途" prop="募集资金用途">
          <el-input
            v-model="transactionForm.bondData['募集资金用途']"
            placeholder="募集资金用途"
          ></el-input>
        </el-form-item>

        <!-- 第二行 -->
        <el-row>
          <!-- GB类型 -->
          <el-col :span="8">
            <el-form-item label="GB类型" prop="GB类型">
              <el-input
                v-model="transactionForm.bondData['GB类型']"
                placeholder="GB类型"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 发行起始日 -->
          <el-col :span="8">
            <el-form-item label="发行起始日" prop="发行起始日">
              <el-date-picker
                v-model="transactionForm.bondData['发行起始日']"
                class="date-picker"
                type="date"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <!-- 是否贴标 -->
          <el-col :span="8">
            <el-form-item label="是否贴标" prop="是否贴标">
              <el-radio-group v-model="transactionForm.bondData['是否贴标']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <!-- 发行规模 -->
          <el-col :span="8">
            <el-form-item label="发行规模" prop="发行规模(亿)">
              <el-input
                v-model="transactionForm.bondData['发行规模亿']"
                placeholder="发行规模(亿)"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 绿债金额 -->
          <el-col :span="8">
            <el-form-item label="绿债金额" prop="绿债金额">
              <el-input
                v-model="transactionForm.bondData['绿债金额']"
                placeholder="绿债金额"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- GB判断 -->
          <el-col :span="8">
            <el-form-item label="GB判断" prop="GB判断">
              <el-radio-group v-model="transactionForm.bondData['GB判断']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <!-- GI -->
          <el-col :span="8">
            <el-form-item label="GI" prop="GI">
              <el-input
                v-model="transactionForm.bondData['GI']"
                placeholder="GI"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- GI符号 -->
          <el-col :span="8">
            <el-form-item label="GI符号" prop="GI符号">
              <el-input
                v-model="transactionForm.bondData['GI符号']"
                placeholder="GI符号"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 项目名称 -->
          <el-col :span="8">
            <el-form-item label="项目名称" prop="项目名称">
              <el-input
                v-model="transactionForm.bondData['项目名称']"
                placeholder="项目名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <!-- GB二级分类（项目） -->
          <el-col :span="8">
            <el-form-item label="GB二级分类" prop="GB二级分类（项目）">
              <el-input
                v-model="transactionForm.bondData['GB二级分类项目']"
                placeholder="GB二级分类（项目）"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 所使用绿债金额（项目） -->
          <el-col :span="8">
            <el-form-item label="所使用绿债" prop="所使用绿债金额（项目）">
              <el-input
                v-model="transactionForm.bondData['所使用绿债金额项目']"
                placeholder="所使用绿债金额（项目）"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 标签（项目） -->
          <el-col :span="8">
            <el-form-item label="标签" prop="标签（项目）">
              <el-input
                v-model="transactionForm.bondData['标签项目']"
                placeholder="标签（项目）"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 备注 -->
        <el-form-item label="备注" prop="备注">
          <el-input
            v-model="transactionForm.bondData['备注']"
            placeholder="备注"
          ></el-input>
        </el-form-item>

        <!-- 第六行 -->
        <el-row>
          <!-- 发行期限（年） -->
          <el-col :span="8">
            <el-form-item label="发行期限" prop="发行期限（年）">
              <el-date-picker
                v-model="transactionForm.bondData['发行期限年']"
                class="date-picker"
                type="date"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <!-- 债券评级 -->
          <el-col :span="8">
            <el-form-item label="债券评级" prop="债券评级">
              <el-input
                v-model="transactionForm.bondData['债券评级']"
                placeholder="债券评级"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 主体评级 -->
          <el-col :span="8">
            <el-form-item label="主体评级" prop="主体评级">
              <el-input
                v-model="transactionForm.bondData['主体评级']"
                placeholder="主体评级"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <el-row>
          <!-- 票面利率(%) -->
          <el-col :span="8">
            <el-form-item label="票面利率" prop="票面利率(%)">
              <el-input
                v-model="transactionForm.bondData['票面利率']"
                placeholder="票面利率(%)"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 浮动利率(%) -->
          <el-col :span="8">
            <el-form-item label="浮动利率" prop="浮动利率(%)">
              <el-input
                v-model="transactionForm.bondData['浮动利率']"
                placeholder="浮动利率(%)"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 增信方式 -->
          <el-col :span="8">
            <el-form-item label="增信方式" prop="增信方式">
              <el-input
                v-model="transactionForm.bondData['增信方式']"
                placeholder="增信方式"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 特殊条款 -->
        <el-form-item label="特殊条款" prop="特殊条款">
          <el-input
            v-model="transactionForm.bondData['特殊条款']"
            placeholder="特殊条款"
          ></el-input>
        </el-form-item>

        <!-- 第八行 -->
        <el-row>
          <!-- 上市日期 -->
          <el-col :span="8">
            <el-form-item label="上市日期" prop="上市日期">
              <el-date-picker
                v-model="transactionForm.bondData['上市日期']"
                class="date-picker"
                type="date"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <!-- 上市地点 -->
          <el-col :span="8">
            <el-form-item label="上市地点" prop="上市地点">
              <el-input
                v-model="transactionForm.bondData['上市地点']"
                placeholder="上市地点"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 债券代码列表 -->
          <el-col :span="8">
            <el-form-item label="代码列表" prop="债券代码列表">
              <el-input
                v-model="transactionForm.bondData['债券代码列表']"
                placeholder="债券代码列表"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第九行 -->
        <el-row>
          <!-- 到期日 -->
          <el-col :span="8">
            <el-form-item label="到期日" prop="到期日">
              <el-date-picker
                v-model="transactionForm.bondData['到期日']"
                class="date-picker"
                type="date"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <!-- 利率类型 -->
          <el-col :span="8">
            <el-form-item label="利率类型" prop="利率类型">
              <el-input
                v-model="transactionForm.bondData['利率类型']"
                placeholder="利率类型"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 付息频率 -->
          <el-col :span="8">
            <el-form-item label="付息频率" prop="付息频率">
              <el-input
                v-model="transactionForm.bondData['付息频率']"
                placeholder="付息频率"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第十行 -->
        <el-row>
          <!-- 评级机构 -->
          <el-col :span="8">
            <el-form-item label="评级机构" prop="评级机构">
              <el-input
                v-model="transactionForm.bondData['评级机构']"
                placeholder="评级机构"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 担保人 -->
          <el-col :span="8">
            <el-form-item label="担保人" prop="担保人">
              <el-input
                v-model="transactionForm.bondData['担保人']"
                placeholder="担保人"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 发行时担保人评级 -->
          <el-col :span="8">
            <el-form-item label="担保人评级" prop="发行时担保人评级">
              <el-input
                v-model="transactionForm.bondData['发行时担保人评级']"
                placeholder="发行时担保人评级"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第十一行 -->
        <el-row>
          <!-- 担保人企业性质 -->
          <el-col :span="8">
            <el-form-item label="企业性质" prop="担保人企业性质">
              <el-input
                v-model="transactionForm.bondData['担保人企业性质']"
                placeholder="担保人企业性质"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 担保条款 -->
          <el-col :span="8">
            <el-form-item label="担保条款" prop="担保条款">
              <el-input
                v-model="transactionForm.bondData['担保条款']"
                placeholder="担保条款"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 主承销商 -->
          <el-col :span="8">
            <el-form-item label="主承销商" prop="主承销商">
              <el-input
                v-model="transactionForm.bondData['主承销商']"
                placeholder="主承销商"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第十二行 -->
        <el-row>
          <!-- 发行方式 -->
          <el-col :span="8">
            <el-form-item label="发行方式" prop="发行方式">
              <el-input
                v-model="transactionForm.bondData['发行方式']"
                placeholder="发行方式"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 发行价格 -->
          <el-col :span="8">
            <el-form-item label="发行价格" prop="发行价格">
              <el-input
                v-model="transactionForm.bondData['发行价格']"
                placeholder="发行价格"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 发行年度 -->
          <el-col :span="8">
            <el-form-item label="发行年度" prop="发行年度">
              <el-date-picker
                v-model="transactionForm.bondData['发行年度']"
                class="date-picker"
                type="date"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第十三行 -->
        <el-row>
          <!-- Wind债券类型(一级) -->
          <el-col :span="8">
            <el-form-item label="债券类型" prop="Wind债券类型(一级)">
              <el-input
                v-model="transactionForm.bondData['Wind债券类型一级']"
                placeholder="Wind债券类型(一级)"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- Wind债券类型(二级) -->
          <el-col :span="8">
            <el-form-item label="债券类型" prop="Wind债券类型(二级)">
              <el-input
                v-model="transactionForm.bondData['Wind债券类型二级']"
                placeholder="Wind债券类型(二级)"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 是否发行失败 -->
          <el-col :span="8">
            <el-form-item label="是否发行失败" prop="是否发行失败">
              <el-radio-group
                v-model="transactionForm.bondData['是否发行失败']"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第十四行 -->
        <el-row>
          <!-- 是否城投债 -->
          <el-col :span="8">
            <el-form-item label="是否城投债" prop="是否城投债">
              <el-radio-group v-model="transactionForm.bondData['是否城投债']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 是否增发 -->
          <el-col :span="8">
            <el-form-item label="是否增发" prop="是否增发">
              <el-radio-group v-model="transactionForm.bondData['是否增发']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 是否跨市场 -->
          <el-col :span="8">
            <el-form-item label="是否跨市场" prop="是否跨市场">
              <el-radio-group v-model="transactionForm.bondData['是否跨市场']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h1>选择公司</h1>
      <el-form ref="companyRef" :model="transactionForm" label-width="100px">
        <el-form-item label="请选择公司" prop="company">
          <el-select v-model="transactionForm.company">
            <el-option
              v-for="company in companies"
              :key="company"
              :value="company"
              >{{ company }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-form>

      <h1>填写金额</h1>
      <el-form ref="amountRef" :model="transactionForm" label-width="100px">
        <el-form-item label="请输入金额" prop="amount">
          <el-input
            v-model="transactionForm.amount"
            placeholder="请输入金额..."
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 提交 -->
      <el-button type="primary" @click.native="onSubmit">发起交易</el-button>
      <el-button type="warning" @click.native="onResetFields"
        >重置表单</el-button
      >
    </el-card>
  </div>
</template>

<script>
export default {
  async created() {
    const response = await this.$http.get("/api/transactionCompany", {
      token: window.sessionStorage.getItem("token"),
    });
    if (response.status !== 200) {
      return this.$message.error("请求数据失败！请检查网络重试");
    }
    this.companies = response.data;
  },
  data() {
    return {
      companies: ["a", "b"],
      transactionForm: {
        token: window.sessionStorage.getItem("token"),
        bondData: {
          交易代码: "",
          债券全称: "",
          债券简称: "",
          GB类型: "",
          募集资金用途: "",
          发行起始日: "",
          是否贴标: "",
          发行规模亿: "",
          绿债金额: "",
          GB判断: "",
          GI: "",
          GI符号: "",
          项目名称: "",
          GB二级分类项目: "",
          所使用绿债金额项目: "",
          标签项目: "",
          备注: "",
          发行期限年: "",
          债券评级: "",
          主体评级: "",
          票面利率: "",
          浮动利率: "",
          特殊条款: "",
          增信方式: "",
          上市日期: "",
          上市地点: "",
          债券代码列表: "",
          到期日: "",
          利率类型: "",
          付息频率: "",
          评级机构: "",
          担保人: "",
          发行时担保人评级: "",
          担保人企业性质: "",
          担保条款: "",
          主承销商: "",
          发行方式: "",
          发行价格: "",
          Wind债券类型一级: "",
          Wind债券类型二级: "",
          是否发行失败: "",
          是否城投债: "",
          是否增发: "",
          是否跨市场: "",
          发行年度: "",
        },
        company: "",
        amount: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      // 提交用户填写的表单
      const response = await this.$http.post(
        "/api/transaction",
        this.transactionForm
      );

      // 判断提交的成功与否
      if (response.status !== 200) {
        this.$message.error("提交失败，请稍后重试");
      } else if (response.data.isSuccess === false) {
        this.$message.error("交易失败");
      } else {
        this.$message.success("交易成功");
      }

      // 重置表单数据
      this.onResetFields();
    },
    onResetFields() {
      this.$refs.bondDataRef.resetFields();
      this.$refs.companyRef.resetFields();
      this.$refs.amountRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
h1 {
  margin-bottom: 30px;
}

.date-picker {
  width: 100% !important;
}

.el-select {
  width: 100%;
}

.el-button {
  width: 100%;
  margin: 5px 0 !important;
}
</style>
