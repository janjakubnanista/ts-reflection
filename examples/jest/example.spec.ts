import 'jest';

// @ts-ignore
import { propertiesOf, valuesOf } from 'ts-reflection';

describe('example jest test suite', () => {
  interface MyInterface {
    name: string;
    description?: string;
  }

  type MyUnion = 'primary' | 'secondary' | 'greg';

  it('should list all the properties of an interface', () => {
    expect(propertiesOf<MyInterface>()).toEqual(['name', 'description']);
  });

  it('should list all the possible values of an union type', () => {
    expect(valuesOf<MyUnion>()).toEqual(['primary', 'secondary', 'greg']);
  });
});
