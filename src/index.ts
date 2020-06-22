// Here the project needs to declare the fictional exports
export declare function generatedFunction(): void;

// If someone forgets to register [PROJECT NAME]/transformer then tsc
// is going to actually import this file which will throw this error
// for easier problem solving
throw new Error(
  'It looks like you have forgotten to register the transform for [PROJECT NAME]!\n\nPlease look at the installation guide to see how to do that for your project:\n\nhttps://www.npmjs.com/package/[PROJECT NAME]#installation',
);
