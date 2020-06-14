<h1>
  <img height="56px" width="auto" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/master/res/ts-reflection.png" align="center"/>
  <span>ts-reflection</span>
</h1>

<a href="https://github.com/janjakubnanista/ts-reflection">&lt; Back to project</a>

# Installation

`ts-reflection` is a TypeScript transformer - it generates the required type checks and injects them into your code at compile time. It is compatible with [rollup](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/rollup), [webpack](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/webpack) and [ttypescript](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/ttypescript) projects and works nicely with [jest](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/jest).

You will first need to install `ts-reflection` using `npm`, `yarn` or similar:

```bash
# NPM
npm install --dev ts-reflection

# Yarn
yarn add -D ts-reflection
```

<a id="installation--webpack"></a>
## Webpack

[See example here](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/webpack)

In order to enable `ts-reflection` in your Webpack project you need to configure `ts-loader` or `awesome-typescript-loader` in you Webpack config.

### 1. Import the transformer

```typescript
// Using ES6 imports
import transformer from 'ts-reflection/transformer';

// Or using the old syntax
const transformer = require('ts-reflection/transformer').default;
```

### 2. Adjust your `ts-loader` / `awesome-typescript-loader` configuration

```typescript
{
  test: /\.ts(x)?$/,
  loader: 'ts-loader', // Or 'awesome-typescript-loader'
  options: {
    getCustomTransformers: program => ({
      before: [transformer(program)],
    }),
  },
}
```

<a id="installation--rollup"></a>
## Rollup

[See example here](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/rollup)

In order to enable `ts-reflection` in your Rollup project you need to configure `ts-loader` or `awesome-typescript-loader` in you rollup config.

### 1. Import the transformer

```typescript
import transformer from 'ts-reflection/transformer';
```

### 2. Option 1: Adjust your `@wessberg/rollup-plugin-ts` plugin configuration

```typescript
import ts from '@wessberg/rollup-plugin-ts';

// ...

ts({
  transformers: [
    ({ program }) => ({
      before: transformer(program),
    }),
  ],
}),
```

### 2. Option 2: Adjust your `rollup-plugin-typescript2` plugin configuration

```typescript
import typescript from 'rollup-plugin-typescript2';

// ...

typescript({
  transformers: [
    service => ({
      before: [transformer(service.getProgram())],
      after: [],
    }),
  ],
}),
```

<a id="installation--ttypescript"></a>
## TTypeScript

[See example here](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/ttypescript)

### 1. Install `ttypescript`

```bash
# NPM
npm install --dev ttypescript

# Yarn
yarn add -D ttypescript
```

### 2. Add `ts-reflection` transformer

In order to enable `ts-reflection` in your TTypescript project you need to configure plugins in your `tsconfig.json`.

```json
{
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-reflection/transformer" }
    ]
  }
}
```

<a id="installation--jest"></a>
## Jest

[See example here](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/jest)

In order to enable `ts-reflection` in your Jest tests you need to switch to `ttypescript` compiler.

### 1. Configure `ttypescript`

See [the instructions above](#installation--ttypescript).

### 2. Set `ttypescript` as your compiler

In your `jest.config.js` (or `package.json`):

```javascript
module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
```

<a id="installation--ts-node"></a>
## ts-node

[See example here](https://github.com/janjakubnanista/ts-reflection/tree/master/examples/ts-node)

### 1. Configure `ttypescript`

See [the instructions above](#installation--ttypescript).

### 2. Set `ttypescript` as your compiler

Either using command line:

```bash
$ ts-node --compiler ttypescript ...
```

Or the programmatic API:

```javascript
require('ts-node').register({
  compiler: 'ttypescript'
})
```