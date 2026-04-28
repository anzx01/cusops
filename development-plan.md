# AI接待员开发计划

## 1. 开发目标

在 6 周内交付一个可内测的 AI 接待员 MVP，完成“客户咨询 -> AI 收集信息 -> 判断服务范围 -> 预约 -> 写入日历 -> 转人工/后台管理 -> 数据展示”的闭环。

首个版本不追求平台化完整度，优先验证：

- 商家能否快速上线
- AI 能否稳定接待和筛选
- 预约闭环是否真实可用
- 商家是否能从数据中看到价值

## 2. 技术假设

如果后续没有既有技术栈，建议采用以下默认方案：

- 前端：Next.js + TypeScript + Tailwind CSS
- 后端：Next.js API Routes 或 NestJS
- 数据库：PostgreSQL
- ORM：Prisma
- 队列：BullMQ + Redis
- AI：OpenAI Responses API 或同类可工具调用模型
- 向量检索：PostgreSQL pgvector 或托管向量库
- 认证：Clerk/Auth.js/Supabase Auth 三选一
- 日历：Google Calendar 优先，Outlook 后置
- 消息渠道：Web Chat 优先，SMS/WhatsApp/微信按市场选择
- 部署：Vercel/Render/Fly.io + 托管 PostgreSQL

如果项目已有技术栈，应优先沿用现有架构。

## 3. 里程碑

### 第 0 周：需求冻结与技术准备

目标：

- 冻结 MVP 行业和渠道
- 明确业务字段和预约规则
- 确认技术栈
- 搭建项目骨架

交付物：

- 数据模型草案
- API 草案
- 页面信息架构
- AI 安全策略草案
- 开发环境和部署环境

验收：

- 团队能在本地启动项目
- 数据库迁移可运行
- 基础登录和租户结构明确

### 第 1 周：商家后台基础与业务资料

目标：

- 完成商家后台主框架
- 完成行业模板初始化
- 完成业务资料配置

功能：

- 注册/登录
- 商家创建
- 行业模板选择
- 服务项目管理
- 服务区域管理
- 营业时间管理
- FAQ 管理
- 不可承诺事项管理
- 人工联系人配置

关键表：

- users
- merchants
- merchant_members
- services
- service_areas
- business_profiles
- faqs
- handoff_contacts

验收：

- 新商家可通过模板生成初始资料
- 管理员可编辑服务、区域、营业时间和 FAQ
- 所有资料按商家隔离

### 第 2 周：Web Chat 与对话系统

目标：

- 完成可嵌入 Web Chat
- 完成统一对话存储
- 完成后台 Inbox 基础能力

功能：

- Web Chat 嵌入脚本
- 客户会话创建
- 消息收发
- Inbox 列表
- 对话详情
- 客户信息侧栏
- 标签和状态
- 人工接管开关

关键表：

- channels
- conversations
- messages
- leads
- conversation_tags
- handoff_events

验收：

- 外部页面可嵌入聊天组件
- 客户消息能实时或准实时进入后台
- 人工可接管和恢复 AI
- 每条消息记录渠道和商家归属

### 第 3 周：AI 接待与安全规则

目标：

- 完成 AI 自动回复
- 完成资料检索和字段收集
- 完成转人工规则

功能：

- AI 接待员配置
- 基于业务资料的回答
- 必填字段收集
- 服务范围判断
- 意图识别
- 高风险词检测
- 禁答主题
- 低置信度转人工
- 对话摘要
- 未回答问题记录

关键表：

- ai_agents
- ai_runs
- ai_citations
- missing_knowledge_items
- safety_rules
- lead_fields

AI 工具：

- search_business_profile
- check_service_area
- update_lead
- request_handoff
- summarize_conversation

验收：

- AI 可基于资料回答常见问题
- AI 能在缺字段时继续追问
- AI 能识别不服务区域并给出合理回复
- 高风险词和禁答主题必须转人工
- 所有 AI 回复保留运行记录

### 第 4 周：预约闭环与日历集成

目标：

- 完成可用预约流程
- 打通 Google Calendar
- 完成冲突检测和确认消息

功能：

- 日历授权
- 可预约时间计算
- 预约创建
- 预约改期
- 预约取消
- 日历写入和同步
- 预约确认消息
- 预约状态管理

关键表：

- calendar_connections
- availability_rules
- bookings
- booking_events
- notification_logs

AI 工具：

- get_available_slots
- create_booking
- reschedule_booking
- cancel_booking

验收：

- AI 在收齐字段后可给出可预约时间
- 客户确认后创建预约
- 预约写入 Google Calendar
- 冲突时不能重复预约
- 后台可查看和修改预约

### 第 5 周：工作台、数据分析与 ROI

目标：

- 完成价值展示
- 完成关键指标统计
- 完成内测可用的管理面板

功能：

- 工作台
- 咨询数
- 有效线索数
- 预约数
- 转化率
- AI 自动处理率
- 转人工率
- 平均首次响应时间
- 未回答问题数
- 预计新增收入
- 节省人工时间
- 时间范围筛选

关键表：

- analytics_events
- daily_metrics
- roi_settings

验收：

- 指标来自真实事件
- 支持今日、7 天、30 天
- ROI 参数可配置
- 商家能看到本月预约和预计收入

### 第 6 周：测试、打磨与内测上线

目标：

- 完成端到端测试
- 修复关键问题
- 准备内测商家

功能：

- 上线向导
- AI 模拟测试
- 错误反馈
- 空状态和异常状态
- 基础审计日志
- 管理员内测工具

验收：

- 10 条模拟测试通过后才能上线
- 完整客户链路可跑通
- 高风险场景转人工测试通过
- 日历断连、AI 失败、渠道异常有可理解提示
- 至少 3 个内测商家可上线试用

## 4. 功能拆分

### 4.1 前端页面

- 登录/注册
- 上线向导
- 工作台
- 业务资料
- 服务项目
- 服务区域
- AI 接待员设置
- 对话 Inbox
- 对话详情
- 预约管理
- 渠道设置
- 日历连接
- 数据分析
- 安全规则
- 设置

### 4.2 后端模块

- Auth and tenancy
- Merchant profile
- Business profile
- Service catalog
- Channel gateway
- Conversation service
- AI orchestration
- Safety guardrails
- Lead qualification
- Booking service
- Calendar integration
- Analytics event pipeline
- Notification service
- Audit log

### 4.3 AI 编排模块

输入：

- 商家资料
- 当前对话
- 已收集线索字段
- 渠道信息
- 安全规则

输出：

- 回复内容
- 下一步动作
- 字段更新
- 是否转人工
- 转人工原因
- 使用的资料来源

动作类型：

- reply
- ask_field
- update_lead
- check_area
- suggest_slots
- create_booking
- handoff
- close_conversation

## 5. 数据模型初稿

### merchants

- id
- name
- industry
- timezone
- locale
- phone
- email
- created_at

### services

- id
- merchant_id
- name
- description
- duration_minutes
- price_note
- active

### business_profiles

- id
- merchant_id
- company_intro
- business_hours
- booking_rules
- price_rules
- forbidden_promises
- updated_at

### conversations

- id
- merchant_id
- channel_id
- lead_id
- status
- ai_enabled
- handoff_required
- handoff_reason
- last_message_at
- created_at

### messages

- id
- conversation_id
- sender_type
- content
- metadata
- created_at

### leads

- id
- merchant_id
- name
- phone
- email
- address
- postal_code
- service_need
- preferred_time
- qualification_status
- status
- created_at

### bookings

- id
- merchant_id
- lead_id
- service_id
- starts_at
- ends_at
- address
- status
- calendar_event_id
- created_at

### ai_runs

- id
- conversation_id
- model
- input_snapshot
- output_snapshot
- action
- confidence
- safety_result
- created_at

### analytics_events

- id
- merchant_id
- event_type
- entity_type
- entity_id
- properties
- created_at

## 6. API 初稿

### 商家与资料

- POST /api/merchants
- GET /api/merchant
- PATCH /api/merchant
- GET /api/business-profile
- PATCH /api/business-profile
- GET /api/services
- POST /api/services
- PATCH /api/services/:id
- DELETE /api/services/:id

### 对话

- POST /api/chat/sessions
- POST /api/chat/messages
- GET /api/conversations
- GET /api/conversations/:id
- POST /api/conversations/:id/handoff
- POST /api/conversations/:id/resume-ai
- POST /api/conversations/:id/summarize

### 预约

- GET /api/availability
- POST /api/bookings
- GET /api/bookings
- PATCH /api/bookings/:id
- POST /api/bookings/:id/cancel

### 日历

- GET /api/calendar/connect
- GET /api/calendar/callback
- DELETE /api/calendar/disconnect

### 数据

- GET /api/analytics/overview
- GET /api/analytics/conversations
- GET /api/analytics/bookings

## 7. 测试计划

### 单元测试

- 服务范围判断
- 可预约时间计算
- 预约冲突检测
- 高风险词匹配
- 禁答主题判断
- ROI 指标计算

### 集成测试

- Web Chat 发消息到 Inbox
- AI 回复并更新线索字段
- AI 触发转人工
- AI 创建预约并写入日历
- 改约和取消同步日历

### 端到端测试

- 新商家上线流程
- 客户咨询到预约流程
- 客户要求人工流程
- 不服务区域流程
- AI 答不上来并生成待补充资料流程

## 8. 发布计划

### Alpha

对象：内部测试

要求：

- 主要链路跑通
- AI 可接待
- 预约可创建
- 后台可查看数据

### Beta

对象：3-5 个真实商家

要求：

- 商家可独立上线
- 真实客户可咨询
- 人工可接管
- 数据可用于复盘

### Public MVP

对象：明确行业的付费试用客户

要求：

- 渠道稳定
- AI 安全策略稳定
- 日历集成稳定
- 能证明预约和线索价值

## 9. 优先级

### P0

- 多租户基础
- 行业模板初始化
- 业务资料
- Web Chat
- Inbox
- AI 接待
- 安全转人工
- 线索字段收集
- 日历预约
- 工作台核心指标

### P1

- 第二渠道
- 未回答问题回流
- 对话摘要
- ROI 配置
- 预约改期/取消
- 模拟测试

### P2

- 自动跟进
- 预约提醒
- 服务后索评
- 第二行业模板
- 更完整分析

## 10. 关键技术风险

### AI 不稳定

处理：

- 工具调用约束
- 输出结构化
- 高风险转人工
- 置信度和禁答规则
- 上线前模拟测试

### 日历冲突

处理：

- 服务端统一创建预约
- 创建前实时检查
- 日历事件 ID 持久化
- 改约和取消使用幂等事件

### 多租户数据泄露

处理：

- 所有查询必须带 merchant_id
- 关键接口做权限校验
- 数据库层面预留 RLS 或强约束策略

### 指标不可信

处理：

- 统一 analytics_events
- 业务动作写事件
- 面板只读聚合结果
- 指标口径写入文档

## 11. 内测运营计划

### 招募标准

- 有稳定线上咨询
- 每周至少 20 条客户咨询
- 愿意安装 Web Chat 或接入一个渠道
- 愿意提供真实 FAQ 和服务规则

### 内测反馈节奏

- 第 1 天：上线和配置问题
- 第 3 天：AI 回复质量和转人工问题
- 第 7 天：预约转化和价值感
- 第 14 天：是否愿意付费

### 重点访谈问题

- 哪些客户问题 AI 处理得好
- 哪些问题必须人工处理
- 哪些字段最影响预约
- 数据面板是否能证明价值
- 愿意为什么能力付费

## 12. 交付定义

MVP 完成的标准不是功能列表全部上线，而是以下闭环真实可用：

1. 商家能在 15 分钟内完成基础上线
2. 客户能通过渠道发起咨询
3. AI 能回答和追问关键信息
4. AI 能识别风险并转人工
5. AI 能完成预约并写入日历
6. 商家能在后台查看对话、线索、预约和数据
7. 商家能看懂 AI 带来的预约和节省时间
