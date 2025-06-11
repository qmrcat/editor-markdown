



        // Funcions del modal
        function showModal(content) {
            document.getElementById('modalContent').innerHTML = content;
            document.getElementById('modalOverlay').classList.remove('hidden');
        }

        function hideModal() {
            document.getElementById('modalOverlay').classList.add('hidden');
        }

        // Alternar vista prèvia
        function togglePreview() {
            const editorContainer = document.getElementById('editorContainer');
            const previewContainer = document.getElementById('previewContainer');
            const toggleText = document.getElementById('previewToggleText');
            const mainContent = document.getElementById('mainContent');
            const editor = document.getElementById('editor');
            
            previewVisible = !previewVisible;
            
            if (previewVisible) {
                // Mostrar vista prèvia
                previewContainer.classList.remove('hidden');
                toggleText.textContent = '👁️ Amagar vista';
                
                // Responsive: En mòbil (lg:) dividir verticalment, en desktop horitzontalment
                editorContainer.className = 'w-full lg:w-1/2 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 flex flex-col min-h-0';
                previewContainer.className = 'w-full lg:w-1/2 bg-white dark:bg-gray-800 transition-all duration-300 flex flex-col min-h-0';
                mainContent.className = 'flex flex-col lg:flex-row flex-1 overflow-hidden relative';
                editor.className = 'w-full flex-1 p-4 border-none outline-none resize-none editor-textarea min-h-[60vh] lg:min-h-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
            } else {
                // Amagar vista prèvia
                previewContainer.classList.add('hidden');
                toggleText.textContent = '👁️ Mostrar vista';
                
                // Editor a pantalla completa
                editorContainer.className = 'w-full bg-white dark:bg-gray-800 transition-all duration-300 flex flex-col min-h-0';
                mainContent.className = 'flex flex-1 overflow-hidden relative';
                editor.className = 'w-full flex-1 p-4 border-none outline-none resize-none editor-textarea bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
            }
        }



        // Funció per inserir imatges
async function insertImage() {
    try {
        // Demanar URL de la imatge
        const imageUrl = await showPrompt(
            'Introdueix l\'URL de la imatge:', 
            '', 
            'https://example.com/imatge.jpg'
        );
        
        if (!imageUrl) return; // L'usuari ha cancel·lat
        
        // Validar que sembli una URL vàlida
        if (!isValidUrl(imageUrl)) {
            await showAlert('L\'URL introduïda no sembla vàlida. Assegura\'t que comenci per http:// o https://', 'warning');
            return;
        }
        
        // Demanar descripció/text alternatiu
        const altText = await showPrompt(
            'Introdueix una descripció per la imatge (text alternatiu):', 
            '', 
            'Descripció de la imatge'
        );
        
        if (altText === null) return; // L'usuari ha cancel·lat
        
        // Crear la marca Markdown per la imatge
        const markdownImage = `![${altText || 'Imatge'}](${imageUrl})`;
        
        // Inserir al editor
        insertText(markdownImage);
        
        await showAlert('Imatge inserida correctament!', 'success');
        
    } catch (error) {
        await showAlert('Error en inserir la imatge: ' + error.message, 'error');
    }
}

// Funció auxiliar per validar URLs
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

        // Tancar modal fent clic fora
        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                resolveModal(null);
            }
        });

        // Tancar modal amb Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !document.getElementById('modalOverlay').classList.contains('hidden')) {
                resolveModal(null);
            }
        });

        // Configurar drag & drop
function setupDragAndDrop() {
    const editor = document.getElementById('editor');
    const dragOverlay = document.getElementById('dragOverlay');
    const mainContent = document.getElementById('mainContent');
    
    // Evitar el comportament per defecte del navegador
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        mainContent.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Mostrar overlay quan s'arrossega sobre l'àrea
    ['dragenter', 'dragover'].forEach(eventName => {
        mainContent.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        mainContent.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        if (!isDragging) {
            isDragging = true;
            dragOverlay.classList.remove('hidden');
        }
    }
    
    function unhighlight() {
        isDragging = false;
        dragOverlay.classList.add('hidden');
    }
    
    // Gestionar l'arxiu quan es deixa anar
    mainContent.addEventListener('drop', handleDrop, false);
    
    async function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            
            // Comprovar si és un fitxer de text vàlid
            if (file.type === 'text/markdown' || file.type === 'text/plain' || 
                file.name.endsWith('.md') || file.name.endsWith('.txt')) {
                
                // Comprovar si l'editor té contingut
                const currentContent = editor.value.trim();
                let shouldReplace = true;
                
                if (currentContent) {
                    shouldReplace = await showConfirm(
                        `L'editor ja té contingut. Vols substituir-lo pel contingut del fitxer "${file.name}"?<br><br>` +
                        '⚠️ <strong>Atenció:</strong> El contingut actual es perdrà si no l\'has desat.',
                        'Sí, substituir',
                        'Cancel·lar'
                    );
                }
                
                if (shouldReplace) {
                    const reader = new FileReader();
                    reader.onload = async function(e) {
                        editor.value = e.target.result;
                        updatePreview();
                        currentFileName = file.name;
                        await showAlert(`Fitxer "${file.name}" carregat correctament mitjançant drag & drop.`, 'success');
                    };
                    reader.onerror = async function() {
                        await showAlert('Error en llegir el fitxer.', 'error');
                    };
                    reader.readAsText(file);
                }
            } else {
                await showAlert(
                    'Tipus de fitxer no suportat.<br><br>' +
                    '📄 <strong>Formats acceptats:</strong> .md, .txt', 
                    'warning'
                );
            }
        }
    }
}






// Funció per convertir text amb emojis
function convertEmojis(text) {
    // Buscar totes les coincidències de :emoji_name:
    return text.replace(/:[\w+-]+:/g, function(match) {
        const emoji = emojiMap[match];
        return emoji || match; // Si no existeix l'emoji, mantenir el text original
    });
}

// Actualitzar la funció updatePreview per incloure conversió d'emojis
function updatePreview() {
    if (previewVisible) {
        const editorContent = document.getElementById('editor').value;
        const preview = document.getElementById('preview');
        
        // Primer processar el Markdown
        let htmlContent = marked.parse(editorContent);
        
        // Després convertir els emojis
        htmlContent = convertEmojis(htmlContent);
        
        preview.innerHTML = htmlContent;
    }
}
// Funció per inserir shortcode d'emoji
function insertEmojiShortcode(shortcode) {
    insertText(shortcode);
    // Forçar actualització de la vista prèvia
    setTimeout(updatePreview, 10);
}

// Funció alternativa per al dropdown que insereix shortcodes
function createEmojiShortcodeButton(emoji, shortcode, title) {
    return `<button onclick="insertEmojiShortcode('${shortcode}'); closeDropdown('emojiDropdown')" 
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg" 
                    title="${title} (${shortcode})">${emoji}</button>`;
}



        

        // Comprovar i gestionar documents d'exemple
        async function checkExampleDocuments() {
            const userPreference = localStorage.getItem('skipExampleDocs');
            
            if (userPreference === 'true') {
                // L'usuari ha dit que no vol exemples, deixar l'editor buit
                return;
            }
            
            const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
            const hasExistingDocs = Object.keys(savedDocs).length > 0;
            const editorHasContent = document.getElementById('editor').value.trim() !== '';
            
            if (!hasExistingDocs && !editorHasContent) {
                // Preguntar a l'usuari si vol documents d'exemple
                const wantsExamples = await showConfirm(
                    'Vols que afegim alguns documents d\'exemple per començar?<br><br>' +
                    '💡 Els documents d\'exemple t\'ajudaran a entendre com funciona l\'editor.',
                    'Sí, afegir exemples',
                    'No, començar buit'
                );
                
                if (wantsExamples) {
                    // Afegir documents d'exemple
                    addExampleDocuments();
                    // Carregar el primer document d'exemple
                    const exampleDoc = `# Benvingut a l'Editor de Markdown!

Aquest és un document d'exemple per mostrar-te les capacitats de l'editor.

## ✨ Característiques principals

- **Vista prèvia en temps real** mentre escrius
- **Barra d'eines completa** per a tots els elements Markdown
- **Emmagatzematge local** i exportació a fitxers
- **Disseny responsiu** que funciona en mòbils
- **Drag & Drop** per obrir fitxers fàcilment

## 🛠️ Elements que pots utilitzar

### Text amb format
Pots utilitzar **text en negreta**, *text en cursiva*, ~~text ratllat~~ i \`codi inline\`.

### Llistes
- Element 1
- Element 2
  - Sub-element
  - Un altre sub-element

### Llistes numeradas
1. Primer element
2. Segon element
3. Tercer element

### Llistes de tasques
- [x] Tasca completada
- [ ] Tasca pendent
- [ ] Una altra tasca

### Codi
\`\`\`javascript
function salutacio() {
    console.log("Hola, món!");
}
salutacio();
\`\`\`

### Taules
| Funcionalitat | Descripció | Estat |
|---------------|------------|-------|
| Editor | Escriptura de Markdown | ✅ |
| Vista prèvia | Renderització HTML | ✅ |
| Drag & Drop | Obrir fitxers | ✅ |

### Cites
> "La millor manera d'aprendre Markdown és practicant."
> 
> — Un usuari satisfet

### Enllaços
Pots crear [enllaços a webs externes](https://example.com) o referències internes.

---

## 🚀 Comença a editar!

Prova la barra d'eines de dalt, arrossega fitxers a l'editor, o simplement comença a escriure. 

**Consell:** Utilitza el botó 👁️ per amagar aquesta vista prèvia si necessites més espai.`;
                    
                    document.getElementById('editor').value = exampleDoc;
                    updatePreview();
                } else {
                    // L'usuari no vol exemples, recordar aquesta decisió
                    localStorage.setItem('skipExampleDocs', 'true');
                }
            }
        }

        // Afegir documents d'exemple al Local Storage
        function addExampleDocuments() {
            const exampleDocs = {
                'exemple-basic.md': {
                    content: '# Document d\'exemple\n\nAquest és un document d\'exemple per provar l\'editor.\n\n## Característiques\n\n- **Negreta** i *cursiva*\n- Llistes\n- [Enllaços](https://example.com)\n\n```javascript\n// Codi d\'exemple\nconsole.log("Hola món!");\n```',
                    lastModified: new Date().toISOString()
                },
                'notes-personals.md': {
                    content: '# Notes personals\n\n## Tasques pendents\n\n- [ ] Revisar editor\n- [ ] Afegir més funcions\n- [x] Provar Local Storage\n\n## Ideas\n\n> L\'editor de Markdown és molt útil per prendre notes ràpides.\n\nPuc guardar documents tant al disc dur com al Local Storage.',
                    lastModified: new Date(Date.now() - 86400000).toISOString() // 1 dia abans
                },
                'guia-markdown.md': {
                    content: '# Guia ràpida de Markdown\n\n## Títols\n```\n# Títol 1\n## Títol 2\n### Títol 3\n```\n\n## Format de text\n- **Negreta**: `**text**`\n- *Cursiva*: `*text*`\n- ~~Ratllat~~: `~~text~~`\n- `Codi`: `` `text` ``\n\n## Llistes\n```\n- Element 1\n- Element 2\n\n1. Element 1\n2. Element 2\n```\n\n## Enllaços\n```\n[Text](URL)\n```',
                    lastModified: new Date(Date.now() - 172800000).toISOString() // 2 dies abans
                }
            };
            localStorage.setItem('markdownDocs', JSON.stringify(exampleDocs));
        }

        function resolveModal(value) {
            if (currentModalResolve) {
                const resolve = currentModalResolve;
                currentModalResolve = null;
                hideModal();
                resolve(value);
            }
        }

        // Actualitzar vista prèvia
        function updatePreview() {
            if (previewVisible) {
                const editorContent = document.getElementById('editor').value;
                const preview = document.getElementById('preview');
                preview.innerHTML = marked.parse(editorContent);
            }
        }

        // Inserir text a la posició del cursor
        function insertText(text) {
            const editor = document.getElementById('editor');
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const currentValue = editor.value;
            
            editor.value = currentValue.substring(0, start) + text + currentValue.substring(end);
            editor.selectionStart = editor.selectionEnd = start + text.length;
            editor.focus();
            updatePreview();
        }

        // Embolicar text seleccionat
        function wrapText(startText, endText) {
            const editor = document.getElementById('editor');
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selectedText = editor.value.substring(start, end);
            const currentValue = editor.value;
            
            if (selectedText) {
                editor.value = currentValue.substring(0, start) + startText + selectedText + endText + currentValue.substring(end);
                editor.selectionStart = start + startText.length;
                editor.selectionEnd = start + startText.length + selectedText.length;
            } else {
                editor.value = currentValue.substring(0, start) + startText + endText + currentValue.substring(end);
                editor.selectionStart = editor.selectionEnd = start + startText.length;
            }
            
            editor.focus();
            updatePreview();
        }

        // Importar fitxer
        async function importFile() {
            await showOpenDialog();
        }

        // Mostrar diàleg d'obertura
        async function showOpenDialog() {
            const location = await showLocationChoice('D\'on vols obrir el document?');
            if (!location) return;
            
            if (location === 'disk') {
                // Obrir des del disc dur - activar selector de fitxers
                document.getElementById('fileInput').click();
            } else {
                // Obrir del Local Storage
                await showLocalStorageDocuments();
            }
        }

        // Mostrar documents del Local Storage
        async function showLocalStorageDocuments() {
            try {
                const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
                const docNames = Object.keys(savedDocs);
                
                if (docNames.length === 0) {
                    await showAlert('No hi ha documents guardats al Local Storage.<br><br>💡 <strong>Consell:</strong> Desa primer algun document per poder-lo obrir després.', 'info');
                    return;
                }
                
                const selectedDoc = await showDocumentSelector(savedDocs, docNames, 'open');
                if (selectedDoc) {
                    await loadFromLocalStorage(selectedDoc);
                }
                
            } catch (error) {
                await showAlert('Error en llegir del Local Storage: ' + error.message, 'error');
            }
        }

        // Selector de documents
        function showDocumentSelector(savedDocs, docNames, action = 'open') {
            return new Promise((resolve) => {
                let docList = '<div class="max-h-64 overflow-y-auto">';
                docNames.forEach((name, index) => {
                    const doc = savedDocs[name];
                    const lastModified = new Date(doc.lastModified).toLocaleString('ca-ES');
                    const actionText = action === 'open' ? 'Obrir' : 'Seleccionar';
                    docList += `
                        <div class="flex items-center justify-between p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div class="flex-1">
                                <div class="font-semibold text-gray-800 dark:text-gray-100">${name}</div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">${lastModified}</div>
                            </div>
                            <button onclick="resolveModal('${name}')" 
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                ${actionText}
                            </button>
                        </div>
                    `;
                });
                docList += '</div>';

                const content = `
                    <div class="p-6 dark:bg-gray-800">
                        <div class="flex items-center mb-4">
                            <span class="text-2xl mr-3">📄</span>
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Documents guardats</h3>
                        </div>
                        ${docList}
                        <div class="flex justify-end mt-4">
                            <button onclick="resolveModal(null)" 
                                    class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                                Cancel·lar
                            </button>
                        </div>
                    </div>
                `;
                
                currentModalResolve = resolve;
                showModal(content);
            });
        }

        // Carregar document del Local Storage
        async function loadFromLocalStorage(fileName) {
            try {
                const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
                const doc = savedDocs[fileName];
                
                if (doc) {
                    document.getElementById('editor').value = doc.content;
                    updatePreview();
                    currentFileName = fileName;
                    await showAlert(`Document "${fileName}" carregat correctament.`, 'success');
                } else {
                    await showAlert('Document no trobat.', 'error');
                }
            } catch (error) {
                await showAlert('Error en carregar del Local Storage: ' + error.message, 'error');
            }
        }

        // Gestionar importació de fitxer
        async function handleFileImport(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Comprovar si l'editor té contingut
            const currentContent = document.getElementById('editor').value.trim();
            let shouldReplace = true;
            
            if (currentContent) {
                shouldReplace = await showConfirm(
                    `L'editor ja té contingut. Vols substituir-lo pel contingut del fitxer "${file.name}"?<br><br>` +
                    '⚠️ <strong>Atenció:</strong> El contingut actual es perdrà si no l\'has desat.',
                    'Sí, substituir',
                    'Cancel·lar'
                );
            }
            
            if (shouldReplace) {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    document.getElementById('editor').value = e.target.result;
                    updatePreview();
                    currentFileName = file.name;
                    await showAlert(`Fitxer "${file.name}" carregat correctament.`, 'success');
                };
                reader.readAsText(file);
            }
            
            // Netejar l'input per permetre seleccionar el mateix fitxer de nou
            event.target.value = '';
        }

        // Exportar fitxer
        async function exportFile() {
            await showSaveDialog();
        }

        // Mostrar diàleg de desament
        async function showSaveDialog() {
            const content = document.getElementById('editor').value;
            if (!content.trim()) {
                await showAlert('No hi ha contingut per desar.', 'warning');
                return;
            }

            const fileName = await showPrompt('Nom del fitxer:', currentFileName, 'document.md');
            if (!fileName) return;

            const location = await showLocationChoice('On vols desar el document?');
            if (!location) return;
            
            if (location === 'disk') {
                // Desar al disc dur
                saveToFile(content, fileName);
            } else {
                // Desar al Local Storage
                await saveToLocalStorage(content, fileName);
            }
        }

        // Desar al disc dur
        function saveToFile(content, fileName) {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.endsWith('.md') ? fileName : fileName + '.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            currentFileName = fileName;
        }

        // Desar al Local Storage
        async function saveToLocalStorage(content, fileName) {
            try {
                // Obtenir llista de documents guardats
                const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
                
                // Afegir o actualitzar document
                savedDocs[fileName] = {
                    content: content,
                    lastModified: new Date().toISOString()
                };
                
                // Guardar al Local Storage
                localStorage.setItem('markdownDocs', JSON.stringify(savedDocs));
                
                currentFileName = fileName;
                await showAlert(`Document "${fileName}" desat al Local Storage correctament.`, 'success');
            } catch (error) {
                await showAlert('Error en desar al Local Storage: ' + error.message, 'error');
            }
        }

        // Netejar editor
        async function clearEditor() {
            const confirmed = await showConfirm('Estàs segur que vols netejar tot el contingut?', 'Sí, netejar', 'Cancel·lar');
            if (confirmed) {
                document.getElementById('editor').value = '';
                updatePreview();
                currentFileName = 'document.md';
            }
        }

        // Gestor del Local Storage
        async function showLocalStorageManager() {
            try {
                const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
                const docNames = Object.keys(savedDocs);
                
                if (docNames.length === 0) {
                    await showAlert('No hi ha documents guardats al Local Storage.', 'info');
                    return;
                }
                
                await showStorageManager(savedDocs, docNames);
                
            } catch (error) {
                await showAlert('Error en gestionar el Local Storage: ' + error.message, 'error');
            }
        }

        // Interfície del gestor d'emmagatzematge
        function showStorageManager(savedDocs, docNames) {
            return new Promise((resolve) => {
                let docList = '<div class="max-h-64 overflow-y-auto mb-4">';
                docNames.forEach((name, index) => {
                    const doc = savedDocs[name];
                    const lastModified = new Date(doc.lastModified).toLocaleString('ca-ES');
                    docList += `
                        <div class="flex items-center justify-between p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                            <div class="flex-1">
                                <div class="font-semibold text-gray-800 dark:text-gray-100">${name}</div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">${lastModified}</div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="loadDocument('${name}')" 
                                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Carregar
                                </button>
                                <button onclick="deleteDocument('${name}')" 
                                        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm dark:bg-red-600 dark:hover:bg-red-700">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                });
                docList += '</div>';

                const content = `
                    <div class="p-6 dark:bg-gray-800">
                        <div class="flex items-center mb-4">
                            <span class="text-2xl mr-3">📋</span>
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Gestió de documents</h3>
                        </div>
                        ${docList}
                        <div class="flex justify-between">
                            <button onclick="clearAllDocuments()" 
                                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700">
                                🗑️ Eliminar tots
                            </button>
                            <button onclick="hideModal(); modalResolve(null)" 
                                    class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                                Tancar
                            </button>
                        </div>
                    </div>
                `;
                
                modalResolve = resolve;
                showModal(content);
                
                // Funcions globals per als botons del modal
                window.loadDocument = async (name) => {
                    hideModal();
                    await loadFromLocalStorage(name);
                };
                
                window.deleteDocument = async (name) => {
                    const confirmed = await showConfirm(`Estàs segur que vols eliminar "${name}"?`, 'Sí, eliminar', 'Cancel·lar');
                    if (confirmed) {
                        await deleteFromLocalStorage(name);
                        // Recarregar el gestor
                        setTimeout(() => showLocalStorageManager(), 100);
                    } else {
                        // Tornar al gestor
                        setTimeout(() => showLocalStorageManager(), 100);
                    }
                };
                
                window.clearAllDocuments = async () => {
                    const confirmed = await showConfirm('Estàs segur que vols eliminar tots els documents del Local Storage?', 'Sí, eliminar tot', 'Cancel·lar');
                    if (confirmed) {
                        localStorage.removeItem('markdownDocs');
                        await showAlert('Tots els documents han estat eliminats.', 'success');
                    } else {
                        // Tornar al gestor
                        setTimeout(() => showLocalStorageManager(), 100);
                    }
                };
            });
        }

        // Eliminar document del Local Storage
        async function deleteFromLocalStorage(docName) {
            try {
                const savedDocs = JSON.parse(localStorage.getItem('markdownDocs') || '{}');
                
                if (savedDocs[docName]) {
                    delete savedDocs[docName];
                    localStorage.setItem('markdownDocs', JSON.stringify(savedDocs));
                    await showAlert(`Document "${docName}" eliminat correctament.`, 'success');
                } else {
                    await showAlert('Document no trobat.', 'error');
                }
            } catch (error) {
                await showAlert('Error en eliminar del Local Storage: ' + error.message, 'error');
            }
        }

        // Dreceres de teclat
        document.getElementById('editor').addEventListener('keydown', async function(e) {
            // Ctrl+B per negreta
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                wrapText('**', '**');
            }
            // Ctrl+I per cursiva
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                wrapText('*', '*');
            }
            // Ctrl+S per desar
            else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                await exportFile();
            }
            // Ctrl+O per obrir
            else if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                await importFile();
            }
            // Tab per indentar
            else if (e.key === 'Tab') {
                e.preventDefault();
                insertText('    ');
            }
        });