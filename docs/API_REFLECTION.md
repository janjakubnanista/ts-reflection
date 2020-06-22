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

#### `function valuesOf<T>(): T[]`

`valuesOf` takes one type argument `T` (a union type) and returns all possible literal values of such type:

```typescript
type ButtonType = 'primary' | 'secondary' | 'link';

const buttonTypes: ButtonType[] = valuesOf<ButtonType>(); // ['primary', 'secondary', 'link']
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

**The type that you pass to `valuesOf` must not be a type parameter!** In other words:

```typescript
function doMyStuff<T>(value: unknown) {
  // Bad, T is a type argument and will depend on how you call the function
  const typeValues = valuesOf<T>();

  // Good, MyUnionType is not a type parameter
  const typeValues = valuesOf<MyUnionType>();
}
```

#### `function propertiesOf<T>(): (keyof T)[]`

`propertiesOf` takes one type argument `T` and returns all its public (i.e. not `private` or `protected`) properties:

```typescript
interface MyInterface {
  property: number;
  anotherProperty: string;
}

const interfaceProperties: (keyof MyInterface)[] = propertiesOf<MyInterface>(); // ['property', 'anotherProperty']

class MyClass {
  private id: string;
  protected name: string;
  public displayName: sting;
}

const classProperties: (keyof MyClass)[] = propertiesOf<MyInterface>(); // ['displayName']
```

`propertiesOf` also works nicely with `enums`, you no longer need to hack any `Object.keys` calls:

```typescript
enum MyEnum {
  NO = 0,
  MAYBE = 1,
  YES = 2
}

const propertiesOfMyEnum = propertiesOf<MyEnum>(); // ['NO', 'MAYBE', 'YES']
```

**The type that you pass to `propertiesOf` must not be a type parameter either!** (see above)

