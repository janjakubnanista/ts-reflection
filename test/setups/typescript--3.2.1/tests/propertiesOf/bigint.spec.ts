import 'jest';

import { expectPropertiesMatch } from '../../../../utils/utils.v2';
import { propertiesOf } from 'ts-reflection';

describe('propertiesOf', () => {
  it('should return correct properties of bigint', () => {
    const expectedProperties = ['toString', 'toLocaleString', 'valueOf', Symbol.toStringTag];

    expectPropertiesMatch(propertiesOf<bigint>(), expectedProperties);
    expectPropertiesMatch(propertiesOf<BigInt>(), expectedProperties);
  });
});
