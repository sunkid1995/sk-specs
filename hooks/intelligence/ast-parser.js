import fs from 'fs';
import ts from 'typescript';

/**
 * Phân tích AST của một file nguồn TypeScript/JavaScript.
 * Trả về danh sách imports (đường dẫn thô) và exports (tên các symbol).
 */
export function parseFileAst(absolutePath) {
  let content;
  try {
    content = fs.readFileSync(absolutePath, 'utf8');
  } catch (e) {
    return { imports: [], exports: [] };
  }

  let sourceFile;
  try {
    sourceFile = ts.createSourceFile(absolutePath, content, ts.ScriptTarget.Latest, true);
  } catch (e) {
    return { imports: [], exports: [] };
  }

  const imports = [];
  const exports = [];

  function visit(node) {
    // 1. Import thông thường: import ... from '...'
    if (ts.isImportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
    }
    // 2. Dynamic import: import('...')
    else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) {
        imports.push(arg.text);
      }
    }
    // 3. Re-export hoặc Export từ nguồn khác: export { a } from '...' hoặc export * from '...'
    else if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
      if (node.exportClause) {
        if (ts.isNamedExports(node.exportClause)) {
          node.exportClause.elements.forEach(element => {
            const name = (element.propertyName || element.name).text;
            if (name) exports.push(name);
          });
        }
      }
    }
    // 4. Named exports từ class, function, interface, type, enum
    else if (
      ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node)
    ) {
      const hasExport = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (hasExport && node.name) {
        exports.push(node.name.text);
      }
    }
    // 5. Export từ biến statement: export const a = 1
    else if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (hasExport) {
        node.declarationList.declarations.forEach(decl => {
          if (ts.isIdentifier(decl.name)) {
            exports.push(decl.name.text);
          }
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { imports, exports };
}
