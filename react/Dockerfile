# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

# Corepack is bundled through Node 24 (removed from the distribution in Node 25+),
# which is why this image is pinned to 24 even though the host runs Node 26.
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
