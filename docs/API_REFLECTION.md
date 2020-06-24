<h1>
  <img height="56px" width="auto" src="https://raw.githubusercontent.com/janjakubnanista/ts-reflection/main/res/ts-reflection@xs.jpg" align="center"/>
  <span>ts-reflection</span>
</h1>

<a href="https://github.com/janjakubnanista/ts-reflection">&lt; Back to project</a>

# Reflection API

Two functions are exported: `valuesOf` and `propertiesOf`. (funny enough neither of them exist, just check [index.js](https://github.com/janjakubnanista/ts-reflection/tree/main/src/index.ts) yourself :grinning:).

```typescript
import { propertiesOf, valuesOf } from 'ts-reflection';
```

<a id="valuesOf"></a>
## `valuesOf`

```typescript
function valuesOf<T>(): T[]
```

`valuesOf` takes one type argument `T` (a union type usually) and returns all possible literal values of such type:

```typescript
import { valuesOf } from 'ts-reflection';

type UnionType = 'string value' | 1 | true | Symbol.toStringTag;

// You can use valuesOf utility to get all the possible union type values
const unionTypeValues = valuesOf<UnionType>(); // ['string value', 1, true, Symbol.toStringTag]
```

In case the union type does not contain any literal types, `valuesOf` will return an empty array:

```typescript
type UnionType = string | number | boolean;

const unionTypes: UnionType[] = valuesOf<UnionType>(); // []
```

In case the literal types are "shadowed" by non-literal ones, the literal types will not be present in the array:

```typescript
// "number" in union type will shadow all the numeric literals
type UnionType = 'primary' | 'secondary' | 1 | 2 | number;
const unionTypes: UnionType[] = valuesOf<UnionType>(); // ['primary', 'secondary']

// "string" in union type will shadow all the string literals
type UnionType = 'primary' | 'secondary' | 1 | 2 | string;
const unionTypes: UnionType[] = valuesOf<UnionType>(); // [1, 2]
```

`valuesOf` also works nicely with `enums`, you no longer need to hack any `Object.keys` calls:

```typescript
enum MyEnum {
  NO = 0,
  MAYBE = 1,
  YES = 2
}

const valuesOfMyEnum = valuesOf<MyEnum>(); // [0, 1, 2]
```

`valuesOf` will expand `boolean` type into `true` and `false`:

```typescript
type UnionType = 'string value' | boolean;

const values = valuesOf<UnionType>(); // ['string value', true, false]
```

**The type that you pass to `valuesOf` must not be a type parameter!** In other words:

```typescript
function doMyStuff<T>(value: unknown) {
  // Bad, T is a type argument and will depend on how you call the function
  const typeValues = valuesOf<T>();

  // Good, MyUnionType is not a type parameter
  const typeValues = valuesOf<MyUnionType>();
}
```

<a id="propertiesOf"></a>
## `propertiesOf`

```typescript
function propertiesOf<T>(...queries: PropertyQuery[]): (keyof T)[]
```

`propertiesOf` takes one type argument `T` and an (optional) list of `PropertyQueries` (these allow fine-grained access to what properties you want to list).

**The type that you pass to `propertiesOf` must not be a type parameter either!** (see above)

### `propertiesOf()`

If called with no arguments, it returns all `public` property names of a type (all interface properties are `public`):

#### interfaces

```typescript
interface MyInterface {
  property: number;
  anotherProperty: string;
}

const properties = propertiesOf<MyInterface>(); // ['property', 'anotherProperty']
```

#### enums

```typescript
enum MyEnum {
  NO = 0,
  MAYBE = 1,
  YES = 2
}

const propertiesOfMyEnum = propertiesOf<MyEnum>(); // ['NO', 'MAYBE', 'YES']
```

#### classes

```typescript
class MyClass {
  private id: string;
  protected name: string;
  public displayName: sting;
}

const properties = propertiesOf<MyInterface>(); // ['displayName']
```

### `propertiesOf(query: PropertyQuery)`

When `propertiesOf` is called with one `PropertyQuery`, it returns all the properties that match that query. Here is how such a query looks:

```typescript
interface PropertyQuery {
  public?: boolean;
  protected?: boolean;
  private?: boolean;
  readonly?: boolean;
  optional?: boolean;
}
```

Here are some examples of such queries:

```typescript
// Get all the private properties
const privateProperties = propertiesOf<MyClass>({ private: true });

// Get all readonly properties
const readonlyProperties = propertiesOf<MyClass>({ readonly: true });

// Get all non-readonly properties
const nonReadonlyProperties = propertiesOf<MyClass>({ readonly: false });

// Get all optional properties
const optionalProperties = propertiesOf<MyClass>({ optional: true });

// Get all required properties
const requiredProperties = propertiesOf<MyClass>({ optional: false });

// Get all readonly optional properties
const readonlyOptionalProperties = propertiesOf<MyClass>({ readonly: true, optional: true });

// Get all readonly optional properties that are not public
const readonlyOptionalProperties = propertiesOf<MyClass>({ readonly: true, optional: true, public: false });

// Get all required properties that are not public
const readonlyOptionalProperties = propertiesOf<MyClass>({ optional: false, public: false });
```

### `propertiesOf(...queries: PropertyQuery[])`

When called with multiple queries, `propertiesOf` will return all properties that match at least one of the queries.

Here are some examples of such queries:

```typescript
// Get all optional or readonly properties
const optionalOrReadonlyProperties = propertiesOf<MyClass>({ optional: true }, { readonly: true });

// Get all private or protected properties
const privateOrProtectedProperties = propertiesOf<MyClass>({ private: true }, { protected: true });
```

