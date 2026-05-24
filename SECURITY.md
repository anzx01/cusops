# 安全与敏感信息

如果你发现安全问题，请不要在公开 Issue 中披露可利用细节。请通过仓库维护者提供的私有渠道报告；如果尚未设置私有渠道，请先联系维护者建立临时报告方式。

## 发布前检查

- 不提交 `.env`、`.env.local`、真实数据库、日志、Playwright 报告或生产导出数据。
- 不提交 API Key、OAuth client secret、访问令牌、私钥、Cookie、会话 ID 或云服务凭证。
- 演示数据必须使用虚构商家、联系人、电话、地址和对话内容。
- 如果发现密钥已经进入 git 历史，应立即吊销密钥，并在清理历史后再公开仓库。

## 本地检查命令

```bash
rg -n --hidden -S "(api[_-]?key|secret|token|password|private[_-]?key|BEGIN .*PRIVATE KEY|sk-[A-Za-z0-9]|ghp_|github_pat_|AKIA|AIza|xox[baprs]-)" -g "!package-lock.json" -g "!.git/**" -g "!node_modules/**"
git status --short
```
