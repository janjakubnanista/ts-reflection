<h1>
  <img height="56px" width="auto" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/master/res/ts-reflection.png" align="center"/>
  <span>ts-reflection</span>
</h1>

<a href="https://github.com/janjakubnanista/ts-reflection">&lt; Back to project</a>

# API

`ts-reflection` has two APIs:

- [Type guard API](./API_TYPE_CHECKER.md) and its [.d.ts](https://github.com/janjakubnanista/ts-reflection/tree/master/src/index.ts) with `isA` and `typeCheckFor` declarations
- [Transformer API](./API_TRANSFORMER.md) for integration with [rollup](./INSTALLATION.md#installation--rollup), [webpack](./INSTALLATION.md#installation--webpack), [ttypescript](./INSTALLATION.md#installation--ttypescript), [jest](./INSTALLATION.md#installation--jest) and [ts-node](./INSTALLATION.md#installation--ts-node)