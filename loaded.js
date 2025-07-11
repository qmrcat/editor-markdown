// Inicialitzar l'editor
        document.addEventListener('DOMContentLoaded', async function() {

            
            document.getElementById('emojiDropdown').innerHTML = generateEmojiHtml(emojiGroups)



            initializeTheme()

            new TooltipManager();
            // Comprovar si cal mostrar documents d'exemple
            await checkExampleDocuments();
            
            // Configurar drag & drop
            setupDragAndDrop();
            
            updatePreview();
            
            // Detectar canvis de mida de pantalla per ajustar el layout responsiu
            window.addEventListener('resize', function() {
                // Forçar actualització del layout responsive
                if (previewVisible) {
                    const mainContent = document.getElementById('mainContent');
                    const editorContainer = document.getElementById('editorContainer');
                    const previewContainer = document.getElementById('previewContainer');
                    const editor = document.getElementById('editor');
                    
                    // Reassignar classes per assegurar responsivitat
                    editorContainer.className = 'w-full lg:w-1/2 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 flex flex-col min-h-0';
                    previewContainer.className = 'w-full lg:w-1/2 bg-white dark:bg-gray-800 transition-all duration-300 flex flex-col min-h-0';
                    mainContent.className = 'flex flex-col lg:flex-row flex-1 overflow-hidden relative';
                    editor.className = 'w-full flex-1 p-4 border-none outline-none resize-none editor-textarea min-h-[60vh] lg:min-h-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
                }
            });

            // Inicialitzar funcionalitats de cerca i undo/redo
            initializeSearchReplace();
            initializeUndoRedo();
            addSearchUndoKeyboardShortcuts();
            
            // Inicialitzar sistema d'exportació
            initializeExportSystem();

            // Precarregar la llibreria PDF en segon pla (opcional)
            setTimeout(() => {
                if (exportSystem && typeof exportSystem.loadHTML2PDF === 'function') {
                    exportSystem.loadHTML2PDF().catch(() => {
                        // Fallar silenciosament, es carregarà quan es necessiti
                    });
                }
            }, 3000); // Carregar després de 3 segons
        });