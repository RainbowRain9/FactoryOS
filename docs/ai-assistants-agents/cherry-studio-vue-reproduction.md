# Cherry Studio 界面 Vue 3 还原指南

本文档详细说明如何使用 Vue 3.5 + TypeScript + Ant Design Vue 4.2 + Pinia 3.0 + Vite 7.1 技术栈来还原 Cherry Studio 的界面。

## 项目概述

Cherry Studio 是一个基于 Electron 的桌面 AI 助手应用，包含以下核心界面：

- 助手管理页面
- 智能体管理页面
- 对话界面
- 设置页面
- 历史记录可视化

## 界面结构分析

### 1. 整体布局架构

**参考位置**: [`src/renderer/src/pages/home/HomePage.tsx`](src/renderer/src/pages/home/HomePage.tsx:125-167)

```typescript
// Vue 3 组合式API实现
<template>
  <Container class="home-page">
    <!-- 左侧导航栏 -->
    <Navbar
      v-if="isLeftNavbar"
      :activeAssistant="activeAssistant"
      :activeTopic="activeTopic"
      @update:activeTopic="setActiveTopic"
      @update:activeAssistant="setActiveAssistant"
      position="left"
    />

    <!-- 内容区域 -->
    <ContentContainer>
      <!-- 助手侧边栏 -->
      <motion-div v-if="showAssistants">
        <HomeTabs
          :activeAssistant="activeAssistant"
          :activeTopic="activeTopic"
          @update:activeAssistant="setActiveAssistant"
          @update:activeTopic="setActiveTopic"
          position="left"
        />
      </motion-div>

      <!-- 聊天界面 -->
      <Chat
        :assistant="activeAssistant"
        :activeTopic="activeTopic"
        @update:activeTopic="setActiveTopic"
        @update:activeAssistant="setActiveAssistant"
      />
    </ContentContainer>
  </Container>
</template>
```

### 2. 助手管理页面

**参考位置**: [`src/renderer/src/pages/home/Tabs/AssistantsTab.tsx`](src/renderer/src/pages/home/Tabs/AssistantsTab.tsx:35-178)

#### 核心组件结构

```vue
<template>
  <Container class="assistants-tab" ref="containerRef">
    <!-- API服务器提示 -->
    <Alert
      v-if="!apiServerConfig.enabled && !iknow.enable_api_server_to_use_agent"
      color="warning"
      :title="t('agent.warning.enable_server')"
      closable
      @close="handleAlertClose"
    />

    <!-- 加载状态 -->
    <Spin v-if="agentsLoading" />

    <!-- 错误提示 -->
    <Alert
      v-if="apiServerRunning && agentsError"
      color="danger"
      :title="t('agent.list.error.failed')"
      :description="getErrorMessage(agentsError)"
    />

    <!-- 标签页内容 -->
    <UnifiedTagGroups
      v-if="assistantsTabSortType === 'tags'"
      :groupedItems="groupedUnifiedItems"
      :activeAssistantId="activeAssistant.id"
      :activeAgentId="activeAgentId"
      @assistantSwitch="setActiveAssistant"
      @assistantDelete="onDeleteAssistant"
      @agentDelete="deleteAgent"
      @agentPress="setActiveAgentId"
    />

    <UnifiedList
      v-else
      :items="unifiedItems"
      :activeAssistantId="activeAssistant.id"
      :activeAgentId="activeAgentId"
      @assistantSwitch="setActiveAssistant"
      @assistantDelete="onDeleteAssistant"
      @agentDelete="deleteAgent"
      @agentPress="setActiveAgentId"
    />

    <!-- 添加按钮 -->
    <UnifiedAddButton @create="onCreateAssistant" />
  </Container>
</template>

<script setup lang="ts">
// 使用组合式API
import { ref, computed, onMounted } from 'vue';
import { useAssistantsStore } from '@/stores/assistants';
import { useAgentsStore } from '@/stores/agents';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const assistantsStore = useAssistantsStore();
const agentsStore = useAgentsStore();

// 响应式数据
const activeAssistant = ref(null);
const containerRef = ref(null);
const dragging = ref(false);

// 计算属性
const agents = computed(() => agentsStore.agents);
const assistants = computed(() => assistantsStore.assistants);
const apiServerConfig = computed(() => settingsStore.apiServerConfig);

// 方法
const onDeleteAssistant = (assistant: Assistant) => {
  // 删除逻辑
};

const onCreateAssistant = () => {
  // 创建助手逻辑
};
</script>
```

#### 助手卡片组件

**参考位置**: [`src/renderer/src/pages/home/Tabs/components/AssistantItem.tsx`](src/renderer/src/pages/home/Tabs/components/AssistantItem.tsx)

```vue
<template>
  <AssistantItemContainer :class="{ active: isActive }" @click="handleClick">
    <div class="assistant-header">
      <EmojiAvatar :emoji="assistant.emoji" />
      <div class="assistant-info">
        <div class="assistant-name">{{ assistant.name }}</div>
        <div class="assistant-model">{{ assistant.model?.name }}</div>
      </div>
    </div>

    <div class="assistant-actions">
      <a-button type="text" size="small" @click.stop="handleEdit">
        <EditOutlined />
      </a-button>
      <a-button type="text" size="small" @click.stop="handleDelete">
        <DeleteOutlined />
      </a-button>
    </div>
  </AssistantItemContainer>
</template>
```

### 3. 智能体管理页面

**参考位置**: [`src/renderer/src/pages/home/Tabs/SessionsTab.tsx`](src/renderer/src/pages/home/Tabs/SessionsTab.tsx:12-43)

```vue
<template>
  <div>
    <Alert
      v-if="!apiServer.enabled"
      color="warning"
      :title="t('agent.warning.enable_server')"
    />

    <Alert v-else-if="!activeAgentId" color="warning" title="Select an agent" />

    <div v-else>
      <Sessions :agentId="activeAgentId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useRuntimeStore } from '@/stores/runtime';

const settingsStore = useSettingsStore();
const runtimeStore = useRuntimeStore();

const apiServer = computed(() => settingsStore.apiServer);
const activeAgentId = computed(() => runtimeStore.chat.activeAgentId);
</script>
```

### 4. 对话界面

**参考位置**: [`src/renderer/src/pages/home/Chat.tsx`](src/renderer/src/pages/home/Chat.tsx:194-283)

#### 主聊天组件

```vue
<template>
  <Container
    id="chat"
    :class="[messageStyle, { 'multi-select-mode': isMultiSelectMode }]"
  >
    <a-layout class="chat-layout">
      <!-- 聊天头部 -->
      <ChatNavbar
        :activeAssistant="assistant"
        :activeTopic="activeTopic"
        @update:activeTopic="setActiveTopic"
        @update:activeAssistant="setActiveAssistant"
      />

      <!-- 消息区域 -->
      <div class="messages-container">
        <!-- 普通对话 -->
        <template v-if="activeTopicOrSession === 'topic'">
          <Messages
            :key="activeTopic.id"
            :assistant="assistant"
            :topic="activeTopic"
            @update:activeTopic="setActiveTopic"
          />

          <!-- 内容搜索 -->
          <ContentSearch
            ref="contentSearchRef"
            :searchTarget="mainRef"
            :filter="contentSearchFilter"
            :includeUser="filterIncludeUser"
            @update:includeUser="userOutlinedItemClickHandler"
          />

          <!-- 聊天导航 -->
          <ChatNavigation v-if="messageNavigation === 'buttons'" />

          <!-- 输入框 -->
          <Inputbar
            :assistant="assistant"
            :topic="activeTopic"
            @update:activeTopic="setActiveTopic"
          />
        </template>

        <!-- 智能体会话 -->
        <template v-else-if="activeTopicOrSession === 'session'">
          <AgentSessionMessages
            v-if="activeAgentId && activeSessionId"
            :agentId="activeAgentId"
            :sessionId="activeSessionId"
          />
          <AgentSessionInputbar
            v-if="activeAgentId && activeSessionId"
            :agentId="activeAgentId"
            :sessionId="activeSessionId"
          />
        </template>
      </div>
    </a-layout>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAssistantStore } from '@/stores/assistant';
import { useRuntimeStore } from '@/stores/runtime';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps<{
  assistant: Assistant;
  activeTopic: Topic;
}>();

const emit = defineEmits<{
  'update:activeTopic': [topic: Topic];
  'update:activeAssistant': [assistant: Assistant];
}>();

// Store
const assistantStore = useAssistantStore();
const runtimeStore = useRuntimeStore();
const settingsStore = useSettingsStore();

// 响应式数据
const mainRef = ref<HTMLElement>();
const contentSearchRef = ref();
const filterIncludeUser = ref(false);

// 计算属性
const { topicPosition, messageStyle, messageNavigation } =
  storeToRefs(settingsStore);
const { activeTopicOrSession, activeAgentId, activeSessionIdMap } =
  storeToRefs(runtimeStore);
const activeSessionId = computed(() =>
  activeAgentId.value ? activeSessionIdMap.value[activeAgentId.value] : null,
);

// 方法
const userOutlinedItemClickHandler = () => {
  filterIncludeUser.value = !filterIncludeUser.value;
  nextTick(() => {
    contentSearchRef.value?.search();
    contentSearchRef.value?.focus();
  });
};
</script>
```

#### 消息组件

**参考位置**: [`src/renderer/src/pages/home/Messages/Messages.tsx`](src/renderer/src/pages/home/Messages/Messages.tsx)

```vue
<template>
  <MessagesContainer id="messages" ref="messagesRef">
    <MessageGroup
      v-for="group in messageGroups"
      :key="group.id"
      :group="group"
      :assistant="assistant"
      @messageDelete="handleMessageDelete"
      @messageEdit="handleMessageEdit"
      @messageRegenerate="handleMessageRegenerate"
    />
  </MessagesContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useMessagesStore } from '@/stores/messages';

const props = defineProps<{
  assistant: Assistant;
  topic: Topic;
}>();

const messagesStore = useMessagesStore();
const messagesRef = ref<HTMLElement>();

// 计算属性
const messages = computed(() =>
  messagesStore.getMessagesByTopicId(props.topic.id),
);

const messageGroups = computed(() => groupMessagesByDate(messages.value));

// 自动滚动到底部
watch(
  messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true },
);
</script>
```

### 5. 对话历史可视化

**参考位置**: [`src/renderer/src/pages/home/Messages/ChatFlowHistory.tsx`](src/renderer/src/pages/home/Messages/ChatFlowHistory.tsx:203-523)

#### 流程图组件

```vue
<template>
  <FlowContainer>
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>

    <div v-else-if="nodes.length > 0" class="flow-container">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :node-types="nodeTypes"
        :default-edge-options="defaultEdgeOptions"
        :fit-view="true"
        :min-zoom="0.4"
        :max-zoom="1"
        @nodes-change="onNodesChange"
        @edges-change="onEdgesChange"
      >
        <Controls :show-interactive="false" />
        <MiniMap
          :node-stroke-width="3"
          :zoomable="true"
          :pannable="true"
          :node-color="nodeColor"
        />
      </VueFlow>
    </div>

    <div v-else class="empty-container">
      <div class="empty-text">{{ t('chat.history.no_messages') }}</div>
    </div>
  </FlowContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { VueFlow, useVueFlow } from '@braks/vueflow';
import { useMessagesStore } from '@/stores/messages';
import type { Node, Edge } from '@braks/vueflow';

const props = defineProps<{
  conversationId?: string;
}>();

const { t } = useI18n();
const messagesStore = useMessagesStore();
const { onNodesChange, onEdgesChange } = useVueFlow();

// 响应式数据
const loading = ref(true);
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

// 计算属性
const messages = computed(() =>
  messagesStore.getMessagesByTopicId(props.conversationId || ''),
);

const { userMessages, assistantMessages } = computed(() => ({
  userMessages: messages.value.filter((msg) => msg.role === 'user'),
  assistantMessages: messages.value.filter((msg) => msg.role === 'assistant'),
}));

// 自定义节点类型
const nodeTypes = {
  custom: markRaw(CustomNode),
};

// 边的默认配置
const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: 'var(--color-border)',
    strokeDasharray: '4,4',
    strokeWidth: 2,
  },
  type: 'step',
  markerEnd: undefined,
  zIndex: 5,
};

// 构建对话流程数据
const buildConversationFlowData = () => {
  if (!props.conversationId || !messages.value.length) {
    return { nodes: [], edges: [] };
  }

  const flowNodes: Node[] = [];
  const flowEdges: Edge[] = [];

  // 布局参数
  const verticalGap = 200;
  const horizontalGap = 350;
  const baseX = 150;

  // 为用户消息创建节点
  userMessages.value.forEach((message, index) => {
    const nodeId = `user-${message.id}`;
    const yPosition = index * verticalGap * 2;

    flowNodes.push({
      id: nodeId,
      type: 'custom',
      data: {
        userName: userName,
        content: getMainTextContent(message),
        type: 'user',
        messageId: message.id,
        userAvatar: userAvatar,
      },
      position: { x: baseX, y: yPosition },
    });

    // 查找相关的助手消息并创建节点
    const relatedAssistantMsgs = getRelatedAssistantMessages(message, index);
    relatedAssistantMsgs.forEach((aMsg, aIndex) => {
      const assistantNodeId = `assistant-${aMsg.id}`;
      const isMultipleResponses = relatedAssistantMsgs.length > 1;
      const assistantX =
        baseX + (isMultipleResponses ? horizontalGap * aIndex : 0);
      const assistantY = yPosition + verticalGap;

      flowNodes.push({
        id: assistantNodeId,
        type: 'custom',
        data: {
          model: aMsg.model?.name || t('chat.history.assistant_node'),
          content: getMainTextContent(aMsg),
          type: 'assistant',
          messageId: aMsg.id,
          modelId: aMsg.model?.id || '',
          modelInfo: aMsg.model,
        },
        position: { x: assistantX, y: assistantY },
      });

      // 连接消息
      flowEdges.push({
        id: `edge-${nodeId}-to-${assistantNodeId}`,
        source: nodeId,
        target: assistantNodeId,
      });
    });
  });

  return { nodes: flowNodes, edges: flowEdges };
};

// 监听消息变化
watch(
  messages,
  () => {
    loading.value = true;
    setTimeout(() => {
      const { nodes: flowNodes, edges: flowEdges } =
        buildConversationFlowData();
      nodes.value = flowNodes;
      edges.value = flowEdges;
      loading.value = false;
    }, 500);
  },
  { deep: true },
);
</script>
```

#### 自定义节点组件

```vue
<template>
  <a-tooltip
    :title="tooltipContent"
    placement="top"
    :color="'rgba(0, 0, 0, 0.85)'"
    :mouse-enter-delay="0.3"
    :mouse-leave-delay="0.1"
  >
    <CustomNodeContainer :style="nodeStyle" @click="handleNodeClick">
      <!-- 连接点 -->
      <Handle type="target" :position="Position.Top" :style="handleStyle" />
      <Handle type="target" :position="Position.Left" :style="handleStyle" />

      <!-- 节点内容 -->
      <NodeHeader>
        <NodeAvatar>
          <component :is="avatarComponent" />
        </NodeAvatar>
        <NodeTitle>{{ title }}</NodeTitle>
      </NodeHeader>
      <NodeContent :title="data.content">
        {{ data.content }}
      </NodeContent>

      <Handle type="source" :position="Position.Bottom" :style="handleStyle" />
      <Handle type="source" :position="Position.Right" :style="handleStyle" />
    </CustomNodeContainer>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@braks/vueflow';

interface Props {
  data: {
    type: 'user' | 'assistant';
    content: string;
    userName?: string;
    model?: string;
    messageId: string;
    userAvatar?: string;
    modelInfo?: Model;
  };
}

const props = defineProps<Props>();
const { t } = useI18n();

// 计算属性
const nodeStyle = computed(() => {
  const isUser = props.data.type === 'user';
  const borderColor = isUser ? 'var(--color-icon)' : 'var(--color-primary)';
  const backgroundColor = isUser
    ? 'rgba(var(--color-info-rgb), 0.03)'
    : 'rgba(var(--color-primary-rgb), 0.03)';
  const gradientColor = isUser
    ? 'rgba(var(--color-info-rgb), 0.08)'
    : 'rgba(var(--color-primary-rgb), 0.08)';

  return {
    borderColor,
    background: `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientColor} 100%)`,
    boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1), 0 0 0 2px ${borderColor}40`,
  };
});

const title = computed(() => {
  if (props.data.type === 'user') {
    return props.data.userName || t('chat.history.user_node');
  } else {
    return props.data.model || t('chat.history.assistant_node');
  }
});

const avatarComponent = computed(() => {
  if (props.data.type === 'user') {
    return props.data.userAvatar
      ? h(Avatar, { src: props.data.userAvatar })
      : h(UserOutlined);
  } else {
    return props.data.modelInfo
      ? h(ModelAvatar, { model: props.data.modelInfo })
      : h(RobotOutlined);
  }
});

const tooltipContent = computed(() => ({
  title: title.value,
  body: props.data.content,
  footer: t('chat.history.click_to_navigate'),
}));

// 样式
const handleStyle = {
  opacity: 0,
  width: '12px',
  height: '12px',
  background: 'transparent',
  border: 'none',
};

// 方法
const handleNodeClick = () => {
  if (props.data.messageId) {
    // 创建自定义事件来定位消息
    const customEvent = new CustomEvent('flow-navigate-to-message', {
      detail: {
        messageId: props.data.messageId,
        modelId: props.data.modelId,
        modelName: props.data.model,
        nodeType: props.data.type,
      },
      bubbles: true,
    });

    document.dispatchEvent(customEvent);

    // 延迟滚动到消息
    setTimeout(() => {
      EventEmitter.emit(
        EVENT_NAMES.LOCATE_MESSAGE + ':' + props.data.messageId,
      );
    }, 250);
  }
};
</script>
```

### 6. 助手创建弹窗

**参考位置**: [`src/renderer/src/components/Popups/AddAssistantPopup.tsx`](src/renderer/src/components/Popups/AddAssistantPopup.tsx:156-213)

```vue
<template>
  <a-modal
    v-model:open="open"
    centered
    :footer="null"
    :closable="false"
    width="600px"
    @after-close="handleClose"
  >
    <template #title>
      <div class="modal-header">
        <h3>{{ t('assistants.create') }}</h3>
      </div>
    </template>

    <!-- 搜索框 -->
    <div class="search-container">
      <a-input
        v-model:value="searchText"
        :placeholder="t('assistants.search')"
        allow-clear
        size="middle"
        @change="handleSearchChange"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>

    <a-divider style="margin: 0" />

    <!-- 助手列表 -->
    <div class="assistants-list" ref="containerRef">
      <div
        v-for="(preset, index) in filteredPresets"
        :key="preset.id"
        :class="[
          'assistant-item',
          { default: preset.id === 'default' },
          { 'keyboard-selected': index === selectedIndex },
        ]"
        @click="onCreateAssistant(preset)"
        @mouseenter="selectedIndex = index"
      >
        <div class="assistant-info">
          <span class="assistant-emoji">{{ preset.emoji }}</span>
          <span class="assistant-name">{{ preset.name }}</span>
        </div>

        <div class="assistant-tags">
          <a-tag v-if="preset.id === 'default'" color="green">
            {{ t('assistants.presets.tag.system') }}
          </a-tag>
          <a-tag v-if="preset.type === 'agent'" color="orange">
            {{ t('assistants.presets.tag.agent') }}
          </a-tag>
          <a-tag v-if="preset.id === 'new'" color="green">
            {{ t('assistants.presets.tag.new') }}
          </a-tag>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAssistantsStore } from '@/stores/assistants';
import { useAssistantPresetsStore } from '@/stores/assistantPresets';
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [assistant: Assistant];
}>();

const { t } = useI18n();
const assistantsStore = useAssistantsStore();
const assistantPresetsStore = useAssistantPresetsStore();

// 响应式数据
const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const searchText = ref('');
const selectedIndex = ref(0);
const containerRef = ref<HTMLElement>();
const inputRef = ref();

// 计算属性
const presets = computed(() => {
  const allPresets = [
    ...assistantPresetsStore.userPresets,
    ...assistantPresetsStore.systemPresets,
  ];
  const list = [assistantPresetsStore.defaultAssistant, ...allPresets];

  if (searchText.value.trim()) {
    const newAgent = {
      id: 'new',
      name: searchText.value.trim(),
      prompt: '',
      topics: [],
      type: 'assistant',
      emoji: '⭐️',
    };
    return [
      newAgent,
      ...list.filter(
        (preset) =>
          preset.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
          preset.description
            ?.toLowerCase()
            .includes(searchText.value.toLowerCase()),
      ),
    ];
  }

  return list;
});

// 键盘导航
const handleKeyDown = (e: KeyboardEvent) => {
  const displayedPresets = presets.value.slice(0, 100);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex.value =
        selectedIndex.value >= displayedPresets.length - 1
          ? 0
          : selectedIndex.value + 1;
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex.value =
        selectedIndex.value <= 0
          ? displayedPresets.length - 1
          : selectedIndex.value - 1;
      break;
    case 'Enter':
    case 'NumpadEnter':
      if (
        selectedIndex.value >= 0 &&
        selectedIndex.value < displayedPresets.length
      ) {
        onCreateAssistant(displayedPresets[selectedIndex.value]);
      }
      break;
  }
};

// 监听键盘事件
watch(open, (newValue) => {
  if (newValue) {
    nextTick(() => {
      window.addEventListener('keydown', handleKeyDown);
      inputRef.value?.focus();
    });
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

// 监听选中项变化，确保在可视区域
watch(selectedIndex, () => {
  nextTick(() => {
    if (containerRef.value) {
      const presetItems =
        containerRef.value.querySelectorAll('.assistant-item');
      if (presetItems[selectedIndex.value]) {
        presetItems[selectedIndex.value].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  });
});

// 方法
const onCreateAssistant = async (preset: AssistantPreset) => {
  let assistant: Assistant;

  if (preset.id === 'default') {
    assistant = { ...preset, id: uuid() };
    assistantsStore.addAssistant(assistant);
  } else {
    assistant = await createAssistantFromAgent(preset);
  }

  emit('confirm', assistant);
  open.value = false;
};

const handleClose = () => {
  emit('confirm', undefined);
};
</script>

<style lang="scss" scoped>
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.search-container {
  padding: 12px 24px;
}

.assistants-list {
  max-height: 50vh;
  overflow-y: auto;
  padding: 0 24px 20px;
}

.assistant-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;

  &:hover,
  &.keyboard-selected,
  &.default {
    background-color: var(--color-background-mute);
  }

  .assistant-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;

    .assistant-emoji {
      font-size: 20px;
    }

    .assistant-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .assistant-tags {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
}
</style>
```

## 状态管理 (Pinia)

### 助手状态管理

```typescript
// stores/assistants.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Assistant } from '@/types';

export const useAssistantsStore = defineStore('assistants', () => {
  // 状态
  const assistants = ref<Assistant[]>([]);
  const activeAssistantId = ref<string>('');

  // 计算属性
  const activeAssistant = computed(() =>
    assistants.value.find((a) => a.id === activeAssistantId.value),
  );

  const assistantsByName = computed(() =>
    assistants.value.reduce(
      (acc, assistant) => {
        acc[assistant.name] = assistant;
        return acc;
      },
      {} as Record<string, Assistant>,
    ),
  );

  // 方法
  const addAssistant = (assistant: Assistant) => {
    assistants.value.push(assistant);
  };

  const removeAssistant = (id: string) => {
    const index = assistants.value.findIndex((a) => a.id === id);
    if (index > -1) {
      assistants.value.splice(index, 1);
    }
  };

  const updateAssistant = (id: string, updates: Partial<Assistant>) => {
    const index = assistants.value.findIndex((a) => a.id === id);
    if (index > -1) {
      assistants.value[index] = { ...assistants.value[index], ...updates };
    }
  };

  const setActiveAssistant = (id: string) => {
    activeAssistantId.value = id;
  };

  const copyAssistant = (id: string) => {
    const assistant = assistants.value.find((a) => a.id === id);
    if (assistant) {
      const newAssistant = {
        ...assistant,
        id: generateId(),
        name: `${assistant.name} (Copy)`,
      };
      assistants.value.push(newAssistant);
      return newAssistant;
    }
  };

  return {
    // 状态
    assistants,
    activeAssistantId,

    // 计算属性
    activeAssistant,
    assistantsByName,

    // 方法
    addAssistant,
    removeAssistant,
    updateAssistant,
    setActiveAssistant,
    copyAssistant,
  };
});
```

### 智能体状态管理

```typescript
// stores/agents.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Agent, AgentSession } from '@/types';

export const useAgentsStore = defineStore('agents', () => {
  // 状态
  const agents = ref<Agent[]>([]);
  const sessions = ref<Record<string, AgentSession[]>>({});
  const activeAgentId = ref<string>('');
  const activeSessionIdMap = ref<Record<string, string>>({});
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 计算属性
  const activeAgent = computed(() =>
    agents.value.find((a) => a.id === activeAgentId.value),
  );

  const activeSessions = computed(() =>
    activeAgentId.value ? sessions.value[activeAgentId.value] || [] : [],
  );

  const activeSessionId = computed(() =>
    activeAgentId.value ? activeSessionIdMap.value[activeAgentId.value] : null,
  );

  // 方法
  const setAgents = (agentList: Agent[]) => {
    agents.value = agentList;
  };

  const addAgent = (agent: Agent) => {
    agents.value.push(agent);
  };

  const removeAgent = (id: string) => {
    const index = agents.value.findIndex((a) => a.id === id);
    if (index > -1) {
      agents.value.splice(index, 1);
    }
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    const index = agents.value.findIndex((a) => a.id === id);
    if (index > -1) {
      agents.value[index] = { ...agents.value[index], ...updates };
    }
  };

  const setActiveAgent = (id: string) => {
    activeAgentId.value = id;
  };

  const setSessions = (agentId: string, sessionList: AgentSession[]) => {
    sessions.value[agentId] = sessionList;
  };

  const setActiveSession = (agentId: string, sessionId: string) => {
    activeSessionIdMap.value[agentId] = sessionId;
  };

  const createSession = async (agentId: string, name: string) => {
    // 调用API创建会话
    const session = await agentApi.createSession(agentId, name);

    if (!sessions.value[agentId]) {
      sessions.value[agentId] = [];
    }
    sessions.value[agentId].push(session);

    return session;
  };

  const deleteAgent = async (id: string) => {
    // 调用API删除智能体
    await agentApi.deleteAgent(id);
    removeAgent(id);
  };

  return {
    // 状态
    agents,
    sessions,
    activeAgentId,
    activeSessionIdMap,
    loading,
    error,

    // 计算属性
    activeAgent,
    activeSessions,
    activeSessionId,

    // 方法
    setAgents,
    addAgent,
    removeAgent,
    updateAgent,
    setActiveAgent,
    setSessions,
    setActiveSession,
    createSession,
    deleteAgent,
  };
});
```

## 类型定义

```typescript
// types/index.ts

export interface Assistant {
  id: string;
  name: string;
  emoji?: string;
  prompt: string;
  model?: Model;
  topics: Topic[];
  type: 'assistant' | 'agent';
  settings?: AssistantSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  model?: Model;
  instructions?: string;
  tools?: AgentTool[];
  settings?: AgentSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentSession {
  id: string;
  agentId: string;
  name: string;
  messages: AgentMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCall[];
  createdAt: string;
}

export interface Topic {
  id: string;
  assistantId: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  topicId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: Model;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  maxTokens?: number;
  supportedFeatures?: string[];
}

export interface AssistantSettings {
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export interface AgentSettings {
  temperature?: number;
  topP?: number;
  tools?: AgentTool[];
  memory?: boolean;
  knowledgeBase?: string[];
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}
```

## 样式主题

### 主题配置

```typescript
// styles/theme.ts
export const lightTheme = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // 字体
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,

    // 边框
    borderRadius: 8,
    borderWidth: 1,

    // 阴影
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',

    // 间距
    padding: 16,
    margin: 16,
  },
};

export const darkTheme = {
  token: {
    colorPrimary: '#177ddc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#d32029',
    colorInfo: '#177ddc',

    // 暗色模式配置
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorBorder: '#434343',
  },
};
```

### CSS 变量

```scss
// styles/variables.scss
:root {
  // 颜色
  --color-primary: #1677ff;
  --color-primary-rgb: 22, 119, 255;
  --color-primary-soft: rgba(22, 119, 255, 0.1);
  --color-info: #1677ff;
  --color-info-rgb: 22, 119, 255;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #ff4d4f;

  // 文本颜色
  --color-text: rgba(0, 0, 0, 0.85);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-text-3: rgba(0, 0, 0, 0.45);
  --color-icon: rgba(0, 0, 0, 0.45);

  // 背景色
  --color-background: #ffffff;
  --color-background-mute: #f5f5f5;
  --color-border: #d9d9d9;

  // 尺寸
  --navbar-height: 64px;
  --sidebar-width: 280px;
  --assistants-width: 300px;

  // 阴影
  --shadow-1: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.15);
}

[data-theme='dark'] {
  // 文本颜色
  --color-text: rgba(255, 255, 255, 0.85);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-text-3: rgba(255, 255, 255, 0.45);
  --color-icon: rgba(255, 255, 255, 0.45);

  // 背景色
  --color-background: #141414;
  --color-background-mute: #1f1f1f;
  --color-border: #434343;
}
```

## 路由配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        name: 'chat',
        component: () => import('@/views/Chat.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/History.vue'),
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/views/Knowledge.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

## 构建配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/views': resolve(__dirname, 'src/views'),
      '@/stores': resolve(__dirname, 'src/stores'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/styles': resolve(__dirname, 'src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          antd: ['ant-design-vue'],
          flow: ['@braks/vueflow'],
        },
      },
    },
  },
});
```

### Package.json

```json
{
  "name": "cherry-studio-vue",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.4.0",
    "pinia": "^3.0.0",
    "ant-design-vue": "^4.2.0",
    "@braks/vueflow": "^1.9.0",
    "axios": "^1.7.0",
    "dayjs": "^1.11.0",
    "lodash-es": "^4.17.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/lodash-es": "^4.17.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "sass": "^1.80.0",
    "typescript": "^5.8.0",
    "vite": "^7.1.0",
    "vue-tsc": "^2.1.0"
  }
}
```

## 总结

这个文档提供了使用 Vue 3 + TypeScript + Ant Design Vue 技术栈还原 Cherry Studio 界面的完整指南。主要包含：

1. **项目结构**: 整体布局和组件层次
2. **核心组件**: 助手管理、智能体管理、对话界面、历史可视化等
3. **状态管理**: 使用 Pinia 管理应用状态
4. **类型定义**: 完整的 TypeScript 类型系统
5. **样式主题**: 支持明暗主题切换
6. **构建配置**: Vite 构建工具配置

所有组件的设计都参考了原始 React 代码的逻辑和样式，确保在 Vue 3 生态系统中实现相同的功能和用户体验。
