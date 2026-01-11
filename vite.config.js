import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 假设你在 Gitee 上创建的仓库名字叫 'bit-virtual-tour'
// 请务必把下面的名字换成你真实的仓库名！
export default defineConfig({
  base: './', // 👈 偷懒的万能写法：改成 './' (相对路径)，这样无论你仓库叫什么都能跑
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
