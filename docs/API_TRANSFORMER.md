<h1>
  <img height="56px" width="auto" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/main/res/ts-reflection@xs.jpg" align="center"/>
  <span>ts-reflection</span>
</h1>

<a href="https://github.com/janjakubnanista/ts-reflection">&lt; Back to project</a>

# Transformer API

## `function transformer(program: ts.Program): (file: ts.SourceFile) => ts.SourceFile`

The transformer function is exported from `ts-reflection/transformer`:

```typescript
import transformer from 'ts-reflection/transformer';

// Or equivalent
const transfomer = require('ts-reflection/transformer').default;
```

Please refer to the [installation section](./INSTALLATION.md) for more information on how to plug the transformer into your build.
