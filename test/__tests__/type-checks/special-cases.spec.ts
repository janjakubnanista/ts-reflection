import { assert, notALiteral, notAnEmptyObject, notOfType, numeric, primitive } from '../utils';
import fc from 'fast-check';

// @ts-ignore
import { isA, typeCheckFor } from 'ts-reflection';

describe('special-cases', () => {
  test('never in conditional', () => {
    type ConditionalPropertyNames<P> = {
      [K in keyof P]: P[K] extends number ? K : never;
    }[keyof P];
    type Interface = {
      numeric: number;
      string: string;
    };
    type TypeReference1 = ConditionalPropertyNames<Interface>;
    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(fc.constantFrom<TypeReference1>('numeric'));
    const invalidArbitrary: fc.Arbitrary<unknown> = fc.oneof(
      fc.constantFrom('string'),
      fc.anything().filter(notALiteral('numeric')),
    );
    assert(validArbitrary, invalidArbitrary, [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)]);
  });

  // FIXME Needs more thought about cycle breaking
  test.skip('recursive structure', () => {
    type TypeReference1 = {
      cycle: TypeReference1;
    };
    const validArbitrary = fc.oneof(
      fc.record({ cycle: fc.anything() }).map<TypeReference1>((node) => Object.assign(node, { cycle: node }) as any),
    );
    const invalidArbitrary = fc.oneof(primitive(), fc.constantFrom({ cycle: { cycle: null } }), fc.anything());
    assert(validArbitrary, invalidArbitrary, [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)]);
  });

  test('callable interface', () => {
    type TypeReference1 = {
      (a: string): string;
      (a: boolean): number;
    };
    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.func(fc.anything()) as fc.Arbitrary<TypeReference1>,
    );
    const invalidArbitrary = fc.oneof(fc.anything().filter(notOfType('function')));
    assert(validArbitrary, invalidArbitrary, [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)]);
  });

  test('callable interface with additional properties', () => {
    type TypeReference1 = {
      (): string;
      apply: number;
      description: string;
    };
    const validArbitrary: fc.Arbitrary<TypeReference1> = fc
      .tuple(fc.func(fc.anything() as fc.Arbitrary<string>), numeric(), fc.string())
      .map(([object, apply, description]) => Object.assign(object, { apply, description }));
    const invalidArbitrary = fc.oneof(
      fc.func(fc.anything()),
      fc.anything().filter(notOfType('function')),
      fc
        .tuple(
          fc.func(fc.anything() as fc.Arbitrary<string>),
          fc.anything().filter(notOfType('number')),
          fc.anything().filter(notOfType('string')),
        )
        .map(([object, apply, description]) => Object.assign(object, { apply, description })),
    );
    assert(validArbitrary, invalidArbitrary, [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)]);
  });

  test('callable interface with string index type', () => {
    type TypeReference1 = {
      (a: string): string;
      [key: string]: number;
    };

    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.dictionary(fc.string(), numeric()).map((record) => Object.assign(() => 'string', record)),
    );

    const invalidArbitrary = fc.oneof(
      fc.anything().filter(notOfType('function')),
      fc
        .dictionary(fc.string(), fc.anything().filter(notOfType('number')))
        .filter(notAnEmptyObject)
        .map((record) => Object.assign(() => 'string', record)),
    );
    assert(validArbitrary, invalidArbitrary, [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)]);
  });
});
