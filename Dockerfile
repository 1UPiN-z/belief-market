FROM rust:1.75.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    openssl \
    libssl-dev \
    curl \
    git \
    npm \
    nodejs \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI
RUN curl https://release.solana.com/v1.18.0/install -o /tmp/solana-install-init.sh && \
    chmod +x /tmp/solana-install-init.sh && \
    /tmp/solana-install-init.sh --version v1.18.0 --datacenter sf && \
    rm /tmp/solana-install-init.sh

# Add Solana to PATH
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Set working directory
WORKDIR /workspace

# Copy project
COPY . .

# Install npm dependencies for frontend and SDK
RUN cd frontend && npm install --legacy-peer-deps || true && cd ..
RUN cd client && npm install || true && cd ..

# Default command
CMD ["/bin/bash"]
