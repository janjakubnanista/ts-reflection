import 'jest';

// @ts-ignore
import { propertiesOf } from 'ts-reflection';

const expectPropertiesMatch = (received: unknown[], expected: unknown[]) => {
  expect(received).toHaveLength(expected.length);
  expect(new Set(received)).toEqual(new Set(expected));
}

describe('propertiesOf', () => {
  describe('explicit properties', () => {
    it('should return an empty array for an empty interface', () => {
      interface TypeReference1 {} // eslint-disable-line @typescript-eslint/no-empty-interface
      type TypeReference2 = {};

      expect(propertiesOf<TypeReference1>()).toEqual([]);
      expect(propertiesOf<TypeReference2>()).toEqual([]);
    });

    it('should return an array of explicitly defined property names', () => {
      interface TypeReference1 {
        name: string;
        age?: number;
      }

      type TypeReference2 = {
        name: string;
        age?: number;
      };

      const expectedProperties: string[] = ['name', 'age'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
    });
  });

  describe('class properties', () => {
    class ClassWithPublicProperties {
      public age: number;
      public bio: string = '';

      constructor(public name: string, age: number) {
        this.age = age;
      }

      publicMethod(): void {}
      publicMethodWithInitializer = (): void => {}

      get propertyWithGetter() {
        return null;
      }
    }

    class ClassWithProtectedProperties {
      protected age: number;
      protected bio: string = '';

      constructor(protected name: string, age: number) {
        this.age = age;
      }

      protected protectedMethod(): void {}
      protected protectedMethodWithInitializer = (): void => {}

      protected get propertyWithGetter() {
        return null;
      }
    }

    class ClassWithPrivateProperties {
      private age: number;

      constructor(private name: string, age: number) {
        this.age = age;
      }

      private privateMethod(): void {}
      private privateMethodWithInitializer = (): void => {}

      private get propertyWithGetter() {
        return null;
      }
    }

    it('should return all public class properties', () => {
      type TypeReference1 = ClassWithPublicProperties;

      const expectedProperties: string[] = ['age', 'bio', 'name', 'publicMethod', 'publicMethodWithInitializer', 'propertyWithGetter'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<ClassWithPublicProperties>(), expectedProperties);
    });

    it('should exclude private class properties', () => {
      type TypeReference1 = ClassWithPrivateProperties;

      const expectedProperties: string[] = [];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<ClassWithPrivateProperties>(), expectedProperties);
    });

    it('should exclude protected class properties', () => {
      type TypeReference1 = ClassWithProtectedProperties;

      const expectedProperties: string[] = [];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<ClassWithProtectedProperties>(), expectedProperties);
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
      }
      type TypeReference2 = Record<LiteralPropertyNames, number>;

      const expectedProperties: string[] = ['name', 'age', 'bio', '6'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
    });

    it('should exclude numeric literal properties when literal property names are mixed with number type', () => {
      type MixedPropertyTypes = LiteralPropertyNames | number;
      type TypeReference1 = {
        [key in MixedPropertyTypes]: string;
      }
      type TypeReference2 = Record<MixedPropertyTypes, number>;

      const expectedProperties: string[] = ['name', 'age', 'bio'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
    });

    it('should exclude string literal properties when literal property names are mixed with string type', () => {
      type MixedPropertyTypes = LiteralPropertyNames | string;
      type TypeReference1 = {
        [key in MixedPropertyTypes]: string;
      }
      type TypeReference2 = Record<MixedPropertyTypes, number>;

      const expectedProperties: string[] = ['6'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
    });

    it('should exclude string literal properties when literal property names are mixed with string type', () => {
      type MixedPropertyTypes = LiteralPropertyNames | string;
      type TypeReference1 = {
        [key in MixedPropertyTypes]: string;
      }
      type TypeReference2 = Record<MixedPropertyTypes, number>;

      const expectedProperties: string[] = ['6'];
      expectPropertiesMatch(propertiesOf<TypeReference1>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<TypeReference2>(), expectedProperties);
    });

    it('should exclude all literal properties when literal property names are mixed with string and number type', () => {
      type MixedPropertyTypes = LiteralPropertyNames | string | number;
      type TypeReference1 = {
        [key in MixedPropertyTypes]: string;
      }
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
  });
});
