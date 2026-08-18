<template>
  <el-dialog v-model="visible" title="修改用户信息" append-to-body width="40%">
    <el-form :model="user" label-width="80px">
      <el-form-item label="用户账号"><el-input v-model="user.userId" disabled /></el-form-item>
      <el-form-item label="用户昵称"><el-input v-model="user.username" /></el-form-item>
      <el-form-item label="用户类型">
        <span>普通用户</span>
        <el-switch v-model="user.usertype" class="user-type-switch" />
        <span>管理员</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="$emit('save')">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  user: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'save'])
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
.user-type-switch { margin: 0 8px; }
</style>
