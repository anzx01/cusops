# AI接待员实施 Backlog

本文档把 `prd.md` 和 `development-plan.md` 拆成可直接录入 GitHub Issues 或 Linear 的任务。建议先按 P0 完成 MVP 闭环，再进入 P1 扩展。

## 1. 使用方式

每个任务都包含：

- Title：Issue 标题
- Priority：P0/P1/P2
- Milestone：建议里程碑
- Labels：建议标签
- Depends on：依赖任务
- Scope：实现范围
- Acceptance Criteria：验收标准

建议命名规范：

- Epic：较大的功能域
- Feature：可交付功能
- Chore：工程基础设施
- Test：测试与质量
- Spike：技术调研

## 2. 标签体系

优先级：

- `priority:P0`：MVP 必须完成
- `priority:P1`：MVP 强相关，允许 Beta 前后补齐
- `priority:P2`：后续增强

功能域：

- `area:foundation`
- `area:onboarding`
- `area:business-profile`
- `area:channel`
- `area:inbox`
- `area:ai`
- `area:safety`
- `area:booking`
- `area:calendar`
- `area:analytics`
- `area:qa`
- `area:ops`

任务类型：

- `type:epic`
- `type:feature`
- `type:chore`
- `type:test`
- `type:spike`

风险标记：

- `risk:ai-quality`
- `risk:data-isolation`
- `risk:calendar-sync`
- `risk:channel-delivery`

## 3. 里程碑

- M0 Foundation：项目骨架、认证、多租户、数据库、部署环境
- M1 Merchant Setup：商家上线向导、行业模板、业务资料
- M2 Conversations：Web Chat、消息、Inbox、人工接管
- M3 AI Receptionist：AI 编排、资料检索、线索收集、安全转人工
- M4 Booking：可预约时间、日历、预约创建/改约/取消
- M5 Analytics：工作台、指标、ROI
- M6 Beta Readiness：测试、错误状态、安全检查、内测准备

## 4. Epic 列表

### CUS-E01 Foundation and Tenancy

- Priority：P0
- Milestone：M0 Foundation
- Labels：`type:epic`, `area:foundation`, `priority:P0`
- Goal：完成可开发、可部署、支持多商户隔离的基础架构。

### CUS-E02 Merchant Onboarding and Business Profile

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:epic`, `area:onboarding`, `area:business-profile`, `priority:P0`
- Goal：让商家通过行业模板和表单在 15 分钟内完成基础上线配置。

### CUS-E03 Web Chat and Inbox

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:epic`, `area:channel`, `area:inbox`, `priority:P0`
- Goal：客户可通过 Web Chat 咨询，商家可在后台查看并人工接管。

### CUS-E04 AI Receptionist and Safety

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:epic`, `area:ai`, `area:safety`, `priority:P0`, `risk:ai-quality`
- Goal：AI 能基于业务资料接待、收集字段、判断范围，并在风险场景转人工。

### CUS-E05 Booking and Calendar

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:epic`, `area:booking`, `area:calendar`, `priority:P0`, `risk:calendar-sync`
- Goal：AI 能在收齐信息后创建预约，并写入 Google Calendar。

### CUS-E06 Dashboard and Analytics

- Priority：P0
- Milestone：M5 Analytics
- Labels：`type:epic`, `area:analytics`, `priority:P0`
- Goal：让商家看到咨询、线索、预约和 ROI。

### CUS-E07 Beta Readiness

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:epic`, `area:qa`, `area:ops`, `priority:P0`
- Goal：完成内测上线前的端到端验证、异常状态和运营准备。

## 5. P0 Issues

### CUS-001 Create application skeleton and local dev environment

- Priority：P0
- Milestone：M0 Foundation
- Labels：`type:chore`, `area:foundation`, `priority:P0`
- Depends on：None

Scope：

- 初始化前后端项目结构
- 配置 TypeScript、lint、format、env 示例文件
- 配置本地数据库连接
- 提供本地启动命令

Acceptance Criteria：

- 新开发者可根据 README 在本地启动项目
- 本地服务、数据库迁移、基础健康检查可运行
- 环境变量有示例和说明

### CUS-002 Implement authentication and merchant tenancy

- Priority：P0
- Milestone：M0 Foundation
- Labels：`type:feature`, `area:foundation`, `priority:P0`, `risk:data-isolation`
- Depends on：CUS-001

Scope：

- 用户注册、登录、退出
- 商家空间创建
- 用户和商家成员关系
- 所有后端请求具备 merchant scope

Acceptance Criteria：

- 登录用户只能访问所属商家的数据
- 未登录用户无法进入后台
- API 查询必须校验 merchant_id
- 至少有管理员角色

### CUS-003 Define initial database schema and migrations

- Priority：P0
- Milestone：M0 Foundation
- Labels：`type:chore`, `area:foundation`, `priority:P0`
- Depends on：CUS-001

Scope：

- 建立核心数据表：users、merchants、merchant_members、services、business_profiles、conversations、messages、leads、bookings、ai_runs、analytics_events
- 建立必要索引和外键
- 提供 seed 数据入口

Acceptance Criteria：

- 迁移可重复执行
- 核心表具备 merchant_id 或明确归属链路
- 常用查询字段有索引

### CUS-004 Build admin shell navigation and layout

- Priority：P0
- Milestone：M0 Foundation
- Labels：`type:feature`, `area:foundation`, `priority:P0`
- Depends on：CUS-002

Scope：

- 后台主布局
- 左侧导航
- 顶部商家信息
- 加载、空状态和错误状态基础组件

Acceptance Criteria：

- 登录后进入后台
- 导航包含工作台、对话、预约、业务资料、AI 设置、渠道、数据、设置
- 移动端可基本访问，桌面端体验优先

### CUS-010 Seed first industry template

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:onboarding`, `priority:P0`
- Depends on：CUS-003

Scope：

- 创建首个行业模板，建议家政/清洁服务
- 模板包含服务项目、FAQ、服务区域字段、预约规则、禁答主题、转人工规则、默认语气
- 提供模板应用逻辑

Acceptance Criteria：

- 新商家可一键应用模板
- 应用模板后生成可编辑的初始配置
- 模板不要求用户理解 Prompt 或 Workflow

### CUS-011 Build onboarding wizard

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:onboarding`, `priority:P0`
- Depends on：CUS-010

Scope：

- 步骤：选择行业、商家信息、服务项目、服务区域、营业时间、业务资料、日历连接提示、人工联系人
- 保存进度
- 显示上线完成度

Acceptance Criteria：

- 商家可按步骤完成基础配置
- 未完成关键步骤时提示缺失项
- 15 分钟内可完成最小上线配置

### CUS-012 Implement merchant profile settings

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:business-profile`, `priority:P0`
- Depends on：CUS-003

Scope：

- 商家名称
- 联系电话
- 联系邮箱
- 默认语言
- 时区
- 营业时间

Acceptance Criteria：

- 管理员可编辑并保存商家基础信息
- 时区用于预约时间展示和日历写入
- 营业时间可被可预约时间计算使用

### CUS-013 Implement service catalog CRUD

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:business-profile`, `priority:P0`
- Depends on：CUS-003

Scope：

- 服务项目列表
- 新增、编辑、停用服务
- 字段：名称、说明、时长、价格说明、是否允许 AI 预约

Acceptance Criteria：

- 服务项目可被 AI 检索
- 停用服务不参与客户推荐和预约
- 每项服务归属当前商家

### CUS-014 Implement service area rules

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:business-profile`, `priority:P0`
- Depends on：CUS-003

Scope：

- 配置服务城市、区域、邮编或文本规则
- 提供服务范围判断接口

Acceptance Criteria：

- AI 可调用接口判断客户地址/邮编是否在服务范围
- 不在服务范围时返回明确原因
- 规则可由管理员编辑

### CUS-015 Implement business profile and FAQ management

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:business-profile`, `priority:P0`
- Depends on：CUS-003

Scope：

- 公司介绍
- 价格规则
- 预约规则
- 不可承诺事项
- FAQ 新增、编辑、删除、启用、停用

Acceptance Criteria：

- 业务资料可被 AI 使用
- 停用资料不进入 AI 上下文
- 修改资料后可立即影响后续回复

### CUS-016 Configure handoff contacts and notification target

- Priority：P0
- Milestone：M1 Merchant Setup
- Labels：`type:feature`, `area:business-profile`, `priority:P0`
- Depends on：CUS-002

Scope：

- 配置人工接管联系人
- 配置通知方式占位，MVP 可先使用后台通知和邮件
- 定义默认负责人

Acceptance Criteria：

- 转人工事件能关联联系人
- Inbox 中能看到应由谁处理
- 没有联系人时系统提示无法上线

### CUS-020 Build embeddable Web Chat widget

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:channel`, `priority:P0`
- Depends on：CUS-002, CUS-004

Scope：

- Web Chat 前端组件
- 可嵌入脚本
- 欢迎语
- 品牌色
- 客户消息输入和展示

Acceptance Criteria：

- 外部 HTML 页面可通过脚本嵌入聊天窗口
- 消息能发送到当前商家
- Widget 不暴露后台权限信息

### CUS-021 Implement chat session and message APIs

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:channel`, `priority:P0`
- Depends on：CUS-020

Scope：

- 创建匿名客户会话
- 发送客户消息
- 保存 AI、客户、人工消息
- 返回消息历史

Acceptance Criteria：

- 所有消息持久化
- 会话和商家正确绑定
- API 对外部 widget 有基础防滥用限制

### CUS-022 Build Inbox conversation list and detail view

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:inbox`, `priority:P0`
- Depends on：CUS-021

Scope：

- 对话列表
- 对话详情
- 消息时间线
- 渠道来源
- 对话状态
- 未处理筛选

Acceptance Criteria：

- 后台可查看所有当前商家的对话
- 新消息能更新列表状态
- 可按状态查看未处理、已转人工、已预约等对话

### CUS-023 Implement manual handoff and resume AI

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:inbox`, `priority:P0`
- Depends on：CUS-022

Scope：

- 人工接管
- 恢复 AI
- 接管状态展示
- 接管事件记录

Acceptance Criteria：

- 人工接管后 AI 不再自动回复
- 恢复 AI 后后续客户消息可由 AI 处理
- 所有接管和恢复动作记录操作者和时间

### CUS-024 Build lead side panel in conversation detail

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:inbox`, `priority:P0`
- Depends on：CUS-022

Scope：

- 显示姓名、电话、邮箱、地址、服务需求、期望时间、线索状态
- 支持人工编辑线索字段

Acceptance Criteria：

- 对话详情中能看到线索完整度
- 人工编辑字段后 AI 后续上下文可使用
- 字段变更有更新时间

### CUS-025 Implement conversation tags and status

- Priority：P0
- Milestone：M2 Conversations
- Labels：`type:feature`, `area:inbox`, `priority:P0`
- Depends on：CUS-022

Scope：

- 标签：潜在客户、已预约、无效、需跟进
- 状态：新对话、处理中、转人工、已关闭

Acceptance Criteria：

- 人工可手动设置标签和状态
- AI 动作可自动更新部分状态
- 列表可按标签和状态筛选

### CUS-030 Build AI receptionist settings

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `priority:P0`
- Depends on：CUS-015

Scope：

- 接待员名称
- 语气风格
- 默认语言
- 是否主动引导预约
- 是否允许 AI 报价
- 是否允许 AI 承诺服务时间

Acceptance Criteria：

- 管理员可修改 AI 基础行为
- 配置变更影响后续对话
- 危险配置有提示，例如允许报价

### CUS-031 Implement AI orchestration runner

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `priority:P0`, `risk:ai-quality`
- Depends on：CUS-021, CUS-030

Scope：

- 接收客户消息
- 构造 AI 输入上下文
- 调用模型
- 解析结构化输出
- 执行动作：reply、ask_field、update_lead、handoff
- 保存 ai_runs

Acceptance Criteria：

- 客户发消息后 AI 可生成回复
- AI 输出必须是可解析结构
- AI 失败时不丢消息，并提示人工处理
- 每次 AI 运行都有审计记录

### CUS-032 Implement business knowledge retrieval

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `priority:P0`
- Depends on：CUS-015, CUS-031

Scope：

- 将业务资料和 FAQ 纳入可检索上下文
- 提供 search_business_profile 工具
- 记录 AI 回复使用的资料来源

Acceptance Criteria：

- AI 回复优先使用当前商家的业务资料
- 不跨商家检索资料
- ai_runs 中保存引用来源

### CUS-033 Implement structured lead field collection

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `priority:P0`
- Depends on：CUS-024, CUS-031

Scope：

- AI 收集姓名、电话、地址/邮编、服务需求、期望时间
- 缺字段时自动追问
- 字段提取后更新 lead

Acceptance Criteria：

- AI 不重复追问已收集字段
- 字段更新可在 Inbox 侧栏看到
- 收齐必要字段后可进入预约步骤

### CUS-034 Implement service area qualification

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `area:business-profile`, `priority:P0`
- Depends on：CUS-014, CUS-033

Scope：

- AI 调用 check_service_area
- 根据地址、城市、邮编判断是否可服务
- 更新线索 qualification_status

Acceptance Criteria：

- 在服务范围内时继续推进预约
- 不在服务范围内时礼貌说明并关闭或转人工
- 判断结果和原因可追踪

### CUS-035 Implement safety guardrails and forced handoff

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:safety`, `priority:P0`, `risk:ai-quality`
- Depends on：CUS-031

Scope：

- 禁答主题
- 高风险词
- 客户要求人工
- 低置信度转人工
- 禁止承诺最终价格、退款、法律/医疗建议等

Acceptance Criteria：

- 命中高风险词必须转人工
- 客户要求人工必须转人工
- 禁答主题不由 AI 直接回答
- 转人工原因保存在对话中

### CUS-036 Generate handoff conversation summary

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `area:inbox`, `priority:P0`
- Depends on：CUS-023, CUS-031

Scope：

- 生成对话摘要
- 提取客户需求、已收集字段、风险点、建议下一步
- 接管时自动生成

Acceptance Criteria：

- 人工接管时能看到摘要
- 摘要可手动刷新
- 摘要生成失败不影响人工查看原始消息

### CUS-037 Track missing knowledge items

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `area:business-profile`, `priority:P0`
- Depends on：CUS-032

Scope：

- AI 遇到无法回答的问题时创建待补充资料
- 后台展示待补充问题
- 管理员可转为 FAQ 或忽略

Acceptance Criteria：

- 未覆盖问题能被记录
- 待补充项关联原始对话
- 处理后不再反复出现在待处理列表

### CUS-038 Build AI run audit view

- Priority：P0
- Milestone：M3 AI Receptionist
- Labels：`type:feature`, `area:ai`, `area:safety`, `priority:P0`
- Depends on：CUS-031

Scope：

- 对话详情中展示 AI 动作、使用资料、转人工原因
- 内部调试视图可查看结构化输入输出

Acceptance Criteria：

- 商家可看到 AI 为什么转人工或如何回答
- 内部管理员可排查 AI 运行失败
- 敏感信息展示遵守权限控制

### CUS-040 Implement Google Calendar OAuth connection

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:calendar`, `priority:P0`, `risk:calendar-sync`
- Depends on：CUS-002

Scope：

- Google Calendar OAuth
- 保存授权 token
- 选择目标日历
- 断开连接

Acceptance Criteria：

- 管理员可连接 Google Calendar
- token 安全保存
- 断连后不再尝试创建日历事件

### CUS-041 Implement availability rules

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:booking`, `priority:P0`
- Depends on：CUS-012, CUS-013, CUS-040

Scope：

- 基于营业时间、服务时长和日历忙闲计算可预约时间
- 提供 get_available_slots 接口

Acceptance Criteria：

- 返回未来可预约时间段
- 排除日历已有忙碌时间
- 不返回营业时间之外的时段

### CUS-042 Let AI suggest booking slots

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:ai`, `area:booking`, `priority:P0`
- Depends on：CUS-033, CUS-041

Scope：

- AI 在字段收齐后调用可预约时间接口
- 向客户展示 2-3 个候选时间
- 解析客户选择

Acceptance Criteria：

- 字段未收齐时不建议预约时间
- 候选时间符合可用性规则
- 客户选择后可进入创建预约

### CUS-043 Create booking from AI conversation

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:booking`, `area:ai`, `priority:P0`, `risk:calendar-sync`
- Depends on：CUS-042

Scope：

- create_booking 工具
- 创建 booking 记录
- 写入 Google Calendar
- 更新 lead 和 conversation 状态
- 发送确认消息

Acceptance Criteria：

- 客户明确确认后才创建预约
- 日历冲突时创建失败并重新建议时间
- 创建成功后后台可见预约
- 对话状态更新为已预约

### CUS-044 Build booking management UI

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:booking`, `priority:P0`
- Depends on：CUS-043

Scope：

- 预约列表
- 预约详情
- 状态管理
- 按日期和状态筛选

Acceptance Criteria：

- 商家可查看所有预约
- 可查看客户、服务、地址、时间和来源对话
- 状态变更被记录

### CUS-045 Implement reschedule and cancel booking

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:booking`, `area:calendar`, `priority:P0`
- Depends on：CUS-044

Scope：

- 后台改约
- 后台取消
- 同步更新 Google Calendar
- 记录 booking_events

Acceptance Criteria：

- 改约前检查冲突
- 取消后日历事件同步取消或删除
- 操作失败时给出明确错误

### CUS-046 Send booking confirmation messages

- Priority：P0
- Milestone：M4 Booking
- Labels：`type:feature`, `area:booking`, `area:channel`, `priority:P0`
- Depends on：CUS-043

Scope：

- 预约成功后在当前对话渠道发送确认
- 记录 notification_logs
- 确认内容包含时间、服务、地址和改约说明

Acceptance Criteria：

- 预约创建成功后客户收到确认
- 发送失败时后台可见
- 确认消息使用商家时区

### CUS-050 Implement analytics event pipeline

- Priority：P0
- Milestone：M5 Analytics
- Labels：`type:feature`, `area:analytics`, `priority:P0`
- Depends on：CUS-021, CUS-043

Scope：

- 统一记录业务事件
- 事件类型：conversation_created、message_received、lead_qualified、handoff_requested、booking_created、booking_cancelled、ai_replied

Acceptance Criteria：

- 关键业务动作都写入 analytics_events
- 事件包含 merchant_id、entity_type、entity_id、properties
- 重复事件有幂等策略或去重字段

### CUS-051 Build dashboard overview metrics

- Priority：P0
- Milestone：M5 Analytics
- Labels：`type:feature`, `area:analytics`, `priority:P0`
- Depends on：CUS-050

Scope：

- 今日咨询数
- 今日有效线索数
- 今日预约数
- 未处理对话数
- AI 自动处理率
- 平均首次响应时间

Acceptance Criteria：

- 支持今日、7 天、30 天切换
- 指标来自 analytics_events 或真实业务表
- 指标有空状态

### CUS-052 Implement ROI settings and calculations

- Priority：P0
- Milestone：M5 Analytics
- Labels：`type:feature`, `area:analytics`, `priority:P0`
- Depends on：CUS-051

Scope：

- 配置平均客单价
- 配置人工时薪或每条咨询处理时间
- 计算预计新增收入
- 计算节省人工时间

Acceptance Criteria：

- 商家可编辑 ROI 参数
- Dashboard 展示本月预计新增收入和节省时间
- 指标旁有简短口径说明

### CUS-053 Build analytics detail page

- Priority：P0
- Milestone：M5 Analytics
- Labels：`type:feature`, `area:analytics`, `priority:P0`
- Depends on：CUS-051, CUS-052

Scope：

- 趋势图
- 咨询到预约漏斗
- 转人工率
- 未回答问题数

Acceptance Criteria：

- 支持基础时间范围筛选
- 图表在无数据时展示合理空状态
- 用户能从页面定位价值和问题

### CUS-060 Create end-to-end test scenarios

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:test`, `area:qa`, `priority:P0`
- Depends on：CUS-043, CUS-051

Scope：

- 新商家上线流程
- 客户咨询到预约
- 客户要求人工
- 不服务区域
- AI 答不上来生成待补充资料

Acceptance Criteria：

- E2E 测试可在本地或 CI 运行
- 覆盖 MVP 主链路
- 失败时能定位到具体步骤

### CUS-061 Build AI simulation test before launch

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:feature`, `area:ai`, `area:qa`, `priority:P0`
- Depends on：CUS-031, CUS-035

Scope：

- 上线前模拟测试入口
- 预置至少 10 条行业测试问题
- 记录通过/失败

Acceptance Criteria：

- 商家上线前能运行模拟测试
- 高风险测试必须触发转人工
- 测试结果可查看

### CUS-062 Add production-grade error and empty states

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:chore`, `area:qa`, `priority:P0`
- Depends on：CUS-004

Scope：

- AI 失败
- 日历断连
- 渠道发送失败
- 无对话
- 无预约
- 无数据

Acceptance Criteria：

- 关键页面都有空状态
- 常见失败有用户可理解的提示
- 错误不泄露内部堆栈

### CUS-063 Complete basic security and privacy pass

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:chore`, `area:qa`, `priority:P0`, `risk:data-isolation`
- Depends on：CUS-002, CUS-040

Scope：

- API 权限检查
- merchant_id 隔离检查
- token 和敏感信息存储检查
- 审计日志基础检查

Acceptance Criteria：

- 跨商家访问测试失败
- 日历 token 不明文暴露到前端
- 关键操作有操作者和时间记录

### CUS-064 Prepare beta launch checklist and demo seed data

- Priority：P0
- Milestone：M6 Beta Readiness
- Labels：`type:chore`, `area:ops`, `priority:P0`
- Depends on：CUS-060, CUS-063

Scope：

- Beta 上线清单
- Demo 商家 seed 数据
- 常见测试脚本
- 内测反馈表问题

Acceptance Criteria：

- 团队可用 demo 商家演示完整流程
- 内测商家上线有 checklist
- 反馈问题能映射到产品模块

## 6. P1 Issues

### CUS-070 Select and integrate second customer channel

- Priority：P1
- Milestone：Post-MVP or Beta
- Labels：`type:feature`, `area:channel`, `priority:P1`, `risk:channel-delivery`
- Depends on：CUS-021

Scope：

- 根据目标市场选择 SMS、WhatsApp、微信/企微之一
- 接入收发消息
- 统一进入 Inbox 和 AI 编排

Acceptance Criteria：

- 第二渠道消息与 Web Chat 使用同一套 conversation 数据模型
- 渠道来源可追踪
- 发送失败可见

### CUS-071 Implement unanswered customer follow-up

- Priority：P1
- Milestone：Post-MVP or Beta
- Labels：`type:feature`, `area:ai`, `area:booking`, `priority:P1`
- Depends on：CUS-043, CUS-050

Scope：

- 客户未完成预约时延迟跟进
- 可配置跟进间隔
- 可关闭自动跟进

Acceptance Criteria：

- 未回复客户可收到一次自动跟进
- 已转人工或已预约客户不再自动跟进
- 跟进动作记录在对话中

### CUS-072 Add booking reminders

- Priority：P1
- Milestone：Post-MVP or Beta
- Labels：`type:feature`, `area:booking`, `priority:P1`
- Depends on：CUS-043

Scope：

- 预约前提醒
- 提醒时间配置
- 通过原渠道发送

Acceptance Criteria：

- 预约前按配置发送提醒
- 取消的预约不发送提醒
- 发送结果可追踪

### CUS-073 Add website URL import for business profile

- Priority：P1
- Milestone：Post-MVP or Beta
- Labels：`type:feature`, `area:business-profile`, `priority:P1`
- Depends on：CUS-015

Scope：

- 用户输入网站 URL
- 抓取公开页面文本
- AI 建议服务项目和 FAQ
- 用户确认后写入业务资料

Acceptance Criteria：

- 导入内容必须由用户确认后生效
- 抓取失败有明确提示
- 不自动发布不确定内容

### CUS-074 Add service-after-review request

- Priority：P1
- Milestone：Post-MVP or Beta
- Labels：`type:feature`, `area:booking`, `priority:P1`
- Depends on：CUS-044

Scope：

- 预约完成后发送索评消息
- 配置评价链接
- 记录发送状态

Acceptance Criteria：

- 仅已完成预约触发索评
- 商家可关闭索评功能
- 发送结果可追踪

## 7. P2 Issues

### CUS-090 Add second industry template

- Priority：P2
- Milestone：V1
- Labels：`type:feature`, `area:onboarding`, `priority:P2`
- Depends on：CUS-010, Beta feedback

Scope：

- 基于首批内测反馈选择第二行业
- 新增行业模板配置
- 新增模拟测试问题

Acceptance Criteria：

- 第二行业商家可独立上线
- 不影响第一行业模板
- 模板配置可复用同一套产品能力

### CUS-091 Build visual Playbook configuration

- Priority：P2
- Milestone：V2
- Labels：`type:feature`, `area:ai`, `priority:P2`
- Depends on：Stable MVP workflows

Scope：

- 将隐藏的业务流程可视化
- 支持开关和简单分支配置
- 不引入复杂拖拽编辑器

Acceptance Criteria：

- 用户能理解并调整核心接待剧本
- 不要求用户写 Prompt
- 配置错误有校验

### CUS-092 Add multi-staff availability

- Priority：P2
- Milestone：V2
- Labels：`type:feature`, `area:booking`, `priority:P2`
- Depends on：CUS-041

Scope：

- 员工/技师日历
- 按服务项目匹配员工
- 多人可用性计算

Acceptance Criteria：

- 预约可分配到具体员工
- 可用性考虑员工日历
- 后台可查看员工预约

## 8. 推荐执行顺序

第一批：

1. CUS-001
2. CUS-002
3. CUS-003
4. CUS-004

第二批：

1. CUS-010
2. CUS-011
3. CUS-012
4. CUS-013
5. CUS-014
6. CUS-015
7. CUS-016

第三批：

1. CUS-020
2. CUS-021
3. CUS-022
4. CUS-023
5. CUS-024
6. CUS-025

第四批：

1. CUS-030
2. CUS-031
3. CUS-032
4. CUS-033
5. CUS-034
6. CUS-035
7. CUS-036
8. CUS-037
9. CUS-038

第五批：

1. CUS-040
2. CUS-041
3. CUS-042
4. CUS-043
5. CUS-044
6. CUS-045
7. CUS-046

第六批：

1. CUS-050
2. CUS-051
3. CUS-052
4. CUS-053
5. CUS-060
6. CUS-061
7. CUS-062
8. CUS-063
9. CUS-064

## 9. MVP Definition of Done

MVP 可以进入内测的标准：

- 商家可完成注册、模板初始化和基础资料配置
- Web Chat 可嵌入外部页面
- 客户消息进入 Inbox
- AI 可基于业务资料回复
- AI 可收集必要线索字段
- AI 可判断服务范围
- AI 可在风险场景转人工
- 人工可接管和恢复 AI
- AI 可建议预约时间
- 客户确认后可创建预约并写入 Google Calendar
- 商家可查看对话、线索、预约和工作台数据
- Dashboard 可展示预约数、有效线索数、AI 自动处理率和 ROI
- 主要端到端测试通过
- 跨商家数据隔离检查通过
