import 'jest';

import { TestClass, expectPropertiesMatch } from '../utils';

// @ts-ignore
import { propertiesOf } from 'ts-reflection';

describe('propertiesOf', () => {
  describe('classes', () => {
    const allPublicTestClassProperties = [
      'defaultAccessMutableProperty',
      'defaultAccessOptionalProperty',
      'defaultAccessReadonlyProperty',
      'defaultAccessOptionalReadonlyProperty',
      'publicMutableProperty',
      'publicOptionalProperty',
      'publicReadonlyProperty',
      'publicOptionalReadonlyProperty',
      'publicMutableConstructorProperty',
      'publicReadonlyConstructorProperty',
      'publicOptionalConstructorProperty',
      'defaultAccessMethod',
      'defaultAccessMethodWithInitializer',
      'publicMethod',
      'publicMethodWithInitializer',
      'defaultAccessGetter',
      'publicGetter',
      'defaultAccessSetter',
      'publicSetter',
    ];

    const allPublicReadonlyTestClassProperties = [
      'defaultAccessReadonlyProperty',
      'defaultAccessOptionalReadonlyProperty',
      'publicReadonlyProperty',
      'publicOptionalReadonlyProperty',
      'publicReadonlyConstructorProperty',
    ];

    const allPublicOptionalTestClassProperties = [
      'defaultAccessOptionalProperty',
      'defaultAccessOptionalReadonlyProperty',
      'publicOptionalProperty',
      'publicOptionalReadonlyProperty',
      'publicOptionalConstructorProperty',
    ];

    const allPrivateTestClassProperties = [
      'privateMutableProperty',
      'privateOptionalProperty',
      'privateReadonlyProperty',
      'privateOptionalReadonlyProperty',
      'privateMutableConstructorProperty',
      'privateReadonlyConstructorProperty',
      'privateOptionalConstructorProperty',
      'privateMethod',
      'privateMethodWithInitializer',
      'privateGetter',
      'privateSetter',
    ];

    const allPrivateReadonlyTestClassProperties = [
      'privateReadonlyProperty',
      'privateOptionalReadonlyProperty',
      'privateReadonlyConstructorProperty',
    ];

    const allPrivateOptionalTestClassProperties = [
      'privateOptionalProperty',
      'privateOptionalReadonlyProperty',
      'privateOptionalConstructorProperty',
    ];

    const allProtectedTestClassProperties = [
      'protectedMutableProperty',
      'protectedOptionalProperty',
      'protectedReadonlyProperty',
      'protectedOptionalReadonlyProperty',
      'protectedMutableConstructorProperty',
      'protectedReadonlyConstructorProperty',
      'protectedOptionalConstructorProperty',
      'protectedMethod',
      'protectedMethodWithInitializer',
      'protectedGetter',
      'protectedSetter',
    ];

    const allProtectedReadonlyTestClassProperties = [
      'protectedReadonlyProperty',
      'protectedOptionalReadonlyProperty',
      'protectedReadonlyConstructorProperty',
    ];

    const allProtectedOptionalTestClassProperties = [
      'protectedOptionalProperty',
      'protectedOptionalReadonlyProperty',
      'protectedOptionalConstructorProperty',
    ];

    const allReadonlyTestClassProperties = [
      'defaultAccessReadonlyProperty',
      'defaultAccessOptionalReadonlyProperty',
      'publicReadonlyProperty',
      'publicOptionalReadonlyProperty',
      'protectedReadonlyProperty',
      'protectedOptionalReadonlyProperty',
      'privateReadonlyProperty',
      'privateOptionalReadonlyProperty',
      'publicReadonlyConstructorProperty',
      'protectedReadonlyConstructorProperty',
      'privateReadonlyConstructorProperty',
    ];

    const allMutableTestClassProperties = [
      'defaultAccessMutableProperty',
      'defaultAccessOptionalProperty',
      'publicMutableProperty',
      'publicOptionalProperty',
      'protectedMutableProperty',
      'protectedOptionalProperty',
      'privateMutableProperty',
      'privateOptionalProperty',
      'publicMutableConstructorProperty',
      'protectedMutableConstructorProperty',
      'privateMutableConstructorProperty',
      'publicOptionalConstructorProperty',
      'protectedOptionalConstructorProperty',
      'privateOptionalConstructorProperty',
      'defaultAccessMethod',
      'defaultAccessMethodWithInitializer',
      'publicMethod',
      'publicMethodWithInitializer',
      'privateMethod',
      'privateMethodWithInitializer',
      'protectedMethod',
      'protectedMethodWithInitializer',
      'defaultAccessGetter',
      'publicGetter',
      'protectedGetter',
      'privateGetter',
      'defaultAccessSetter',
      'publicSetter',
      'protectedSetter',
      'privateSetter',
    ];

    it('should return all public class properties when queries are not passed', () => {
      expectPropertiesMatch(propertiesOf<TestClass>(), allPublicTestClassProperties);
    });

    it('should return all public class properties when called with single public query', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true }),
        allPublicTestClassProperties,
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
        allProtectedTestClassProperties,
      );
    });

    it('should return all readonly class properties when flags are READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ readonly: true }),
        allReadonlyTestClassProperties,
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
      expectPropertiesMatch(propertiesOf<TestClass>({ public: true }, { protected: true }), [
        ...allPublicTestClassProperties,
        ...allProtectedTestClassProperties,
      ]);
    });

    it('should return all public or private class properties when flags are PUBLIC | PRIVATE', () => {
      expectPropertiesMatch(propertiesOf<TestClass>({ public: true }, { private: true }), [
        ...allPublicTestClassProperties,
        ...allPrivateTestClassProperties,
      ]);
    });

    it('should return all private or protected class properties when flags are PRIVATE | PROTECTED', () => {
      expectPropertiesMatch(propertiesOf<TestClass>({ private: true }, { protected: true }), [
        ...allPrivateTestClassProperties,
        ...allProtectedTestClassProperties,
      ]);
    });

    it('should return all class properties when flags are PUBLIC | PRIVATE | PROTECTED', () => {
      expectPropertiesMatch(propertiesOf<TestClass>({ public: true }, { protected: true }, { private: true }), [
        ...allPublicTestClassProperties,
        ...allPrivateTestClassProperties,
        ...allProtectedTestClassProperties,
      ]);
    });

    it('should return all optional public class properties when flags are PUBLIC & OPTIONAL', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ public: true, optional: true }),
        allPublicOptionalTestClassProperties,
      );
    });

    it('should return all optional protected class properties when flags are PROTECTED & OPTIONAL', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true, optional: true }),
        allProtectedOptionalTestClassProperties,
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
        allPublicReadonlyTestClassProperties,
      );
    });

    it('should return all readonly protected class properties when flags are PROTECTED & READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ protected: true, readonly: true }),
        [...allProtectedReadonlyTestClassProperties],
      );
    });

    it('should return all readonly private class properties when flags are PRIVATE & READONLY', () => {
      expectPropertiesMatch(
        propertiesOf<TestClass>({ private: true, readonly: true }),
        [...allPrivateReadonlyTestClassProperties],
      );
    });
  });
});
