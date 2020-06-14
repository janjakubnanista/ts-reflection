<h1>
  <img height="56px" width="auto" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/master/res/ts-reflection.png" align="center"/>
  <span>ts-reflection</span>
</h1>

<a href="https://github.com/janjakubnanista/ts-reflection">&lt; Back to project</a>

# Transformer API

## `function transformer(program: ts.Program, options: TransformerOptions): (file: ts.SourceFile) => ts.SourceFile`

The transformer function is exported from `ts-reflection/transformer`:

```typescript
import transformer from 'ts-reflection/transformer';

// Or equivalent
const transfomer = require('ts-reflection/transformer').default;
```

Please refer to the [installation section](./INSTALLATION.md) for more information on how to plug the transformer into your build.

### TransformerOptions

`transformer` function accepts an `options` object with the following keys:

|Name|Type|Default value|Description|
|----|----|-------------|-----------|
|`logLevel`|`'debug' | 'normal' | 'nosey' | 'silent'`|`'normal'`|Set the verbosity of logging when transforming|

## Passing options to `transformer`

Depending on the type of your project there are several ways of passing the `options` to the transformer.

### Webpack and Rollup projects

You can pass options to the transformer directly in your config file:

```javascript
// In your Webpack config loader configuration
{
  // ...
  getCustomTransformers: program => ({
    before: [transformer(program, { logLevel: 'debug' })],
  }),
  // ...
}

// In your Rollup config using @wessberg/rollup-plugin-ts
ts({
  transformers: [
    ({ program }) => ({
      before: transformer(program, { logLevel: 'debug' }),
    }),
  ],
}),

// In your Rollup config using rollup-plugin-typescript2
typescript({
  transformers: [
    service => ({
      before: [transformer(service.getProgram(), { logLevel: 'debug' })],
      after: [],
    }),
  ],
}),
```

### TTypeScript projects

You can pass options to the transformer via `tsconfig.json`:

```javascript
{
  // ...
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-reflection/transformer", "logLevel": "debug" },
    ]
  },
  // ...
}
```