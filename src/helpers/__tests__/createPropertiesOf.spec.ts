import 'jest';
import { PropertyDescriptor, PropertyFlag, PropertyName } from '../../types';
import { PropertyQuery } from '../../types';
import { createPropertiesOf } from '../createPropertiesOf';
import fc from 'fast-check';

describe('createPropertiesOf', () => {
  const getPropertyName = ({ name }: PropertyDescriptor): PropertyName => name;

  const optionalOf = <T>(arbitrary: fc.Arbitrary<T>): fc.Arbitrary<T | undefined> =>
    fc.oneof(fc.constantFrom(undefined), arbitrary);

  const optionalBoolean = () => optionalOf(fc.boolean());

  const propertyQueryArbitrary = (): fc.Arbitrary<PropertyQuery> =>
    fc.record({
      public: optionalBoolean(),
      protected: optionalBoolean(),
      private: optionalBoolean(),
      readonly: optionalBoolean(),
      optional: optionalBoolean(),
    });

  const propertyFlagArbitrary = (): fc.Arbitrary<PropertyFlag> =>
    fc.constantFrom(
      PropertyFlag.PUBLIC,
      PropertyFlag.PROTECTED,
      PropertyFlag.PRIVATE,
      PropertyFlag.OPTIONAL,
      PropertyFlag.READONLY,
    );

  const propertyFlagsArbitrary = (): fc.Arbitrary<PropertyFlag> =>
    fc
      .array(propertyFlagArbitrary())
      .filter(({ length }) => length > 0)
      .map((flags: PropertyFlag[]) => flags.reduce((combined, flag) => combined | flag));

  const propertyDescriptorArbitrary = () =>
    fc.record<PropertyDescriptor>({
      flags: propertyFlagsArbitrary(),
      name: fc.oneof(
        fc.string(),
        fc.integer(),
        fc.string().map((name) => Symbol(name)),
      ),
    });

  const propertyDescriptorsArbitrary = (): fc.Arbitrary<PropertyDescriptor[]> =>
    fc.array(propertyDescriptorArbitrary());

  it('should only return public properties when called with no query', () => {
    fc.assert(
      fc.property(propertyDescriptorsArbitrary(), (properties): void => {
        expect(createPropertiesOf(properties)()).toEqual(
          properties.filter(({ flags }) => flags & PropertyFlag.PUBLIC).map(getPropertyName),
        );
      }),
    );
  });

  testSingleQuery('public', PropertyFlag.PUBLIC);
  testSingleQuery('private', PropertyFlag.PRIVATE);
  testSingleQuery('protected', PropertyFlag.PROTECTED);
  testSingleQuery('readonly', PropertyFlag.READONLY);
  testSingleQuery('optional', PropertyFlag.OPTIONAL);

  it.each<[string, PropertyQuery[], PropertyFlag]>([
    ['public OR private', [{ public: true }, { private: true }], PropertyFlag.PUBLIC | PropertyFlag.PRIVATE],
    ['public OR protected', [{ public: true }, { protected: true }], PropertyFlag.PUBLIC | PropertyFlag.PROTECTED],
    ['private OR protected', [{ private: true }, { protected: true }], PropertyFlag.PRIVATE | PropertyFlag.PROTECTED],
    ['optional OR readonly', [{ optional: true }, { readonly: true }], PropertyFlag.OPTIONAL | PropertyFlag.READONLY],
    ['public OR readonly', [{ public: true }, { readonly: true }], PropertyFlag.PUBLIC | PropertyFlag.READONLY],
    ['private OR readonly', [{ private: true }, { readonly: true }], PropertyFlag.PRIVATE | PropertyFlag.READONLY],
    [
      'private OR protected OR readonly',
      [{ private: true }, { protected: true }, { readonly: true }],
      PropertyFlag.PRIVATE | PropertyFlag.PROTECTED | PropertyFlag.READONLY,
    ],
  ])('should return %s properties when passed multiple include queries', (name, queries, expectedFlags) => {
    fc.assert(
      fc.property(propertyDescriptorsArbitrary(), (properties): void => {
        expect(createPropertiesOf(properties)(...queries)).toEqual(
          properties.filter(({ flags }) => flags & expectedFlags).map(getPropertyName),
        );
      }),
    );
  });

  it.each<[string, PropertyQuery[], PropertyFlag[]]>([
    ['public AND private', [{ public: true, private: true }], [PropertyFlag.PUBLIC, PropertyFlag.PRIVATE]],
    ['public AND protected', [{ public: true, protected: true }], [PropertyFlag.PUBLIC, PropertyFlag.PROTECTED]],
    ['private AND optional', [{ private: true, optional: true }], [PropertyFlag.PRIVATE, PropertyFlag.OPTIONAL]],
    ['readonly AND optional', [{ readonly: true, optional: true }], [PropertyFlag.READONLY, PropertyFlag.OPTIONAL]],
  ])(
    'should return %s properties when passed single query with multiple include properties',
    (name, queries, expectedFlags) => {
      fc.assert(
        fc.property(propertyDescriptorsArbitrary(), (properties): void => {
          expect(createPropertiesOf(properties)(...queries)).toEqual(
            properties.filter(({ flags }) => expectedFlags.every((flag) => flag & flags)).map(getPropertyName),
          );
        }),
      );
    },
  );

  it.each<[string, PropertyQuery[], PropertyFlag[], PropertyFlag[]]>([
    ['public AND NOT private', [{ public: true, private: false }], [PropertyFlag.PUBLIC], [PropertyFlag.PRIVATE]],
    ['public AND NOT protected', [{ public: true, protected: false }], [PropertyFlag.PUBLIC], [PropertyFlag.PROTECTED]],
    ['private AND NOT optional', [{ private: true, optional: false }], [PropertyFlag.PRIVATE], [PropertyFlag.OPTIONAL]],
    [
      'readonly AND NOT optional',
      [{ readonly: true, optional: false }],
      [PropertyFlag.READONLY],
      [PropertyFlag.OPTIONAL],
    ],
    [
      'readonly AND public AND NOT optional',
      [{ readonly: true, optional: false }],
      [PropertyFlag.READONLY],
      [PropertyFlag.OPTIONAL],
    ],
    [
      'readonly AND public AND NOT optional AND NOT public',
      [{ readonly: true, optional: false, public: false }],
      [PropertyFlag.READONLY],
      [PropertyFlag.OPTIONAL, PropertyFlag.PUBLIC],
    ],
    [
      'NOT readonly AND public AND NOT optional AND NOT public',
      [{ readonly: false, optional: false, public: false }],
      [],
      [PropertyFlag.READONLY, PropertyFlag.OPTIONAL, PropertyFlag.PUBLIC],
    ],
    [
      'readonly AND public AND optional AND NOT public',
      [{ readonly: true, optional: true, public: false }],
      [PropertyFlag.READONLY, PropertyFlag.OPTIONAL],
      [PropertyFlag.PUBLIC],
    ],
  ])(
    'should return %s properties when passed single query with multiple include properties',
    (name, queries, expectedFlags, unexpectedFlags) => {
      fc.assert(
        fc.property(propertyDescriptorsArbitrary(), (properties): void => {
          expect(createPropertiesOf(properties)(...queries)).toEqual(
            properties
              .filter(
                ({ flags }) =>
                  expectedFlags.every((flag) => flag & flags) && unexpectedFlags.every((flag) => !(flag & flags)),
              )
              .map(getPropertyName),
          );
        }),
      );
    },
  );

  it('should return properties matching any of the queries when passed multiple queries', () => {
    fc.assert(
      fc.property(propertyDescriptorsArbitrary(), (properties): void => {
        expect(createPropertiesOf(properties)({ private: true, optional: false }, { protected: true })).toEqual(
          properties
            .filter(
              ({ flags }) =>
                (flags & PropertyFlag.PRIVATE && !(flags & PropertyFlag.OPTIONAL)) || flags & PropertyFlag.PROTECTED,
            )
            .map(getPropertyName),
        );
      }),
    );
  });

  function testSingleQuery(queryKey: keyof PropertyQuery, expectedFlags: PropertyFlag): void {
    describe(`when called with single query with only ${queryKey} property`, () => {
      it(`should only return ${queryKey} properties when the value is truthy`, () => {
        fc.assert(
          fc.property(propertyDescriptorsArbitrary(), (properties): void => {
            expect(createPropertiesOf(properties)({ [queryKey]: true })).toEqual(
              properties.filter(({ flags }) => flags & expectedFlags).map(getPropertyName),
            );
          }),
        );
      });

      it(`should not return ${queryKey} properties when the value is falsy`, () => {
        fc.assert(
          fc.property(propertyDescriptorsArbitrary(), (properties): void => {
            expect(createPropertiesOf(properties)({ [queryKey]: false })).toEqual(
              properties.filter(({ flags }) => !(flags & expectedFlags)).map(getPropertyName),
            );
          }),
        );
      });
    });
  }
});
