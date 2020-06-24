import ts from 'typescript';

export const createVariable = (identifier: ts.Identifier, initializer: ts.Expression): ts.Statement =>
  ts.createVariableStatement(undefined, [ts.createVariableDeclaration(identifier, undefined, initializer)]);

export const createRequire = (identifier: ts.Identifier, path: string, property = 'default'): ts.Statement =>
  createVariable(
    identifier,
    ts.createPropertyAccess(
      ts.createCall(ts.createIdentifier('require'), undefined, [ts.createLiteral(path)]),
      property,
    ),
  );
