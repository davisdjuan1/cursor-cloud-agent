/**
 * 在 Cursor/VS Code 中查看命令参数的实用工具
 * 
 * 方法1: 使用 TypeScript 类型定义查看
 * - 在代码中 Ctrl+Click (Cmd+Click) 命令名称，跳转到类型定义
 * - 查看 vscode.d.ts 中的命令签名
 * 
 * 方法2: 运行时获取命令信息
 * - 使用 executeCommand 的返回值推断参数类型
 * - 查看命令注册时的参数定义
 */

import * as vscode from 'vscode';

/**
 * 获取所有命令列表
 */
export async function getAllCommands(): Promise<string[]> {
    return await vscode.commands.getCommands();
}

/**
 * 尝试执行命令并捕获参数错误，从而推断参数类型
 * 注意：这个方法会尝试执行命令，可能触发副作用，请谨慎使用
 */
export async function inferCommandArgs(commandId: string): Promise<void> {
    try {
        // 尝试不带参数执行
        await vscode.commands.executeCommand(commandId);
        console.log(`命令 ${commandId} 可以不带参数执行`);
    } catch (error: any) {
        if (error.message) {
            console.log(`命令 ${commandId} 错误信息: ${error.message}`);
            // 错误信息通常会提示缺少什么参数
        }
    }
}

/**
 * 查看命令的类型定义（需要手动操作）
 * 1. 在代码中 Ctrl+Click (Cmd+Click) executeCommand
 * 2. 跳转到 vscode.d.ts 查看类型定义
 * 3. 或者使用 "Go to Definition" 功能
 */
export function viewCommandTypeDefinition() {
    // 示例：查看常见命令的参数
    const examples = {
        // 文件操作命令
        'vscode.open': (uri: vscode.Uri) => vscode.commands.executeCommand('vscode.open', uri),
        'vscode.openFolder': (uri: vscode.Uri) => vscode.commands.executeCommand('vscode.openFolder', uri),
        
        // 编辑器命令
        'vscode.executeFormatDocumentProvider': (uri: vscode.Uri, options: vscode.FormattingOptions) => 
            vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', uri, options),
        
        // 搜索命令
        'vscode.executeWorkspaceSymbolProvider': (query: string) => 
            vscode.commands.executeCommand('vscode.executeWorkspaceSymbolProvider', query),
    };
    
    return examples;
}

/**
 * 方法3: 使用 VS Code API 文档
 * 访问: https://code.visualstudio.com/api/references/vscode-api
 * 
 * 方法4: 查看命令的注册位置
 * - 在扩展的 package.json 中查看 contributes.commands
 * - 在代码中搜索 registerCommand 的调用
 */

/**
 * 实用工具：列出命令并尝试推断其参数
 */
export async function analyzeCommand(commandId: string): Promise<{
    exists: boolean;
    canExecuteWithoutArgs: boolean;
    errorMessage?: string;
}> {
    const allCommands = await vscode.commands.getCommands();
    const exists = allCommands.includes(commandId);
    
    if (!exists) {
        return { exists: false, canExecuteWithoutArgs: false };
    }
    
    try {
        await vscode.commands.executeCommand(commandId);
        return { exists: true, canExecuteWithoutArgs: true };
    } catch (error: any) {
        return {
            exists: true,
            canExecuteWithoutArgs: false,
            errorMessage: error.message
        };
    }
}

/**
 * 方法5: 使用 TypeScript 的智能提示
 * 在编写代码时，IDE 会自动提示命令的参数类型
 */
export function exampleWithTypeHint() {
    // 当你输入 executeCommand 时，IDE 会显示：
    // executeCommand<T = unknown>(command: string, ...rest: any[]): Thenable<T>
    
    // 对于已知的命令，可以通过类型断言来获得更好的类型提示
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('file:///path/to/file'));
    
    // 或者使用泛型来指定返回类型
    vscode.commands.executeCommand<vscode.Uri[]>('vscode.executeWorkspaceSymbolProvider', 'query');
}
