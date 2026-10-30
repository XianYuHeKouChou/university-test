<template>
  <el-container class="login-bg h-full">
    <el-main style="padding: 0">
      <div class="h-full flex justify-center items-center">
        <el-card
          class="mx-auto w-full max-w-md bg-white/80 backdrop-blur shadow-2xl rounded-2xl border-0">
          <div class="mb-6 text-center">
            <h1 class="text-2xl font-semibold text-gray-800">欢迎登录</h1>
            <p class="text-gray-500 text-sm mt-1">请输入账号和密码</p>
          </div>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            label-position="top"
            class="space-y-3"
          >
            <el-form-item label="账号" prop="identifier">
              <el-input
                v-model="loginForm.identifier"
                placeholder="用户名 / 邮箱"
                clearable
                @keyup.enter="onSubmit"
              >
                <template #prefix>
                  <el-icon class="text-gray-400">
                    <component :is="UserFilled"/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                show-password
                placeholder="请输入密码"
                @keyup.enter="onSubmit"
              >
                <template #prefix>
                  <el-icon class="text-gray-400">
                    <component :is="Lock"/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <div class="flex items-center justify-between mb-1">
              <el-checkbox v-model="remember" label="记住我"/>
              <a href="" class="text-sm text-blue-600 hover:underline">忘记密码?</a>
            </div>

            <el-button
              type="primary"
              class="w-full !h-11 !text-base"
              :loading="loading"
              @click="onSubmit"
            >
              登录
            </el-button>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {applyUserRoutes} from '@/router/index.ts'
import {
  ElContainer,
  ElMain,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElCheckbox,
  ElIcon
} from 'element-plus'
import {Lock, UserFilled} from '@element-plus/icons-vue'
import {useAppStore} from '@/stores/counter.ts'

const loginForm = reactive({
  identifier: 'admin',
  password: '123456'
})
const router = useRouter()
const loading = ref(false)
const remember = ref(true)
const rules = {
  identifier: [{required: true, message: '请输入账号', trigger: 'blur'}],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, message: '密码至少 6 位', trigger: 'blur'}
  ]
}

function onSubmit() {
  useAppStore().setPermission('admin')
  applyUserRoutes()
  router.push('/');
}
</script>

<style scoped>
.login-bg {
  background-image: url('/image/loginbg.png');
  background-size: cover;
  background-position: center;
}
</style>
