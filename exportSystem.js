
class ExportSystem {
    constructor() {
        this.exportModal = null;
        this.currentContent = '';
        this.currentFileName = '';
    }

    init() {
        this.createExportModal();
    }

    createExportModal() {
        const modal = document.createElement('div');
        modal.id = 'exportModal';
        modal.className = 'export-modal hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Exportar document</h3>
                        <button id="closeExportModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom del fitxer:</label>
                        <input type="text" id="exportFileName" 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                               placeholder="document">
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selecciona el format:</label>
                        <div class="grid grid-cols-1 gap-3">
                            <!-- Markdown -->
                            <button onclick="exportSystem.selectFormat('markdown')" 
                                    class="export-option flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-2xl">📝</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">Markdown (.md)</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Format original, manté tota la sintaxi</p>
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </button>
                            
                            <!-- HTML -->
                            <button onclick="exportSystem.selectFormat('html')" 
                                    class="export-option flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                                <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-2xl">🌐</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">HTML (.html)</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Pàgina web completa amb estils</p>
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </button>
                            
                            <!-- PDF -->
                            <button onclick="exportSystem.selectFormat('pdf')" 
                                    class="export-option flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                                <div class="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-2xl">📄</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">PDF (.pdf)</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Document portable per impressió</p>
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </button>
                            
                            <!-- HTML Simple -->
                            <button onclick="exportSystem.selectFormat('html-simple')" 
                                    class="export-option flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-2xl">📋</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">HTML Simple</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Només contingut HTML, sense estils</p>
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Opcions addicionals -->
                    <div id="exportOptions" class="mb-6 hidden">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Opcions d'exportació:</label>
                        
                        <!-- Opcions HTML -->
                        <div id="htmlOptions" class="hidden space-y-3">
                            <label class="flex items-center">
                                <input type="checkbox" id="includeCSS" checked 
                                       class="mr-2 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Incloure estils CSS</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="darkModeCSS" 
                                       class="mr-2 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Usar tema fosc</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="responsiveCSS" checked 
                                       class="mr-2 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Disseny responsiu</span>
                            </label>
                        </div>
                        
                        <!-- Opcions PDF -->
                        <div id="pdfOptions" class="hidden space-y-3">
                            <div>
                                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Mida de pàgina:</label>
                                <select id="pageSize" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                    <option value="a4">A4</option>
                                    <option value="letter">Letter</option>
                                    <option value="a3">A3</option>
                                    <option value="legal">Legal</option>
                                </select>
                            </div>
                            <label class="flex items-center">
                                <input type="checkbox" id="includePageNumbers" 
                                       class="mr-2 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Numerar pàgines</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="includeDate" checked 
                                       class="mr-2 rounded text-blue-600 focus:ring-blue-500 focus:ring-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Incloure data d'exportació</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-3">
                        <button onclick="exportSystem.hide()" 
                                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                            Cancel·lar
                        </button>
                        <button id="confirmExport" onclick="exportSystem.confirmExport()" 
                                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" disabled>
                            <span id="exportButtonText">Exportar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.exportModal = modal;
        this.addEventListeners();
    }

    addEventListeners() {
        const closeBtn = document.getElementById('closeExportModal');
        closeBtn.addEventListener('click', () => this.hide());
        
        // Tancar en clicar fora
        this.exportModal.addEventListener('click', (e) => {
            if (e.target === this.exportModal) {
                this.hide();
            }
        });
        
        // ESC per tancar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.exportModal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    show() {
        this.currentContent = document.getElementById('editor').value;
        this.currentFileName = currentFileName || 'document';
        
        // Netejar extensió si n'hi ha
        const baseFileName = this.currentFileName.replace(/\.[^/.]+$/, "");
        document.getElementById('exportFileName').value = baseFileName;
        
        this.exportModal.classList.remove('hidden');
        document.getElementById('exportFileName').focus();
        document.getElementById('exportFileName').select();
    }

    hide() {
        this.exportModal.classList.add('hidden');
        this.resetForm();
    }

    selectFormat(format) {
        // Actualitzar interfície
        const options = document.querySelectorAll('.export-option');
        options.forEach(option => {
            option.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        });
        
        event.currentTarget.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        
        // Mostrar opcions específiques
        this.showFormatOptions(format);
        
        // Activar botó d'exportació
        const exportBtn = document.getElementById('confirmExport');
        const exportText = document.getElementById('exportButtonText');
        exportBtn.disabled = false;
        exportBtn.dataset.format = format;
        
        switch(format) {
            case 'markdown':
                exportText.textContent = 'Exportar Markdown';
                break;
            case 'html':
                exportText.textContent = 'Exportar HTML';
                break;
            case 'html-simple':
                exportText.textContent = 'Exportar HTML Simple';
                break;
            case 'pdf':
                exportText.textContent = 'Exportar PDF';
                break;
        }
    }

    showFormatOptions(format) {
        const optionsContainer = document.getElementById('exportOptions');
        const htmlOptions = document.getElementById('htmlOptions');
        const pdfOptions = document.getElementById('pdfOptions');
        
        // Amagar totes les opcions
        htmlOptions.classList.add('hidden');
        pdfOptions.classList.add('hidden');
        optionsContainer.classList.add('hidden');
        
        // Mostrar opcions específiques
        if (format === 'html') {
            htmlOptions.classList.remove('hidden');
            optionsContainer.classList.remove('hidden');
        } else if (format === 'pdf') {
            pdfOptions.classList.remove('hidden');
            optionsContainer.classList.remove('hidden');
        }
    }

    async confirmExport() {
        const format = document.getElementById('confirmExport').dataset.format;
        const fileName = document.getElementById('exportFileName').value || 'document';
        
        if (!format) {
            await showAlert('Selecciona un format d\'exportació.', 'warning');
            return;
        }

        try {
            await this.exportToFormat(format, fileName);
            this.hide();
        } catch (error) {
            await showAlert(`Error en exportar: ${error.message}`, 'error');
        }
    }

    async exportToFormat(format, fileName) {
        switch(format) {
            case 'markdown':
                await this.exportMarkdown(fileName);
                break;
            case 'html':
                await this.exportHTML(fileName, true);
                break;
            case 'html-simple':
                await this.exportHTML(fileName, false);
                break;
            case 'pdf':
                await this.exportPDF(fileName);
                break;
        }
    }

    async exportMarkdown(fileName) {
        const blob = new Blob([this.currentContent], { type: 'text/markdown' });
        this.downloadFile(blob, `${fileName}.md`);
        await showAlert('Document Markdown exportat correctament!', 'success');
    }

    async exportHTML(fileName, withStyles = true) {
        const htmlContent = marked.parse(this.currentContent);
        let fullHTML;
        
        if (withStyles) {
            const includeCSS = document.getElementById('includeCSS').checked;
            const darkMode = document.getElementById('darkModeCSS').checked;
            const responsive = document.getElementById('responsiveCSS').checked;
            
            fullHTML = this.generateStyledHTML(htmlContent, {
                includeCSS,
                darkMode,
                responsive,
                title: fileName
            });
        } else {
            fullHTML = htmlContent;
        }
        
        const blob = new Blob([fullHTML], { type: 'text/html' });
        this.downloadFile(blob, `${fileName}.html`);
        await showAlert(`Document HTML ${withStyles ? 'amb estils' : 'simple'} exportat correctament!`, 'success');
    }

    generateStyledHTML(content, options) {
        const { includeCSS, darkMode, responsive, title } = options;
        
        let css = '';
        if (includeCSS) {
            css = `
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: ${darkMode ? '#f3f4f6' : '#374151'};
                background-color: ${darkMode ? '#1f2937' : '#ffffff'};
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: ${darkMode ? '#f9fafb' : '#1f2937'};
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-weight: 600;
            }
            
            h1 { font-size: 2.25rem; border-bottom: 2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}; padding-bottom: 0.5rem; }
            h2 { font-size: 1.875rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }
            h5 { font-size: 1.125rem; }
            h6 { font-size: 1rem; }
            
            p { margin-bottom: 1rem; }
            
            code {
                background-color: ${darkMode ? '#374151' : '#f3f4f6'};
                color: ${darkMode ? '#fbbf24' : '#dc2626'};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            }
            
            pre {
                background-color: ${darkMode ? '#374151' : '#f8fafc'};
                border: 1px solid ${darkMode ? '#4b5563' : '#e2e8f0'};
                border-radius: 0.5rem;
                padding: 1rem;
                overflow-x: auto;
                margin: 1rem 0;
            }
            
            pre code {
                background-color: transparent;
                color: ${darkMode ? '#e5e7eb' : '#475569'};
                padding: 0;
            }
            
            blockquote {
                border-left: 4px solid ${darkMode ? '#3b82f6' : '#6366f1'};
                padding-left: 1rem;
                margin: 1rem 0;
                font-style: italic;
                background-color: ${darkMode ? '#1e293b' : '#f8fafc'};
                padding: 1rem;
                border-radius: 0 0.5rem 0.5rem 0;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
                border: 1px solid ${darkMode ? '#4b5563' : '#e5e7eb'};
                border-radius: 0.5rem;
                overflow: hidden;
            }
            
            th, td {
                padding: 0.75rem;
                text-align: left;
                border-bottom: 1px solid ${darkMode ? '#4b5563' : '#e5e7eb'};
            }
            
            th {
                background-color: ${darkMode ? '#374151' : '#f9fafb'};
                font-weight: 600;
                color: ${darkMode ? '#f3f4f6' : '#374151'};
            }
            
            tr:hover {
                background-color: ${darkMode ? '#1f2937' : '#f9fafb'};
            }
            
            ul, ol { margin: 1rem 0; padding-left: 2rem; }
            li { margin-bottom: 0.5rem; }
            
            a {
                color: ${darkMode ? '#60a5fa' : '#3b82f6'};
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: border-color 0.2s;
            }
            
            a:hover {
                border-bottom-color: ${darkMode ? '#60a5fa' : '#3b82f6'};
            }
            
            img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem 0;
            }
            
            hr {
                border: none;
                height: 1px;
                background-color: ${darkMode ? '#4b5563' : '#e5e7eb'};
                margin: 2rem 0;
            }
            
            .export-info {
                border-top: 1px solid ${darkMode ? '#4b5563' : '#e5e7eb'};
                padding-top: 2rem;
                margin-top: 3rem;
                font-size: 0.875rem;
                color: ${darkMode ? '#9ca3af' : '#6b7280'};
                text-align: center;
            }
            
            ${responsive ? `
            @media (max-width: 768px) {
                body { padding: 1rem; font-size: 0.9rem; }
                h1 { font-size: 1.8rem; }
                h2 { font-size: 1.5rem; }
                table { font-size: 0.8rem; }
                th, td { padding: 0.5rem; }
            }
            ` : ''}
        </style>
            `;
        }
        
        const currentDate = new Date().toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${css}
</head>
<body>
    ${content}
    <div class="export-info">
        <p>Document exportat des de l'Editor de Markdown el ${currentDate}</p>
    </div>
</body>
</html>`;
    }

    async exportPDF(fileName) {
        try {
            // Mostrar indicador de càrrega
            const exportBtn = document.getElementById('confirmExport');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generant PDF...</span>';
            exportBtn.disabled = true;

            await this.loadJSPDF();
            
            const pageSize = document.getElementById('pageSize').value;
            const includePageNumbers = document.getElementById('includePageNumbers').checked;
            const includeDate = document.getElementById('includeDate').checked;
            
            // Configurar jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: pageSize
            });

            // Procesar contingut Markdown
            const htmlContent = marked.parse(this.currentContent);
            const textContent = this.htmlToText(htmlContent);
            
            // Configuració de pàgina
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;
            const margin = 20;
            const lineHeight = 7;
            const maxWidth = pageWidth - (margin * 2);
            
            let yPosition = margin;
            
            // Títol del document
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text(fileName, margin, yPosition);
            yPosition += lineHeight * 2;
            
            // Data si està activada
            if (includeDate) {
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                const currentDate = new Date().toLocaleDateString('ca-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                pdf.text(`Generat el ${currentDate}`, margin, yPosition);
                yPosition += lineHeight * 1.5;
            }
            
            // Línia separadora
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += lineHeight;
            
            // Processar contingut
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            
            const lines = this.processContentForPDF(textContent, pdf, maxWidth);
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Comprovar si necessitem nova pàgina
                if (yPosition > pageHeight - margin - 20) {
                    if (includePageNumbers) {
                        pdf.setFontSize(8);
                        pdf.text(`${pdf.internal.getNumberOfPages()}`, pageWidth - margin - 10, pageHeight - 10);
                    }
                    
                    pdf.addPage();
                    yPosition = margin;
                }
                
                // Aplicar estils segons el tipus de línia
                if (line.type === 'heading') {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(14 - line.level);
                    yPosition += lineHeight * 0.5;
                } else if (line.type === 'code') {
                    pdf.setFont('courier', 'normal');
                    pdf.setFontSize(9);
                } else {
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(11);
                }
                
                pdf.text(line.text, margin, yPosition);
                yPosition += lineHeight;
                
                // Espai extra després de títols
                if (line.type === 'heading') {
                    yPosition += lineHeight * 0.3;
                }
            }
            
            // Número de pàgina final
            if (includePageNumbers) {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(`${i}`, pageWidth - margin - 10, pageHeight - 10);
                }
            }
            
            // Desar PDF
            pdf.save(`${fileName}.pdf`);
            
            // Restaurar botó
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            
            await showAlert('Document PDF exportat correctament!', 'success');
            
        } catch (error) {
            // Restaurar botó en cas d'error
            const exportBtn = document.getElementById('confirmExport');
            if (exportBtn) {
                exportBtn.innerHTML = 'Exportar PDF';
                exportBtn.disabled = false;
            }
            
            console.error('PDF Export Error:', error);
            await showAlert(`Error en exportar PDF: ${error.message}`, 'error');
        }
    }

    async loadJSPDF() {
        if (window.jspdf) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('No s\'ha pogut carregar la llibreria PDF'));
            document.head.appendChild(script);
        });
    }

    htmlToText(html) {
        // Crear un element temporal per processar HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Eliminar elements no desitjats
        const scripts = temp.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
        
        return temp.textContent || temp.innerText || '';
    }

    processContentForPDF(content, pdf, maxWidth) {
        const lines = [];
        const contentLines = content.split('\n');
        
        for (const line of contentLines) {
            if (!line.trim()) {
                lines.push({ text: '', type: 'normal' });
                continue;
            }
            
            // Detectar tipus de línia
            let lineType = 'normal';
            let processedText = line.trim();
            let level = 0;
            
            // Títols
            const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
            if (headingMatch) {
                lineType = 'heading';
                level = headingMatch[1].length;
                processedText = headingMatch[2];
            }
            
            // Codi
            if (line.includes('```') || line.trim().startsWith('    ')) {
                lineType = 'code';
            }
            
            // Dividir línies llargues
            const words = processedText.split(' ');
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const textWidth = pdf.getTextWidth(testLine);
                
                if (textWidth > maxWidth && currentLine) {
                    lines.push({ text: currentLine, type: lineType, level });
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push({ text: currentLine, type: lineType, level });
            }
        }
        
        return lines;
    }

    generatePDFHTML(content, options) {
        const { title, includeDate } = options;
        const currentDate = new Date().toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 100%; padding: 0; color: #333;">
                <div style="margin-bottom: 30px; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px;">
                    <h1 style="margin: 0; color: #2563eb; font-size: 28px;">${title}</h1>
                    ${includeDate ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Generat el ${currentDate}</p>` : ''}
                </div>
                <div style="line-height: 1.6;">
                    ${content}
                </div>
            </div>
        `;
    }

    downloadFile(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        // Reset selections
        const options = document.querySelectorAll('.export-option');
        options.forEach(option => {
            option.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        });
        
        // Reset button
        const exportBtn = document.getElementById('confirmExport');
        exportBtn.disabled = true;
        exportBtn.dataset.format = '';
        document.getElementById('exportButtonText').textContent = 'Exportar';
        
        // Hide options
        document.getElementById('exportOptions').classList.add('hidden');
    }
}

// Instància global
let exportSystem;

// Funcions públiques
function initializeExportSystem() {
    exportSystem = new ExportSystem();
    exportSystem.init();
}

function showExportDialog() {
    if (!exportSystem) initializeExportSystem();
    
    const content = document.getElementById('editor').value;
    if (!content.trim()) {
        showAlert('No hi ha contingut per exportar.', 'warning');
        return;
    }
    
    exportSystem.show();
}

// Mantenir compatibilitat amb la funció existent
async function exportFile() {
    showExportDialog();
}

class ExportUtilities {
    
    // Exportació ràpida des del dropdown
    static async quickExport(format) {
        const content = document.getElementById('editor').value;
        if (!content.trim()) {
            await showAlert('No hi ha contingut per exportar.', 'warning');
            return;
        }

        const fileName = currentFileName ? currentFileName.replace(/\.[^/.]+$/, "") : 'document';
        
        try {
            if (!exportSystem) {
                initializeExportSystem();
            }
            
            switch(format) {
                case 'markdown':
                    await exportSystem.exportMarkdown(fileName);
                    break;
                case 'html':
                    // HTML amb estils per defecte
                    await exportSystem.exportHTML(fileName, true);
                    break;
                case 'pdf':
                    await exportSystem.exportPDF(fileName);
                    break;
                case 'html-simple':
                    await exportSystem.exportHTML(fileName, false);
                    break;
                default:
                    showExportDialog();
            }
        } catch (error) {
            await showAlert(`Error en exportar: ${error.message}`, 'error');
        }
    }

    // Previsualització HTML
    static previewHTML() {
        const content = document.getElementById('editor').value;
        if (!content.trim()) {
            showAlert('No hi ha contingut per previsualitzar.', 'warning');
            return;
        }

        const htmlContent = marked.parse(content);
        const styledHTML = exportSystem.generateStyledHTML(htmlContent, {
            includeCSS: true,
            darkMode: isDarkMode,
            responsive: true,
            title: 'Previsualització'
        });

        // Obrir en una nova finestra
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(styledHTML);
        previewWindow.document.close();
    }

    // Copiar HTML al porta-retalls
    static async copyHTML() {
        const content = document.getElementById('editor').value;
        if (!content.trim()) {
            await showAlert('No hi ha contingut per copiar.', 'warning');
            return;
        }

        try {
            const htmlContent = marked.parse(content);
            await navigator.clipboard.writeText(htmlContent);
            await showAlert('HTML copiat al porta-retalls!', 'success');
        } catch (error) {
            await showAlert('Error en copiar al porta-retalls.', 'error');
        }
    }

    // Estadístiques del document
    static showDocumentStats() {
        const content = document.getElementById('editor').value;
        const stats = this.calculateStats(content);
        
        const statsModal = `
            <div class="p-6 dark:bg-gray-800">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">📊</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Estadístiques del document</h3>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.characters}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Caràcters</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${stats.charactersNoSpaces}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Caràcters (sense espais)</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${stats.words}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Paraules</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">${stats.lines}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Línies</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-red-600 dark:text-red-400">${stats.paragraphs}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Paràgrafs</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${stats.readingTime}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Min. lectura</div>
                    </div>
                </div>
                
                ${stats.elements.length > 0 ? `
                <div class="mb-4">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Elements Markdown:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${stats.elements.map(element => `
                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                ${element}
                            </span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="flex justify-end">
                    <button onclick="hideModal()" 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Tancar
                    </button>
                </div>
            </div>
        `;
        
        showModal(statsModal);
    }

    static calculateStats(content) {
        const characters = content.length;
        const charactersNoSpaces = content.replace(/\s/g, '').length;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const lines = content.split('\n').length;
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
        const readingTime = Math.ceil(words / 200); // 200 paraules per minut

        // Detectar elements Markdown
        const elements = [];
        if (content.match(/^#{1,6}\s/m)) elements.push('Títols');
        if (content.match(/\*\*.*?\*\*/)) elements.push('Negreta');
        if (content.match(/\*.*?\*/)) elements.push('Cursiva');
        if (content.match(/~~.*?~~/)) elements.push('Ratllat');
        if (content.match(/`.*?`/)) elements.push('Codi inline');
        if (content.match(/```[\s\S]*?```/)) elements.push('Blocs de codi');
        if (content.match(/^\s*[-*+]\s/m)) elements.push('Llistes');
        if (content.match(/^\s*\d+\.\s/m)) elements.push('Llistes numeradas');
        if (content.match(/^\s*-\s*\[[ x]\]/m)) elements.push('Tasques');
        if (content.match(/\[.*?\]\(.*?\)/)) elements.push('Enllaços');
        if (content.match(/!\[.*?\]\(.*?\)/)) elements.push('Imatges');
        if (content.match(/^\s*>/m)) elements.push('Cites');
        if (content.match(/\|.*\|/)) elements.push('Taules');
        if (content.match(/^---+$/m)) elements.push('Separadors');

        return {
            characters,
            charactersNoSpaces,
            words,
            lines,
            paragraphs,
            readingTime,
            elements
        };
    }

    // Importar des d'URL
    static async importFromURL() {
        try {
            const url = await showPrompt(
                'Introdueix l\'URL del fitxer Markdown a importar:',
                '',
                'https://raw.githubusercontent.com/...'
            );
            
            if (!url) return;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const content = await response.text();
            
            // Comprovar si l'editor té contingut
            const currentContent = document.getElementById('editor').value.trim();
            let shouldReplace = true;
            
            if (currentContent) {
                shouldReplace = await showConfirm(
                    'L\'editor ja té contingut. Vols substituir-lo pel contingut importat?',
                    'Sí, substituir',
                    'Cancel·lar'
                );
            }
            
            if (shouldReplace) {
                document.getElementById('editor').value = content;
                updatePreview();
                
                // Guardar estat per undo
                if (undoRedoManager) {
                    undoRedoManager.saveState();
                }
                
                await showAlert('Contingut importat correctament des de l\'URL!', 'success');
            }
            
        } catch (error) {
            await showAlert(`Error en importar des de l'URL: ${error.message}`, 'error');
        }
    }
}

// Funcions globals de conveniència
function quickExportMarkdown() {
    ExportUtilities.quickExport('markdown');
}

function quickExportHTML() {
    ExportUtilities.quickExport('html');
}

function quickExportPDF() {
    ExportUtilities.quickExport('pdf');
}

function previewHTML() {
    ExportUtilities.previewHTML();
}

function copyHTML() {
    ExportUtilities.copyHTML();
}

function showDocumentStats() {
    ExportUtilities.showDocumentStats();
}

function importFromURL() {
    ExportUtilities.importFromURL();
}

// Drecera de teclat per estadístiques
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+S per estadístiques
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        showDocumentStats();
    }
    // Ctrl+Shift+P per previsualitzar HTML
    else if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        previewHTML();
    }
    // Ctrl+Shift+C per copiar HTML
    else if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyHTML();
    }
});