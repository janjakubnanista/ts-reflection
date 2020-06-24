import 'jest';

// @ts-ignore
import { PropertyType } from 'ts-reflection/types';
import { propertiesOf } from 'ts-reflection';

const expectPropertiesMatch = (received: unknown[], expected: unknown[]) => {
  expect(received).toHaveLength(expected.length);
  expect(new Set(received)).toEqual(new Set(expected));
};

describe('propertiesOf', () => {
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

    describe('flags', () => {
      const enumProperties: unknown[] = ['A', 'B'];
      enum Enum {
        A,
        B,
      }

      it('should return all the keys when flags are PUBLIC', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ public: true }),
          enumProperties,
        );
      });

      it('should return an empty array when flags are NOT PUBLIC', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ public: false }),
          [],
        );
      });

      it('should return an empty array when flags are PRIVATE', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ private: true }),
          [],
        );
      });

      it('should return all the keys when flags are NOT PRIVATE', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ private: false }),
          enumProperties,
        );
      });

      it('should return an empty array when flags are PROTECTED', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ protected: true }),
          [],
        );
      });

      it('should return all the keys when flags are NOT PROTECTED', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ protected: false }),
          enumProperties,
        );
      });

      it('should return all the keys when flags are READONLY', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ readonly: true }),
          enumProperties,
        );
      });

      it('should return an empty array when flags are NOT READONLY', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ readonly: false }),
          [],
        );
      });

      it('should return an empty array when flags are OPTIONAL', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ optional: true }),
          [],
        );
      });

      it('should return all the keys when flags are NOT OPTIONAL', () => {
        expectPropertiesMatch(
          propertiesOf<Enum>({ optional: false }),
          enumProperties,
        );
      });
    });
  });
});
