[English](README.md) | [简体中文](README.zh-CN.md)

# reddit-readonly-search

面向 Reddit 官方 Data API 的极简个人、非商业、只读客户端。

## 用途

本客户端帮助单一账号持有者查找已有的技术讨论，避免重复发帖提问。访问范围严格限制在三个 AI 工程社区：`r/MachineLearning`、`r/LocalLLaMA` 和 `r/ClaudeAI`。

客户端仅支持两项手动触发的操作：在允许的子版块中搜索最多 10 条公开帖子，以及读取指定帖子下的最多 25 条公开评论。不支持发帖、投票、私信、版务管理、编辑、删除、爬取、持续监控或枚举用户。

## 数据处理

- 无数据库、分析统计、遥测、后台任务或服务端。
- 查询结果仅输出到本地标准输出（`stdout`），供即时查阅。
- 客户端不会将 Reddit 内容持久化写入磁盘。
- 不进行再分发、转售、广告投放、用户画像、敏感特征推断或去匿名化。
- Reddit 数据不会用于训练、微调、改进或评估任何 AI/ML 模型。
- 账号持有者可通过本地开发助手调用此 CLI，但返回结果仅用于个人即时阅读，不会加入训练数据集或作为数据产品共享。

完整范围与数据删除策略请参阅 [DATA_HANDLING.md](DATA_HANDLING.md)。

## 身份认证

本仓库不包含任何凭据。获得 Reddit 明确批准后，仅需在本地环境变量中设置已安装客户端（installed-client）的 ID：

```bash
export REDDIT_CLIENT_ID='approved-client-id'
```

客户端使用 Reddit 的 installed-client 授权方式请求仅限应用（application-only）的 OAuth 令牌。令牌仅保留在进程内存中，命令退出后立即丢弃。

## 使用方法

需要 Node.js 20 或更高版本。

```bash
node index.mjs search MachineLearning "small language models"
node index.mjs comments MachineLearning abc123
```

## 请求限制

每次手动调用仅发起一次 OAuth 令牌请求和一次 Data API 请求。不包含批处理模式、分页循环、定时调度、重试循环或持续轮询。结果上限在代码中硬编码为最多 10 条帖子和 25 条评论。

## API 范围

代码仅调用以下接口：

- `POST https://www.reddit.com/api/v1/access_token`
- `GET https://oauth.reddit.com/r/{subreddit}/search`
- `GET https://oauth.reddit.com/r/{subreddit}/comments/{post_id}`

不使用任何写入权限（write scopes）或写入接口。

## 许可证

[MIT](LICENSE)
