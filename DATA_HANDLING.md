# Data handling and retention

## Controller and users

This is a single-user local tool operated only by Reddit user `u/tianruian`. It is not offered to other users and has no public service endpoint.

## Collection scope

The tool retrieves only public posts and public comments from r/MachineLearning, r/LocalLLaMA, and r/ClaudeAI after a manual query by the account holder.

## Retention and deletion

Reddit response data is held only in process memory and printed to standard output. The application has no database, cache, file-writing path, telemetry, or backup. When the command exits, the in-memory response and OAuth token are discarded. If the operator redirects terminal output to a file, that is outside the application's default behavior and the operator must delete it immediately after review.

## User rights and removals

Because the application does not retain Reddit data, deleted or edited Reddit content is not preserved by the application. Every later request reads the current API response.

## Prohibited uses

The tool will not use Reddit data for resale, redistribution, advertising, profiling, sensitive-trait inference, deanonymization, surveillance, model training, fine-tuning, evaluation datasets, or product analytics.

## Security

No client ID, access token, or other credential is committed to this repository. OAuth tokens exist only in process memory for a single command.
