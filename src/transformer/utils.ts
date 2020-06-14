import ts from 'typescript';

/**
 * Helper debugging function that takes a type as a parameter and returns
 * a human-readable list of its flags
 *
 * @param type {ts.Type}
 *
 * @returns {String[]} Array of type flags names
 */
export const typeFlags = (type: ts.Type): string[] => {
  return Object.keys(ts.TypeFlags).filter((flagName) => !!((ts.TypeFlags[flagName as any] as any) & type.flags));
};

/**
 * Helper debugging function that takes a type as a parameter and returns
 * a human-readable list of its object flags (if it has any)
 *
 * @param type {ts.Type}
 *
 * @returns {String[]} Array of object flags names
 */
export const objectFlags = (type: ts.Type): string[] => {
  const objectFlags = (type as ts.TypeReference).objectFlags;
  if (typeof objectFlags !== 'number') return [];

  return Object.keys(ts.ObjectFlags).filter((flagName) => !!((ts.ObjectFlags[flagName as any] as any) & objectFlags));
};

/**
 * Helper debugging function that takes a Symbol as a parameter and returns
 * a human-readable list of its flags
 *
 * @param type {ts.Symbol}
 *
 * @returns {String[]} Array of symbol flags names
 */
export const getSymbolFlags = (symbol: ts.Symbol): string[] => {
  return Object.keys(ts.SymbolFlags).filter((flagName) => !!((ts.SymbolFlags[flagName as any] as any) & symbol.flags));
};

/**
 * Helper function that checkes whether the array of modifiers
 * contains "private" or "protected" keywords.
 *
 * @param modifiers {ts.ModifiersArray} [undefined] The array of modifiers
 */
const hasPrivateOrProtectedModifiers = (modifiers?: ts.ModifiersArray): boolean =>
  !!modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
  );

/**
 * Helper function that checks whether a property represented by a Symbol
 * is publicly visible, i.e. it does not have "private" or "protected" modifier
 *
 * @param property {ts.Symbol} Property symbol
 */
export const isPublicProperty = (property: ts.Symbol): boolean => {
  const declaration = property.valueDeclaration;
  if (!declaration) {
    // TODO This is just a "guess", maybe the missing declaration can mean a private/protected property
    return true;
  }

  if (
    ts.isPropertySignature(declaration) ||
    ts.isPropertyDeclaration(declaration) ||
    ts.isMethodDeclaration(declaration) ||
    ts.isMethodSignature(declaration) ||
    ts.isParameter(declaration) ||
    ts.isGetAccessor(declaration)
  )
    return !hasPrivateOrProtectedModifiers(declaration.modifiers);

  return false;
};

export const getPropertyAccessor = (property: ts.Symbol): ts.Expression => {
  const declaration = property.valueDeclaration;
  if (!declaration) return ts.createStringLiteral(property.name);

  if (
    ts.isPropertySignature(declaration) ||
    ts.isPropertyDeclaration(declaration) ||
    ts.isMethodDeclaration(declaration) ||
    ts.isMethodSignature(declaration)
  ) {
    if (ts.isComputedPropertyName(declaration.name)) return declaration.name.expression;
  }

  return ts.createStringLiteral(property.name);
};

export const publicProperties = (type: ts.Type): ts.Expression => {
  return ts.createArrayLiteral(type.getApparentProperties().filter(isPublicProperty).map(getPropertyAccessor));
};
