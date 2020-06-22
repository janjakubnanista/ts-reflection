// @ts-ignore
import { propertiesOf, valuesOf } from 'ts-reflection';

interface MyInterface {
  name: string;
  description: string;
  hobbies: string[];
}

type MyUnion = 'primary' | 'secondary' | 'greg';

const propertiesOfMyInterface = propertiesOf<MyInterface>();
const valuesOfMyUnion = valuesOf<MyUnion>();

console.log('Properties of MyInterface: ');
propertiesOfMyInterface.forEach((property) => console.log('\t- ', property));

console.log('Values of MyUnion: ');
valuesOfMyUnion.forEach((value) => console.log('\t- ', value));
