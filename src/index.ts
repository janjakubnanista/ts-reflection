import { PropertyOf, PropertyQuery } from './types';

// Here the project needs to declare the fictional exports
export declare function generatedFunction(): void;

/**
 * Returns and array of property names for a given interface / type.
 *
 * @example
 * ```
 * interface MyInterface {
 *    name: string;
 *    age: number;
 * }
 *
 * const propertiesOfMyInterface = propertiesOf<MyInterface>();
 * console.log(propertiesOfMyInterface); // ['name', 'age'];
 * ```
 *
 * @function
 * @template T Interface/type to get properties of
 * @param type {PropertyType} The types of properties to get
 * @return {String[]} An array of property names of a given interface / type
 */
export declare function propertiesOf<T>(...queries: PropertyQuery[]): PropertyOf<T>[];

/**
 * Returns an array of possible literal values of type T, most commonly a union or an enum
 *
 * @example
 * ```
 * type ButtonType = "primary" | "secondary" | "error" | "link";
 *
 * // allButtonTypes will be an array of all the ButtonType values, i.e. ["primary" | "secondary" | "error" | "link"]
 * const buttonTypes = valuesOf<ButtonType>();
 * ```
 *
 * Types that have unlimited amount of values will not be present in the array, for example:
 *
 * @example
 * ```
 * type Union = 6 | "message" | boolean | number | string | symbol;
 *
 * // unionValues will only contain [6, "message", true, false]
 * // since number, string and symbol can have infinite amount of possible values
 * const unionValues = valuesOf<Union>();
 * ```
 *
 * @template T
 * @return {T[]} Array of possible literal values of type T
 */
export declare function valuesOf<T>(): T[];

// If someone forgets to register ts-reflection/transformer then tsc
// is going to actually import this file which will throw this error
// for easier problem solving
throw new Error(
  'It looks like you have forgotten to register the transform for ts-reflection!\n\nPlease look at the installation guide to see how to do that for your project:\n\nhttps://www.npmjs.com/package/ts-reflection#installation',
);
