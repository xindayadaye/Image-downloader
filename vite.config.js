import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // 开启ElementPlus自动引入CSS
    ElementPlus({
      useSource: true,
      defaultLocale: "zh-cn",
    }), // 自动导入组件
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
      ],
      vueTemplate: true,
    }),
    // 自动注册组件
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // 输出目录，默认是 dist
    outDir: "build",
    // 是否开启 sourcemap
    sourcemap: false,
    // 是否开启压缩
    minify: "esbuild", // 可选值：'terser' | 'esbuild'
    // 是否开启 brotli 压缩
    brotli: true,
    // 是否将模块提取到单独的 chunk 中，默认是 true
    chunkSizeWarningLimit: 500,
    // 是否提取 CSS 到单独的文件中
    cssCodeSplit: true,
    // 是否开启 CSS 压缩
    cssMinify: true,
    // 是否开启 CSS 去重
    cssInlineLimit: 4096,
    // 启用/禁用 esbuild 的 minification，如果设置为 false 则使用 Terser 进行 minification
    target: "es2018", // 可选值：'esnext' | 'es2020' | 'es2019' | 'es2018' | 'es2017' | 'es2016' | 'es2015' | 'es5'
    // 是否开启 Rollup 的代码拆分功能
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
    // 是否开启增量式构建
    // https://vitejs.dev/guide/build.html#incremental-build
    incremental: false,
  },
});
