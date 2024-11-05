# socket programming

## 1. Setup

This project uses `yarn berry` as package manager. To install it, run:

```bash
npm install -g corepack  # if you don't have corepack installed
corepack enable
```

Then, install the dependencies:

```bash
yarn install
```

## 2. Running the server and client

This project is monorepo using `yarn workspaces`. To run the server and client, run:

```bash
yarn workspace server start
yarn workspace client dev
```

You can access the client at `http://localhost:5173`.
(The client server runs on different port if the default port is already in use)
