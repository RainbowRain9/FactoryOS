# FactoryOS 对话界面实现任务清单

## 概述

基于 Cherry Studio 的对话界面架构，为 FactoryOS 实现统一的 AI 对话界面。支持与普通助手和 Dify 智能体的对话，提供流畅的用户体验。

## 阶段 1: 基础架构搭建

- [ ] 1. 创建对话界面类型定义
  - File: packages/types/src/chat.ts
  - 定义 Message, Topic, Session, MessageGroup 等核心接口
  - 扩展现有的助手类型定义
  - Purpose: 建立对话界面的类型安全基础
  - _Leverage: packages/types/src/ai-assistants.ts_
  - _Requirements: 基础架构_
  - _Prompt: Role: TypeScript 类型专家 | Task: 创建对话界面的完整类型定义，包括消息、对话、会话等核心接口，确保类型安全和扩展性 | Restrictions: 必须兼容现有的助手类型，支持流式消息数据结构，保持向后兼容 | Success: 所有接口类型定义完整，编译无错误，支持所有对话场景_

- [ ] 2. 创建对话状态管理 Store
  - File: packages/stores/src/chat.ts
  - 实现对话状态管理和消息数据流
  - 添加话题和会话的 CRUD 操作
  - Purpose: 提供对话界面的响应式状态管理
  - _Leverage: packages/stores/src/ai-assistants.ts_
  - _Requirements: 状态管理_
  - _Prompt: Role: Pinia 状态管理专家 | Task: 创建对话状态管理，包括消息列表、对话历史、当前状态等，使用 Pinia composition API | Restrictions: 必须支持大量消息的高效管理，实现流式消息更新，处理并发对话 | Success: Store 功能完整，状态响应式更新，支持所有对话操作_

- [ ] 3. 创建对话服务层
  - File: apps/web-antd/src/services/chat/
  - 实现 ChatService 和 AgentChatService
  - 添加消息发送、接收、历史加载等功能
  - Purpose: 提供对话的业务逻辑层
  - _Leverage: apps/web-antd/src/services/ai-assistants/_
  - _Requirements: 服务层_
  - _Prompt: Role: 前端服务架构师 | Task: 创建对话服务层，实现消息发送、历史管理、流式响应处理，集成现有的助手服务 | Restrictions: 必须处理网络异常，实现消息重试，支持离线模式，确保数据一致性 | Success: 服务层稳定可靠，错误处理完善，支持所有对话功能_

## 阶段 2: 主对话界面组件

- [ ] 4. 创建 ChatView 主对话界面
  - File: apps/web-antd/src/views/ai-chat/ChatView.vue
  - 实现对话界面的主容器组件
  - 添加条件渲染逻辑和状态管理集成
  - Purpose: 提供对话界面的主入口和容器
  - _Leverage: @core/ui-kit layout components, chat store_
  - _Requirements: 主界面_
  - _Prompt: Role: Vue 组件架构师 | Task: 创建主对话界面组件，实现条件渲染、状态管理、键盘快捷键，复用现有布局组件 | Restrictions: 必须支持助手和智能体的无缝切换，处理各种对话状态，确保响应式性能 | Success: 主界面功能完整，状态切换流畅，用户体验良好_

- [ ] 5. 创建 ChatNavbar 对话导航栏
  - File: apps/web-antd/src/views/ai-chat/components/ChatNavbar.vue
  - 实现对话导航和信息显示
  - 添加返回、设置、状态指示等功能
  - Purpose: 提供对话界面的导航和信息展示
  - _Leverage: @core/ui-kit/navbar components, icons_
  - _Requirements: 导航组件_
  - _Prompt: Role: UI 组件开发专家 | Task: 创建对话导航栏组件，显示助手信息、连接状态、快速操作，使用现有导航组件 | Restrictions: 必须显示实时状态信息，支持快速操作，保持视觉一致性 | Success: 导航栏信息完整，状态显示准确，操作便捷_

- [ ] 6. 实现对话路由配置
  - File: apps/web-antd/src/router/routes/chat.ts
  - 配置对话界面的路由和权限
  - 集成到现有的路由系统
  - Purpose: 将对话界面集成到应用导航
  - _Leverage: effects/router, effects/access_
  - _Requirements: 路由集成_
  - _Prompt: Role: 前端路由专家 | Task: 配置对话界面路由，支持动态助手参数，集成权限控制，复用现有路由模式 | Restrictions: 必须支持浏览器刷新，正确处理参数传递，保持路由状态同步 | Success: 路由配置正确，权限控制有效，URL 状态同步_

## 阶段 3: 消息显示组件

- [ ] 7. 创建 Messages 普通消息组件
  - File: apps/web-antd/src/views/ai-chat/components/Messages.vue
  - 实现普通助手消息的显示和交互
  - 添加消息分组、无限滚动、Markdown 渲染
  - Purpose: 提供普通助手对话的消息展示
  - _Leverage: @core/ui-kit/markdown components, virtual scroll_
  - _Requirements: 消息显示_
  - _Prompt: Role: Vue 组件开发专家 | Task: 创建普通消息组件，实现消息分组、无限滚动、Markdown 渲染，使用现有 Markdown 组件 | Restrictions: 必须支持大量消息的流畅滚动，正确渲染 Markdown 格式，处理图片和代码块 | Success: 消息显示性能优秀，格式渲染正确，交互功能完善_

- [ ] 8. 创建 AgentSessionMessages 智能体消息组件
  - File: apps/web-antd/src/views/ai-chat/components/AgentSessionMessages.vue
  - 实现智能体消息的流式显示
  - 添加工作流状态和思考过程可视化
  - Purpose: 提供智能体对话的专属消息展示
  - _Leverage: Messages.vue, dify-client.ts_
  - _Requirements: 智能体消息_
  - _Prompt: Role: 流式数据处理专家 | Task: 创建智能体消息组件，实现流式响应显示、工作流状态可视化、思考过程展示 | Restrictions: 必须实时显示流式数据，正确处理工作流状态，提供流畅的视觉反馈 | Success: 流式消息显示实时，状态可视化清晰，用户体验流畅_

- [ ] 9. 创建 MessageGroup 消息分组组件
  - File: apps/web-antd/src/views/ai-chat/components/MessageGroup.vue
  - 实现消息的分组显示和交互
  - 添加复制、编辑、删除等操作
  - Purpose: 提供消息的组织和管理功能
  - _Leverage: @core/ui-kit/card components, context menu_
  - _Requirements: 消息组织_
  - _Prompt: Role: 交互组件开发专家 | Task: 创建消息分组组件，实现消息分组显示、右键菜单、批量操作，使用现有组件库 | Restrictions: 必须支持各种消息操作，保持视觉一致性，处理复杂交互逻辑 | Success: 消息分组清晰，操作功能完整，交互体验良好_

## 阶段 4: 输入框组件

- [ ] 10. 创建 Inputbar 普通输入框组件
  - File: apps/web-antd/src/views/ai-chat/components/Inputbar.vue
  - 实现普通助手的文本输入功能
  - 添加快捷命令、文件上传、模型提及
  - Purpose: 提供普通助手对话的输入界面
  - _Leverage: @core/ui-kit/input components, file upload_
  - _Requirements: 普通输入_
  - _Prompt: Role: 表单组件专家 | Task: 创建普通输入框组件，实现自动调整高度、快捷命令、文件上传，使用现有输入组件 | Restrictions: 必须支持各种快捷操作，处理文件上传，显示 Token 计数，支持键盘快捷键 | Success: 输入框功能完整，快捷操作便捷，文件处理可靠_

- [ ] 11. 创建 AgentSessionInputbar 智能体输入框
  - File: apps/web-antd/src/views/ai-chat/components/AgentSessionInputbar.vue
  - 实现智能体的专属输入功能
  - 添加流式中断、工作流参数输入
  - Purpose: 提供智能体对话的专属输入界面
  - _Leverage: Inputbar.vue, agent service_
  - _Requirements: 智能体输入_
  - _Prompt: Role: 流式交互专家 | Task: 创建智能体输入框组件，实现流式响应中断、工作流参数输入、会话状态显示 | Restrictions: 必须支持流式中断控制，处理复杂参数输入，显示实时状态信息 | Success: 智能体输入控制精准，参数输入便捷，状态显示准确_

- [ ] 12. 创建 InputbarTools 输入工具栏
  - File: apps/web-antd/src/views/ai-chat/components/InputbarTools.vue
  - 实现输入框的工具栏和快捷操作
  - 添加文件管理、知识库选择、模型提及
  - Purpose: 提供输入辅助功能和快捷操作
  - _Leverage: @core/ui-kit/button components, file manager_
  - _Requirements: 输入工具_
  - _Prompt: Role: 工具栏组件专家 | Task: 创建输入工具栏组件，实现文件管理、知识库选择、模型提及等功能，使用现有工具组件 | Restrictions: 必须提供丰富的快捷操作，保持工具栏整洁，处理各种文件类型 | Success: 工具栏功能丰富，操作便捷，文件处理完善_

## 阶段 5: 消息处理和渲染

- [ ] 13. 创建 Markdown 渲染器
  - File: apps/web-antd/src/components/MarkdownRenderer.vue
  - 实现消息内容的 Markdown 渲染
  - 添加代码高亮、数学公式、图表支持
  - Purpose: 提供丰富的消息内容渲染
  - _Leverage: @core/ui-kit/markdown, highlight.js_
  - _Requirements: 内容渲染_
  - _Prompt: Role: 内容渲染专家 | Task: 创建 Markdown 渲染器，支持代码高亮、数学公式、表格、图片等富文本内容 | Restrictions: 必须支持标准 Markdown 语法，正确渲染代码块，处理数学公式，确保安全性 | Success: Markdown 渲染准确，代码高亮正确，富文本显示完整_

- [ ] 14. 实现流式消息处理
  - File: apps/web-antd/src/composables/useStreamingMessages.ts
  - 处理智能体的流式响应数据
  - 实现平滑的文本更新动画
  - Purpose: 提供流式消息的数据处理和显示
  - _Leverage: dify-client.ts, vue reactivity_
  - _Requirements: 流式处理_
  - _Prompt: Role: 流式数据处理专家 | Task: 创建流式消息处理组合式函数，实现实时数据解析、平滑更新、状态管理 | Restrictions: 必须处理流式数据的断点续传，避免频繁 DOM 更新，保持文本连贯性 | Success: 流式处理流畅，更新动画平滑，用户体验优秀_

- [ ] 15. 创建消息操作菜单
  - File: apps/web-antd/src/views/ai-chat/components/MessageActions.vue
  - 实现消息的右键菜单和操作
  - 添加复制、编辑、删除、重新生成等功能
  - Purpose: 提供消息的交互操作功能
  - _Leverage: @core/ui-kit/context menu, icons_
  - _Requirements: 消息操作_
  - _Prompt: Role: 交互组件专家 | Task: 创建消息操作菜单组件，实现右键菜单、快捷操作、批量操作，使用现有菜单组件 | Restrictions: 必须支持各种消息操作，保持菜单响应速度，处理操作权限 | Success: 消息操作完整，菜单响应迅速，权限控制正确_

## 阶段 6: 性能优化和用户体验

- [ ] 16. 实现虚拟滚动优化
  - File: apps/web-antd/src/composables/useVirtualScroll.ts
  - 优化大量消息的渲染性能
  - 实现平滑滚动和位置记忆
  - Purpose: 提升大量数据场景下的性能
  - _Leverage: vue composables, intersection observer_
  - _Requirements: 性能优化_
  - _Prompt: Role: 性能优化专家 | Task: 创建虚拟滚动组合式函数，实现大量消息的高效渲染，支持平滑滚动和位置记忆 | Restrictions: 必须处理动态高度内容，保持滚动流畅，实现位置精确记忆 | Success: 虚拟滚动性能优秀，滚动体验流畅，位置记忆准确_

- [ ] 17. 实现消息缓存和预加载
  - File: apps/web-antd/src/services/message-cache.ts
  - 实现消息的本地缓存和预加载
  - 添加离线模式支持
  - Purpose: 提升消息加载速度和离线可用性
  - _Leverage: indexedDB, local storage_
  - _Requirements: 缓存优化_
  - _Prompt: Role: 缓存策略专家 | Task: 创建消息缓存服务，实现智能缓存策略、预加载机制、离线模式支持 | Restrictions: 必须处理缓存一致性，实现智能预加载，支持离线操作，管理存储空间 | Success: 缓存策略有效，加载速度提升，离线功能可用_

- [ ] 18. 实现键盘快捷键
  - File: apps/web-antd/src/composables/useKeyboardShortcuts.ts
  - 实现对话界面的键盘快捷操作
  - 添加自定义快捷键配置
  - Purpose: 提升键盘操作用户的效率
  - _Leverage: vue composables, keyboard event_
  - _Requirements: 快捷键_
  - _Prompt: Role: 交互体验专家 | Task: 创建键盘快捷键组合式函数，实现常用操作的快捷键支持，支持自定义配置 | Restrictions: 必须避免冲突，支持快捷键自定义，处理各种输入场景 | Success: 快捷键功能完整，操作效率提升，配置灵活_

## 阶段 7: 集成和测试

- [ ] 19. 集成对话界面与助手管理
  - File: apps/web-antd/src/views/ai-chat/index.ts
  - 实现对话界面与助手管理系统的集成
  - 添加导航和状态同步
  - Purpose: 将对话界面集成到主应用
  - _Leverage: ai-assistants views, router integration_
  - _Requirements: 系统集成_
  - _Prompt: Role: 系统集成专家 | Task: 实现对话界面与助手管理的无缝集成，添加导航链接、状态同步、数据流转 | Restrictions: 必须保持状态一致性，实现平滑切换，处理数据同步，确保用户体验连贯 | Success: 系统集成完整，状态同步准确，用户体验流畅_

- [ ] 20. 创建对话界面测试
  - File: apps/web-antd/src/views/ai-chat/**tests**/
  - 编写组件测试、集成测试、E2E 测试
  - 覆盖主要功能和边界情况
  - Purpose: 确保对话界面的功能可靠性
  - _Leverage: vitest, vue test utils, playwright_
  - _Requirements: 测试覆盖_
  - _Prompt: Role: 测试工程师 | Task: 创建全面的测试套件，包括单元测试、集成测试、E2E 测试，覆盖所有主要功能 | Restrictions: 必须测试各种交互场景，模拟网络异常，覆盖边界情况，确保测试稳定性 | Success: 测试覆盖率高，功能测试完整，边界情况处理正确_

- [ ] 21. 性能监控和优化
  - File: apps/web-antd/src/utils/chat-performance.ts
  - 实现性能监控和分析
  - 添加性能指标收集和优化建议
  - Purpose: 持续监控和优化对话界面性能
  - _Leverage: performance API, analytics_
  - _Requirements: 性能监控_
  - _Prompt: Role: 性能监控专家 | Task: 创建性能监控工具，实现关键指标收集、性能分析、优化建议，确保生产环境性能 | Restrictions: 必须监控关键性能指标，提供有用分析，不影响用户体验，支持持续优化 | Success: 性能监控有效，指标收集准确，优化建议实用_

## 开发优先级建议

### 高优先级 (必须实现)

1. 基础架构搭建 (任务 1-3)
2. 主对话界面组件 (任务 4-6)
3. 基础消息显示 (任务 7)
4. 基础输入功能 (任务 10)

### 中优先级 (重要功能)

1. 智能体消息组件 (任务 8)
2. 智能体输入框 (任务 11)
3. Markdown 渲染 (任务 13)
4. 流式消息处理 (任务 14)

### 低优先级 (增强功能)

1. 虚拟滚动优化 (任务 16)
2. 消息缓存 (任务 17)
3. 键盘快捷键 (任务 18)
4. 性能监控 (任务 21)

## 预期开发时间

- **阶段 1-3**: 2-3 周 (基础功能)
- **阶段 4-5**: 2-3 周 (核心交互)
- **阶段 6-7**: 1-2 周 (优化和测试)

**总计**: 5-8 周完成完整的对话界面实现

## 技术难点和解决方案

### 1. 流式消息处理

**难点**: 实时处理大量流式数据而不影响界面性能 **解决方案**: 使用 requestAnimationFrame 批量更新，节流 DOM 操作

### 2. 消息分组和虚拟滚动

**难点**: 动态高度的消息分组渲染 **解决方案**: 预计算消息高度，使用 Intersection Observer 优化

### 3. 智能体状态同步

**难点**: 多个组件间的状态同步和一致性 **解决方案**: 使用 Pinia 的统一状态管理，实现响应式数据流

### 4. 文件上传和处理

**难点**: 支持各种文件类型的上传和预览 **解决方案**: 使用 File API，实现类型检测和安全检查

这个任务清单为 FactoryOS 对话界面的实现提供了详细的指导，确保开发过程的有序进行和功能完整性。
