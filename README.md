## What's inside?

This Turborepo includes the following packages/apps:

- blockchain
- nodes-mock
- wallet-client
- web

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Using this example

Run the following command:

Install node, pnpm and turborepo

```sh
pnpm install
pnpm run dev #start all svelte apllications and the hardhat dev node
pnpm run deploy # deploy the test smart contract
```

To deploy the web wallet to ipfs run

```sh
pnpm run build
```

Afterwards move the static website files into IPFS.
