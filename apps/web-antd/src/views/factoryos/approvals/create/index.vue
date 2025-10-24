<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Alert, Button, Card } from 'ant-design-vue';

const route = useRoute();
const prefill = ref<Record<string, any> | null>(null);
const applied = ref(false);

onMounted(() => {
  // 优先从 URL 读取 prefill，其次从 sessionStorage 读取
  const q = route.query as Record<string, any>;
  let raw = q.prefill as string | undefined;
  if (!raw) raw = sessionStorage.getItem('requests:prefill') || undefined;
  if (raw) {
    try {
      prefill.value = JSON.parse(String(raw));
    } catch {
      // 非 JSON 情况下忽略
      prefill.value = null;
    }
  }
});

function applyPrefill() {
  applied.value = true;
  // Todo: 将 prefill 数据回填到真实表单字段（此处为入口演示）
  sessionStorage.removeItem('requests:prefill');
}
</script>

<template>
  <div class="p-6 space-y-3">
    <h1 class="text-xl font-semibold">发起申请</h1>
    <p class="text-gray-500">占位页面：常用请假/出差/报销/用章。</p>

    <Card v-if="prefill" size="small">
      <Alert
        type="info"
        show-icon
        message="检测到来自智能申请助手的预填数据"
        description="可一键回填到表单（当前为入口演示，未接真实表单）。"
      >
        <template #action>
          <Button type="primary" @click="applyPrefill">从对话回填</Button>
        </template>
      </Alert>

      <pre class="mt-3 text-xs bg-gray-50 p-2 rounded" v-if="!applied">{{ prefill }}</pre>
      <Alert v-else type="success" show-icon message="已应用回填（示意）" />
    </Card>
  </div>
  
</template>
