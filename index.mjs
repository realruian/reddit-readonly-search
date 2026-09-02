#!/usr/bin/env node

const USER_AGENT = 'macos:reddit-readonly-search:v0.1.0 (by /u/tianruian)';
const ALLOWED_SUBREDDITS = new Set(['MachineLearning', 'LocalLLaMA', 'ClaudeAI']);
const POST_LIMIT = 10;
const COMMENT_LIMIT = 25;

function usage() {
  console.error('Usage:');
  console.error('  node src/index.mjs search <subreddit> <query>');
  console.error('  node src/index.mjs comments <subreddit> <post_id>');
  process.exit(1);
}

function assertSubreddit(name) {
  if (!ALLOWED_SUBREDDITS.has(name)) throw new Error(`Subreddit must be one of: ${[...ALLOWED_SUBREDDITS].join(', ')}`);
}

async function getApplicationToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  if (!clientId) throw new Error('Set REDDIT_CLIENT_ID after Reddit approves the OAuth client.');
  const body = new URLSearchParams({grant_type: 'https://oauth.reddit.com/grants/installed_client', device_id: globalThis.crypto.randomUUID()});
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {Authorization: `Basic ${Buffer.from(`${clientId}:`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': USER_AGENT},
    body,
  });
  if (!response.ok) throw new Error(`OAuth token request failed: ${response.status}`);
  const token = await response.json();
  if (!token.access_token) throw new Error('OAuth response did not contain an access token.');
  return token.access_token;
}

async function redditGet(pathname, params) {
  const token = await getApplicationToken();
  const url = new URL(`https://oauth.reddit.com${pathname}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url, {headers: {Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT}});
  if (!response.ok) throw new Error(`Reddit API request failed: ${response.status}`);
  return response.json();
}

function postView(child) {
  const p = child.data;
  return {id: p.id, subreddit: p.subreddit, title: p.title, author: p.author, created_utc: p.created_utc, score: p.score, num_comments: p.num_comments, permalink: `https://www.reddit.com${p.permalink}`, selftext: p.selftext || ''};
}

function collectComments(children, out = []) {
  for (const child of children ?? []) {
    if (out.length >= COMMENT_LIMIT) break;
    if (child.kind !== 't1') continue;
    const c = child.data;
    out.push({id: c.id, author: c.author, body: c.body, created_utc: c.created_utc, score: c.score, permalink: `https://www.reddit.com${c.permalink}`});
    if (c.replies?.data?.children) collectComments(c.replies.data.children, out);
  }
  return out;
}

const [command, subreddit, ...rest] = process.argv.slice(2);
if (!command || !subreddit || rest.length === 0) usage();
assertSubreddit(subreddit);
if (command === 'search') {
  const query = rest.join(' ').trim();
  if (!query || query.length > 100) throw new Error('Query must be 1-100 characters.');
  const data = await redditGet(`/r/${encodeURIComponent(subreddit)}/search`, {q: query, restrict_sr: 1, sort: 'relevance', t: 'all', limit: POST_LIMIT, raw_json: 1});
  console.log(JSON.stringify(data.data.children.map(postView), null, 2));
} else if (command === 'comments') {
  const postId = rest[0];
  if (!/^[a-z0-9]+$/i.test(postId)) throw new Error('Invalid post ID.');
  const data = await redditGet(`/r/${encodeURIComponent(subreddit)}/comments/${postId}`, {sort: 'top', depth: 2, limit: COMMENT_LIMIT, raw_json: 1});
  console.log(JSON.stringify(collectComments(data[1]?.data?.children), null, 2));
} else usage();
