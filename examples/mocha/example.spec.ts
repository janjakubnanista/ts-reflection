import 'jest';

import { expect } from 'chai';
import { propertiesOf, valuesOf } from 'ts-reflection';

describe('example mocha test suite', () => {
  interface MyInterface {
    name: string;
    description?: string;
  }

  type MyUnion = 'primary' | 'secondary' | 'greg';

  it('should list all the properties of an interface', () => {
    expect(propertiesOf<MyInterface>()).to.eql(['name', 'description']);
  });

  it('should list all the possible values of an union type', () => {
    expect(valuesOf<MyUnion>()).to.eql(['primary', 'secondary', 'greg']);
  });
});
