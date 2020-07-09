import 'jest';
import { expectPropertiesMatch } from '../../../utils/utils.v2';
import { valuesOf } from 'ts-reflection';

describe('valuesOf', () => {
  type NumericLiteralUnion = 1 | 1e6 | 0xffffff | 0b111111 | 0.9 | 0.5;
  const numericLiteralValues: NumericLiteralUnion[] = [1, 1e6, 0xffffff, 0b111111, 0.9, 0.5];
  type StringLiteralUnion = 'primary' | 'secondary';
  const stringLiteralValues: StringLiteralUnion[] = ['primary', 'secondary'];

  type DuplicateUnion =
    | 'primary'
    | 'primary'
    | 'secondary'
    | 'secondary'
    | 1
    | 1
    | 1n
    | 1n
    | true
    | true
    | false
    | false;
  const duplicateUnionValues: DuplicateUnion[] = ['primary', 'secondary', 1, 1n, true, false];

  it('should return an empty array for number type', () => {
    expect(valuesOf<number>()).toEqual([]);
  });

  it('should return an empty array for string type', () => {
    expect(valuesOf<string>()).toEqual([]);
  });

  it('should return an empty array for string or number union type', () => {
    expect(valuesOf<string | number>()).toEqual([]);
  });

  it('should return a single value for a singular literal type', () => {
    expect(valuesOf<'primary'>()).toEqual(['primary']);
    expect(valuesOf<6>()).toEqual([6]);
  });

  it('should return an array of all possible values of string union', () => {
    expectPropertiesMatch(valuesOf<StringLiteralUnion>(), stringLiteralValues);
  });

  it('should return an array of all possible values of number union', () => {
    expectPropertiesMatch(valuesOf<NumericLiteralUnion>(), numericLiteralValues);
  });

  it('should return an array of all possible values of mixed union', () => {
    type TypeReference1 = NumericLiteralUnion | StringLiteralUnion;

    expectPropertiesMatch(valuesOf<TypeReference1>(), [...numericLiteralValues, ...stringLiteralValues]);
  });

  it('should exclude all string literals if string is mixed with union', () => {
    type TypeReference1 = NumericLiteralUnion | StringLiteralUnion | string;

    expectPropertiesMatch(valuesOf<TypeReference1>(), numericLiteralValues);
  });

  it('should exclude all number literals if number is mixed with union', () => {
    type TypeReference1 = NumericLiteralUnion | StringLiteralUnion | number;

    expectPropertiesMatch(valuesOf<TypeReference1>(), stringLiteralValues);
  });

  it('should exclude all literals if string and number are mixed with union', () => {
    type TypeReference1 = NumericLiteralUnion | StringLiteralUnion | number | string;

    expectPropertiesMatch(valuesOf<TypeReference1>(), []);
  });

  it('should deduplicate duplicate values within a type', () => {
    expect(valuesOf<DuplicateUnion>()).toHaveLength(6);
    expectPropertiesMatch(valuesOf<DuplicateUnion>(), duplicateUnionValues);
  });

  it('should deduplicate duplicate values across types', () => {
    type TypeReference1 = DuplicateUnion | DuplicateUnion | 'primary' | 1;

    expect(valuesOf<TypeReference1>()).toHaveLength(6);
    expectPropertiesMatch(valuesOf<TypeReference1>(), duplicateUnionValues);
  });

  it('should expand boolean into true and false', () => {
    type TypeReference1 = 'property' | boolean;

    const expectedValues: TypeReference1[] = ['property', true, false];
    expectPropertiesMatch(valuesOf<TypeReference1>(), expectedValues);
  });

  it('should list all the values of regular enums', () => {
    enum Enum {
      A,
      'B',
    }

    const expectedValues: Enum[] = [Enum.A, Enum.B];
    expectPropertiesMatch(valuesOf<Enum>(), expectedValues);
  });

  it('should list all the values of regular enums with values', () => {
    enum Enum {
      A = 1,
      'B' = 'string',
    }

    const expectedValues: Enum[] = [Enum.A, Enum.B];
    expectPropertiesMatch(valuesOf<Enum>(), expectedValues);
  });

  it('should list all the values of const enums', () => {
    const enum Enum {
      A,
      'B',
    }

    const expectedValues: Enum[] = [Enum.A, Enum.B];
    expectPropertiesMatch(valuesOf<Enum>(), expectedValues);
  });

  it('should list all the values of const enums with values', () => {
    const enum Enum {
      A = 1,
      'B' = 'string',
    }

    const expectedValues: Enum[] = [Enum.A, Enum.B];
    expectPropertiesMatch(valuesOf<Enum>(), expectedValues);
  });

  it('should exclude any non-literal types', () => {
    type MyNonLiteralEnum = Promise<unknown> | HTMLAnchorElement | WebSocket | Record<string, unknown> | 'literal';

    const expectedValues: MyNonLiteralEnum[] = ['literal'];
    expectPropertiesMatch(valuesOf<MyNonLiteralEnum>(), expectedValues);
  });
});
