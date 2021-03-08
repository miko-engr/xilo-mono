# Xilo Monorepo

Built with [Nx](https://nx.dev). Before starting, you probably want `@nrwl/cli` installed globally: `yarn global add @nrwl/cli`

## Referencing other projects

- All projects (libs as well as apps) exist in the `@xilo-mono` scope
- To import from a given package, an import statement may look like `import { IFormContainer } from '@xilo-mono/form-contracts';`

## Setup

- Install with `yarn`
- Note that the customized `formio` build must be built separately with `yarn build:formio`. Also note that within the `libs/formio5` dir, only edit files within the `src` directory- both `libs` and `dist` are output.
- Add `.env` file
- Launch with `yarn start` (launches default project, in this case the UI sandbox at `apps/builder-ui-ng`)
- App will start on `localhost:4200`

## Yarn App available for build
yarn start:dashboard --port 4100
yarn start:customer-form (old forms)
yarn start:intake-form
yarn start:customer-formly