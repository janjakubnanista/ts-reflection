import ts from 'typescript';

/**
 * The main transformer function.
 *
 * This needs to be registered as a TypeScript "before" transform
 * in your build/test configuration.
 *
 * @param program {ts.Program} An instance of TypeScript Program
 */
export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
    // Here you need to apply the transformation to file

    return file;
  };
};
