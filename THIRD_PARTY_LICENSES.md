# 第三方许可证

本项目使用以下开源库，感谢它们的贡献：

## 生产依赖

| 库 | 版本 | 许可证 | 用途 |
|---|---|---|---|
| @prisma/client | ^6.19.3 | Apache 2.0 | ORM 数据库客户端 |
| react | ^19.2.5 | MIT | UI 框架 |
| react-dom | ^19.2.5 | MIT | React DOM 绑定 |
| next | ^16.2.4 | MIT | React 框架 |
| zod | ^4.3.6 | MIT | TypeScript 优先的数据验证 |
| lucide-react | ^1.11.0 | ISC | React 图标库 |

## 开发依赖

| 库 | 版本 | 许可证 | 用途 |
|---|---|---|---|
| typescript | ^6.0.3 | Apache 2.0 | TypeScript 编译器 |
| prisma | ^6.19.3 | Apache 2.0 | ORM 和迁移工具 |
| @types/react | ^19.2.14 | MIT | React TypeScript 类型 |
| @types/react-dom | ^19.2.3 | MIT | React DOM TypeScript 类型 |
| @types/node | ^25.6.0 | MIT | Node.js TypeScript 类型 |
| eslint | ^9.39.4 | MIT | JavaScript 代码检查 |
| eslint-config-next | ^16.2.4 | MIT | Next.js ESLint 配置 |
| @playwright/test | ^1.59.1 | Apache 2.0 | E2E 测试框架 |
| tsx | ^4.21.0 | MIT | TypeScript 执行器 |
| dotenv | ^17.4.2 | BSD-2-Clause | 环境变量加载 |

## 许可证汇总

- **MIT**：宽松许可，允许任何用途（含商业）
- **Apache 2.0**：宽松许可，明确专利权授予
- **ISC**：简单宽松许可，与 MIT 相似
- **BSD-2-Clause**：宽松许可，常见于工具库

所有依赖项均采用开源许可证，兼容本项目的 MIT 许可证。

## 许可证查看

获取依赖项完整许可信息：

```bash
npm ls --depth=0
npm info <package-name> license
```
