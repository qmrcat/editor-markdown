function showAlert(message, type = 'info') {
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

        const content = `
            <div class="p-6 bg-white dark:bg-gray-800">
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-3">${iconMap[type]}</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Informació</h3>
                </div>
                <div class="mb-6 p-3 rounded border ${colorMap[type]} dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    ${message}
                </div>
                <div class="flex justify-end">
                    <button onclick="resolveModal(true)" 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        D'acord
                    </button>
                </div>
            </div>
        `;
        
        currentModalResolve = resolve;
        showModal(content);
    });
}

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