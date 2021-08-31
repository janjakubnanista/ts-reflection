import ts from 'typescript';

export const createVariable = (identifier: ts.Identifier, initializer: ts.Expression): ts.Statement =>
  ts.createVariableStatement(undefined, [ts.createVariableDeclaration(identifier, undefined, initializer)]);

export const createImportStatement = (namedImport: string, path: string): ts.Statement => {
  // from https://stackoverflow.com/questions/59693819/generate-import-statement-programmatically-using-typescript-compiler-api

  return ts.createImportDeclaration(
    /* decorators */ undefined,
    /* modifiers */ undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(namedImport))]),
    ),
    ts.createLiteral(path),
  );
};

export const createRequire = (identifier: ts.Identifier, path: string, property = 'default'): ts.Statement[] => [
  createVariable(
    identifier,
    ts.createPropertyAccess(
      ts.createCall(ts.createIdentifier('require'), undefined, [ts.createLiteral(path)]),
      property,
    ),
  ),
];

export const createImport = (identifier: ts.Identifier, path: string, property = 'default'): ts.Statement[] => [
  createImportStatement(property, path),
  ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(identifier, undefined, ts.createIdentifier(property))],
      ts.NodeFlags.None,
    ),
  ),
];
