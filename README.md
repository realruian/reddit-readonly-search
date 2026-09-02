# reddit-readonly-search

A minimal personal, non-commercial, read-only client for Reddit's official Data API.

## Purpose

The client helps one account holder find existing technical discussions instead of creating duplicate questions. It is restricted to three AI-engineering communities: r/MachineLearning, r/LocalLLaMA, and r/ClaudeAI.

It supports only two manually invoked operations: search up to 10 public posts in one allowed subreddit, and read up to 25 public comments from one selected post. It does not post, vote, message, moderate, edit, delete, crawl, monitor, or enumerate users.

## Data handling

- No database, analytics, telemetry, background jobs, or server.
- Results are written only to local standard output for immediate review.
- The client does not persist Reddit content to disk.
- No redistribution, resale, advertising, user profiling, sensitive-trait inference, or deanonymization.
- Reddit data is not used to train, fine-tune, improve, or evaluate an AI/ML model.
- The account holder may invoke the CLI from a local development assistant, but results remain for immediate personal reading and are not added to a training dataset or shared as a data product.

See [DATA_HANDLING.md](DATA_HANDLING.md) for the complete scope and deletion policy.

## Authentication

This repository contains no credentials. After explicit Reddit approval, set the installed-client ID only in the local environment:

```bash
export REDDIT_CLIENT_ID='approved-client-id'
```

The client requests an application-only OAuth token using Reddit's installed-client grant. Tokens are kept only in process memory and discarded when the command exits.

## Usage

Requires Node.js 20 or later.

```bash
node index.mjs search MachineLearning "small language models"
node index.mjs comments MachineLearning abc123
```

## Request limits

Each manual invocation makes one OAuth token request and one Data API request. There is no batch mode, pagination loop, scheduler, retry loop, or continuous polling. Result limits are hard-coded to 10 posts and 25 comments.

## API scope

The code calls only:

- `POST https://www.reddit.com/api/v1/access_token`
- `GET https://oauth.reddit.com/r/{subreddit}/search`
- `GET https://oauth.reddit.com/r/{subreddit}/comments/{post_id}`

No write scopes or write endpoints are used.

































