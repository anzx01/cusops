# 贡献指南

感谢你对本项目的兴趣！我们欢迎所有形式的贡献。

## 行为准则

请遵守基本的尊重和专业的标准，确保项目对所有人都是友好的。

## 如何贡献

### 报告 Bug

在提交 Issue 前，请检查是否已存在相同的报告。请包括：

- 清晰的 Bug 描述
- 复现步骤
- 预期行为与实际行为
- 环境信息（操作系统、Node.js 版本、浏览器等）

### 提出功能请求

请创建一个 Issue 描述你的想法，并解释为什么认为这个功能有用。

### 提交代码

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 开发指南

### 设置开发环境

```bash
npm install
npm run db:setup
npm run dev
```

### 代码规范

- 使用 TypeScript，避免 `any` 类型
- 遵循 ESLint 配置
- 为新功能编写测试
- 提交前运行 `npm run lint` 和 `npm run typecheck`

### 提交消息规范

使用清晰的提交消息，格式如下：

```
<type>: <subject>

<body>

<footer>
```

类型包括：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `test`: 测试相关
- `refactor`: 代码重构
- `style`: 格式调整

### 测试

运行测试套件：

```bash
npm run lint
npm run typecheck
npm run test:e2e
```

## 许可证

通过贡献代码，你同意将你的贡献授权在项目的 MIT 许可证下使用。

## 联系方式

如有任何问题，欢迎通过 Issue 讨论。
