const durationToast = 4000; // Durada per defecte dels toasts


// function showAlertVell(message, type = 'info') {
//     return new Promise((resolve) => {
//         const iconMap = {
//             'info': '💡',
//             'success': '✅', 
//             'warning': '⚠️',
//             'error': '❌'
//         };
        
//         const colorMap = {
//             'info': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
//             'success': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
//             'warning': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
//             'error': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
//         };

//         const content = `
//             <div class="p-6 bg-white dark:bg-gray-800">
//                 <div class="flex items-center mb-4">
//                     <span class="text-2xl mr-3">${iconMap[type]}</span>
//                     <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Informació</h3>
//                 </div>
//                 <div class="mb-6 p-3 rounded border ${colorMap[type]} dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
//                     ${message}
//                 </div>
//                 <div class="flex justify-end">
//                     <button onclick="resolveModal(true)" 
//                             class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
//                         D'acord
//                     </button>
//                 </div>
//             </div>
//         `;
        
//         currentModalResolve = resolve;
//         showModal(content);
//     });
// }


////////////////////////////////////////////////////////////////////////////////////////

// Sistema d'alertes millorat
function showAlert(message, type = 'info', autoClose = true, duration = durationToast) {
    return new Promise((resolve) => {
        const iconMap = {
            'info': '💡',
            'success': '✅', 
            'warning': '⚠️',
            'error': '❌'
        };
        
        const colorMap = {
            'info': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
            'success': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
            'warning': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
            'error': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
        };

        // Determinar si usar toast o modal
        const useToast = (type === 'info' || type === 'success');
        
        if (useToast) {
            showToastAlert(message, type, iconMap[type], colorMap[type], autoClose, duration, resolve);
        } else {
            showModalAlert(message, type, iconMap[type], colorMap[type], resolve);
        }
    });
}

// Alertes tipus toast (dalt esquerra)
function showToastAlert(message, type, icon, colorClasses, autoClose, duration, resolve) {
    // Crear contenidor de toasts si no existeix
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed top-4 left-4 z-50 space-y-2 max-w-sm';
        document.body.appendChild(toastContainer);
    }

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `transform transition-all duration-300 translate-x-[-100%] opacity-0 p-4 rounded-lg border shadow-lg ${colorClasses}`;
    
    toast.innerHTML = `
        <div class="flex items-start">
            <span class="text-xl mr-3 flex-shrink-0">${icon}</span>
            <div class="flex-1">
                <div class="font-medium">${type === 'info' ? 'Informació' : 'Èxit'}</div>
                <div class="text-sm mt-1">${message}</div>
            </div>
            <button onclick="removeToast(this.parentElement.parentElement)" 
                    class="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Animació d'entrada
    setTimeout(() => {
        toast.classList.remove('translate-x-[-100%]', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Auto-tancament
    if (autoClose && (type === 'info' || type === 'success')) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    // Resolve promise immediatament per toasts
    resolve(true);
}

// Alertes tipus modal (centre)
function showModalAlert(message, type, icon, colorClasses, resolve) {
    const content = `
        <div class="p-6">
            <div class="flex items-center mb-4">
                <span class="text-2xl mr-3">${icon}</span>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    ${type === 'warning' ? 'Advertència' : 'Error'}
                </h3>
            </div>
            <div class="mb-6 p-3 rounded border ${colorClasses}">
                ${message}
            </div>
            <div class="flex justify-end">
                <button onclick="resolveModalAlert(true)" 
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    D'acord
                </button>
            </div>
        </div>
    `;
    
    currentModalAlertResolve = resolve;
    showModal(content);
}

// Variables globals per gestionar alerts
let currentModalAlertResolve = null;

// Funció per resoldre modal alerts
function resolveModalAlert(value) {
    if (currentModalAlertResolve) {
        const resolve = currentModalAlertResolve;
        currentModalAlertResolve = null;
        hideModal();
        resolve(value);
    }
}

// Funció per eliminar toasts
function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.classList.add('translate-x-[-100%]', 'opacity-0');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
                
                // Eliminar contenidor si està buit
                const container = document.getElementById('toastContainer');
                if (container && container.children.length === 0) {
                    container.remove();
                }
            }
        }, 300);
    }
}

// Funcions de conveniència
function showSuccessToast(message, duration = 3000) {
    return showAlert(message, 'success', true, duration);
}

function showInfoToast(message, duration = 4000) {
    return showAlert(message, 'info', true, duration);
}

function showWarningModal(message) {
    return showAlert(message, 'warning', false);
}

function showErrorModal(message) {
    return showAlert(message, 'error', false);
}


////////////////////////////////////////////////////////////////////////////////////////

function showConfirm(message, confirmText = 'Acceptar', cancelText = 'Cancel·lar') {
    return new Promise((resolve) => {
        const content = `
            <div class="p-6 dark:bg-gray-800">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">❓</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirmació</h3>
                </div>
                <div class="mb-6 text-gray-700 dark:text-gray-200">
                    ${message}
                </div>
                <div class="flex justify-end gap-3">
                    <button onclick="resolveModal(false)" 
                            class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                        ${cancelText}
                    </button>
                    <button onclick="resolveModal(true)" 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;
        
        currentModalResolve = resolve;
        showModal(content);
    });
}

function showPrompt(message, defaultValue = '', placeholder = '') {
    return new Promise((resolve) => {
        const content = `
            <div class="p-6 dark:bg-gray-800">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">✏️</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Entrada requerida</h3>
                </div>
                <div class="mb-4 text-gray-700 dark:text-gray-200">
                    ${message}
                </div>
                <input type="text" id="promptInput" value="${defaultValue}" placeholder="${placeholder}"
                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <div class="flex justify-end gap-3">
                    <button onclick="resolveModal(null)" 
                            class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                        Cancel·lar
                    </button>
                    <button onclick="resolveModal(document.getElementById('promptInput').value)" 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Acceptar
                    </button>
                </div>
            </div>
        `;
        
        currentModalResolve = resolve;
        showModal(content);
        
        // Focus en l'input i seleccionar text
        setTimeout(() => {
            const input = document.getElementById('promptInput');
            if (input) {
                input.focus();
                input.select();
                
                // Enter per acceptar
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        resolveModal(input.value);
                    }
                });
            }
        }, 100);
    });
}

function showLocationChoice(message, option1 = 'Disc dur', option2 = 'Local Storage') {
    return new Promise((resolve) => {
        const content = `
            <div class="p-6 dark:bg-gray-800">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">📍</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Triar ubicació</h3>
                </div>
                <div class="mb-6 text-gray-700 dark:text-gray-200">
                    ${message}
                </div>
                <div class="flex flex-col gap-3">
                    <button onclick="resolveModal('disk')" 
                            class="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span class="text-2xl mr-3">💾</span>
                        <div class="text-left">
                            <div class="font-semibold dark:text-gray-100">${option1}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Desar/obrir fitxers al teu ordinador</div>
                        </div>
                    </button>
                    <button onclick="resolveModal('storage')" 
                            class="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span class="text-2xl mr-3">🗄️</span>
                        <div class="text-left">
                            <div class="font-semibold dark:text-gray-100">${option2}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Desar/obrir del navegador (local)</div>
                        </div>
                    </button>
                </div>
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


// Sistema de tooltips avançat (opcional)
class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        // Crear element tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip-advanced';
        this.tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 9999;
            white-space: nowrap;
        `;
        document.body.appendChild(this.tooltip);

        // Afegir listeners
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.show(target, target.getAttribute('data-tooltip'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hide();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.tooltip.style.opacity === '1') {
                this.position(e);
            }
        });
    }

    show(element, text) {
        this.tooltip.textContent = text;
        this.tooltip.style.opacity = '1';
    }

    hide() {
        this.tooltip.style.opacity = '0';
    }

    position(event) {
        const tooltip = this.tooltip;
        const x = event.clientX;
        const y = event.clientY;
        
        // Posicionar tooltip
        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y - 30) + 'px';

        // Ajustar si surt de la pantalla
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = (x - rect.width - 10) + 'px';
        }
        if (rect.top < 0) {
            tooltip.style.top = (y + 20) + 'px';
        }
    }
}