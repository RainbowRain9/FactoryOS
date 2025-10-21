# Tasks Document

## 阶段 1: 基础架构和类型定义

- [ ] 1. 创建助手和智能体类型定义
  - File: packages/types/src/ai-assistants.ts
  - 定义 Assistant, Agent, Group 等核心接口
  - 扩展现有的基础类型定义
  - Purpose: 建立类型安全的数据结构基础
  - _Leverage: packages/types/src/base.ts_
  - _Requirements: 1.1, 2.1_
  - _Prompt: Role: TypeScript 类型系统专家 | Task: 创建助手和智能体的完整类型定义，包括Assistant、Agent、Group等接口，继承现有base.ts中的基础类型 | Restrictions: 不修改现有基础类型，保持向后兼容性，遵循项目命名规范 | Success: 所有接口编译通过，正确的类型继承，覆盖所有功能需求的类型定义_

- [ ] 2. 创建 Pinia store 状态管理
  - File: packages/stores/src/ai-assistants.ts
  - 实现助手和智能体的状态管理
  - 添加 CRUD 操作和状态更新逻辑
  - Purpose: 提供响应式的数据状态管理
  - _Leverage: packages/stores/src/common.ts_
  - _Requirements: 1.1, 2.1, 3.1_
  - _Prompt: Role: Vue 状态管理专家 | Task: 使用 Pinia 创建助手和智能体的状态管理，包括列表、CRUD操作、拖拽状态等，复用现有store模式 | Restrictions: 必须使用 Pinia composition API，保持状态一致性，处理异步操作 | Success: Store 正确管理所有状态，支持响应式更新，操作方法完整可靠_

- [ ] 3. 创建服务层基础架构
  - File: apps/web-antd/src/services/ai-assistants/
  - 实现 AssistantService 和 AgentService
  - 添加 API 调用和错误处理逻辑
  - Purpose: 提供业务逻辑层和数据访问抽象
  - _Leverage: packages/utils/src/request.ts, packages/utils/src/error-handler.ts_
  - _Requirements: 2.1, 2.2_
  - _Prompt: Role: 前端服务架构师 | Task: 创建助手和智能体服务层，实现API调用、数据转换、错误处理等功能，使用现有的request工具 | Restrictions: 必须处理所有API错误场景，实现重试机制，保持接口一致性 | Success: 服务层完整可靠，错误处理完善，支持所有业务操作_

## 阶段 2: 核心组件开发

- [ ] 4. 创建主视图组件 AssistantsView.vue
  - File: apps/web-antd/src/views/ai-assistants/AssistantsView.vue
  - 实现页面布局和组件协调
  - 集成搜索、筛选、视图切换功能
  - Purpose: 提供助手管理的主界面容器
  - _Leverage: @core/ui-kit layout components, packages/effects/layouts_
  - _Requirements: 1.1, 3.1, 4.1_
  - _Prompt: Role: Vue 3 组件架构师 | Task: 创建主视图组件，集成所有子组件，实现搜索、筛选、视图切换等功能，使用现有布局组件 | Restrictions: 必须使用 Vue 3 Composition API，保持组件职责单一，确保响应式性能 | Success: 主视图完整可用，所有子组件正确集成，交互流畅_

- [ ] 5. 创建助手卡片组件 AssistantCard.vue
  - File: apps/web-antd/src/views/ai-assistants/components/AssistantCard.vue
  - 实现卡片展示、状态指示、右键菜单
  - 添加拖拽支持和动画效果
  - Purpose: 提供单个助手/智能体的可视化展示
  - _Leverage: @core/ui-kit/Card.vue, packages/icons_
  - _Requirements: 1.2, 3.1, 3.2_
  - _Prompt: Role: Vue 组件开发专家 | Task: 创建助手卡片组件，支持拖拽、右键菜单、状态显示，复用现有UI组件和图标 | Restrictions: 必须支持拖拽操作，保持视觉一致性，处理各种状态显示 | Success: 卡片组件功能完整，拖拽流畅，视觉效果符合设计要求_

- [ ] 6. 创建拖拽功能组合式函数
  - File: apps/web-antd/src/composables/useDragAndDrop.ts
  - 实现拖拽排序和分组逻辑
  - 添加拖拽动画和视觉反馈
  - Purpose: 提供可复用的拖拽交互功能
  - _Leverage: packages/utils/src/dom.ts_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Role: 前端交互专家 | Task: 创建拖拽功能的组合式函数，支持排序、分组、动画反馈，确保性能和用户体验 | Restrictions: 必须处理拖拽边界情况，提供平滑动画，保持数据一致性 | Success: 拖拽功能流畅可靠，支持所有交互场景，性能优秀_

## 阶段 3: 视图和列表组件

- [ ] 7. 创建列表视图组件 UnifiedList.vue
  - File: apps/web-antd/src/views/ai-assistants/components/UnifiedList.vue
  - 实现虚拟滚动和列表布局
  - 添加排序和筛选功能
  - Purpose: 提供高效的列表展示方式
  - _Leverage: @core/ui-kit/List.vue, @core/ui-kit/VirtualScroll_
  - _Requirements: 3.1, 4.1_
  - _Prompt: Role: 性能优化专家 | Task: 创建支持虚拟滚动的列表组件，处理大量数据的性能优化，集成搜索筛选功能 | Restrictions: 必须实现虚拟滚动，保持滚动性能，支持动态高度 | Success: 列表组件性能优秀，支持大量数据，搜索筛选响应迅速_

- [ ] 8. 创建分组视图组件 UnifiedTagGroups.vue
  - File: apps/web-antd/src/views/ai-assistants/components/UnifiedTagGroups.vue
  - 实现分组展示和折叠功能
  - 添加分组间拖拽支持
  - Purpose: 提供组织化的分组展示方式
  - _Leverage: @core/ui-kit/Collapse.vue, AssistantCard.vue_
  - _Requirements: 3.2, 3.3_
  - _Prompt: Role: Vue 组件开发专家 | Task: 创建分组视图组件，支持分组展示、折叠展开、分组间拖拽，保持良好的用户体验 | Restrictions: 必须支持分组操作，处理嵌套拖拽逻辑，保持状态同步 | Success: 分组功能完整，操作直观，状态管理正确_

- [ ] 9. 创建搜索筛选组合式函数
  - File: apps/web-antd/src/composables/useSearchFilter.ts
  - 实现实时搜索和多维度筛选
  - 添加搜索历史和热门标签
  - Purpose: 提供强大的搜索和筛选能力
  - _Leverage: packages/utils/src/string.ts_
  - _Requirements: 4.1, 4.2_
  - _Prompt: Role: 搜索算法专家 | Task: 创建搜索筛选功能，支持关键词搜索、标签筛选、类型筛选，优化搜索性能和用户体验 | Restrictions: 必须实现实时搜索，支持模糊匹配，处理大数据量搜索 | Success: 搜索功能强大准确，响应迅速，支持多种筛选条件_

## 阶段 4: 创建和配置功能

- [ ] 10. 创建助手创建弹窗 CreateAssistantModal.vue
  - File: apps/web-antd/src/views/ai-assistants/components/CreateAssistantModal.vue
  - 实现助手配置表单和验证
  - 添加预设模板和快速创建
  - Purpose: 提供助手创建和配置界面
  - _Leverage: @core/ui-kit/Modal.vue, @core/ui-kit/Form.vue_
  - _Requirements: 1.1, 1.3_
  - _Prompt: Role: 表单组件专家 | Task: 创建助手配置弹窗，实现表单验证、预设模板、配置选项，确保用户体验友好 | Restrictions: 必须验证所有输入，提供清晰的配置选项，支持模板选择 | Success: 弹窗功能完整，表单验证可靠，用户体验流畅_

- [ ] 11. 创建智能体创建弹窗 CreateAgentModal.vue
  - File: apps/web-antd/src/views/ai-assistants/components/CreateAgentModal.vue
  - 实现 Dify API 配置和连接测试
  - 添加工作流选择和参数配置
  - Purpose: 提供智能体创建和 Dify 集成界面
  - _Leverage: CreateAssistantModal.vue, AgentService_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Role: API 集成专家 | Task: 创建智能体配置弹窗，实现 Dify API 配置、连接测试、工作流选择，处理 API 集成细节 | Restrictions: 必须验证 API 连接，安全存储密钥，处理连接失败场景 | Success: 智能体配置功能完整，API 集成可靠，错误处理完善_

- [ ] 12. 创建统一添加按钮 UnifiedAddButton.vue
  - File: apps/web-antd/src/views/ai-assistants/components/UnifiedAddButton.vue
  - 实现添加按钮和下拉菜单
  - 添加快捷操作和最近使用
  - Purpose: 提供统一的添加入口
  - _Leverage: @core/ui-kit/Button.vue, @core/ui-kit/Dropdown.vue_
  - _Requirements: 1.1, 2.1_
  - _Prompt: Role: UI 交互设计师 | Task: 创建统一添加按钮，支持下拉菜单、快捷操作、智能推荐，提升用户操作效率 | Restrictions: 必须提供清晰的选项，支持键盘导航，保持视觉一致性 | Success: 添加按钮功能完善，操作便捷，用户体验优秀_

## 阶段 5: Dify 集成和智能体功能

- [ ] 13. 实现 Dify API 客户端
  - File: apps/web-antd/src/services/dify-client.ts
  - 实现 Dify 工作流 API 调用
  - 添加流式响应和错误处理
  - Purpose: 提供 Dify 工作流的接口集成
  - _Leverage: packages/utils/src/request.ts_
  - _Requirements: 2.2, 2.3_
  - _Prompt: Role: API 集成工程师 | Task: 创建 Dify API 客户端，实现工作流调用、流式响应处理、错误重试机制，确保集成稳定性 | Restrictions: 必须处理流式响应，实现超时控制，支持重试机制 | Success: Dify 集成稳定可靠，支持所有工作流功能，错误处理完善_

- [ ] 14. 创建智能体健康检查
  - File: apps/web-antd/src/services/agent-health-check.ts
  - 实现定期健康检查和状态更新
  - 添加自动重连和状态同步
  - Purpose: 监控智能体连接状态和可用性
  - _Leverage: AgentService, dify-client.ts_
  - _Requirements: 2.4_
  - _Prompt: Role: 系统监控专家 | Task: 创建智能体健康检查服务，实现定期检查、状态同步、自动重连，确保智能体可用性 | Restrictions: 必须避免频繁检查，智能调度检查时机，处理网络异常 | Success: 健康检查可靠，状态同步及时，自动恢复功能正常_

- [ ] 15. 实现智能体对话功能
  - File: apps/web-antd/src/views/ai-assistants/components/AgentChat.vue
  - 实现与智能体的对话界面
  - 添加流式响应显示和消息管理
  - Purpose: 提供智能体对话的用户界面
  - _Leverage: dify-client.ts, @core/ui-kit/Chat.vue_
  - _Requirements: 2.3_
  - _Prompt: Role: 聊天界面开发专家 | Task: 创建智能体对话组件，支持流式消息显示、历史记录、消息管理，提供良好的对话体验 | Restrictions: 必须处理流式数据，保持消息同步，支持长对话 | Success: 对话功能完整，消息显示流畅，用户体验优秀_

## 阶段 6: 优化和测试

- [ ] 16. 添加本地存储和缓存
  - File: apps/web-antd/src/services/ai-assistants-cache.ts
  - 实现本地数据缓存和同步
  - 添加离线支持和数据恢复
  - Purpose: 提升性能和离线可用性
  - _Leverage: packages/utils/src/storage.ts_
  - _Requirements: 性能需求_
  - _Prompt: Role: 缓存策略专家 | Task: 创建本地缓存服务，实现数据缓存、离线支持、增量同步，优化应用性能 | Restrictions: 必须处理数据一致性，实现智能缓存策略，支持离线操作 | Success: 缓存机制有效，性能提升明显，离线功能可用_

- [ ] 17. 创建单元测试
  - File: apps/web-antd/src/views/ai-assistants/**tests**/
  - 测试所有组件和功能模块
  - 添加快照测试和覆盖率检查
  - Purpose: 确保代码质量和功能可靠性
  - _Leverage: Vitest, Vue Test Utils_
  - _Requirements: 所有功能需求_
  - _Prompt: Role: 测试工程师 | Task: 创建全面的单元测试，包括组件测试、工具函数测试、Store 测试，确保代码覆盖率 | Restrictions: 必须测试所有关键路径，模拟各种边界情况，保持测试稳定性 | Success: 测试覆盖率高，所有测试通过，能有效捕获回归问题_

- [ ] 18. 创建集成测试和 E2E 测试
  - File: playground/**tests**/e2e/ai-assistants.spec.ts
  - 测试完整的用户操作流程
  - 添加性能测试和兼容性测试
  - Purpose: 验证系统整体功能和用户体验
  - _Leverage: Playwright, 测试工具链_
  - _Requirements: 所有需求_
  - _Prompt: Role: E2E 测试专家 | Task: 创建端到端测试，覆盖用户核心操作流程，包括创建、管理、使用助手和智能体 | Restrictions: 必须模拟真实用户操作，覆盖主要使用场景，确保测试稳定性 | Success: E2E 测试完整覆盖主要流程，能有效发现集成问题_

## 阶段 7: 部署和文档

- [ ] 19. 配置路由和权限
  - File: apps/web-antd/src/router/routes/ai-assistants.ts
  - 添加路由配置和权限控制
  - 集成到现有导航系统
  - Purpose: 将功能集成到应用主框架
  - _Leverage: effects/access, packages/effects/router_
  - _Requirements: 权限需求_
  - _Prompt: Role: 路由和权限专家 | Task: 配置助手管理功能的路由和权限，集成到现有导航和权限系统，确保访问控制正确 | Restrictions: 必须遵循现有权限模式，正确配置路由守卫，保持导航一致性 | Success: 路由配置正确，权限控制有效，无缝集成到现有系统_

- [ ] 20. 创建用户文档和帮助
  - File: docs/src/guide/features/ai-assistants.md
  - 编写用户使用指南和功能说明
  - 添加常见问题和故障排除
  - Purpose: 帮助用户理解和使用功能
  - _Leverage: 现有文档模板和结构_
  - _Requirements: 可用性需求_
  - _Prompt: Role: 技术文档写手 | Task: 创建用户友好的使用文档，包括功能介绍、操作指南、常见问题，帮助用户快速上手 | Restrictions: 必须语言通俗易懂，步骤清晰明了，覆盖主要使用场景 | Success: 文档完整易懂，用户能根据文档独立使用功能_

- [ ] 21. 性能优化和最终调试
  - File: 多个文件优化
  - 进行性能分析和代码优化
  - 修复发现的问题和提升用户体验
  - Purpose: 确保功能达到生产就绪状态
  - _Leverage: 性能分析工具，调试工具_
  - _Requirements: 性能和可靠性需求_
  - _Prompt: Role: 性能优化工程师 | Task: 进行全面的性能分析和优化，包括渲染性能、内存使用、网络请求等，确保生产环境表现 | Restrictions: 必须保持功能完整性，优化不影响用户体验，遵循最佳实践 | Success: 性能指标达标，功能稳定可靠，用户体验流畅，达到生产标准_
