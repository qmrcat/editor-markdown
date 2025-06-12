// Editor visual de taules
function showTableCreator() {
    const content = `
        <div class="p-6 max-w-md mx-auto">
            <div class="flex items-center mb-4">
                <span class="text-2xl mr-3">⊞</span>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Crear taula</h3>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Selecciona la mida de la taula:</div>
            <div class="flex justify-between mb-2 gap-4 items-start">
                <!-- Selector visual de mida (esquerra) -->
                <div>
                    
                    <div id="tableGrid" class="inline-block border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 rounded">
                        <!-- Grid es generarà dinàmicament -->
                    </div>

                </div>
                
                <!-- Opcions adicionals (dreta) -->
                <div class="flex flex-col justify-between min-w-[180px]">
                    <label class="flex items-center mb-3">
                        <input  type="checkbox" id="includeHeaders" checked 
                                class="mr-2 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Incloure capçaleres</span>
                    </label>
                    
                    <div>
                        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Alineació per defecte:</label>
                        <select id="defaultAlignment" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
                            <option value="left">Esquerra</option>
                            <option value="center">Centre</option>
                            <option value="right">Dreta</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="tableSizeDisplay" class="text-left mt-0 mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Mou el cursor per seleccionar
            </div>
            
            <div class="flex justify-end gap-3">
                <button onclick="cancelTableCreation()" 
                        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                    Cancel·lar
                </button>
                <button onclick="createTableFromSelection()" 
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Crear taula
                </button>
            </div>
        </div>
    `;
    
    showModal(content);
    initializeTableGrid();
}

// Funció per cancel·lar la creació de taula
function cancelTableCreation() {
    hideModal();
    window.tableSelection = null;
}

// Inicialitzar el grid selector
function initializeTableGrid() {
    const maxRows = 8;
    const maxCols = 8;
    const grid = document.getElementById('tableGrid');
    let selectedRows = 0;
    let selectedCols = 0;
    
    // Netejar contingut i configurar grid CSS
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${maxCols}, 16px)`;
    grid.style.gridTemplateRows = `repeat(${maxRows}, 16px)`;
    grid.style.gap = '0';
    grid.style.border = '1px solid #d1d5db';
    
    // Crear cel·les del grid
    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < maxCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'bg-gray-100 dark:bg-gray-600 border-r border-b border-gray-300 dark:border-gray-500 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-600';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Eliminar border dret de l'última columna
            if (col === maxCols - 1) {
                cell.classList.remove('border-r');
            }
            
            // Eliminar border inferior de l'última fila
            if (row === maxRows - 1) {
                cell.classList.remove('border-b');
            }
            
            // Events per al hover i selecció
            cell.addEventListener('mouseenter', function() {
                const hoverRow = parseInt(this.dataset.row);
                const hoverCol = parseInt(this.dataset.col);
                highlightCells(hoverRow + 1, hoverCol + 1);
                updateSizeDisplay(hoverRow + 1, hoverCol + 1);
            });
            
            cell.addEventListener('click', function() {
                selectedRows = parseInt(this.dataset.row) + 1;
                selectedCols = parseInt(this.dataset.col) + 1;
                highlightCells(selectedRows, selectedCols, true);
                updateSizeDisplay(selectedRows, selectedCols);
            });
            
            grid.appendChild(cell);
        }
    }
    
    // Resetar en sortir del grid
    grid.addEventListener('mouseleave', function() {
        if (selectedRows > 0 && selectedCols > 0) {
            highlightCells(selectedRows, selectedCols, true);
            updateSizeDisplay(selectedRows, selectedCols);
        } else {
            highlightCells(0, 0);
            updateSizeDisplay(0, 0);
        }
    });
    
    function highlightCells(rows, cols, selected = false) {
        const cells = grid.querySelectorAll('div[data-row]');
        cells.forEach(cell => {
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);
            
            // Classes base
            let classes = 'cursor-pointer transition-colors duration-150';
            
            // Afegir borders
            if (cellCol < maxCols - 1) classes += ' border-r';
            if (cellRow < maxRows - 1) classes += ' border-b';
            classes += ' border-gray-300 dark:border-gray-500';
            
            // Colors segons l'estat - IMPORTANT: cel·la està dins de la selecció si és menor que rows/cols
            if (cellRow < rows && cellCol < cols) {
                if (selected) {
                    classes += ' bg-blue-500 dark:bg-blue-600'; // Selecció confirmada
                } else {
                    classes += ' bg-blue-300 dark:bg-blue-400'; // Hover/preview
                }
            } else {
                classes += ' bg-gray-100 dark:bg-gray-600 hover:bg-blue-200 dark:hover:bg-blue-500'; // Cel·les no seleccionades
            }
            
            cell.className = classes;
        });
    }
    
    function updateSizeDisplay(rows, cols) {
        const display = document.getElementById('tableSizeDisplay');
        if (rows > 0 && cols > 0) {
            display.textContent = `${cols} × ${rows}`;
        } else {
            display.textContent = 'Mou el cursor per seleccionar';
        }
        
        // Guardar selecció global
        window.tableSelection = { rows, cols };
    }
}

// Crear taula basada en la selecció
function createTableFromSelection() {
    const selection = window.tableSelection;
    
    if (!selection || selection.rows === 0 || selection.cols === 0) {
        showAlert('Selecciona primer la mida de la taula.', 'warning');
        return;
    }
    
    const includeHeaders = document.getElementById('includeHeaders').checked;
    const alignment = document.getElementById('defaultAlignment').value;
    
    const table = generateMarkdownTable(selection.rows, selection.cols, includeHeaders, alignment);
    
    // Tancar modal i inserir taula
    hideModal();
    insertText(table);
    
    // Netejar selecció
    window.tableSelection = null;
    
    showAlert(`Taula de ${selection.cols}×${selection.rows} inserida correctament.`, 'success');
}

// Generar taula Markdown
function generateMarkdownTable(rows, cols, includeHeaders, alignment) {
    let table = '';
    
    // Crear fila de capçaleres si està activat
    if (includeHeaders) {
        // Capçaleres
        table += '|';
        for (let col = 0; col < cols; col++) {
            table += ` Columna ${col + 1} |`;
        }
        table += '\n';
        
        // Separador amb alineació
        table += '|';
        for (let col = 0; col < cols; col++) {
            switch (alignment) {
                case 'center':
                    table += ':--------:|';
                    break;
                case 'right':
                    table += '--------:|';
                    break;
                default: // left
                    table += '---------|';
            }
        }
        table += '\n';
        
        // Ajustar el nombre de files de dades
        rows = Math.max(1, rows - 1);
    }
    
    // Crear files de dades
    for (let row = 0; row < rows; row++) {
        table += '|';
        for (let col = 0; col < cols; col++) {
            if (includeHeaders) {
                table += ` Dada ${row + 1}-${col + 1} |`;
            } else {
                table += ` Cel·la ${row + 1}-${col + 1} |`;
            }
        }
        table += '\n';
    }
    
    return table;
}

// Modificar la funció existent del botó de taula
function insertTableVisual() {
    showTableCreator();
}