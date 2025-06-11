// Funcions per gestionar el dropdown
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const button = dropdown.previousElementSibling;
    const parentDropdown = button.closest('.dropdown');
    
    // Tancar altres dropdowns oberts
    document.querySelectorAll('.dropdown-content.show').forEach(dd => {
        if (dd.id !== dropdownId) {
            dd.classList.remove('show');
            dd.closest('.dropdown').classList.remove('open');
        }
    });
    
    // Alternar el dropdown actual
    if (dropdown.classList.contains('show')) {
        closeDropdown(dropdownId);
    } else {
        openDropdown(dropdownId);
    }
}

function openDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const parentDropdown = dropdown.closest('.dropdown');
    
    dropdown.classList.add('show');
    parentDropdown.classList.add('open');
    
    // Ajustar posició si surt de la pantalla
    setTimeout(() => {
        const rect = dropdown.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.right > windowWidth - 10) {
            dropdown.style.left = 'auto';
            dropdown.style.right = '0';
        }
    }, 10);
}

function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const parentDropdown = dropdown.closest('.dropdown');
    
    dropdown.classList.remove('show');
    parentDropdown.classList.remove('open');
    
    // Resetar posició
    dropdown.style.left = '';
    dropdown.style.right = '';
}

// Tancar dropdown en fer clic fora
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (dropdownContent && dropdownContent.classList.contains('show')) {
                closeDropdown(dropdownContent.id);
            }
        }
    });
});

// Tancar dropdown amb Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
            closeDropdown(dropdown.id);
        });
    }
});