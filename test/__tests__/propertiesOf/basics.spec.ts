import 'jest';

// @ts-ignore
import { propertiesOf } from 'ts-reflection';

const expectPropertiesMatch = (received: unknown[], expected: unknown[]) => {
  expect(received).toHaveLength(expected.length);
  expect(new Set(received)).toEqual(new Set(expected));
};

describe('propertiesOf', () => {
  describe('basics', () => {
    describe('explicit properties', () => {
      it('should return an empty array for an empty interface', () => {
        interface TypeReference1 {} // eslint-disable-line @typescript-eslint/no-empty-interface
        type TypeReference2 = TypeReference1;

        expect(propertiesOf<TypeReference1>()).toEqual([]);
        expect(propertiesOf<TypeReference2>()).toEqual([]);
      });

      it('should return an array of explicitly defined property names', () => {
        interface TypeReference1 {
          name: string;
          age?: number;
        }

        type TypeReference2 = TypeReference1;

        const expectedProperties: string[] = ['name', 'age'];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });
    });

    describe('indexed types', () => {
      type LiteralPropertyNames = 'name' | 'bio' | 'age' | 6;

      it('should return an empty array for string records / string indexes', () => {
        type TypeReference1 = {
          [key: string]: number;
        };
        type TypeReference2 = Record<string, number>;

        const expectedProperties: string[] = [];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should return an empty array for number records / number indexes', () => {
        type TypeReference1 = {
          [key: number]: number;
        };
        type TypeReference2 = Record<number, number>;

        const expectedProperties: string[] = [];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should return an empty array for symbol records', () => {
        type TypeReference1 = Record<symbol, number>;

        expect(propertiesOf<TypeReference1>()).toEqual([]);
      });

      it('should return an array with literal indexed properties', () => {
        type TypeReference1 = {
          [key in LiteralPropertyNames]: string;
        };
        type TypeReference2 = Record<LiteralPropertyNames, number>;

        const expectedProperties: LiteralPropertyNames[] = ['name', 'age', 'bio', 6];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should exclude numeric literal properties when literal property names are mixed with number type', () => {
        type MixedPropertyTypes = LiteralPropertyNames | number;
        type TypeReference1 = {
          [key in MixedPropertyTypes]: string;
        };
        type TypeReference2 = Record<MixedPropertyTypes, number>;

        const expectedProperties: string[] = ['name', 'age', 'bio'];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should exclude string literal properties when literal property names are mixed with string type', () => {
        type MixedPropertyTypes = LiteralPropertyNames | string;
        type TypeReference1 = {
          [key in MixedPropertyTypes]: string;
        };
        type TypeReference2 = Record<MixedPropertyTypes, number>;

        const expectedProperties: MixedPropertyTypes[] = [6];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should exclude string literal properties when literal property names are mixed with string type', () => {
        type MixedPropertyTypes = LiteralPropertyNames | string;
        type TypeReference1 = {
          [key in MixedPropertyTypes]: string;
        };
        type TypeReference2 = Record<MixedPropertyTypes, number>;

        const expectedProperties: MixedPropertyTypes[] = [6];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });

      it('should exclude all literal properties when literal property names are mixed with string and number type', () => {
        type MixedPropertyTypes = LiteralPropertyNames | string | number;
        type TypeReference1 = {
          [key in MixedPropertyTypes]: string;
        };
        type TypeReference2 = Record<MixedPropertyTypes, number>;

        const expectedProperties: string[] = [];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });
    });

    describe('computed properties', () => {
      it('should include computed properties', () => {
        const propertyName = 'myProperty';
        const anotherPropertyName = 'otherProperty';
        interface TypeReference1 {
          [propertyName]: string;
          [anotherPropertyName]: number;
        }

        const expectedProperties: string[] = [propertyName, anotherPropertyName];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      });

      it('should include computed symbol properties', () => {
        interface TypeReference1 {
          [Symbol.toStringTag]: string;
        }

        const expectedProperties: symbol[] = [Symbol.toStringTag];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      });

      it('should work with different number literal notations', () => {
        type NumericPropertyType = 1e7 | 1e-6 | 0x111111 | 17.254 | 0.5;
        type TypeReference1 = {
          [key in NumericPropertyType]: string;
        };
        type TypeReference2 = Record<NumericPropertyType, number>;

        const expectedProperties: number[] = [1e7, 1e-6, 0x111111, 17.254, 0.5];
        expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
        expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
      });
    });

    describe('enums', () => {
      it('should list all the keys of regular enums', () => {
        enum Enum {
          A,
          'B',
        }

        const expectedProperties: unknown[] = ['A', 'B'];
        expectPropertiesMatch(propertiesOf<Enum>(), expectedProperties);
      });

      it('should list all the keys of regular enums with values', () => {
        enum Enum {
          A = 1,
          'B' = 'string',
        }

        const expectedProperties: unknown[] = ['A', 'B'];
        expectPropertiesMatch(propertiesOf<Enum>(), expectedProperties);
      });

      it('should list all the keys of const enums', () => {
        const enum Enum {
          A,
          'B',
        }

        const expectedProperties: unknown[] = ['A', 'B'];
        expectPropertiesMatch(propertiesOf<Enum>(), expectedProperties);
      });

      it('should list all the keys of const enums with values', () => {
        const enum Enum {
          A = 1,
          'B' = 'string',
        }

        const expectedProperties: unknown[] = ['A', 'B'];
        expectPropertiesMatch(propertiesOf<Enum>(), expectedProperties);
      });
    });
  });
});
