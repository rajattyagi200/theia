FROM gitpod/workspace-full:latest

# Docker build does not rebuild an image when a base image is changed, increase this counter to trigger it.
ENV TRIGGER_REBUILD 3

# Install custom tools, runtime, etc.
RUN sudo apt-get update \
    # window manager
    && sudo apt-get install -y jwm \
    # native-keymap
    && sudo apt-get install -y libx11-dev libxkbfile-dev \
    # keytar
    && sudo apt-get install -y libsecret-1-dev \
    && sudo rm -rf /var/lib/apt/lists/*

ENV SHELL=/bin/bash

ENV NODE_VERSION="14.19.0"
RUN bash -c ". .nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && npm install -g yarn"
ENV PATH=$HOME/.nvm/versions/node/v${NODE_VERSION}/bin:$PATH
