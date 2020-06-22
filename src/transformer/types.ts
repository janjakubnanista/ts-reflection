import ts from 'typescript';

/**
 * TypeScript AST visitor that transforms the tree on a per-node basis.
 *
 * It can either return the original node, return a completely different node
 * or return undefined if the original node needs to be removed from the tree.
 */
export type ASTVisitor = (node: ts.Node) => ts.Node | undefined;

/**
 * Helper type for functions that accept an Expression and return a different expression
 */
export type ExpressionTransformer = (value: ts.Expression) => ts.Expression;
