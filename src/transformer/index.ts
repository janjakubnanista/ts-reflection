import { createPropertiesOf } from './utils/properties';
import { createRequire } from './utils/codeGenerators';
import { createValuesOf } from './utils/values';
import { isOurCallExpression, isOurImportExpression } from './visitor/assertions';
import { visitNodeAndChildren } from './visitor/visitNodeAndChildren';
import ts from 'typescript';

/**
 * The main transformer function.
 *
 * This needs to be registered as a TypeScript "before" transform
 * in your build/test configuration.
 *
 * See https://www.npmjs.com/package/ts-reflection#installation for more information
 *
 * @param program {ts.Program} An instance of TypeScript Program
 * @param options {Partial<TransformerOptions>} Transformer options object
 */
export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  // Get a reference to a TypeScript TypeChecker in order to resolve types from type nodes
  const typeChecker = program.getTypeChecker();

  return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
    const createPropertiesOfIdentifier = ts.createIdentifier('___getPropertyFilter___');
    const createPropertiesOfImport = createRequire(
      createPropertiesOfIdentifier,
      'ts-reflection/helpers/createPropertiesOf',
      'createPropertiesOf',
    );

    let needsFilterPropertiesImport = false;

    // First transform the file
    const transformedFile = visitNodeAndChildren(file, program, context, (node: ts.Node) => {
      // All the imports from ts-reflection are fake so we need to remove them all
      if (isOurImportExpression(node)) return undefined;

      if (isOurCallExpression(node, 'propertiesOf', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('propertiesOf<T>() requires one type parameter, none specified');
        }

        needsFilterPropertiesImport = true;

        const propertiesOfFunction = ts.createCall(createPropertiesOfIdentifier, undefined, [
          createPropertiesOf(typeChecker, typeNode),
        ]);

        return ts.createCall(propertiesOfFunction, undefined, node.arguments);
      }

      if (isOurCallExpression(node, 'valuesOf', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('valuesOf<T>() requires one type parameter, none specified');
        }

        return createValuesOf(typeChecker, typeNode);
      }

      return node;
    });

    if (needsFilterPropertiesImport) {
      return ts.updateSourceFileNode(transformedFile, [
        ...(needsFilterPropertiesImport ? [createPropertiesOfImport] : []),
        ...transformedFile.statements,
      ]);
    }

    return transformedFile;
  };
};
