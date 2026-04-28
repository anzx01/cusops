# AI接待员

面向本地服务商的 AI 接待、筛选和预约 MVP。当前版本聚焦一个清晰闭环：

客户咨询 -> AI 收集服务信息 -> 判断服务范围 -> 创建预约 -> 后台查看对话/线索/预约/数据 -> 必要时转人工。

## 当前能力

- 后台工作台：咨询数、有效线索、预约数、AI 自动处理率、ROI 估算。
- Web Chat：客户可通过聊天窗口发起咨询。
- 嵌入脚本：商家网站可通过 `/widget.js` 加载右下角聊天按钮。
- AI 接待 MVP：规则型接待逻辑，支持字段收集、服务识别、地址判断、预约创建、风险词转人工。
- 业务资料：可维护公司资料、服务项目、服务区域、FAQ、待补充问题。
- 对话管理：查看消息、线索字段、AI 审计，支持人工接管、恢复 AI、关闭对话。
- 预约管理：查看预约并取消预约。
- 设置：配置 AI 接待员、人工接管联系人、ROI 估算口径。
- 数据分析：展示商家可读的业务动态，不暴露内部事件名和数据库 ID。
- E2E 测试：覆盖聊天、预约、转人工、后台维护、嵌入脚本和数据页。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Prisma Client
- SQLite 开发库
- Playwright E2E
- ESLint

## 本地启动

安装依赖：

```bash
npm install
```

初始化开发数据库并写入演示数据：

```bash
npm run db:setup
```

启动开发服务：

```bash
npm run dev -- -H 127.0.0.1 -p 3001
```

常用入口：

- 后台：http://127.0.0.1:3001/dashboard
- Web Chat：http://127.0.0.1:3001/chat/demo-web-chat
- 渠道设置：http://127.0.0.1:3001/channels
- 数据分析：http://127.0.0.1:3001/analytics

## 嵌入 Web Chat

在外部网站页面中加入：

```html
<script async src="http://127.0.0.1:3001/widget.js" data-channel="demo-web-chat" data-label="在线咨询"></script>
```

生产环境需要把 `src` 替换成正式域名。

## 验证命令

```bash
npm run lint
npm run typecheck
npm run test:e2e
```

`npm run test:e2e` 会自动执行：

1. 重建 SQLite 开发库
2. 写入 seed 数据
3. 构建 Next.js 应用
4. 启动测试服务器
5. 运行 Playwright 浏览器测试

## 注意事项

- 当前使用 demo merchant，不包含真实登录认证。
- 当前 AI 接待是规则型 MVP，尚未接入真实 LLM。
- Google Calendar OAuth 尚未接入，预约使用本地模拟 `calendarEventId`。
- 当前环境下 Prisma `migrate` / `db push` 的 schema engine 在 Windows 上报空错误，因此开发库由 `scripts/setup-db.ts` 直接创建，Prisma Client 正常使用。
- E2E 会重建开发数据库，不要在开发库中保存需要长期保留的数据。

## 相关文档

- [PRD](./prd.md)
- [开发计划](./development-plan.md)
- [实施 Backlog](./implementation-backlog.md)
- [项目进度](./PROGRESS.md)
