function quantAleditor() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50';
    
    const content = document.createElement('div');
    content.className = 'bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full';
    
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold mb-4 text-gray-800 dark:text-gray-100';
    title.textContent = 'Quant a l\'Editor de Markdown';
    
    const description = document.createElement('p');
    description.className = 'text-gray-700 dark:text-gray-300 mb-4';
    description.innerHTML = `
        <strong>Versió:</strong> 0.5.1<br>
        <strong>Desenvolupador:</strong> Joan Miralles<br>
        <strong>Data de l'última actualització:</strong> 2023-10-01<br>
        <strong>Funcionalitats:</strong><br>
        - Edició de Markdown en temps real<br>
        - Previsualització en viu<br>
        - Suport per a emojis i imatges<br>
        - Canvi de tema (clar/fosc)<br>
        - Importació i exportació de fitxers Markdown
    `;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
    closeButton.textContent = 'Tancar';
    closeButton.onclick = () => {
        document.body.removeChild(modal);
    };
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(closeButton);
    
    modal.appendChild(content);
    
    document.body.appendChild(modal);
}