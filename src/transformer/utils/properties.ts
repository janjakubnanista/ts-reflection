import { PropertyDescriptor } from '../types';
import { PropertyFlag } from '../../types';
import { getPropertyAccessor } from '../utils/ast';
import ts from 'typescript';

const getPropertyFlags = (property: ts.Symbol): PropertyFlag => {
  let flags: PropertyFlag = 0;

  const declaration = property.valueDeclaration;
  if (
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration) ||
      ts.isMethodDeclaration(declaration) ||
      ts.isMethodSignature(declaration) ||
      ts.isParameter(declaration) ||
      ts.isGetAccessor(declaration) ||
      ts.isSetAccessor(declaration))
  ) {
    flags = flags | (declaration.questionToken ? PropertyFlag.OPTIONAL : 0);

    declaration.modifiers?.forEach((modifier) => {
      switch (modifier.kind) {
        case ts.SyntaxKind.PrivateKeyword:
          flags = flags | PropertyFlag.PRIVATE;
          break;

        case ts.SyntaxKind.ProtectedKeyword:
          flags = flags | PropertyFlag.PROTECTED;
          break;

        case ts.SyntaxKind.PublicKeyword:
          flags = flags | PropertyFlag.PUBLIC;
          break;

        case ts.SyntaxKind.ReadonlyKeyword:
          flags = flags | PropertyFlag.READONLY;
          break;
      }
    });
  }

  if (!(flags & PropertyFlag.PRIVATE) && !(flags & PropertyFlag.PROTECTED)) {
    flags = flags | PropertyFlag.PUBLIC;
  }

  return flags;
};

const getEnumMembers = (declaration: ts.EnumDeclaration): PropertyDescriptor[] => {
  return declaration.members.map((member: ts.EnumMember) => {
    if (member.name.kind === ts.SyntaxKind.PrivateIdentifier) throw new Error('Unexpected private identifier in enum');

    const name = ts.isComputedPropertyName(member.name) ? member.name.expression : ts.createLiteral(member.name);
    const flags = PropertyFlag.PUBLIC | PropertyFlag.READONLY;

    return { name, flags };
  });
};

export const getPropertyDescriptors = (
  typeChecker: ts.TypeChecker,
  scope: ts.TypeNode,
  type: ts.Type = typeChecker.getTypeFromTypeNode(scope),
): PropertyDescriptor[] => {
  const declaration = type.symbol.valueDeclaration;
  if (declaration && ts.isEnumDeclaration(declaration)) {
    return getEnumMembers(declaration);
  }

  return type.getApparentProperties().map((property: ts.Symbol) => {
    const flags = getPropertyFlags(property);
    const name = getPropertyAccessor(property, typeChecker, scope);

    return { flags, name };
  });
};

export const createPropertiesOf = (typeChecker: ts.TypeChecker, typeNode: ts.TypeNode): ts.Expression =>
  ts.createArrayLiteral(
    getPropertyDescriptors(typeChecker, typeNode).map(({ name, flags }) =>
      ts.createObjectLiteral([
        ts.createPropertyAssignment('name', name),
        ts.createPropertyAssignment('flags', ts.createLiteral(flags)),
      ]),
    ),
  );
