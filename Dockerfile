# Runs the Synthlings MCP server over stdio (used by Glama's checks, and by anyone who prefers Docker).
#   docker build -t synthlings . && docker run -i --rm synthlings
# Moves and judging work out of the box; audio rendering needs the free studio (see PLAY.md).
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY bin ./bin
COPY src ./src
COPY assets ./assets
USER node
ENTRYPOINT ["node", "bin/synthlings.mjs"]
