import { propertiesOf, valuesOf } from 'ts-reflection';

//
// First let's do interfaces
//
interface MyInterface {
  name: string;
  description?: string;
  readonly hobbies: string[];
}

type MyInterfaceKey = keyof MyInterface;

const propertiesOfMyInterface: MyInterfaceKey[] = propertiesOf<MyInterface>();
const readonlyPropertiesOfMyInterface: MyInterfaceKey[] = propertiesOf<MyInterface>({ readonly: true });
const optionalPropertiesOfMyInterface: MyInterfaceKey[] = propertiesOf<MyInterface>({ optional: true });
const requiredPropertiesOfMyInterface: MyInterfaceKey[] = propertiesOf<MyInterface>({ optional: false });

console.log('All properties of MyInterface: ');
propertiesOfMyInterface.forEach(logProperty);

console.log('Readonly properties of MyInterface: ');
readonlyPropertiesOfMyInterface.forEach(logProperty);

console.log('Optional properties of MyInterface: ');
optionalPropertiesOfMyInterface.forEach(logProperty);

console.log('Required properties of MyInterface: ');
requiredPropertiesOfMyInterface.forEach(logProperty);

//
// Second we do union types
//
type MyUnion = 'primary' | 'secondary' | 'greg' | MyInterface;

const valuesOfMyUnion = valuesOf<MyUnion>();

console.log('Values of MyUnion: ');
valuesOfMyUnion.forEach(logProperty);

//
// Let's now try enums
//
enum MyEnum {
  ONE = 1,
  TWO = 2,
  'SEVEN' = 7,
}

const valuesOfMyEnum: MyEnum[] = valuesOf<MyEnum>();
const propertiesOfMyEnum = propertiesOf<typeof MyEnum>();

console.log('Values of MyEnum: ');
valuesOfMyEnum.forEach(logProperty);

console.log('Properties of MyEnum: ');
propertiesOfMyEnum.forEach(logProperty);

function logProperty(value: unknown): void {
  console.log('\t-', value);
}
