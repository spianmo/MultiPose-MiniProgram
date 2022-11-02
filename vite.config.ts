import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// @ts-ignore
import defineReactive from 'vite-plugin-vue3-define-reactive'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [defineReactive({
    debug: false
  }), uni()],
});
