import ts from 'typescript';

export const isLiteral = (type: ts.Type): type is ts.LiteralType =>
  type.isLiteral() || !!(type.flags & ts.TypeFlags.BigIntLiteral);

export const isNull = (type: ts.Type): boolean => !!(type.flags & ts.TypeFlags.Null);

export const isUndefined = (type: ts.Type): boolean =>
  !!(type.flags & ts.TypeFlags.Undefined || type.flags & ts.TypeFlags.Void);

export const isAny = (type: ts.Type): boolean => !!(type.flags & ts.TypeFlags.Any || type.flags & ts.TypeFlags.Unknown);

export const isNever = (type: ts.Type): boolean => !!(type.flags & ts.TypeFlags.Never);

export const isObjectKeyword = (typeNode: ts.TypeNode | undefined): boolean =>
  typeNode?.kind === ts.SyntaxKind.ObjectKeyword;

export const isTrueKeyword = (typeNode: ts.TypeNode | undefined): boolean =>
  typeNode?.kind === ts.SyntaxKind.TrueKeyword;

export const isFalseKeyword = (typeNode: ts.TypeNode | undefined): boolean =>
  typeNode?.kind === ts.SyntaxKind.FalseKeyword;

export const isTuple = (type: ts.Type, typeNode: ts.TypeNode | undefined): type is ts.TupleType =>
  typeNode?.kind === ts.SyntaxKind.TupleType;
