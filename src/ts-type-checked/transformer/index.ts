import { TransformerOptions, defaultTransformerOptions } from './options';
import { createLogger } from './logger';
import { createTypeChecker } from './checker/checker';
import { createTypeDescriber } from './descriptor/createTypeDescriber';
import { createValueCheckFunction } from './checker/utils';
import { getPossibleValues, getPublicProperties } from './utils';
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
export default (
  program: ts.Program,
  options: Partial<TransformerOptions> = {},
): ts.TransformerFactory<ts.SourceFile> => {
  const resolvedOptions: TransformerOptions = { ...defaultTransformerOptions, ...options };

  return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
    // Make the logger silent unless options.debug is true
    const logger = createLogger(resolvedOptions.logLevel, `[${file.fileName}]`);

    // Get a reference to a TypeScript TypeChecker in order to resolve types from type nodes
    const typeChecker = program.getTypeChecker();
    const typeCheckMapIdentifier: ts.Identifier = ts.createIdentifier('__isA');
    const [typeDescriber, typeDescriptorMap] = createTypeDescriber(logger.indent(), program, typeChecker);
    const [typeCheckCreator, typeCheckMapCreator] = createTypeChecker(typeCheckMapIdentifier, typeDescriptorMap);

    const typeCheckExpressionCreator = (typeNode: ts.TypeNode, value: ts.Expression): ts.Expression => {
      logger.debug('Processing', typeNode.getFullText());

      const type = typeChecker.getTypeFromTypeNode(typeNode);
      const typeDescriptorName = typeDescriber(typeNode, type);

      return typeCheckCreator(typeDescriptorName, value);
    };

    // First transform the file
    const transformedFile = visitNodeAndChildren(file, program, context, (node: ts.Node) => {
      // All the imports from ts-reflection are fake so we need to remove them all
      if (isOurImportExpression(node)) return undefined;

      if (isOurCallExpression(node, 'isA', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('isA<T>() requires one type parameter, none specified');
        }

        const valueNode = node.arguments[0];
        if (!valueNode) {
          throw new Error('isA<T>() requires one argument, none specified');
        }

        return typeCheckExpressionCreator(typeNode, valueNode);
      }

      if (isOurCallExpression(node, 'typeCheckFor', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('typeCheckFor<T>() requires one type parameter, none specified');
        }

        return createValueCheckFunction((value) => typeCheckExpressionCreator(typeNode, value));
      }

      if (isOurCallExpression(node, 'propertiesOf', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('propertiesOf<T>() requires one type parameter, none specified');
        }

        return ts.createArrayLiteral(getPublicProperties(typeChecker, typeNode));
      }

      if (isOurCallExpression(node, 'valuesOf', typeChecker)) {
        const typeNode = node.typeArguments?.[0];
        if (!typeNode) {
          throw new Error('valuesOf<T>() requires one type parameter, none specified');
        }

        return ts.createArrayLiteral(getPossibleValues(typeChecker, typeNode));
      }

      return node;
    });

    return ts.updateSourceFileNode(transformedFile, [typeCheckMapCreator(), ...transformedFile.statements]);
  };
};
