// @ts-ignore
import { propertiesOf, valuesOf } from 'ts-reflection';

interface MyInterface {
  name: string;
  description?: string;
  readonly hobbies: string[];
}

type MyUnion = 'primary' | 'secondary' | 'greg';

console.log('All properties of MyInterface: ');
propertiesOf<MyInterface>().forEach(logProperty);

console.log('Readonly properties of MyInterface: ');
propertiesOf<MyInterface>({ readonly: true }).forEach(logProperty);

console.log('Optional properties of MyInterface: ');
propertiesOf<MyInterface>({ optional: true }).forEach(logProperty);

console.log('Values of MyUnion: ');
valuesOf<MyUnion>().forEach(logProperty);

function logProperty(value: unknown): void {
  console.log('\t-', value);
}
