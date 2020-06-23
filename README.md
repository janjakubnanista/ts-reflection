<!-- Logo -->
<p align="center">
  <img width="50%" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/main/res/ts-reflection.jpg"/>
</p>

<h1 align="center">
  ts-reflection
</h1>

<p align="center">
  Type inspection utilities for TypeScript
</p>

<!-- The badges section -->
<p align="center">
  <!-- CircleCI build status -->
  <a href="https://circleci.com/gh/janjakubnanista/ts-reflection/tree/main"><img alt="CircleCI Build Status" src="https://circleci.com/gh/janjakubnanista/ts-reflection.svg?style=shield"></a>
  <!-- Fury.io NPM published package version -->
  <a href="https://www.npmjs.com/package/ts-reflection"><img alt="NPM Version" src="https://badge.fury.io/js/ts-reflection.svg"/></a>
  <!-- Shields.io dev dependencies status -->
  <a href="https://github.com/janjakubnanista/ts-reflection/blob/main/package.json"><img alt="Dev Dependency Status" src="https://img.shields.io/david/dev/janjakubnanista/ts-reflection"/></a>
  <!-- Snyk.io vulnerabilities badge -->
  <a href="https://snyk.io/test/github/janjakubnanista/ts-reflection"><img alt="Known Vulnerabilities" src="https://snyk.io/test/github/janjakubnanista/ts-reflection/badge.svg"/></a>
  <!-- Shields.io license badge -->
  <a href="https://github.com/janjakubnanista/ts-reflection/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/ts-reflection"/></a>
</p>

<p align="center">
  <code>ts-reflection</code> allows you to access information about your types in runtime - e.g. get properties of a type or possible values of a union. It is compatible with <a href="./docs/INSTALLATION.md#installation--rollup">rollup</a>, <a href="./docs/INSTALLATION.md#installation--webpack">webpack</a>, and <a href="./docs/INSTALLATION.md#installation--ttypescript">ttypescript</a> projects and works nicely with <a href="./docs/INSTALLATION.md#installation--jest">jest</a> or <a href="./docs/INSTALLATION.md#installation--ts-node">ts-node</a>
</p>

<p align="center">
  <a href="#motivation">Motivation</a>
  <span>|</span>
  <a href="https://github.com/janjakubnanista/ts-reflection/blob/main/docs/INSTALLATION.md">Installation</a>
  <span>|</span>
  <a href="https://github.com/janjakubnanista/ts-reflection/blob/main/docs/API.md">API</a>
  <span>|</span>
  <a href="#acknowledgement">Acknowledgement</a>
</p>

## Wait what?

As they say *an example is worth a thousand API docs* so why not start with one.

```typescript
interface MyInterface {
  name: string;
  hobbies: string[];
}

// You can now use propertiesOf utility to get all properties of a type
const properties = propertiesOf<MyInterface>(); // ['name', 'hobbies']
```

Another one?

```typescript
class MyClass {
  displayName: string;
  greet() {
    console.log('Oh hello there!')
  }
}

// 
const properties = propertiesOf<MyClass>(); // ['displayName', 'greet']
```

Also works with `enums`!

```typescript
enum MyEnum {
  NO = 0,
  MAYBE = 1,
  YES = 2
}

const properties = propertiesOf<MyEnum>(); // ['NO', 'MAYBE', 'YES']
```

Or something completely different?

```typescript
type ButtonType = 'primary' | 'secondary' | 'link';

// You can use valuesOf utility to get all the possible union type values
const buttonTypes = valuesOf<ButtonType>(); // ['primary', 'secondary', 'link']
```

<a id="motivation"></a>
## Motivation

I can't count the number of times I needed to type all the possible values of a union type to create e.g. a dropdown with all the button types:

```typescript
type ButtonType = 'primary' | 'secondary' | 'link';

const buttonTypes: ButtonType[] = ['primary', 'secondary', 'link'];
```

I was always aware of fragility of such solution and the fact you need to update it by hand every time `ButtonType` changes. Now I can write just

```typescript
const buttonTypes: ButtonType[] = valuesOf<ButtonType>;
```


The same goes for a list of type properties - typing those lists of `keyof` type values:

```typescript
interface MyInterface {
  property: number;
  anotherProperty: string;
}

type Key = keyof MyInterface;
const keys: Key[] = ['property', 'anotherProperty']
```

Which now becomes

```typescript
const keys: Key[] = propertiesOf<MyInterface>();
```


## Installation

You can find comprehensive installation instructions in the [installation docs](https://github.com/janjakubnanista/ts-reflection/blob/main/docs/INSTALLATION.md).

## API

You can find comprehensive API documentation in the [API docs](https://github.com/janjakubnanista/ts-reflection/blob/main/docs/API.md).

<a id="acknowledgement"></a>
## Acknowledgement

This idea was inspired by [`ts-transformer-keys`](https://www.npmjs.com/package/ts-transformer-keys) NPM module. The E2E testing infrastructure that ensures compatibility with all minor TypeScript versions is based on my [`ts-reflection`](https://www.npmjs.com/package/ts-reflection) project.