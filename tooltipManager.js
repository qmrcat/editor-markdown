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