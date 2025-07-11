// pdfDiagnostics.js - Sistema de diagnòstic per exportació PDF
class PDFDiagnostics {
    
    static async runDiagnostics() {
        const results = {
            internetConnection: false,
            jsPDFAvailable: false,
            html2pdfAvailable: false,
            browserCompatible: true,
            recommendedMethod: null,
            errors: []
        };

        try {
            // Comprovar connexió a internet
            results.internetConnection = await this.checkInternetConnection();
            
            // Comprovar disponibilitat de jsPDF
            try {
                await this.testJSPDF();
                results.jsPDFAvailable = true;
            } catch (error) {
                results.errors.push(`jsPDF: ${error.message}`);
            }
            
            // Comprovar disponibilitat de html2pdf
            try {
                await this.testHTML2PDF();
                results.html2pdfAvailable = true;
            } catch (error) {
                results.errors.push(`html2pdf: ${error.message}`);
            }
            
            // Comprovar compatibilitat del navegador
            results.browserCompatible = this.checkBrowserCompatibility();
            
            // Determinar mètode recomanat
            if (results.jsPDFAvailable) {
                results.recommendedMethod = 'jsPDF';
            } else if (results.html2pdfAvailable) {
                results.recommendedMethod = 'html2pdf';
            } else {
                results.recommendedMethod = 'none';
            }
            
        } catch (error) {
            results.errors.push(`Diagnòstic general: ${error.message}`);
        }
        
        return results;
    }
    
    static async checkInternetConnection() {
        try {
            const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return true;
        } catch (error) {
            return false;
        }
    }
    
    static async testJSPDF() {
        return new Promise((resolve, reject) => {
            if (window.jspdf) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                if (window.jspdf) {
                    resolve();
                } else {
                    reject(new Error('jsPDF no es va carregar correctament'));
                }
            };
            script.onerror = () => reject(new Error('No es va poder carregar jsPDF'));
            
            // Timeout després de 10 segons
            setTimeout(() => {
                if (!window.jspdf) {
                    reject(new Error('Timeout carregant jsPDF'));
                }
            }, 10000);
            
            document.head.appendChild(script);
        });
    }
    
    static async testHTML2PDF() {
        return new Promise((resolve, reject) => {
            if (window.html2pdf) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => {
                if (window.html2pdf) {
                    resolve();
                } else {
                    reject(new Error('html2pdf no es va carregar correctament'));
                }
            };
            script.onerror = () => reject(new Error('No es va poder carregar html2pdf'));
            
            // Timeout després de 10 segons
            setTimeout(() => {
                if (!window.html2pdf) {
                    reject(new Error('Timeout carregant html2pdf'));
                }
            }, 10000);
            
            document.head.appendChild(script);
        });
    }
    
    static checkBrowserCompatibility() {
        // Comprovar si el navegador suporta les funcions necessàries
        const features = {
            blob: typeof Blob !== 'undefined',
            url: typeof URL !== 'undefined' && typeof URL.createObjectURL !== 'undefined',
            canvas: typeof HTMLCanvasElement !== 'undefined',
            promises: typeof Promise !== 'undefined',
            fetch: typeof fetch !== 'undefined'
        };
        
        return Object.values(features).every(feature => feature);
    }
    
    static async showDiagnosticsModal() {
        const results = await this.runDiagnostics();
        
        const statusIcon = (available) => available ? '✅' : '❌';
        const statusText = (available) => available ? 'Disponible' : 'No disponible';
        const statusColor = (available) => available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        
        const modal = `
            <div class="p-6 dark:bg-gray-800 max-w-lg">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">🔍</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Diagnòstic d'exportació PDF</h3>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span class="font-medium text-gray-700 dark:text-gray-300">Connexió a internet</span>
                        <span class="${statusColor(results.internetConnection)}">
                            ${statusIcon(results.internetConnection)} ${statusText(results.internetConnection)}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span class="font-medium text-gray-700 dark:text-gray-300">Llibreria jsPDF</span>
                        <span class="${statusColor(results.jsPDFAvailable)}">
                            ${statusIcon(results.jsPDFAvailable)} ${statusText(results.jsPDFAvailable)}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span class="font-medium text-gray-700 dark:text-gray-300">Llibreria html2pdf</span>
                        <span class="${statusColor(results.html2pdfAvailable)}">
                            ${statusIcon(results.html2pdfAvailable)} ${statusText(results.html2pdfAvailable)}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span class="font-medium text-gray-700 dark:text-gray-300">Navegador compatible</span>
                        <span class="${statusColor(results.browserCompatible)}">
                            ${statusIcon(results.browserCompatible)} ${statusText(results.browserCompatible)}
                        </span>
                    </div>
                    
                    ${results.recommendedMethod !== 'none' ? `
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                            <div class="font-medium text-blue-800 dark:text-blue-200">Mètode recomanat:</div>
                            <div class="text-sm text-blue-600 dark:text-blue-300">${results.recommendedMethod}</div>
                        </div>
                    ` : `
                        <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                            <div class="font-medium text-red-800 dark:text-red-200">Cap mètode disponible</div>
                            <div class="text-sm text-red-600 dark:text-red-300">Comprova la connexió a internet</div>
                        </div>
                    `}
                </div>
                
                ${results.errors.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Errors detectats:</h4>
                        <div class="space-y-1">
                            ${results.errors.map(error => `
                                <div class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                    ${error}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="border-t dark:border-gray-600 pt-4">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Solucions suggerides:</h4>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        ${!results.internetConnection ? '<li>• Comprova la teva connexió a internet</li>' : ''}
                        ${!results.jsPDFAvailable && !results.html2pdfAvailable ? '<li>• Prova a recarregar la pàgina</li>' : ''}
                        ${!results.browserCompatible ? '<li>• Actualitza el teu navegador a una versió més recent</li>' : ''}
                        <li>• Si el problema persisteix, prova amb l'exportació HTML i converteix-la manualment</li>
                    </ul>
                </div>
                
                <div class="flex justify-end gap-3 mt-6">
                    ${results.recommendedMethod !== 'none' ? `
                        <button onclick="this.testPDFExport(); hideModal()" 
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                            Provar exportació
                        </button>
                    ` : ''}
                    <button onclick="hideModal()" 
                            class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                        Tancar
                    </button>
                </div>
            </div>
        `;
        
        showModal(modal);
        
        // Afegir funció de test global
        window.testPDFExport = async () => {
            try {
                if (exportSystem) {
                    await exportSystem.exportPDF('test-document');
                } else {
                    await showAlert('Sistema d\'exportació no inicialitzat', 'error');
                }
            } catch (error) {
                await showAlert(`Error en test d'exportació: ${error.message}`, 'error');
            }
        };
    }
}

// Funcions globals
async function showPDFDiagnostics() {
    await PDFDiagnostics.showDiagnosticsModal();
}

async function quickPDFDiagnostic() {
    const results = await PDFDiagnostics.runDiagnostics();
    
    if (results.recommendedMethod === 'none') {
        await showAlert(
            'No s\'ha pogut configurar l\'exportació PDF.<br><br>' +
            '🔧 <strong>Solucions:</strong><br>' +
            '• Comprova la connexió a internet<br>' +
            '• Recarrega la pàgina<br>' +
            '• Prova l\'exportació HTML com alternativa',
            'warning'
        );
        return false;
    } else {
        await showAlert(`Exportació PDF configurada correctament amb ${results.recommendedMethod}`, 'success');
        return true;
    }
}