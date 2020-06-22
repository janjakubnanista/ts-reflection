import { isLiteral, isNull, isUndefined } from './descriptor/assertions';
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
export const symbolFlags = (symbol: ts.Symbol): string[] => {
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

/**
 * Helper function that return property name as a ts.Expression.
 * It will make sure that is the property is a numeric literal,
 * it is returned as a number rather than a number-like string
 *
 * @param property {ts.Symbol} The property to get the name of
 * @param typeChecker {ts.TypeChecker} Instance of ts.TypeChecker
 * @param scope {ts.TypeNode} The root TypeNode that contained the type
 */
const getPropertyName = (property: ts.Symbol, typeChecker: ts.TypeChecker, scope: ts.TypeNode): ts.Expression => {
  // Let's get the property type
  const propertyType: ts.Type | undefined =
    // The nameType property is not documented but can serve as a good starting point,
    // saves one function call :)
    (property as any).nameType || typeChecker.getTypeOfSymbolAtLocation(property, scope);

  // If the property type exists and it looks like a number literal then let's turn it into a number
  if (propertyType && typeof propertyType.flags === 'number' && propertyType.flags & ts.TypeFlags.NumberLiteral) {
    const nameAsNumber = parseFloat(property.name);
    if (!isNaN(nameAsNumber) && String(nameAsNumber) === property.name) {
      return ts.createLiteral(nameAsNumber);
    }
  }

  return ts.createLiteral(property.name);
};

/**
 * Helper function that returns a property accessor - either a property name (e.g. 'name')
 * or a computed property expression (e.g. Symbol.toStringTag)
 *
 * @param property {ts.Symbol} The property to get the accessor of
 * @param typeChecker {ts.TypeChecker} Instance of ts.TypeChecker
 * @param scope {ts.TypeNode} The root TypeNode that contained the type
 */
export const getPropertyAccessor = (
  property: ts.Symbol,
  typeChecker: ts.TypeChecker,
  scope: ts.TypeNode,
): ts.Expression => {
  const declaration = property.valueDeclaration;
  if (
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration) ||
      ts.isMethodDeclaration(declaration) ||
      ts.isMethodSignature(declaration))
  ) {
    if (ts.isComputedPropertyName(declaration.name)) return declaration.name.expression;
  }

  return getPropertyName(property, typeChecker, scope);
};

const getEnumMembers = (declaration: ts.EnumDeclaration): ts.Expression[] => {
  return declaration.members.map((member: ts.EnumMember) => {
    if (ts.isComputedPropertyName(member.name)) return member.name.expression;
    if (member.name.kind === ts.SyntaxKind.PrivateIdentifier) throw new Error('Unexpected private identifier in enum');

    return ts.createLiteral(member.name);
  });
};

/**
 * Helper function that returns an array expression containing
 * all publicly available properties of the given type
 *
 * @param type {ts.Type} Type to get properties from
 */
export const getPublicProperties = (
  typeChecker: ts.TypeChecker,
  scope: ts.TypeNode,
  type: ts.Type = typeChecker.getTypeFromTypeNode(scope),
): ts.Expression[] => {
  const declaration = type.symbol.valueDeclaration;
  if (declaration && ts.isEnumDeclaration(declaration)) {
    return getEnumMembers(declaration);
  }

  return type
    .getApparentProperties()
    .filter(isPublicProperty)
    .map((property: ts.Symbol) => getPropertyAccessor(property, typeChecker, scope));
};

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

  // Undefined, Void
  if (isUndefined(type)) {
    return [ts.createIdentifier('undefined')];
  }

  // Union types
  if (type.isUnion()) {
    return type.types
      .map((unionType) => getPossibleValues(typeChecker, scope, unionType))
      .reduce((all, one) => [...all, ...one]);
  }

  return [];
};
