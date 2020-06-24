import ts from 'typescript';

const isLiteral = (type: ts.Type): type is ts.LiteralType =>
  type.isLiteral() || !!(type.flags & ts.TypeFlags.BigIntLiteral);

const isTrueKeyword = (typeNode: ts.TypeNode | undefined): boolean => typeNode?.kind === ts.SyntaxKind.TrueKeyword;

const isFalseKeyword = (typeNode: ts.TypeNode | undefined): boolean => typeNode?.kind === ts.SyntaxKind.FalseKeyword;

const isBoolean = (type: ts.Type): boolean => !!(type.flags & ts.TypeFlags.Boolean);

const isNull = (type: ts.Type): boolean => !!(type.flags & ts.TypeFlags.Null);

const isUndefined = (type: ts.Type): boolean =>
  !!(type.flags & ts.TypeFlags.Undefined || type.flags & ts.TypeFlags.Void);

export const getPossibleValues = (
  typeChecker: ts.TypeChecker,
  scope: ts.TypeNode,
  type: ts.Type = typeChecker.getTypeFromTypeNode(scope),
): ts.Expression[] => {
  // Literal types
  if (isLiteral(type)) {
    if (type.value === undefined) {
      const typeName = typeChecker.typeToString(type, scope);

      throw new Error('Could not find value for a literal type ' + typeName);
    }

    return [ts.createLiteral(type.value)];
  }

  // Null
  if (isNull(type)) return [ts.createNull()];

  // Boolean
  if (isBoolean(type)) return [ts.createTrue(), ts.createFalse()];

  // Undefined, Void
  if (isUndefined(type)) {
    return [ts.createIdentifier('undefined')];
  }

  // Union types
  if (type.isUnion()) {
    const possibleValues = new Set(
      type.types
        .map((unionType) => getPossibleValues(typeChecker, scope, unionType))
        .reduce((all, one) => [...all, ...one]),
    );

    return Array.from(possibleValues);
  }

  // true, false
  const typeNode = typeChecker.typeToTypeNode(type, scope);
  if (typeNode && isTrueKeyword(typeNode)) return [ts.createTrue()];
  if (typeNode && isFalseKeyword(typeNode)) return [ts.createFalse()];

  return [];
};

export const createValuesOf = (typeChecker: ts.TypeChecker, typeNode: ts.TypeNode): ts.Expression =>
  ts.createArrayLiteral(getPossibleValues(typeChecker, typeNode));
