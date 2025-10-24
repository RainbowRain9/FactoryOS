<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Alert, Button, Card, Spin } from 'ant-design-vue';

const isLoading = ref(true);
const hasError = ref(false);
const route = useRoute();

// 是否隐藏 Dify 的品牌标识（覆盖遮挡方式，仅在允许去品牌的场景使用）
const hideBrand = computed(() => {
  const q = route.query as Record<string, any>;
  const v =
    (q.hideBrand as string) ?? (import.meta as any).env?.VITE_DIFY_HIDE_BRAND;
  return String(v).toLowerCase() === 'true' || v === '1';
});

async function encodeInputsForIframe(inputs: Record<string, any>) {
  const result: Record<string, string> = {};
  const keys = Object.keys(inputs || {});
  for (const key of keys) {
    const raw = String(inputs[key] ?? '');
    try {
      if (typeof window !== 'undefined' && 'CompressionStream' in window) {
        const encoder = new TextEncoder();
        const data = encoder.encode(raw);
        const cs = new CompressionStream('gzip');
        const writer = (new Response(data).body as ReadableStream).pipeThrough(cs);
        const compressed = await new Response(writer).arrayBuffer();
        const bytes = new Uint8Array(compressed);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        const b64 = btoa(binary);
        result[key] = encodeURIComponent(b64);
      } else {
        result[key] = encodeURIComponent(raw);
      }
    } catch {
      result[key] = encodeURIComponent(raw);
    }
  }
  return result;
}

// 依据路由参数或环境变量组装 Dify iframe URL（支持 url/base+token/fallback）
const difyUrl = computed(() => {
  const q = route.query as Record<string, any>;
  const fullUrl = q.url as string | undefined;
  const base =
    (q.base as string) ||
    (import.meta as any).env?.VITE_DIFY_BASE ||
    'https://udify.app';
  const token = (q.token as string) || (import.meta as any).env?.VITE_DIFY_TOKEN;
  const fallback = 'https://dify.icerain.love/chatbot/mB7o44I2LtkqYhnO';
  if (fullUrl) return fullUrl;
  if (token) return `${base.replace(/\/$/, '')}/chatbot/${token}`;
  return fallback;
});

const iframeSrc = ref<string>('');

async function buildIframeSrc() {
  try {
    const q = route.query as Record<string, any>;
    const inputsRaw = q.inputs as any;
    const baseUrl = difyUrl.value;
    let inputs: null | Record<string, any> = null;
    if (inputsRaw) {
      if (typeof inputsRaw === 'string') {
        try {
          inputs = JSON.parse(inputsRaw);
        } catch {
          inputs = {};
          inputsRaw.split('&').forEach((pair: string) => {
            const [k, v] = pair.split('=');
            if (k) inputs![decodeURIComponent(k)] = decodeURIComponent(v || '');
          });
        }
      } else if (typeof inputsRaw === 'object') {
        inputs = inputsRaw as Record<string, any>;
      }
    }
    const url = new URL(baseUrl, window.location.origin);
    if (inputs && Object.keys(inputs).length > 0) {
      const encoded = await encodeInputsForIframe(inputs);
      for (const [k, v] of Object.entries(encoded)) {
        url.searchParams.set(k, v);
      }
    }
    iframeSrc.value = url.toString();
  } catch {
    iframeSrc.value = difyUrl.value;
  }
}

onMounted(async () => {
  await buildIframeSrc();
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});

const onIframeLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const onIframeError = () => {
  isLoading.value = false;
  hasError.value = true;
};
</script>

<template>
  <div class="ai-chat-page">
    <div class="chat-content">
      <div v-if="isLoading" class="loading-container">
        <Card class="loading-card">
          <div class="loading-content">
            <Spin size="large" tip="正在加载智能申请助手..." />
            <p class="loading-tip">助手正在启动中，请稍候...</p>
          </div>
        </Card>
      </div>

      <div v-else-if="hasError" class="error-container">
        <Card class="error-card">
          <Alert
            type="error"
            message="加载失败"
            description="无法加载智能申请助手，请检查网络连接或稍后重试。"
            show-icon
            class="error-alert"
          >
            <template #action>
              <Button type="primary" @click="location.reload()">重新加载</Button>
            </template>
          </Alert>
        </Card>
      </div>

      <div v-else class="iframe-container">
        <Card class="chat-card">
          <div class="iframe-wrapper" :class="{ 'hide-brand': hideBrand }">
            <iframe
              :src="iframeSrc || difyUrl"
              class="chat-iframe"
              frameborder="0"
              allow="microphone"
              @load="onIframeLoad"
              @error="onIframeError"
              title="智能申请助手"
            ></iframe>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .ai-chat-page {
    height: 100%;
    min-height: calc(100vh - 48px);
  }

  .chat-content {
    padding: 16px;
  }
}

.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 100px);
  overflow: hidden;
  background: hsl(var(--background));
}

.chat-content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.loading-container,
.error-container,
.iframe-container {
  display: flex;
  flex: 1;
  align-items: stretch;
  justify-content: center;
  height: 100%;
}

.loading-card,
.error-card,
.chat-card {
  width: 100%;
  height: 100%;
}

.chat-card {
  display: flex;
  flex-direction: column;
}

.loading-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.loading-tip {
  margin: 0;
  font-size: 14px;
  color: hsl(var(--muted-foreground));
}

.error-card {
  padding: 24px;
}

.error-alert {
  margin-bottom: 16px;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

.iframe-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

/* 可选：遮挡 iframe 中右下角的品牌标识（仅在许可范围内使用） */
.iframe-wrapper.hide-brand::after {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  width: 180px;
  height: 32px;
  pointer-events: none;
  content: '';
  background: hsl(var(--card));
  border-radius: 6px;
}

.chat-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.loading-card :deep(.ant-card-body),
.error-card :deep(.ant-card-body) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
}
</style>
