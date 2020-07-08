import 'jest';

import { expectPropertiesMatch } from '../../../../utils/utils.v2';
import { propertiesOf } from 'ts-reflection';

describe('propertiesOf', () => {
  describe('composite', () => {
    interface A {
      readonly name: string;
      displayName?: string;
    }

    interface B {
      readonly name: string;
      hobbies: string[];
    }

    interface C {
      readonly id: number;
    }

    it('should include properties of all the types for intersection', () => {
      expectPropertiesMatch(propertiesOf<A & B & C>(), ['name', 'displayName', 'hobbies', 'id']);
      expectPropertiesMatch(propertiesOf<A & B>(), ['name', 'displayName', 'hobbies']);
      expectPropertiesMatch(propertiesOf<A & C>(), ['name', 'displayName', 'id']);
      expectPropertiesMatch(propertiesOf<B & C>(), ['name', 'hobbies', 'id']);
    });

    it('should include properties that occur in all the types for union', () => {
      expectPropertiesMatch(propertiesOf<A | B | C>(), []);
      expectPropertiesMatch(propertiesOf<A | B>(), ['name']);
      expectPropertiesMatch(propertiesOf<A | C>(), []);
      expectPropertiesMatch(propertiesOf<B | C>(), []);
    });
  });
});
