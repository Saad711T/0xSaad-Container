const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

function activate(context) {
    let openCmd = vscode.commands.registerCommand("mathboard.open", () => {
        openWhiteboard(context);
    });

    context.subscriptions.push(openCmd);
}

function openWhiteboard(context) {
    const panel = vscode.window.createWebviewPanel(
        "mathboard",
        "MathBoard",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const htmlPath = path.join(context.extensionPath, "media", "board.html");
    let html = fs.readFileSync(htmlPath, "utf8");

    panel.webview.html = html;
}

exports.activate = activate;
