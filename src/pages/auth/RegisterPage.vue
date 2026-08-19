<template>
  <main class="auth-page">
    <section class="auth-visual">
      <router-link class="brand" to="/">
        <span class="brand__mark">
          <el-icon>
            <Sunrise />
          </el-icon>
        </span>
        <span class="brand__copy">
          <strong>拾光社区</strong>
          <small>记录热爱 · 连接同好</small>
        </span>
      </router-link>
      <div class="auth-quote">
        <h2>
          从今天开始，
          <br />
          收藏自己的闪光时刻。
        </h2>
        <p>加入温暖、真诚的兴趣社区，遇见和你一样认真生活的人。</p>
      </div>
      <small>© 2026 拾光社区 · 友善交流，优质分享</small>
    </section>
    <section class="auth-panel">
      <el-form ref="ruleForm" class="auth-form" :model="ruleForm" :rules="rules">
        <h1>创建账号</h1>
        <p class="auth-subtitle">只需一分钟，开启你的社区旅程</p>
        <el-form-item prop="userId">
          <el-input v-model.number="ruleForm.userId" autocomplete="username" placeholder="8–9 位数字账号" />
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" autocomplete="nickname" placeholder="你的昵称" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="new-password"
            placeholder="设置密码"
            show-password />
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="new-password"
            placeholder="再次输入密码"
            show-password
            @keyup.enter="submitForm" />
        </el-form-item>
        <el-button class="auth-submit" type="primary" :loading="submitting" @click="submitForm">注册</el-button>
        <p class="auth-switch">
          已有账号？
          <button type="button" @click="toLogin">返回登录</button>
        </p>
      </el-form>
    </section>
  </main>
</template>

<script>
import { Sunrise } from "@element-plus/icons-vue";
export default {
  name: "RegisterPage",
  components: { Sunrise },
  data() {
    const validateAccount = (_rule, value, callback) =>
      /^\d{8,9}$/.test(String(value || "")) ? callback() : callback(new Error("请输入 8–9 位数字账号"));
    const validatePassword = (_rule, value, callback) => (value ? callback() : callback(new Error("请输入密码")));
    const validateConfirmation = (_rule, value, callback) =>
      value !== this.ruleForm.password ? callback(new Error("两次输入密码不一致")) : callback();
    return {
      ruleForm: { userId: "", username: "", password: "", checkPass: "" },
      submitting: false,
      rules: {
        userId: [{ validator: validateAccount, trigger: "blur" }],
        username: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkPass: [{ validator: validateConfirmation, trigger: "blur" }],
      },
    };
  },
  methods: {
    async submitForm() {
      const valid = await this.$refs.ruleForm.validate().catch(() => false);
      if (!valid) return;
      this.submitting = true;
      this.$api.users
        .create(this.ruleForm)
        .then(({ data }) => {
          if (!data.success) return this.$message.error(data.message || "注册失败");
          this.$message.success("注册成功，请登录");
          this.$router.push({ name: "login" });
        })
        .catch(() => this.$message.error("暂时无法注册，请确认后端服务已启动"))
        .finally(() => {
          this.submitting = false;
        });
    },
    toLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
