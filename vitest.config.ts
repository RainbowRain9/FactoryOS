import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  server: {
    host: true, // 允许通过 0.0.0.0 监听，便于通过域名/内网访问
    allowedHosts: ['vibot.icerain.love'], // 将你的域名加入白名单
  },
  // 可选：vite preview 阶段同样允许该域名
  preview: {
    host: true,
    allowedHosts: ['vibot.icerain.love'],
  },
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, '**/e2e/**'],
  },
});
