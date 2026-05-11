FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    less \
    musl-tools \
    pkg-config \
    python3 \
    tmux \
    unzip \
  && rm -rf /var/lib/apt/lists/*
