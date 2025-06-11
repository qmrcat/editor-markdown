function initializeTheme() {
    // Comprovar preferència guardada
    console.log("🚀 ~ initializeTheme ~ "

    )
    const savedTheme = localStorage.getItem('markdownEditorTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema guardat o preferència del sistema
    isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    applyTheme();
    updateThemeButton();
}
    

// Alternar entre tema fosc i clar
function toggleTheme() {

    isDarkMode = !isDarkMode;
    
    applyTheme();
    updateThemeButton();
    
    // Guardar preferència
    localStorage.setItem('markdownEditorTheme', isDarkMode ? 'dark' : 'light');
}

// Aplicar el tema seleccionat
function applyTheme() {
    // const html = document.documentElement;
    
    // if (isDarkMode) {
    //     html.classList.add('dark');
    // } else {
    //     html.classList.remove('dark');
    // }
        const body = document.documentElement;
    
    if (isDarkMode) {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
}

// Actualitzar text i icona del botó de tema
function updateThemeButton() {
    const themeButton = document.getElementById('themeToggle');
    if (themeButton) {
        const icon = isDarkMode ? '☀️' : '🌙';
        const text = isDarkMode ? 'Tema clar' : 'Tema fosc';
        themeButton.innerHTML = `${icon} ${text}`;
    }
}