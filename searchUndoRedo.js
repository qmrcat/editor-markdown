// searchReplace.js - Sistema de buscar i substituir
class SearchReplace {
    constructor(editor) {
        this.editor = editor;
        this.searchPanel = null;
        this.currentMatches = [];
        this.currentMatchIndex = -1;
        this.isVisible = false;
    }

    init() {
        this.createSearchPanel();
        this.addEventListeners();
    }

    createSearchPanel() {
        const panel = document.createElement('div');
        panel.id = 'searchPanel';
        panel.className = 'search-panel hidden fixed top-20 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-40 p-4 w-80';
        
        panel.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">Buscar i substituir</h3>
                <button id="closeSearchPanel" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-3">
                <div>
                    <input type="text" id="searchInput" placeholder="Buscar..." 
                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <div class="flex items-center justify-between mt-1">
                        <span id="searchResults" class="text-xs text-gray-500 dark:text-gray-400"></span>
                        <div class="flex gap-1">
                            <button id="prevMatch" class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50" disabled>↑</button>
                            <button id="nextMatch" class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50" disabled>↓</button>
                        </div>
                    </div>
                </div>
                
                <div>
                    <input type="text" id="replaceInput" placeholder="Substituir per..." 
                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                </div>
                
                <div class="flex gap-2">
                    <button id="replaceButton" class="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled>Substituir</button>
                    <button id="replaceAllButton" class="flex-1 px-3 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50" disabled>Tot</button>
                </div>
                
                <div class="flex items-center gap-3 text-xs">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" id="caseSensitive" class="mr-1 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                        <span class="text-gray-700 dark:text-gray-300">Aa</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" id="wholeWord" class="mr-1 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                        <span class="text-gray-700 dark:text-gray-300">Paraula sencera</span>
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.searchPanel = panel;
    }

    addEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const replaceInput = document.getElementById('replaceInput');
        const closeBtn = document.getElementById('closeSearchPanel');
        const prevBtn = document.getElementById('prevMatch');
        const nextBtn = document.getElementById('nextMatch');
        const replaceBtn = document.getElementById('replaceButton');
        const replaceAllBtn = document.getElementById('replaceAllButton');
        const caseSensitive = document.getElementById('caseSensitive');
        const wholeWord = document.getElementById('wholeWord');

        searchInput.addEventListener('input', () => this.search());
        caseSensitive.addEventListener('change', () => this.search());
        wholeWord.addEventListener('change', () => this.search());
        
        closeBtn.addEventListener('click', () => this.hide());
        prevBtn.addEventListener('click', () => this.previousMatch());
        nextBtn.addEventListener('click', () => this.nextMatch());
        replaceBtn.addEventListener('click', () => this.replaceCurrent());
        replaceAllBtn.addEventListener('click', () => this.replaceAll());

        // Dreceres de teclat dins del panel
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.previousMatch();
                } else {
                    this.nextMatch();
                }
            } else if (e.key === 'Escape') {
                this.hide();
            }
        });

        replaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.replaceCurrent();
            } else if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    show() {
        this.searchPanel.classList.remove('hidden');
        this.isVisible = true;
        document.getElementById('searchInput').focus();
        document.getElementById('searchInput').select();
    }

    hide() {
        this.searchPanel.classList.add('hidden');
        this.isVisible = false;
        this.clearHighlights();
        this.editor.focus();
    }

    search() {
        const searchTerm = document.getElementById('searchInput').value;
        const caseSensitive = document.getElementById('caseSensitive').checked;
        const wholeWord = document.getElementById('wholeWord').checked;
        
        this.clearHighlights();
        
        if (!searchTerm) {
            this.updateResults(0, 0);
            return;
        }

        this.currentMatches = this.findMatches(searchTerm, caseSensitive, wholeWord);
        this.updateResults(this.currentMatches.length, 0);
        
        if (this.currentMatches.length > 0) {
            this.currentMatchIndex = 0;
            this.highlightMatches();
            this.scrollToMatch(0);
        }
    }

    findMatches(searchTerm, caseSensitive, wholeWord) {
        const content = this.editor.value;
        const matches = [];
        
        let flags = 'g';
        if (!caseSensitive) flags += 'i';
        
        let pattern = searchTerm;
        if (wholeWord) {
            pattern = `\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
        } else {
            pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        
        const regex = new RegExp(pattern, flags);
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
            });
        }
        
        return matches;
    }

    highlightMatches() {
        // Aquesta funció es pot millorar amb overlay visual
        // Per ara només actualitzem la selecció actual
        if (this.currentMatches.length > 0 && this.currentMatchIndex >= 0) {
            const match = this.currentMatches[this.currentMatchIndex];
            this.editor.setSelectionRange(match.start, match.end);
        }
    }

    scrollToMatch(index) {
        if (index >= 0 && index < this.currentMatches.length) {
            const match = this.currentMatches[index];
            this.editor.setSelectionRange(match.start, match.end);
            this.editor.focus();
            
            // Scroll per assegurar que la selecció és visible
            const lineHeight = 20; // Aproximat
            const textarea = this.editor;
            const textBeforeMatch = textarea.value.substring(0, match.start);
            const lines = textBeforeMatch.split('\n').length - 1;
            const scrollTop = lines * lineHeight - textarea.clientHeight / 2;
            textarea.scrollTop = Math.max(0, scrollTop);
        }
    }

    nextMatch() {
        if (this.currentMatches.length === 0) return;
        
        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.currentMatches.length;
        this.scrollToMatch(this.currentMatchIndex);
        this.updateResults(this.currentMatches.length, this.currentMatchIndex + 1);
    }

    previousMatch() {
        if (this.currentMatches.length === 0) return;
        
        this.currentMatchIndex = this.currentMatchIndex <= 0 ? 
            this.currentMatches.length - 1 : this.currentMatchIndex - 1;
        this.scrollToMatch(this.currentMatchIndex);
        this.updateResults(this.currentMatches.length, this.currentMatchIndex + 1);
    }

    replaceCurrent() {
        if (this.currentMatchIndex < 0 || this.currentMatchIndex >= this.currentMatches.length) return;
        
        const replaceText = document.getElementById('replaceInput').value;
        const match = this.currentMatches[this.currentMatchIndex];
        
        // Guardar estat per undo
        undoRedoManager.saveState();
        
        const content = this.editor.value;
        const newContent = content.substring(0, match.start) + replaceText + content.substring(match.end);
        
        this.editor.value = newContent;
        updatePreview();
        
        // Actualitzar posició del cursor
        this.editor.setSelectionRange(match.start + replaceText.length, match.start + replaceText.length);
        
        // Actualitzar cerca
        setTimeout(() => this.search(), 10);
    }

    replaceAll() {
        if (this.currentMatches.length === 0) return;
        
        const replaceText = document.getElementById('replaceInput').value;
        
        // Guardar estat per undo
        undoRedoManager.saveState();
        
        let content = this.editor.value;
        let offset = 0;
        
        for (const match of this.currentMatches) {
            const adjustedStart = match.start + offset;
            const adjustedEnd = match.end + offset;
            
            content = content.substring(0, adjustedStart) + replaceText + content.substring(adjustedEnd);
            offset += replaceText.length - (match.end - match.start);
        }
        
        this.editor.value = content;
        updatePreview();
        
        // Actualitzar cerca
        setTimeout(() => this.search(), 10);
        
        showAlert(`S'han substituït ${this.currentMatches.length} coincidències.`, 'success');
    }

    updateResults(total, current) {
        const resultsSpan = document.getElementById('searchResults');
        const prevBtn = document.getElementById('prevMatch');
        const nextBtn = document.getElementById('nextMatch');
        const replaceBtn = document.getElementById('replaceButton');
        const replaceAllBtn = document.getElementById('replaceAllButton');
        
        if (total === 0) {
            resultsSpan.textContent = 'Cap coincidència';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            replaceBtn.disabled = true;
            replaceAllBtn.disabled = true;
        } else {
            resultsSpan.textContent = `${current} de ${total}`;
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            replaceBtn.disabled = false;
            replaceAllBtn.disabled = false;
        }
    }

    clearHighlights() {
        // Netejar highlights visuals si n'hi ha
        this.currentMatches = [];
        this.currentMatchIndex = -1;
    }
}

// undoRedo.js - Sistema de desfer i refer
class UndoRedoManager {
    constructor(editor) {
        this.editor = editor;
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = 50;
        this.isRedoing = false;
        this.isUndoing = false;
        this.lastSaveTime = 0;
        this.saveDelay = 1000; // 1 segon entre guardats automàtics
    }

    init() {
        this.saveState(); // Estat inicial
        this.addEventListeners();
    }

    addEventListeners() {
        // Guardar estat en canvis significatius
        this.editor.addEventListener('input', () => {
            if (!this.isUndoing && !this.isRedoing) {
                // Debounce per evitar massa entrades
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    this.saveState();
                }, 500);
            }
        });

        // Guardar en moments clau
        this.editor.addEventListener('paste', () => {
            setTimeout(() => this.saveState(), 10);
        });
    }

    saveState() {
        if (this.isUndoing || this.isRedoing) return;
        
        const currentTime = Date.now();
        if (currentTime - this.lastSaveTime < this.saveDelay && this.history.length > 0) {
            // Massa aviat, substituir l'últim estat
            this.history[this.currentIndex] = {
                content: this.editor.value,
                selectionStart: this.editor.selectionStart,
                selectionEnd: this.editor.selectionEnd,
                timestamp: currentTime
            };
            return;
        }

        const state = {
            content: this.editor.value,
            selectionStart: this.editor.selectionStart,
            selectionEnd: this.editor.selectionEnd,
            timestamp: currentTime
        };

        // Si no estem al final de l'historial, eliminar els estats posteriors
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        this.history.push(state);
        this.currentIndex++;

        // Limitar mida de l'historial
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }

        this.lastSaveTime = currentTime;
        this.updateUndoRedoButtons();
    }

    undo() {
        if (!this.canUndo()) return false;
        
        this.isUndoing = true;
        this.currentIndex--;
        
        const state = this.history[this.currentIndex];
        this.editor.value = state.content;
        this.editor.setSelectionRange(state.selectionStart, state.selectionEnd);
        
        updatePreview();
        this.updateUndoRedoButtons();
        
        setTimeout(() => {
            this.isUndoing = false;
        }, 10);
        
        return true;
    }

    redo() {
        if (!this.canRedo()) return false;
        
        this.isRedoing = true;
        this.currentIndex++;
        
        const state = this.history[this.currentIndex];
        this.editor.value = state.content;
        this.editor.setSelectionRange(state.selectionStart, state.selectionEnd);
        
        updatePreview();
        this.updateUndoRedoButtons();
        
        setTimeout(() => {
            this.isRedoing = false;
        }, 10);
        
        return true;
    }

    canUndo() {
        return this.currentIndex > 0;
    }

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoButton');
        const redoBtn = document.getElementById('redoButton');
        
        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
            if (!this.canUndo()) {
                undoBtn.classList.add('opacity-50', 'cursor-not-allowed');
                undoBtn.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-700');
            } else {
                undoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                undoBtn.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-700');
            }
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
            if (!this.canRedo()) {
                redoBtn.classList.add('opacity-50', 'cursor-not-allowed');
                redoBtn.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-700');
            } else {
                redoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                redoBtn.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-700');
            }
        }
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.saveState(); // Nou estat inicial
    }
}

// Instàncies globals
let searchReplace;
let undoRedoManager;

// Funcions d'inicialització
function initializeSearchReplace() {
    const editor = document.getElementById('editor');
    searchReplace = new SearchReplace(editor);
    searchReplace.init();
}

function initializeUndoRedo() {
    const editor = document.getElementById('editor');
    undoRedoManager = new UndoRedoManager(editor);
    undoRedoManager.init();
}

// Funcions públiques per als botons
function showSearchReplace() {
    if (!searchReplace) initializeSearchReplace();
    searchReplace.show();
}

function undo() {
    if (!undoRedoManager) initializeUndoRedo();
    const success = undoRedoManager.undo();
    if (!success) {
        showAlert('No hi ha res a desfer.', 'info');
    }
}

function redo() {
    if (!undoRedoManager) initializeUndoRedo();
    const success = undoRedoManager.redo();
    if (!success) {
        showAlert('No hi ha res a refer.', 'info');
    }
}

// Dreceres de teclat globals
function addSearchUndoKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+F per buscar
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            showSearchReplace();
        }
        // Ctrl+H per buscar i substituir
        else if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            showSearchReplace();
            setTimeout(() => {
                document.getElementById('replaceInput').focus();
            }, 100);
        }
        // Ctrl+Z per desfer
        else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        // Ctrl+Y o Ctrl+Shift+Z per refer
        else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            redo();
        }
    });
}