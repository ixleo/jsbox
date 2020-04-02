// import {liftOff} from '../../js/grammars/configure-tokenizer';

// import html from './html';
// import javascript from './javascript';
// import 'monaco-editor/min/vs/loader';
// import 'monaco-editor/esm/vs/nls';
// import * as Monaco from 'monaco-editor/esm/vs/editor/editor.main';

// import 'monaco-editor/esm/vs/language/typescript/tsMode';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript';
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript';

export const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
};

export const LANG = {
    'JAVASCRIPT': 'javascript', 'HTML': 'html', 'CSS': 'css', 'JSON': 'json', 'TYPESCRIPT': 'typescript',
    'PYTHON': 'python', 'C++': 'cpp', 'C': 'c', 'C#': 'csharp', 'JAVA': 'java', 'GO': 'go', 'MARKDOWN': 'markdown',
    'SQL': 'sql', 'OBJECTIVE-C': 'objective-c', 'SWIFT': 'swift', 'KOTLIN': 'kotlin', 'PHP': 'php',
    'LESS': 'less', 'SCSS': 'scss', 'COFFEESCRIPT': 'coffeescript', 'MYSQL': 'mysql', 'XML': 'xml',
    'PASCAL': 'pascal', 'PERL': 'perl', 'LUA': 'lua', 'R': 'r', 'REDIS': 'redis', 'RUBY': 'ruby',
    'RUST': 'rust', 'SHELL': 'shell', 'POWERSHELL': 'powershell', 'YAML': 'yaml', 'DOCKERFILE': 'dockerfile',
    'GRAPHQL': 'graphql', 'HANDLEBARS': 'handlebars', 'BAT': 'bat', 'CLOJURE': 'clojure',
    'PLAINTEXT': 'plaintext', 'PUG': 'pug'
};

export const DEFAULT_FONT_SIZE = 14;
const MAX_FONT_SIZE = 20;
const MIN_FONT_SIZE = 10;
let Monaco = null;

export function loadMonaco () {
    let timer = null;
    return new Promise((resolve) => {
        if (window.monaco) {
            resolve(window.monaco);
        } else {
            timer = setInterval(() => {
                if (window.monaco) {
                    resolve(window.monaco);
                    clearInterval(timer);
                }
            }, 200);
        }
    });
}

function initMonaco () {
    if (Monaco === null) {
        Monaco = window.monaco;
        // liftOff(Monaco);
        // Monaco.languages.register({id: 'jx-js'});
        // Monaco.languages.setMonarchTokensProvider('jx-js', javascript);
        // Monaco.languages.register({id: 'jx-html'});
        // Monaco.languages.setMonarchTokensProvider('jx-html', html);
        window.monaco.editor.defineTheme('vsc-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                {token: 'keyword1', foreground: '569cd6'},
                {token: 'keyword2', foreground: 'c586c0'},
                {token: 'keyword3', foreground: '3ac9b0'},
                {token: 'identifier', foreground: '9cdcfe'},
                {token: 'function', foreground: 'dcdcaa'}
            ]
        });
        window.monaco.editor.defineTheme('vsc-light', {
            base: 'vs',
            inherit: true,
            rules: [
                {token: 'keyword1', foreground: '0000ff'},
                {token: 'keyword2', foreground: 'af00db'},
                {token: 'keyword3', foreground: '267f99'},
                {token: 'identifier', foreground: '001090'},
                {token: 'function', foreground: 'b27878'}
            ]
        });
    }
}
export class Editor {
    constructor ({
        el,
        code = '',
        diffCode = '',
        lang = LANG.JAVASCRIPT,
        theme = THEME.LIGHT,
        fontSize = DEFAULT_FONT_SIZE,
        onchange = null
    }) {
        initMonaco();
        this.onchange = onchange;
        this.fontSize = fontSize;
        this.lang = lang;
        this.el = (typeof el === 'string') ? document.querySelector(el) : el;
        if (diffCode) {
            this.type = 'diff-editor';
            this.diffCode = diffCode;
        } else {
            this.type = 'editor';
        }
        this._initEditor(code);
        if (theme !== THEME.LIGHT) {
            this.changeTheme(theme);
        } else {
            Editor.theme = THEME.LIGHT;
        }
        window.editor = this.editor;
    }
    _initEditor (code) {
        code = typeof code === 'string' ? code : this.code();
        if (this.editor)
            this.editor.dispose();
        if (this.type === 'diff-editor') {
            this.editor = Monaco.editor.createDiffEditor(this.el, {
                enableSplitViewResizing: false,
                fontSize: this.fontSize
            });
            this.changeLang(this.lang, code);
        } else {
            this.editor = Monaco.editor.create(this.el, {
                model: null,
                fontSize: this.fontSize
            });
            this.changeLang(this.lang, code);
        }
        if (this.onchange) {
            this.editor.onDidChangeModelContent(() => {
                this.onchange();
            });
        }
    }
    setFontSize (size) {
        if (size > MAX_FONT_SIZE || size < MIN_FONT_SIZE) {
            return false;
        }
        this.fontSize = size;
        this._initEditor();
        return true;
    }
    fontSizeUp () {
        return this.setFontSize(this.fontSize + 1);
    }
    fontSizeDown () {
        return this.setFontSize(this.fontSize - 1);
    }
    changeLang (lang, code) {
        code = code || this.code();
        let oldModel = this.editor.getModel();
        this.lang = lang;
        if (this.type === 'editor') {
            let newModel = Monaco.editor.createModel(code, lang);
            this.editor.setModel(newModel);
            if (oldModel) {
                oldModel.dispose();
            }
        } else {
            let original = Monaco.editor.createModel(this.diffCode, lang);
            let modified = Monaco.editor.createModel(code, lang);
            this.editor.setModel({
                original,
                modified
            });
            if (oldModel) {
                if (oldModel.original) {oldModel.original.dispose();}
                if (oldModel.modified) {oldModel.modified.dispose();}
            }
        }
    }
    changeTheme (theme) {
        Editor.theme = theme;
        Monaco.editor.setTheme((theme === THEME.DARK ? 'vsc-dark' : 'vsc-light' ));
        return theme;
    }
    toggleTheme () {
        return this.changeTheme((Editor.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK ));
    }
    destroy () {
        if (this.editor.getModel()) {
            this.editor.getModel().dispose();
        }
        this.editor.dispose();
        this.editor = null;
    }
    code (v) {
        if (v) {
            this.editor.setValue(v);
            return this;
        } else {
            return this.editor.getValue();
        }
    }
    resize () {
        if (this.editor)
            this.editor.layout();
    }
}