# Editor de Markdown

Un editor de Markdown modern i responsiu amb vista prèvia en temps real, tema fosc/clar, gestió d'emojis i funcionalitats avançades. Creat amb HTML, CSS (Tailwind v4) i JavaScript vanilla.

![Editor de Markdown](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Característiques principals

### 📝 Edició avançada
- **Vista prèvia en temps real** - Veu els canvis instantàniament mentre escrius
- **Barra d'eines completa** amb tooltips intel·ligents i menús desplegables
- **Dreceres de teclat** per a funcions comunes (Ctrl+B, Ctrl+I, Ctrl+S, etc.)
- **Editor amb highlight** i font monospai per a millor llegibilitat
- **Inserció d'imatges** via URL amb descripció alternativa
- **Sistema d'emojis avançat** amb shortcodes (:warning: → ⚠️)

### 🎨 Interfície moderna
- **Tema fosc/clar** amb commutació automàtica segons preferències del sistema
- **Disseny responsiu** adaptatiu per escriptori, tauleta i mòbil
- **Tooltips intel·ligents** que s'ajusten automàticament als marges
- **Modals elegants** amb opacitat ajustable
- **Transicions suaves** i animacions professionals
- **Menús desplegables** organitzats per categories

### 💾 Gestió de fitxers
- **Sistema dual d'emmagatzematge**:
  - Desar/obrir fitxers al disc dur (.md, .txt)
  - Emmagatzematge local al navegador amb gestió visual
- **Drag & Drop intel·ligent** - Arrossega fitxers directament a l'editor
- **Documents d'exemple** opcionals per començar ràpidament
- **Gestió completa** de documents locals (carregar, eliminar, organitzar)

### 📱 Experiència responsiva
- **Layout adaptatiu** que canvia segons la mida de pantalla
- **Vista dividida** (editor + vista prèvia) en pantalles grans
- **Vista apilada** optimitzada per dispositius mòbils
- **Botons tàctils** optimitzats per a pantalles tàctils
- **Menús scrollables** que s'adapten a l'espai disponible

## 🚀 Funcionalitats detallades

### Elements Markdown suportats
- **Títols complets** (H1 fins H6) via menú desplegable organitzat
- **Format de text**: negreta, cursiva, ratllat amb dreceres de teclat
- **Llistes avançades**: amb vinyetes, numerades i de tasques interactives
- **Contingut multimèdia**: enllaços, imatges via URL amb validació
- **Codi professional**: inline i blocs de codi amb syntax highlighting
- **Taules completes** amb capçaleres i formatació automàtica
- **Elements especials**: cites, línies horitzontals, paràgrafs

### Sistema d'emojis avançat
- **Conversió automàtica** de shortcodes a emojis en vista prèvia
- **Més de 150 emojis** organitzats per categories
- **Menú visual** amb categories: expressions, gestos, símbols, programació
- **Tooltip informatiu** mostra el shortcode de cada emoji
- **Scroll intel·ligent** per navegar per la biblioteca completa

### Barra d'eines professinal
- **Menú de títols** desplegable amb tots els nivells (H1-H6)
- **Botons de format** amb tooltips contextuals
- **Inserció ràpida** d'elements complexos (taules, enllaços, imatges)
- **Selector d'emojis** visual i organitzat per categories
- **Posicionament intel·ligent** dels tooltips segons la posició

### Gestió de documents
- **Obertura flexible**: disc dur o Local Storage amb selector visual
- **Desament intel·ligent** amb noms personalitzables i ubicació triable
- **Gestió visual** de documents guardats amb dates de modificació
- **Confirmacions de seguretat** abans de substituir contingut existent
- **Documents d'exemple** opcionals per usuaris nous

## 🛠️ Instal·lació i configuració

### Requisits mínims
- Navegador web modern compatible amb ES6+ (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript habilitat
- Tailwind CSS v4 (inclòs)

### Instal·lació local
1. **Descarrega el projecte**
   ```bash
   git clone [repository-url]
   cd markdown-editor
   ```

2. **Obre l'aplicació**
   - Simplement obre `index.html` al teu navegador
   - O utilitza un servidor local per millor rendiment

3. **Configuració opcional**
   - Tailwind CSS ja està compilat a `output.css`
   - No cal configuració adicional

### Estructura de fitxers
```
markdown-editor/
├── index.html          # Aplicació principal
├── output.css          # Estils Tailwind v4 compilats
├── README.md           # Documentació completa
└── assets/             # Recursos adicionals (si n'hi ha)
```

## ⌨️ Dreceres de teclat completes

| Drecera | Funció | Descripció |
|---------|--------|------------|
| `Ctrl + B` | **Negreta** | Aplica format negreta al text seleccionat |
| `Ctrl + I` | *Cursiva* | Aplica format cursiva al text seleccionat |
| `Ctrl + S` | Desar | Obre diàleg per desar el document |
| `Ctrl + O` | Obrir | Obre diàleg per carregar un document |
| `Tab` | Indentar | Afegeix 4 espais (útil per codi i llistes) |
| `Esc` | Tancar | Tanca modals i menús desplegables oberts |

## 🎯 Casos d'ús professionals

### Documentació tècnica
- **README** de repositoris amb emojis i format professional
- **Documentació d'API** amb taules i exemples de codi
- **Guies d'instal·lació** amb llistes de tasques interactives
- **Notes de versions** amb format estructurat

### Contingut personal
- **Notes d'estudis** amb títols organitzats i format visual
- **Apunts de reunions** amb llistes de tasques i emojis
- **Articles personals** amb vista prèvia en temps real
- **Planificació de projectes** amb taules i estat visual

### Desenvolupament
- **Documentació de codi** amb blocs de sintaxi
- **Issues i bugs** amb emojis descriptius i format clar
- **Changelogs** amb estructura professional
- **Wikis de projectes** amb navegació visual

## 🌟 Avantatges competitius

### Tecnologia moderna
- **Zero dependències externes** (excepte Tailwind CSS inclòs)
- **Funciona completament offline** un cop carregat
- **Rendiment optimitzat** amb JavaScript vanilla
- **Compatible amb PWA** per instal·lació com app nativa

### Experiència d'usuari
- **Interfície intuïtiva** accessible per principiants
- **Funcionalitats avançades** per usuaris experts
- **Feedback visual immediat** amb animacions i transicions
- **Accessibilitat completa** amb suport per lectors de pantalla

### Privacitat i seguretat
- **Dades 100% locals** - res s'envia a servidors externs
- **Control total** sobre els documents i configuració
- **Sense tracking** ni analítiques externes
- **Codi obert** i auditable

## 📱 Compatibilitat detallada

### Navegadors d'escriptori
- ✅ **Chrome** 80+ (recomanat)
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Edge** 80+
- ✅ **Opera** 67+

### Dispositius mòbils
- ✅ **iOS Safari** 13+
- ✅ **Chrome per Android** 80+
- ✅ **Samsung Internet** 11+
- ✅ **Firefox per mòbil** 79+

### Funcionalitats avançades
- ✅ **Local Storage** per guardar documents
- ✅ **File API** per drag & drop
- ✅ **CSS Grid** per layouts responsius
- ✅ **ES6 Modules** per organització del codi

## 🤝 Contribució i desenvolupament

### Com contribuir
1. **Fork del repositori** i crea una branca per la teva funcionalitat
2. **Implementa millores** seguint les convencions del codi existent
3. **Testa exhaustivament** en diferents navegadors i dispositius
4. **Envia pull request** amb descripció detallada dels canvis

### Àrees de millora
- 🎯 **Més emojis** i categories per al selector visual
- 📊 **Gràfics i diagrames** integrats (Mermaid, PlantUML)
- 🎨 **Més temes** i personalització visual
- 📱 **PWA completa** amb instal·lació offline
- 🔄 **Sincronització** amb serveis de núvol (opcional)

### Guidelines de desenvolupament
- **Mantenir compatibilitat** amb navegadors suportats
- **Optimitzar rendiment** - evitar dependències pesades
- **Accessibilitat prioritària** - suport complet per lectors de pantalla
- **Mobile-first** - dissenyar primer per mòbil, després escriptori

## 📄 Informació legal

### Llicència
Aquest projecte està sota **llicència MIT**. Consulta el fitxer `LICENSE` per detalls complets.

### Dependències
- **Tailwind CSS v4** - Framework CSS (MIT License)
- **Marked.js** - Parser de Markdown (MIT License)
- **Fonts del sistema** - Cap dependència externa de fonts

## 🆘 Suport i resolució de problemes

### Problemes comuns
- **JavaScript desactivat**: Activa JavaScript al navegador
- **Local Storage ple**: Neteja documents antics o exporta'ls
- **Drag & drop no funciona**: Comprova permisos del navegador
- **Vista prèvia no actualitza**: Refresca la pàgina

### Com obtenir ajuda
- 📧 **Issues del repositori** per bugs i suggeriments
- 📖 **Documentació completa** en aquest README
- 🔍 **Inspecciona el codi** - és completament llegible i comentat

### Debugging
- Obre **DevTools** (F12) per veure errors a la consola
- Comprova la **compatibilitat del navegador** amb la taula anterior
- Verifica que **Tailwind CSS es carregui** correctament

---

**Creat amb ❤️ i ☕ per facilitar l'escriptura professional en Markdown**

*Versió actual: 2.0 - Inclou tema fosc, emojis, menús desplegables i gestió avançada de fitxers*