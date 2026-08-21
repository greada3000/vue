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
          每一次真诚分享，
          <br />
          都会照亮另一颗心。
        </h2>
        <p>回到熟悉的社区，继续记录你的生活、灵感与成长。</p>
      </div>
      <small>© 2026 拾光社区 · 友善交流，优质分享</small>
    </section>
    <section class="auth-panel">
      <el-form class="auth-form" :model="loginForm" @submit.prevent="Login">
        <h1>欢迎回来</h1>
        <p class="auth-subtitle">登录后继续探索感兴趣的故事与圈子</p>
        <el-form-item>
          <el-input
            v-model.number="loginForm.userId"
            autocomplete="username"
            placeholder="账号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="current-password"
            placeholder="密码"
            show-password
            @keyup.enter="Login"
          />
        </el-form-item>
        <el-button
          class="auth-submit"
          type="primary"
          :loading="submitting"
          @click="Login"
          >登录</el-button
        >
        <p class="auth-switch">
          还没有账号？
          <button type="button" @click="toRegister">立即注册</button>
        </p>
        <el-button text @click="$router.push('/')">先逛逛社区</el-button>
      </el-form>
    </section>
  </main>
</template>

<script>
import { Sunrise } from "@element-plus/icons-vue";
import { setBasicAuth } from "@/services/api";
export default {
  name: "LoginPage",
  components: { Sunrise },
  data: () => ({ loginForm: { userId: "", password: "" }, submitting: false }),
  methods: {
    Login() {
      if (!this.loginForm.userId || !this.loginForm.password)
        return this.$message.warning("请输入账号和密码");
      this.submitting = true;
      this.$api.users
        .login(this.loginForm)
        .then(({ data }) => {
          if (!data.success)
            return this.$message.error(data.message || "登录失败");
          setBasicAuth(this.loginForm.userId, this.loginForm.password);
          this.$store.dispatch("asyncUpdateUser", {
            name: data.data.userId,
            username: data.data.username,
            usertype: data.data.usertype,
            pic: data.data.userpic,
          });
          this.$message.success("欢迎回来");
          const redirect = this.$route.query.redirect;
          this.$router.push(
            redirect ||
              (data.data.usertype
                ? { name: "admin-dashboard" }
                : { name: "home" }),
          );
        })
        .catch((error) =>
          this.$message.error(
            error.userMessage || "暂时无法登录，请确认后端服务已启动",
          ),
        )
        .finally(() => {
          this.submitting = false;
        });
    },
    toRegister() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>
