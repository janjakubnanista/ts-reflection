import { visitEachChild } from 'typescript';
import ts from 'typescript';

type Visitor = (node: ts.Node) => ts.Node | undefined;

function visitNode(node: ts.SourceFile, program: ts.Program, visitor: Visitor): ts.SourceFile;
function visitNode(node: ts.Node, program: ts.Program, visitor: Visitor): ts.Node | undefined;
function visitNode(node: ts.Node, program: ts.Program, visitor: Visitor): ts.Node | undefined {
  if (ts.isSourceFile(node)) return node;

  return visitor(node);
}

export function visitNodeAndChildren(
  node: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  visitor: Visitor,
): ts.SourceFile;
export function visitNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
  visitor: Visitor,
): ts.Node | undefined;
export function visitNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
  visitor: Visitor,
): ts.Node | undefined {
  return visitEachChild(
    visitNode(node, program, visitor),
    (childNode) => visitNodeAndChildren(childNode, program, context, visitor),
    context,
  );
}
