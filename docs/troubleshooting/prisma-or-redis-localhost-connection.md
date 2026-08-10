# Prisma/Redis didn't connect while using localhsot

## Sintomn

`GET /health/ready` hangs waiting indefenitely.

## Diagnostic

`/health` responded correctly.

PostgreSQL & Redis were working fine.

The problem was in the connections stablished in Node.

When replacing `localhost` for `127.0.0.1`, both connections started working.

## Cause

`localhost` was resolving using IPv6 (`::1`), while the services were available with IPv4.

## Solution

Changing:

`localhost`

for:

`127.0.0.1`

## How to diagnose the issue again

1. Check that PostgreSQL is up.
2. Check Redis.
3. Try `/health`.
4. Try `/health/ready`.
5. Try connection using `127.0.0.1`.