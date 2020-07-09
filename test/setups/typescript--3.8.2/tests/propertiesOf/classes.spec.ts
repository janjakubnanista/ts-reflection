import 'jest';

import { expectPropertiesMatch } from '../../../../utils/utils.v2';
import { propertiesOf } from 'ts-reflection';

describe('propertiesOf', () => {
  describe('classes', () => {
    class TestClass {
      #privateProperty = '';
      readonly #privateReadonlyProperty = '';

      #privateOptionalProperty? = '';
      readonly #privateOptionalReadonlyProperty? = '';

      #privateMethod = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
      readonly #privateReadonlyMethod = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

      #privateOptionalMethod? = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
      readonly #privateOptionalReadonlyMethod? = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    }

    const allPrivateTestClassProperties = [
      '#privateProperty',
      '#privateReadonlyProperty',
      '#privateOptionalProperty',
      '#privateOptionalReadonlyProperty',
      '#privateMethod',
      '#privateReadonlyMethod',
      '#privateOptionalMethod',
      '#privateOptionalReadonlyMethod',
    ];

    const allPrivateReadonlyTestClassProperties = [
      '#privateReadonlyProperty',
      '#privateOptionalReadonlyProperty',
      '#privateReadonlyMethod',
      '#privateOptionalReadonlyMethod',
    ];

    const allPrivateOptionalTestClassProperties = [
      '#privateOptionalProperty',
      '#privateOptionalReadonlyProperty',
      '#privateOptionalMethod',
      '#privateOptionalReadonlyMethod',
    ];

    const allMutableTestClassProperties = [
      '#privateProperty',
      '#privateOptionalProperty',
      '#privateMethod',
      '#privateOptionalMethod',
    ];

    it('should return all public class properties when queries are not passed', () => {
      expectPropertiesMatch(propertiesOf<TestClass>(), []);
    });

    it('should return all public class properties when called with single public query', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true }),
        [],
      );
    });

    it('should return all private class properties when flags are PRIVATE', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ private: true }),
        allPrivateTestClassProperties,
      );
    });

    it('should return all protected class properties when flags are PROTECTED', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true }),
        [],
      );
    });

    it('should return all readonly class properties when flags are READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ readonly: true }),
        allPrivateReadonlyTestClassProperties,
      );
    });

    it('should return all mutable class properties when flags are MUTABLE', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ readonly: false }),
        allMutableTestClassProperties,
      );
    });

    it('should return an empty array when flags are PUBLIC & PROTECTED', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true, protected: true }),
        [],
      );
    });

    it('should return an empty array when flags are PUBLIC & PRIVATE', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true, private: true }),
        [],
      );
    });

    it('should return an empty array when flags are PROTECTED & PRIVATE', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true, private: true }),
        [],
      );
    });

    it('should return all public or protected class properties when flags are PUBLIC | PROTECTED', () => {
      expectPropertiesMatch(propertiesOf<TestClass>({ public: true }, { protected: true }), []);
    });

    it('should return all public or private class properties when flags are PUBLIC | PRIVATE', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true }, { private: true }),
        allPrivateTestClassProperties,
      );
    });

    it('should return all private or protected class properties when flags are PRIVATE | PROTECTED', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ private: true }, { protected: true }),
        allPrivateTestClassProperties,
      );
    });

    it('should return all class properties when flags are PUBLIC | PRIVATE | PROTECTED', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true }, { protected: true }, { private: true }),
        allPrivateTestClassProperties,
      );
    });

    it('should return all optional public class properties when flags are PUBLIC & OPTIONAL', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true, optional: true }),
        [],
      );
    });

    it('should return all optional protected class properties when flags are PROTECTED & OPTIONAL', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true, optional: true }),
        [],
      );
    });

    it('should return all optional private class properties when flags are PRIVATE & OPTIONAL', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ private: true, optional: true }),
        allPrivateOptionalTestClassProperties,
      );
    });

    it('should return all readonly public class properties when flags are PUBLIC & READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true, readonly: true }),
        [],
      );
    });

    it('should return all readonly protected class properties when flags are PROTECTED & READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true, readonly: true }),
        [],
      );
    });

    it('should return all readonly private class properties when flags are PRIVATE & READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ private: true, readonly: true }),
        allPrivateReadonlyTestClassProperties,
      );
    });
  });
});
