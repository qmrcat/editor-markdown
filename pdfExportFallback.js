// pdfExportFallback.js - Sistema PDF millorat amb múltiples opcions
class PDFExportManager {
    constructor() {
        this.preferredMethod = 'jspdf'; // 'jspdf' o 'html2pdf'
    }

    async exportPDF(fileName, content, options = {}) {
        try {
            if (this.preferredMethod === 'jspdf') {
                return await this.exportWithJSPDF(fileName, content, options);
            } else {
                return await this.exportWithHTML2PDF(fileName, content, options);
            }
        } catch (error) {
            console.warn(`Error amb ${this.preferredMethod}, provant mètode alternatiu:`, error);
            
            // Provar mètode alternatiu
            const alternativeMethod = this.preferredMethod === 'jspdf' ? 'html2pdf' : 'jspdf';
            try {
                return await (alternativeMethod === 'jspdf' ? 
                    this.exportWithJSPDF(fileName, content, options) : 
                    this.exportWithHTML2PDF(fileName, content, options));
            } catch (fallbackError) {
                throw new Error(`No s'ha pogut exportar PDF amb cap mètode disponible: ${fallbackError.message}`);
            }
        }
    }

    async exportWithJSPDF(fileName, content, options) {
        await this.loadJSPDF();
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: options.pageSize || 'a4'
        });

        // Procesar contingut
        const htmlContent = marked.parse(content);
        const lines = this.processMarkdownForJSPDF(content, pdf);
        
        this.renderContentWithJSPDF(pdf, lines, fileName, options);
        
        pdf.save(`${fileName}.pdf`);
        return true;
    }

    async exportWithHTML2PDF(fileName, content, options) {
        await this.loadHTML2PDF();
        
        const htmlContent = marked.parse(content);
        const styledHTML = this.generateStyledHTMLForPDF(htmlContent, fileName, options);
        
        // Crear element temporal
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = styledHTML;
        tempDiv.style.cssText = `
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 210mm;
            background: white;
            padding: 20mm;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        `;
        document.body.appendChild(tempDiv);

        try {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${fileName}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { 
                    scale: 1.5,
                    useCORS: true,
                    letterRendering: true,
                    logging: false
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: options.pageSize || 'a4', 
                    orientation: 'portrait' 
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await window.html2pdf().set(opt).from(tempDiv).save();
            return true;
        } finally {
            document.body.removeChild(tempDiv);
        }
    }

    processMarkdownForJSPDF(content, pdf) {
        const lines = [];
        const contentLines = content.split('\n');
        
        for (const line of contentLines) {
            if (!line.trim()) {
                lines.push({ text: '', type: 'spacing', height: 3 });
                continue;
            }
            
            let processedLine = this.parseMarkdownLine(line);
            
            // Dividir línies llargues
            if (processedLine.text) {
                const maxWidth = pdf.internal.pageSize.width - 40; // marges
                const wrappedLines = this.wrapText(processedLine.text, pdf, maxWidth, processedLine.type);
                
                wrappedLines.forEach((wrappedText, index) => {
                    lines.push({
                        ...processedLine,
                        text: wrappedText,
                        isFirstLine: index === 0
                    });
                });
            }
        }
        
        return lines;
    }

    parseMarkdownLine(line) {
        const trimmed = line.trim();
        
        // Títols
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
            return {
                text: headingMatch[2],
                type: 'heading',
                level: headingMatch[1].length,
                fontSize: Math.max(12, 18 - headingMatch[1].length),
                bold: true,
                spaceBefore: 8,
                spaceAfter: 4
            };
        }
        
        // Llistes
        if (trimmed.match(/^[-*+]\s+/)) {
            return {
                text: '• ' + trimmed.replace(/^[-*+]\s+/, ''),
                type: 'list',
                fontSize: 11,
                indent: 5
            };
        }
        
        // Llistes numerades
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
            return {
                text: `${numberedMatch[1]}. ${numberedMatch[2]}`,
                type: 'numberedList',
                fontSize: 11,
                indent: 5
            };
        }
        
        // Cites
        if (trimmed.startsWith('>')) {
            return {
                text: trimmed.replace(/^>\s*/, ''),
                type: 'quote',
                fontSize: 11,
                italic: true,
                indent: 10,
                spaceBefore: 3,
                spaceAfter: 3
            };
        }
        
        // Codi
        if (trimmed.startsWith('```') || trimmed.startsWith('    ')) {
            return {
                text: trimmed.replace(/^    /, ''),
                type: 'code',
                fontSize: 9,
                font: 'courier',
                background: true
            };
        }
        
        // Text normal
        return {
            text: this.cleanMarkdown(trimmed),
            type: 'paragraph',
            fontSize: 11,
            spaceAfter: 2
        };
    }

    cleanMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // negreta
            .replace(/\*(.*?)\*/g, '$1')     // cursiva
            .replace(/~~(.*?)~~/g, '$1')     // ratllat
            .replace(/`(.*?)`/g, '$1')       // codi inline
            .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // enllaços
    }

    wrapText(text, pdf, maxWidth, type) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            // Configurar font temporalment per mesurar
            this.setFontForType(pdf, type);
            const textWidth = pdf.getTextWidth(testLine);
            
            if (textWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [''];
    }

    setFontForType(pdf, type) {
        switch (type) {
            case 'heading':
                pdf.setFont('helvetica', 'bold');
                break;
            case 'code':
                pdf.setFont('courier', 'normal');
                break;
            case 'quote':
                pdf.setFont('helvetica', 'italic');
                break;
            default:
                pdf.setFont('helvetica', 'normal');
        }
    }

    renderContentWithJSPDF(pdf, lines, fileName, options) {
        const pageHeight = pdf.internal.pageSize.height;
        const margin = 20;
        let yPosition = margin;
        
        // Títol del document
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(fileName, margin, yPosition);
        yPosition += 15;
        
        // Data
        if (options.includeDate) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const date = new Date().toLocaleDateString('ca-ES');
            pdf.text(`Generat el ${date}`, margin, yPosition);
            yPosition += 10;
        }
        
        // Línia separadora
        pdf.setDrawColor(150);
        pdf.line(margin, yPosition, pdf.internal.pageSize.width - margin, yPosition);
        yPosition += 10;
        
        // Contingut
        for (const line of lines) {
            // Comprovar si necessitem nova pàgina
            const neededSpace = line.spaceBefore || 0 + 7 + (line.spaceAfter || 0);
            if (yPosition + neededSpace > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            
            // Espai abans
            if (line.spaceBefore) {
                yPosition += line.spaceBefore;
            }
            
            // Configurar font
            pdf.setFontSize(line.fontSize || 11);
            this.setFontForType(pdf, line.type);
            
            // Renderitzar text
            const xPosition = margin + (line.indent || 0);
            if (line.text) {
                pdf.text(line.text, xPosition, yPosition);
            }
            
            yPosition += 7; // altura de línia base
            
            // Espai després
            if (line.spaceAfter) {
                yPosition += line.spaceAfter;
            }
        }
        
        // Numeració de pàgines
        if (options.includePageNumbers) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`${i}`, pdf.internal.pageSize.width - margin - 10, pageHeight - 10);
            }
        }
    }

    generateStyledHTMLForPDF(content, title, options) {
        const date = options.includeDate ? 
            `<p style="color: #666; font-size: 12px; margin: 5px 0 20px 0;">Generat el ${new Date().toLocaleDateString('ca-ES')}</p>` : '';
        
        return `
            <div style="max-width: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;">${title}</h1>
                ${date}
                <div style="font-size: 12px;">
                    ${content}
                </div>
            </div>
        `;
    }

    async loadJSPDF() {
        if (window.jspdf) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('No s\'ha pogut carregar jsPDF'));
            document.head.appendChild(script);
        });
    }

    async loadHTML2PDF() {
        if (window.html2pdf) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('No s\'ha pogut carregar html2pdf'));
            document.head.appendChild(script);
        });
    }

    // Mètode per provar connexió i triar millor opció
    async detectBestMethod() {
        try {
            await this.loadJSPDF();
            this.preferredMethod = 'jspdf';
            return 'jspdf';
        } catch (error) {
            try {
                await this.loadHTML2PDF();
                this.preferredMethod = 'html2pdf';
                return 'html2pdf';
            } catch (fallbackError) {
                throw new Error('Cap mètode d\'exportació PDF disponible');
            }
        }
    }
}

// Instància global
const pdfExportManager = new PDFExportManager();