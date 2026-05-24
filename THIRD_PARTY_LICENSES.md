# 第三方许可证

本文件是基于 `package-lock.json` 的开源许可证摘要，用于公开仓库发布前检查。它不替代各依赖包自带的许可证文本；如果重新分发构建产物、容器镜像或打包后的 `node_modules`，请同时保留依赖包中的 `LICENSE`、`NOTICE` 等文件。

## 直接依赖

### 生产依赖

| 库 | 锁定版本 | 许可证 | 用途 |
|---|---:|---|---|
| @prisma/client | 6.19.3 | Apache-2.0 | ORM 数据库客户端 |
| lucide-react | 1.11.0 | ISC | React 图标库 |
| next | 16.2.4 | MIT | React 应用框架 |
| react | 19.2.5 | MIT | UI 框架 |
| react-dom | 19.2.5 | MIT | React DOM 绑定 |
| zod | 4.3.6 | MIT | TypeScript 优先的数据验证 |

### 开发依赖

| 库 | 锁定版本 | 许可证 | 用途 |
|---|---:|---|---|
| @playwright/test | 1.59.1 | Apache-2.0 | E2E 测试框架 |
| @types/node | 25.6.0 | MIT | Node.js TypeScript 类型 |
| @types/react | 19.2.14 | MIT | React TypeScript 类型 |
| @types/react-dom | 19.2.3 | MIT | React DOM TypeScript 类型 |
| dotenv | 17.4.2 | BSD-2-Clause | 环境变量加载 |
| eslint | 9.39.4 | MIT | JavaScript/TypeScript 代码检查 |
| eslint-config-next | 16.2.4 | MIT | Next.js ESLint 配置 |
| prisma | 6.19.3 | Apache-2.0 | ORM 和迁移工具 |
| tsx | 4.21.0 | MIT | TypeScript 执行器 |
| typescript | 6.0.3 | Apache-2.0 | TypeScript 编译器 |

## 传递依赖许可证概览

`package-lock.json` 中 474 个依赖包均带有许可证字段，未发现 `UNKNOWN`。当前许可证集合：

- `0BSD`
- `Apache-2.0`
- `Apache-2.0 AND LGPL-3.0-or-later`
- `Apache-2.0 AND LGPL-3.0-or-later AND MIT`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `BlueOak-1.0.0`
- `CC-BY-4.0`
- `CC0-1.0`
- `ISC`
- `LGPL-3.0-or-later`
- `MIT`
- `MPL-2.0`
- `Python-2.0`

需要额外注意的传递依赖：

- `@img/sharp-libvips-*` 和部分 `@img/sharp-*` 可选包包含 `LGPL-3.0-or-later` 条款，来自 Next.js 图像处理链路。如果分发包含这些二进制依赖的产物，应保留其许可证和再分发说明。
- `axe-core` 使用 `MPL-2.0`，当前仅作为 Playwright/测试相关传递依赖出现。
- `caniuse-lite` 使用 `CC-BY-4.0`，通常作为浏览器兼容数据使用。

未发现直接依赖使用 GPL、AGPL、SSPL、BUSL、Proprietary 或 `UNLICENSED` 许可证。

## 复查命令

```bash
node -e "const lock=require('./package-lock.json'); const rows=Object.entries(lock.packages||{}).filter(([p,v])=>p&&v.version).map(([p,v])=>v.license||'UNKNOWN'); console.log([...new Set(rows)].sort())"
node -e "const lock=require('./package-lock.json'); const rows=Object.entries(lock.packages||{}).filter(([p,v])=>p&&v.version).map(([p,v])=>({name:p.replace(/^node_modules\//,''),license:v.license||'UNKNOWN'})); console.log(rows.filter(r=>/(GPL|AGPL|SSPL|BUSL|UNLICENSED|Proprietary)/i.test(r.license)))"
```
