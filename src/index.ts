// Here the project needs to declare the fictional exports
export declare function generatedFunction(): void;

export type NameOfPropertyOfType<T, C = unknown> = NonNullable<
  {
    [K in keyof T]: T[K] extends C ? K : never;
  }[keyof T]
>;

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
 * @return {String[]} An array of property names of a given interface / type
 */
export declare function propertiesOf<T>(): NameOfPropertyOfType<T>[];

/**
 * Returns an array of possible literal values of (a union) type T.
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
 * @example
 * ```
 * type ButtonType = "primary" | "secondary" | "error" | "link";
 *
 * // allButtonTypes will be an array of all the ButtonType values, i.e. ["primary" | "secondary" | "error" | "link"]
 * const allButtonTypes = valuesOf<ButtonType>();
 * ```
 *
 * @function
 * @template T
 * @return {T[]} Array of possible literal values of type T
 */
export declare function valuesOf<T extends string | number | boolean | bigint>(): T[];

// If someone forgets to register ts-reflection/transformer then tsc
// is going to actually import this file which will throw this error
// for easier problem solving
throw new Error(
  'It looks like you have forgotten to register the transform for ts-reflection!\n\nPlease look at the installation guide to see how to do that for your project:\n\nhttps://www.npmjs.com/package/ts-reflection#installation',
);
