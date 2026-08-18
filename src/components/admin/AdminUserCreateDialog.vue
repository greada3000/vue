<template>
  <el-dialog v-model="visible" title="添加用户" append-to-body width="30%" @closed="reset">
    <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="0" class="register-container">
      <el-form-item prop="userId">
        <el-input v-model.number="form.userId" autocomplete="off" placeholder="请设置8-9位数账号" />
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="form.username" autocomplete="off" placeholder="请设置昵称" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请设置密码" />
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input v-model="form.checkPass" type="password" autocomplete="off" placeholder="请再次输入密码" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="reset">重置</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">注册</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'submit'])
const formRef = ref()
const form = reactive({ userId: '', username: '', password: '', checkPass: '' })

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const validateUserId = (_rule, value, callback) => {
  if (!value) return callback(new Error('账号不能为空'))
  if (!Number.isInteger(value)) return callback(new Error('请输入数字值'))
  if (value < 1 || value > 999999999) return callback(new Error('必须为8-9个数字'))
  callback()
}

const validatePassword = (_rule, value, callback) => {
  if (!value) return callback(new Error('请输入密码'))
  callback()
}

const validateConfirmation = (_rule, value, callback) => {
  if (!value) return callback(new Error('请再次输入密码'))
  if (value !== form.password) return callback(new Error('两次输入密码不一致!'))
  callback()
}

const rules = {
  userId: [{ validator: validateUserId, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  checkPass: [{ validator: validateConfirmation, trigger: 'blur' }]
}

const reset = () => {
  formRef.value?.resetFields()
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { ...form })
}
</script>
