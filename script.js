class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.textElements = [];
        this.shapeElements = [];
        this.allElements = []; // Lista unificada para manejo de capas
        this.selectedElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentImage = null;
        this.textCounter = 0;
        this.shapeCounter = 0;
        this.layerCounter = 0;
        this.imageColors = []; // Para almacenar colores dominantes de la imagen
        this.imagePosition = { x: 0, y: 0 };
        this.imageScale = { width: 0, height: 0 };
        this.isDraggingImage = false;
        this.positionConfirmed = new Set(); // Track de elementos con posición confirmada
        this.backgroundSettings = {
            type: 'solid',
            color: '#ffffff',
            gradient: {
                color1: '#ffffff',
                color2: '#000000',
                direction: 'horizontal'
            },
            imageGradient: {
                intensity: 0.8,
                blur: 20,
                glass: 0.6,
                direction: 'radial'
            }
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupCanvas();
    }
    
    initializeElements() {
        this.imageInput = document.getElementById('imageInput');
        this.textInput = document.getElementById('textInput');
        this.addTextBtn = document.getElementById('addTextBtn');
        this.deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.textElementsContainer = document.getElementById('textElements');
        
        // Controles de canvas
        this.canvasPreset = document.getElementById('canvasPreset');
        this.canvasWidth = document.getElementById('canvasWidth');
        this.canvasHeight = document.getElementById('canvasHeight');
        this.applyCanvasSizeBtn = document.getElementById('applyCanvasSize');
        this.imageMode = document.getElementById('imageMode');
        this.imageDraggable = document.getElementById('imageDraggable');
        
        // Controles de fondo
        this.backgroundType = document.getElementById('backgroundType');
        this.backgroundColor = document.getElementById('backgroundColor');
        this.gradientColor1 = document.getElementById('gradientColor1');
        this.gradientColor2 = document.getElementById('gradientColor2');
        this.gradientDirection = document.getElementById('gradientDirection');
        this.applyBackgroundBtn = document.getElementById('applyBackground');
        this.solidColorGroup = document.getElementById('solidColorGroup');
        this.gradientGroup = document.getElementById('gradientGroup');
        
        // Controles de gradiente de imagen
        this.imageGradientGroup = document.getElementById('imageGradientGroup');
        this.imageGradientIntensity = document.getElementById('imageGradientIntensity');
        this.imageGradientBlur = document.getElementById('imageGradientBlur');
        this.imageGradientGlass = document.getElementById('imageGradientGlass');
        this.imageGradientDirection = document.getElementById('imageGradientDirection');
        this.intensityValue = document.getElementById('intensityValue');
        this.blurValue = document.getElementById('blurValue');
        this.glassValue = document.getElementById('glassValue');
        
        // Controles de texto
        this.textEditable = document.getElementById('textEditable');
        
        // Controles de formas
        this.shapeType = document.getElementById('shapeType');
        this.addShapeBtn = document.getElementById('addShapeBtn');
        this.shapeFillColor = document.getElementById('shapeFillColor');
        this.shapeStrokeColor = document.getElementById('shapeStrokeColor');
        this.shapeStrokeWidth = document.getElementById('shapeStrokeWidth');
        this.shapeStrokeWidthValue = document.getElementById('shapeStrokeWidthValue');
        this.shapeOpacity = document.getElementById('shapeOpacity');
        this.shapeOpacityValue = document.getElementById('shapeOpacityValue');
        
        // Controles de capas
        this.confirmPositionBtn = document.getElementById('confirmPositionBtn');
        this.moveToFrontBtn = document.getElementById('moveToFrontBtn');
        this.moveToBackBtn = document.getElementById('moveToBackBtn');
        this.moveUpBtn = document.getElementById('moveUpBtn');
        this.moveDownBtn = document.getElementById('moveDownBtn');
        this.layersList = document.getElementById('layersList');
        
        // Propiedades del texto
        this.fontSize = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.fontColor = document.getElementById('fontColor');
        this.fontFamily = document.getElementById('fontFamily');
        this.fontWeight = document.getElementById('fontWeight');
        this.textAlign = document.getElementById('textAlign');
        this.textShadow = document.getElementById('textShadow');
        this.textStroke = document.getElementById('textStroke');
        this.strokeColor = document.getElementById('strokeColor');
        
        // Presets de dimensiones para redes sociales
        this.socialMediaPresets = {
            'instagram-square': { width: 1080, height: 1080 },
            'instagram-story': { width: 1080, height: 1920 },
            'facebook-post': { width: 1200, height: 630 },
            'facebook-cover': { width: 820, height: 312 },
            'whatsapp-status': { width: 1080, height: 1920 },
            'twitter-post': { width: 1200, height: 675 },
            'youtube-thumbnail': { width: 1280, height: 720 },
            'linkedin-post': { width: 1200, height: 627 }
        };
    }
    
    setupEventListeners() {
        this.imageInput.addEventListener('change', (e) => this.loadImage(e));
        this.addTextBtn.addEventListener('click', () => this.addText());
        this.deleteSelectedBtn.addEventListener('click', () => this.deleteSelected());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.debugBtn = document.getElementById('debugBtn');
        this.debugBtn.addEventListener('click', () => this.showDebugInfo());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        
        // Controles de canvas
        this.canvasPreset.addEventListener('change', () => this.handlePresetChange());
        this.applyCanvasSizeBtn.addEventListener('click', () => this.applyCanvasSize());
        this.imageMode.addEventListener('change', () => this.redrawCanvas());
        
        // Controles de fondo
        this.backgroundType.addEventListener('change', () => this.handleBackgroundTypeChange());
        this.applyBackgroundBtn.addEventListener('click', () => this.applyBackground());
        
        // Controles de gradiente de imagen
        this.imageGradientIntensity.addEventListener('input', (e) => {
            this.intensityValue.textContent = e.target.value;
        });
        this.imageGradientBlur.addEventListener('input', (e) => {
            this.blurValue.textContent = e.target.value + 'px';
        });
        this.imageGradientGlass.addEventListener('input', (e) => {
            this.glassValue.textContent = e.target.value;
        });
        
        // Controles de formas
        this.addShapeBtn.addEventListener('click', () => this.addShape());
        this.shapeStrokeWidth.addEventListener('input', (e) => {
            this.shapeStrokeWidthValue.textContent = e.target.value + 'px';
            this.updateSelectedShapeProperties();
        });
        this.shapeOpacity.addEventListener('input', (e) => {
            this.shapeOpacityValue.textContent = e.target.value + '%';
            this.updateSelectedShapeProperties();
        });
        this.shapeFillColor.addEventListener('change', () => this.updateSelectedShapeProperties());
        this.shapeStrokeColor.addEventListener('change', () => this.updateSelectedShapeProperties());
        
        // Controles de capas
        this.confirmPositionBtn.addEventListener('click', () => this.confirmPosition());
        this.moveToFrontBtn.addEventListener('click', () => this.moveLayer('front'));
        this.moveToBackBtn.addEventListener('click', () => this.moveLayer('back'));
        this.moveUpBtn.addEventListener('click', () => this.moveLayer('up'));
        this.moveDownBtn.addEventListener('click', () => this.moveLayer('down'));
        
        // Control de propiedades
        this.fontSize.addEventListener('input', (e) => {
            this.fontSizeValue.textContent = e.target.value + 'px';
            this.updateSelectedTextProperties();
        });
        
        this.fontColor.addEventListener('change', () => this.updateSelectedTextProperties());
        this.fontFamily.addEventListener('change', () => this.updateSelectedTextProperties());
        this.fontWeight.addEventListener('change', () => this.updateSelectedTextProperties());
        this.textAlign.addEventListener('change', () => this.updateSelectedTextProperties());
        this.textShadow.addEventListener('change', () => this.updateSelectedTextProperties());
        this.textStroke.addEventListener('change', () => {
            this.strokeColor.disabled = !this.textStroke.checked;
            this.updateSelectedTextProperties();
        });
        this.strokeColor.addEventListener('change', () => this.updateSelectedTextProperties());
        
        // Events del canvas para hacer clic y añadir texto
        // this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        
        // Permitir Enter en el input de texto
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addText();
            }
        });
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.updateCanvasInputs();
        this.drawPlaceholder();
    }
    
    updateCanvasInputs() {
        this.canvasWidth.value = this.canvas.width;
        this.canvasHeight.value = this.canvas.height;
    }
    
    handlePresetChange() {
        const preset = this.canvasPreset.value;
        if (preset !== 'custom' && this.socialMediaPresets[preset]) {
            const dimensions = this.socialMediaPresets[preset];
            this.canvasWidth.value = dimensions.width;
            this.canvasHeight.value = dimensions.height;
        }
    }
    
    applyCanvasSize() {
        const width = parseInt(this.canvasWidth.value);
        const height = parseInt(this.canvasHeight.value);
        
        if (width < 100 || width > 2000 || height < 100 || height > 2000) {
            alert('Las dimensiones deben estar entre 100 y 2000 píxeles.');
            return;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasPreset.value = 'custom';
        this.redrawCanvas();
    }
    
    handleBackgroundTypeChange() {
        const type = this.backgroundType.value;
        this.solidColorGroup.style.display = type === 'solid' ? 'flex' : 'none';
        this.gradientGroup.style.display = type === 'gradient' ? 'block' : 'none';
        this.imageGradientGroup.style.display = type === 'image-gradient' ? 'block' : 'none';
        
        // Si se selecciona gradiente de imagen pero no hay imagen, mostrar mensaje
        if (type === 'image-gradient' && !this.currentImage) {
            alert('Primero debes cargar una imagen para usar el gradiente basado en imagen.');
            this.backgroundType.value = 'solid';
            this.handleBackgroundTypeChange();
        }
    }
    
    applyBackground() {
        this.backgroundSettings.type = this.backgroundType.value;
        this.backgroundSettings.color = this.backgroundColor.value;
        this.backgroundSettings.gradient.color1 = this.gradientColor1.value;
        this.backgroundSettings.gradient.color2 = this.gradientColor2.value;
        this.backgroundSettings.gradient.direction = this.gradientDirection.value;
        
        // Configuraciones para gradiente de imagen
        if (this.backgroundType.value === 'image-gradient') {
            this.backgroundSettings.imageGradient = {
                intensity: parseFloat(this.imageGradientIntensity.value),
                blur: parseInt(this.imageGradientBlur.value),
                glass: parseFloat(this.imageGradientGlass.value),
                direction: this.imageGradientDirection.value
            };
        }
        
        this.redrawCanvas();
    }
    
    drawPlaceholder() {
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#6c757d';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Haz clic aquí para cargar una imagen', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.extractImageColors(); // Extraer colores dominantes
                
                // La imagen siempre se ajusta al tamaño del canvas actual
                // No cambiamos las dimensiones del canvas, la imagen se adapta
                this.redrawCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar fondo
        this.drawBackground();
        
        if (this.currentImage) {
            const mode = this.imageMode.value;
            
            switch (mode) {
                case 'fit':
                    this.drawImageFit();
                    break;
                case 'fill':
                    this.drawImageFill();
                    break;
                case 'stretch':
                    this.drawImageStretch();
                    break;
                default:
                    this.drawImageFit();
            }
        }
    }
    
    drawBackground() {
        if (this.backgroundSettings.type === 'none') return;
        
        if (this.backgroundSettings.type === 'solid') {
            this.ctx.fillStyle = this.backgroundSettings.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundSettings.type === 'gradient') {
            let gradient;
            const { color1, color2, direction } = this.backgroundSettings.gradient;
            
            switch (direction) {
                case 'horizontal':
                    gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
                    break;
                case 'vertical':
                    gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                    break;
                case 'diagonal':
                    gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                    break;
            }
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundSettings.type === 'image-gradient') {
            // Crear efecto glass/espejo con múltiples capas
            const imageGradient = this.createImageGradientForContext(this.ctx);
            if (imageGradient) {
                const glassIntensity = this.backgroundSettings.imageGradient?.glass || parseFloat(this.imageGradientGlass.value);
                
                // Capa base: gradiente principal
                this.ctx.fillStyle = imageGradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Capa de textura glass: gradiente radial sutil
                const glassGradient = this.ctx.createRadialGradient(
                    this.canvas.width * 0.3, this.canvas.height * 0.2, 0,
                    this.canvas.width * 0.7, this.canvas.height * 0.8, 
                    Math.max(this.canvas.width, this.canvas.height) * 0.8
                );
                glassGradient.addColorStop(0, `rgba(255, 255, 255, ${0.05 * glassIntensity})`);
                glassGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.02 * glassIntensity})`);
                glassGradient.addColorStop(1, `rgba(0, 0, 0, ${0.1 * glassIntensity})`);
                
                this.ctx.fillStyle = glassGradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Efecto de viñeta para profundidad
                const vignetteGradient = this.ctx.createRadialGradient(
                    this.canvas.width / 2, this.canvas.height / 2, 0,
                    this.canvas.width / 2, this.canvas.height / 2,
                    Math.max(this.canvas.width, this.canvas.height) * 0.6
                );
                vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                vignetteGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
                vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * glassIntensity})`);
                
                this.ctx.fillStyle = vignetteGradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
    
    drawImageFit() {
        // Ajustar manteniendo proporción (puede dejar espacios)
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = this.currentImage.width / this.currentImage.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imageAspect > canvasAspect) {
            // La imagen es más ancha, ajustar por ancho
            drawWidth = this.canvas.width;
            drawHeight = this.canvas.width / imageAspect;
            drawX = 0;
            drawY = (this.canvas.height - drawHeight) / 2;
        } else {
            // La imagen es más alta, ajustar por altura
            drawWidth = this.canvas.height * imageAspect;
            drawHeight = this.canvas.height;
            drawX = (this.canvas.width - drawWidth) / 2;
            drawY = 0;
        }
        
        // Actualizar posición y escala para el arrastre
        this.imagePosition.x = drawX;
        this.imagePosition.y = drawY;
        this.imageScale.width = drawWidth;
        this.imageScale.height = drawHeight;
        
        this.ctx.drawImage(this.currentImage, drawX, drawY, drawWidth, drawHeight);
    }
    
    drawImageFill() {
        // Llenar todo el canvas (puede recortar partes de la imagen)
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = this.currentImage.width / this.currentImage.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imageAspect > canvasAspect) {
            // La imagen es más ancha, ajustar por altura
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * imageAspect;
            drawX = (this.canvas.width - drawWidth) / 2;
            drawY = 0;
        } else {
            // La imagen es más alta, ajustar por ancho
            drawWidth = this.canvas.width;
            drawHeight = this.canvas.width / imageAspect;
            drawX = 0;
            drawY = (this.canvas.height - drawHeight) / 2;
        }
        
        // Actualizar posición y escala para el arrastre
        this.imagePosition.x = drawX;
        this.imagePosition.y = drawY;
        this.imageScale.width = drawWidth;
        this.imageScale.height = drawHeight;
        
        this.ctx.drawImage(this.currentImage, drawX, drawY, drawWidth, drawHeight);
    }
    
    drawImageStretch() {
        // Estirar para llenar todo el canvas (puede deformar)
        this.imagePosition.x = 0;
        this.imagePosition.y = 0;
        this.imageScale.width = this.canvas.width;
        this.imageScale.height = this.canvas.height;
        
        this.ctx.drawImage(this.currentImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    startShapeResize(event, element) {
        this.isResizing = true;
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = parseInt(element.style.width);
        const startHeight = parseInt(element.style.height);
        
        const onMouseMove = (e) => {
            if (!this.isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newWidth = Math.max(20, startWidth + deltaX);
            const newHeight = Math.max(20, startHeight + deltaY);
            
            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        };
        
        const onMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    updateSelectedShapeProperties() {
        if (!this.selectedElement || this.selectedElement.type !== 'shape') return;
        
        this.applyShapeStyles(this.selectedElement.element);
    }
    
    addText() {
        const text = this.textInput.value.trim();
        if (!text) {
            alert('Por favor, escribe algún texto primero.');
            return;
        }
        
        const textElement = this.createTextElement(text, 50, 50);
        this.textElements.push(textElement);
        this.textInput.value = '';
        this.selectElement(textElement, 'text');
    }
    
    addShape() {
        const shapeElement = this.createShapeElement(100, 100, 100, 100);
        this.shapeElements.push(shapeElement);
        this.selectElement(shapeElement, 'shape');
    }
    
    handleCanvasMouseDown(event) {
        if (!this.imageDraggable.checked || !this.currentImage) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Verificar si el clic está sobre la imagen
        if (this.isPointOnImage(x, y)) {
            this.isDraggingImage = true;
            this.dragOffset.x = x - this.imagePosition.x;
            this.dragOffset.y = y - this.imagePosition.y;
            
            const onMouseMove = (e) => {
                if (!this.isDraggingImage) return;
                
                const rect = this.canvas.getBoundingClientRect();
                const newX = e.clientX - rect.left - this.dragOffset.x;
                const newY = e.clientY - rect.top - this.dragOffset.y;
                
                this.imagePosition.x = newX;
                this.imagePosition.y = newY;
                this.redrawCanvas();
            };
            
            const onMouseUp = () => {
                this.isDraggingImage = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }
    
    isPointOnImage(x, y) {
        return x >= this.imagePosition.x && 
               x <= this.imagePosition.x + this.imageScale.width &&
               y >= this.imagePosition.y && 
               y <= this.imagePosition.y + this.imageScale.height;
    }
    
    createTextElement(text, x, y) {
        this.textCounter++;
        this.layerCounter++;
        
        const element = document.createElement('div');
        element.className = 'text-element';
        element.id = `text-${this.textCounter}`;
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = '200px'; // Ancho inicial
        element.style.zIndex = this.layerCounter;
        
        // Hacer editable si está habilitado
        if (this.textEditable.checked) {
            element.contentEditable = true;
            element.classList.add('editable');
        }
        element.textContent = text;
        
        // Aplicar estilos iniciales
        this.applyTextStyles(element);
        
        // Añadir handle de redimensionado vertical (esquina)
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        element.appendChild(resizeHandle);
        
        // Añadir handle de redimensionado horizontal
        const resizeHandleHorizontal = document.createElement('div');
        resizeHandleHorizontal.className = 'resize-handle-horizontal';
        element.appendChild(resizeHandleHorizontal);
        
        // Event listeners
        element.addEventListener('mousedown', (e) => this.startDrag(e, element, 'text'));
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement({
                id: element.id,
                element: element,
                text: text,
                x: x,
                y: y,
                type: 'text',
                layer: this.layerCounter,
                confirmed: false
            }, 'text');
        });
        
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startResize(e, element);
        });
        
        resizeHandleHorizontal.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startHorizontalResize(e, element);
        });
        
        this.textElementsContainer.appendChild(element);
        
        const textObj = {
            id: element.id,
            element: element,
            text: text,
            x: x,
            y: y,
            type: 'text',
            layer: this.layerCounter,
            confirmed: false,
            visible: true
        };
        
        this.allElements.push(textObj);
        this.updateLayersList();
        
        return textObj;
    }
    
    applyTextStyles(element) {
        element.style.fontSize = this.fontSize.value + 'px';
        element.style.color = this.fontColor.value;
        element.style.fontFamily = this.fontFamily.value;
        element.style.fontWeight = this.fontWeight.value;
        element.style.textAlign = this.textAlign.value;
        
        if (this.textShadow.checked) {
            element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        } else {
            element.style.textShadow = 'none';
        }
        
        if (this.textStroke.checked) {
            element.style.webkitTextStroke = `1px ${this.strokeColor.value}`;
        } else {
            element.style.webkitTextStroke = 'none';
        }
    }
    
    addShape() {
        const shapeElement = this.createShapeElement(100, 100, 100, 100);
        this.shapeElements.push(shapeElement);
        this.selectElement(shapeElement, 'shape');
    }
    
    createShapeElement(x, y, width, height) {
        this.shapeCounter++;
        this.layerCounter++;
        
        const element = document.createElement('div');
        element.className = 'shape-element';
        element.id = `shape-${this.shapeCounter}`;
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        element.style.zIndex = this.layerCounter;
        
        // Aplicar estilos iniciales
        this.applyShapeStyles(element);
        
        // Añadir handle de redimensionado
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        element.appendChild(resizeHandle);
        
        // Event listeners
        element.addEventListener('mousedown', (e) => this.startDrag(e, element, 'shape'));
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement({
                id: element.id,
                element: element,
                type: this.shapeType.value,
                x: x,
                y: y,
                width: width,
                height: height,
                layer: this.layerCounter,
                confirmed: false
            }, 'shape');
        });
        
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startShapeResize(e, element);
        });
        
        this.textElementsContainer.appendChild(element);
        
        const shapeObj = {
            id: element.id,
            element: element,
            type: this.shapeType.value,
            x: x,
            y: y,
            width: width,
            height: height,
            layer: this.layerCounter,
            confirmed: false,
            visible: true
        };
        
        this.allElements.push(shapeObj);
        this.updateLayersList();
        
        return shapeObj;
    }
    
    applyShapeStyles(element) {
        const fillColor = this.shapeFillColor.value;
        const strokeColor = this.shapeStrokeColor.value;
        const strokeWidth = this.shapeStrokeWidth.value;
        const opacity = this.shapeOpacity.value / 100;
        
        element.style.backgroundColor = fillColor;
        element.style.border = `${strokeWidth}px solid ${strokeColor}`;
        element.style.opacity = opacity;
        
        // Aplicar forma según el tipo
        const shapeType = this.shapeType.value;
        switch (shapeType) {
            case 'circle':
                element.style.borderRadius = '50%';
                break;
            case 'triangle':
                element.style.backgroundColor = 'transparent';
                element.style.border = 'none';
                element.style.width = '0';
                element.style.height = '0';
                element.style.borderLeft = '50px solid transparent';
                element.style.borderRight = '50px solid transparent';
                element.style.borderBottom = `100px solid ${fillColor}`;
                break;
            default: // rectangle
                element.style.borderRadius = '0';
                break;
        }
    }
    
    selectElement(elementObj, type) {
        // Deseleccionar elemento anterior
        if (this.selectedElement) {
            this.selectedElement.element.classList.remove('selected');
        }
        
        this.selectedElement = elementObj;
        this.selectedElement.type = type;
        elementObj.element.classList.add('selected');
        
        // Actualizar botones de capas
        this.updateLayerButtons();
        
        // Actualizar botón de confirmar posición
        this.confirmPositionBtn.disabled = elementObj.confirmed;
        
        if (type === 'text') {
            // Actualizar controles con los valores del elemento seleccionado
            const element = elementObj.element;
            const computedStyle = window.getComputedStyle(element);
            
            this.fontSize.value = parseInt(computedStyle.fontSize);
            this.fontSizeValue.textContent = this.fontSize.value + 'px';
            this.fontColor.value = this.rgbToHex(computedStyle.color);
            this.fontFamily.value = computedStyle.fontFamily.replace(/['"]/g, '').split(',')[0];
            this.fontWeight.value = computedStyle.fontWeight === '700' ? 'bold' : 'normal';
            this.textAlign.value = computedStyle.textAlign;
        } else if (type === 'shape') {
            // Actualizar controles de forma
            const element = elementObj.element;
            const computedStyle = window.getComputedStyle(element);
            
            this.shapeFillColor.value = this.rgbToHex(computedStyle.backgroundColor);
            this.shapeStrokeColor.value = this.rgbToHex(computedStyle.borderColor);
            this.shapeStrokeWidth.value = parseInt(computedStyle.borderWidth) || 0;
            this.shapeStrokeWidthValue.textContent = this.shapeStrokeWidth.value + 'px';
            this.shapeOpacity.value = Math.round(parseFloat(computedStyle.opacity) * 100);
            this.shapeOpacityValue.textContent = this.shapeOpacity.value + '%';
        }
        
        this.updateLayersList();
    }
    
    confirmPosition() {
        if (!this.selectedElement) return;
        
        // Encontrar el elemento en TODAS las listas y actualizarlo
        const elementId = this.selectedElement.id;
        
        // Actualizar la posición real del elemento
        const element = this.selectedElement.element;
        
        // Obtener la posición actual del elemento relativa al canvas
        const elementRect = element.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Función para actualizar las propiedades del elemento
        const updateElementProperties = (elementObj) => {
            elementObj.x = elementRect.left - canvasRect.left;
            elementObj.y = elementRect.top - canvasRect.top;
            elementObj.confirmed = true;
            
            if (elementObj.type === 'shape' || element.classList.contains('shape-element')) {
                elementObj.width = elementRect.width;
                elementObj.height = elementRect.height;
            }
            
            if (elementObj.type === 'text' || element.classList.contains('text-element')) {
                elementObj.width = elementRect.width;
                elementObj.height = elementRect.height;
                
                const computedStyle = window.getComputedStyle(element);
                elementObj.fontSize = parseInt(computedStyle.fontSize);
                elementObj.fontFamily = computedStyle.fontFamily;
                elementObj.fontWeight = computedStyle.fontWeight;
                elementObj.color = computedStyle.color;
                elementObj.textAlign = computedStyle.textAlign;
                elementObj.textShadow = computedStyle.textShadow;
                elementObj.webkitTextStroke = computedStyle.webkitTextStroke;
                elementObj.textContent = element.textContent || element.innerText;
            }
        };
        
        // Actualizar en todas las listas
        updateElementProperties(this.selectedElement);
        
        // Actualizar en allElements
        if (this.allElements) {
            const allElementsIndex = this.allElements.findIndex(el => el.id === elementId);
            if (allElementsIndex !== -1) {
                updateElementProperties(this.allElements[allElementsIndex]);
            }
        }
        
        // Actualizar en textElements
        if (this.textElements) {
            const textElementsIndex = this.textElements.findIndex(el => el.id === elementId);
            if (textElementsIndex !== -1) {
                updateElementProperties(this.textElements[textElementsIndex]);
            }
        }
        
        // Actualizar en shapeElements 
        if (this.shapeElements) {
            const shapeElementsIndex = this.shapeElements.findIndex(el => el.id === elementId);
            if (shapeElementsIndex !== -1) {
                updateElementProperties(this.shapeElements[shapeElementsIndex]);
            }
        }
        
        // Actualizar en layers
        if (this.layers) {
            const layersIndex = this.layers.findIndex(el => el.id === elementId);
            if (layersIndex !== -1) {
                updateElementProperties(this.layers[layersIndex]);
            }
        }
        
        // Marcar como confirmado
        this.positionConfirmed.add(elementId);
        
        // Deshabilitar el botón
        this.confirmPositionBtn.disabled = true;
        
        console.log(`Posición confirmada para ${elementId} en TODAS las listas:`, {
            x: this.selectedElement.x,
            y: this.selectedElement.y,
            width: this.selectedElement.width,
            height: this.selectedElement.height,
            confirmed: this.selectedElement.confirmed,
            elementRect: {
                left: elementRect.left,
                top: elementRect.top,
                width: elementRect.width,
                height: elementRect.height
            },
            canvasRect: {
                left: canvasRect.left,
                top: canvasRect.top
            },
            calculatedPosition: {
                x: elementRect.left - canvasRect.left,
                y: elementRect.top - canvasRect.top
            }
        });
        
        // Actualizar la lista de capas
        this.updateLayersList();
    }
    
    updateLayerButtons() {
        const hasSelection = !!this.selectedElement;
        this.moveToFrontBtn.disabled = !hasSelection;
        this.moveToBackBtn.disabled = !hasSelection;
        this.moveUpBtn.disabled = !hasSelection;
        this.moveDownBtn.disabled = !hasSelection;
    }
    
    moveLayer(direction) {
        if (!this.selectedElement) return;
        
        const currentIndex = this.allElements.findIndex(el => el.id === this.selectedElement.id);
        if (currentIndex === -1) return;
        
        let newIndex;
        switch (direction) {
            case 'front':
                newIndex = this.allElements.length - 1;
                break;
            case 'back':
                newIndex = 0;
                break;
            case 'up':
                newIndex = Math.min(currentIndex + 1, this.allElements.length - 1);
                break;
            case 'down':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
        }
        
        if (newIndex !== currentIndex) {
            // Reorganizar array
            const [element] = this.allElements.splice(currentIndex, 1);
            this.allElements.splice(newIndex, 0, element);
            
            // Actualizar z-index de todos los elementos
            this.allElements.forEach((el, index) => {
                el.layer = index + 1;
                el.element.style.zIndex = el.layer;
            });
            
            this.updateLayersList();
        }
    }
    
    updateLayersList() {
        this.layersList.innerHTML = '';
        
        // Mostrar elementos en orden inverso (los de arriba primero)
        const sortedElements = [...this.allElements].reverse();
        
        sortedElements.forEach((element, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'layer-item';
            if (this.selectedElement && this.selectedElement.id === element.id) {
                listItem.classList.add('selected');
            }
            
            const layerInfo = document.createElement('div');
            layerInfo.className = 'layer-info';
            
            const layerType = document.createElement('div');
            layerType.className = 'layer-type';
            layerType.textContent = element.type || 'text';
            
            const layerName = document.createElement('div');
            layerName.className = 'layer-name';
            if (element.type === 'text' || element.type === undefined) {
                layerName.textContent = element.text ? 
                    (element.text.length > 20 ? element.text.substring(0, 20) + '...' : element.text) : 
                    'Texto';
            } else {
                layerName.textContent = `${element.type} ${element.width}x${element.height}`;
            }
            
            // Añadir indicador de posición confirmada
            if (element.confirmed) {
                layerName.textContent += ' ✓';
                layerName.style.color = '#27ae60';
            }
            
            layerInfo.appendChild(layerType);
            layerInfo.appendChild(layerName);
            
            const layerActions = document.createElement('div');
            layerActions.className = 'layer-actions';
            
            // Botón de visibilidad
            const visibilityBtn = document.createElement('button');
            visibilityBtn.className = `visibility-btn ${element.visible ? 'visible' : ''}`;
            visibilityBtn.textContent = element.visible ? '👁' : '🚫';
            visibilityBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleElementVisibility(element);
            };
            
            layerActions.appendChild(visibilityBtn);
            
            listItem.appendChild(layerInfo);
            listItem.appendChild(layerActions);
            
            // Event listener para seleccionar
            listItem.addEventListener('click', () => {
                this.selectElement(element, element.type || 'text');
            });
            
            this.layersList.appendChild(listItem);
        });
    }
    
    toggleElementVisibility(element) {
        element.visible = !element.visible;
        element.element.style.display = element.visible ? 'block' : 'none';
        this.updateLayersList();
    }
    
    updateSelectedTextProperties() {
        if (!this.selectedElement) return;
        
        this.applyTextStyles(this.selectedElement.element);
    }
    
    startDrag(event, element, type) {
        if (event.target.classList.contains('resize-handle') || 
            event.target.classList.contains('resize-handle-horizontal')) return;
        
        this.isDragging = true;
        const rect = element.getBoundingClientRect();
        this.dragOffset.x = event.clientX - rect.left;
        this.dragOffset.y = event.clientY - rect.top;
        
        const onMouseMove = (e) => {
            if (!this.isDragging) return;
            
            const containerRect = this.textElementsContainer.getBoundingClientRect();
            const x = e.clientX - containerRect.left - this.dragOffset.x;
            const y = e.clientY - containerRect.top - this.dragOffset.y;
            
            element.style.left = Math.max(0, x) + 'px';
            element.style.top = Math.max(0, y) + 'px';
        };
        
        const onMouseUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    deleteSelected() {
        if (!this.selectedElement) {
            alert('Por favor, selecciona un elemento primero.');
            return;
        }
        
        // Eliminar de la lista unificada
        const index = this.allElements.findIndex(el => el.id === this.selectedElement.id);
        if (index > -1) {
            this.allElements.splice(index, 1);
        }
        
        // Eliminar de las listas específicas
        if (this.selectedElement.type === 'text') {
            const textIndex = this.textElements.findIndex(t => t.id === this.selectedElement.id);
            if (textIndex > -1) {
                this.textElements.splice(textIndex, 1);
            }
        } else if (this.selectedElement.type === 'shape') {
            const shapeIndex = this.shapeElements.findIndex(s => s.id === this.selectedElement.id);
            if (shapeIndex > -1) {
                this.shapeElements.splice(shapeIndex, 1);
            }
        }
        
        // Eliminar del DOM y limpiar referencias
        this.selectedElement.element.remove();
        this.positionConfirmed.delete(this.selectedElement.id);
        this.selectedElement = null;
        
        // Actualizar UI
        this.updateLayerButtons();
        this.updateLayersList();
        this.confirmPositionBtn.disabled = true;
    }
    
    clearAll() {
        if (confirm('¿Estás seguro de que quieres limpiar todo?')) {
            // Limpiar todas las listas
            this.textElements.forEach(textObj => textObj.element.remove());
            this.shapeElements.forEach(shapeObj => shapeObj.element.remove());
            this.allElements.forEach(elementObj => elementObj.element.remove());
            
            this.textElements = [];
            this.shapeElements = [];
            this.allElements = [];
            this.selectedElement = null;
            this.currentImage = null;
            this.positionConfirmed.clear();
            
            // Resetear contadores
            this.textCounter = 0;
            this.shapeCounter = 0;
            this.layerCounter = 0;
            
            // Actualizar UI
            this.setupCanvas();
            this.imageInput.value = '';
            this.updateLayerButtons();
            this.updateLayersList();
            this.confirmPositionBtn.disabled = true;
        }
    }
    
    startHorizontalResize(event, element) {
        this.isResizing = true;
        const startX = event.clientX;
        const startWidth = parseInt(window.getComputedStyle(element).width);
        
        const onMouseMove = (e) => {
            if (!this.isResizing) return;
            
            const deltaX = e.clientX - startX;
            const newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
            element.style.width = newWidth + 'px';
        };
        
        const onMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    startResize(event, element) {
        this.isResizing = true;
        const startX = event.clientX;
        const startY = event.clientY;
        const startFontSize = parseInt(window.getComputedStyle(element).fontSize);
        
        const onMouseMove = (e) => {
            if (!this.isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const direction = deltaX + deltaY > 0 ? 1 : -1;
            
            const newSize = Math.max(12, Math.min(100, startFontSize + (delta * direction * 0.2)));
            element.style.fontSize = newSize + 'px';
            
            // Actualizar el control si este elemento está seleccionado
            if (this.selectedElement && this.selectedElement.element === element) {
                this.fontSize.value = newSize;
                this.fontSizeValue.textContent = newSize + 'px';
            }
        };
        
        const onMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    downloadImage() {
        // Crear un canvas temporal para la exportación
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        exportCanvas.width = this.canvas.width;
        exportCanvas.height = this.canvas.height;
        
        // VERIFICACIÓN DE ESCALA CRÍTICA
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / canvasRect.width;
        const scaleY = this.canvas.height / canvasRect.height;
        
        console.log('=== INICIO DE EXPORTACIÓN ===');
        console.log('Canvas dimensions:', exportCanvas.width, 'x', exportCanvas.height);
        console.log('Canvas visual size:', canvasRect.width, 'x', canvasRect.height);
        console.log('Scale factors:', { scaleX, scaleY });
        console.log('Total elements:', this.allElements.length);
        console.log('Text elements:', this.textElements.length);
        console.log('Shape elements:', this.shapeElements.length);
        
        // Dibujar el fondo
        this.drawBackgroundOnContext(exportCtx);
        
        // Dibujar la imagen si existe
        if (this.currentImage) {
            const mode = this.imageMode.value;
            this.drawImageOnContext(exportCtx, mode);
        }
        
        // Dibujar todos los elementos en orden de capas (del fondo al frente)
        // Ordenar por número de layer (menor = atrás, mayor = adelante)
        const sortedElements = [...this.allElements].sort((a, b) => (a.layer || 0) - (b.layer || 0));
        
        console.log('Orden de renderizado (layer order):');
        sortedElements.forEach((elementObj, index) => {
            console.log(`  ${index}: ${elementObj.id} (type: ${elementObj.type}, layer: ${elementObj.layer || 'undefined'})`);
        });
        
        sortedElements.forEach((elementObj, index) => {
            console.log(`Elemento ${index}:`, {
                id: elementObj.id,
                type: elementObj.type,
                layer: elementObj.layer || 'undefined',
                visible: elementObj.visible,
                confirmed: elementObj.confirmed,
                x: elementObj.x,
                y: elementObj.y,
                width: elementObj.width,
                height: elementObj.height
            });
            
            if (elementObj.type === 'text' || elementObj.type === undefined) {
                this.drawTextOnContext(exportCtx, elementObj);
            } else {
                this.drawShapeOnContext(exportCtx, elementObj);
            }
        });
        
        console.log('=== FIN DE EXPORTACIÓN ===');
        
        // Descargar la imagen
        const link = document.createElement('a');
        const preset = this.canvasPreset.value;
        const filename = preset !== 'custom' ? `imagen-${preset}.png` : 'imagen-editada.png';
        link.download = filename;
        link.href = exportCanvas.toDataURL();
        link.click();
    }
    
    drawBackgroundOnContext(ctx) {
        if (this.backgroundSettings.type === 'none') return;
        
        if (this.backgroundSettings.type === 'solid') {
            ctx.fillStyle = this.backgroundSettings.color;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundSettings.type === 'gradient') {
            let gradient;
            const { color1, color2, direction } = this.backgroundSettings.gradient;
            
            switch (direction) {
                case 'horizontal':
                    gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
                    break;
                case 'vertical':
                    gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                    break;
                case 'diagonal':
                    gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                    break;
            }
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundSettings.type === 'image-gradient') {
            // Crear efecto glass/espejo con múltiples capas
            const imageGradient = this.createImageGradientForContext(ctx);
            if (imageGradient) {
                const glassIntensity = this.backgroundSettings.imageGradient?.glass || parseFloat(this.imageGradientGlass.value);
                
                // Capa base: gradiente principal
                ctx.fillStyle = imageGradient;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Capa de textura glass: gradiente radial sutil
                const glassGradient = ctx.createRadialGradient(
                    this.canvas.width * 0.3, this.canvas.height * 0.2, 0,
                    this.canvas.width * 0.7, this.canvas.height * 0.8, 
                    Math.max(this.canvas.width, this.canvas.height) * 0.8
                );
                glassGradient.addColorStop(0, `rgba(255, 255, 255, ${0.05 * glassIntensity})`);
                glassGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.02 * glassIntensity})`);
                glassGradient.addColorStop(1, `rgba(0, 0, 0, ${0.1 * glassIntensity})`);
                
                ctx.fillStyle = glassGradient;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Efecto de viñeta para profundidad
                const vignetteGradient = ctx.createRadialGradient(
                    this.canvas.width / 2, this.canvas.height / 2, 0,
                    this.canvas.width / 2, this.canvas.height / 2,
                    Math.max(this.canvas.width, this.canvas.height) * 0.6
                );
                vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                vignetteGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
                vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * glassIntensity})`);
                
                ctx.fillStyle = vignetteGradient;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
    
    drawImageOnContext(ctx, mode) {
        switch (mode) {
            case 'fit':
            case 'fill':
            case 'stretch':
                ctx.drawImage(this.currentImage, 
                    this.imagePosition.x, this.imagePosition.y, 
                    this.imageScale.width, this.imageScale.height);
                break;
        }
    }
    
    drawShapeOnContext(ctx, shapeObj) {
        if (!shapeObj.visible) return;
        
        const element = shapeObj.element;
        
        // CALCULAR FACTORES DE ESCALA (igual que en texto)
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / canvasRect.width;
        const scaleY = this.canvas.height / canvasRect.height;
        
        // Usar posición confirmada si existe, sino convertir coordenadas del DOM
        let x, y, width, height;
        if (shapeObj.confirmed) {
            // APLICAR ESCALA A LAS COORDENADAS Y DIMENSIONES CONFIRMADAS
            x = shapeObj.x * scaleX;
            y = shapeObj.y * scaleY;
            width = shapeObj.width * scaleX;
            height = shapeObj.height * scaleY;
        } else {
            // Convertir coordenadas del DOM al canvas y escalar
            const elementRect = element.getBoundingClientRect();
            x = (elementRect.left - canvasRect.left) * scaleX;
            y = (elementRect.top - canvasRect.top) * scaleY;
            width = elementRect.width * scaleX;
            height = elementRect.height * scaleY;
        }
        
        // Obtener estilos actuales ANTES de los logs
        const style = window.getComputedStyle(element);
        
        // Determinar el tipo específico de forma desde el shapeType o desde las clases CSS
        let specificShapeType = 'rectangle'; // por defecto
        if (element.dataset && element.dataset.shapeType) {
            specificShapeType = element.dataset.shapeType;
        } else {
            // Detectar por estilos CSS
            if (style.borderRadius === '50%') {
                specificShapeType = 'circle';
            } else if (style.borderLeft && style.borderLeft.includes('solid transparent')) {
                specificShapeType = 'triangle';
            }
        }
        
        console.log(`Forma exportada:`, {
            type: shapeObj.type,
            specificShapeType: specificShapeType,
            shapeObjType: typeof shapeObj.type,
            confirmed: shapeObj.confirmed,
            originalPos: shapeObj.confirmed ? { x: shapeObj.x, y: shapeObj.y } : 'from DOM',
            originalSize: shapeObj.confirmed ? { width: shapeObj.width, height: shapeObj.height } : 'from DOM',
            scaledPos: { x, y },
            scaledSize: { width, height },
            scaleFactors: { scaleX, scaleY },
            styles: {
                fillColor: style.backgroundColor,
                strokeColor: style.borderColor,
                strokeWidth: parseInt(style.borderWidth) || 0,
                opacity: parseFloat(style.opacity) || 1,
                borderRadius: style.borderRadius
            }
        });
        
        console.log(`Comparando tipos:`, {
            shapeObjType: shapeObj.type,
            specificShapeType: specificShapeType,
            isRectangle: specificShapeType === 'rectangle',
            isCircle: specificShapeType === 'circle',
            isTriangle: specificShapeType === 'triangle'
        });
        
        // Aplicar opacidad
        const opacity = parseFloat(style.opacity) || 1;
        ctx.globalAlpha = opacity;
        
        // Obtener colores y estilos (también escalar el strokeWidth)
        const fillColor = style.backgroundColor;
        const strokeColor = style.borderColor;
        const strokeWidth = (parseInt(style.borderWidth) || 0) * Math.min(scaleX, scaleY);
        
        if (specificShapeType === 'rectangle') {
            console.log(`Dibujando rectángulo:`, {
                position: { x, y },
                size: { width, height },
                fillColor: fillColor,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                opacity: opacity
            });
            
            // Dibujar rectángulo
            if (fillColor && fillColor !== 'rgba(0, 0, 0, 0)' && fillColor !== 'transparent') {
                ctx.fillStyle = fillColor;
                ctx.fillRect(x, y, width, height);
                console.log(`✅ Rectángulo relleno dibujado con color: ${fillColor}`);
            } else {
                console.log(`❌ Sin relleno - fillColor: ${fillColor}`);
            }
            
            if (strokeWidth > 0 && strokeColor && strokeColor !== 'rgba(0, 0, 0, 0)') {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;
                ctx.strokeRect(x, y, width, height);
                console.log(`✅ Borde de rectángulo dibujado`);
            } else {
                console.log(`❌ Sin borde - strokeWidth: ${strokeWidth}, strokeColor: ${strokeColor}`);
            }
        } else if (specificShapeType === 'circle') {
            // Dibujar círculo
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            const radius = Math.min(width, height) / 2;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            
            if (fillColor && fillColor !== 'rgba(0, 0, 0, 0)' && fillColor !== 'transparent') {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            
            if (strokeWidth > 0 && strokeColor && strokeColor !== 'rgba(0, 0, 0, 0)') {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
            }
        } else if (specificShapeType === 'triangle') {
            console.log(`Dibujando triángulo:`, {
                points: [
                    { x: x + width / 2, y: y },
                    { x: x, y: y + height },
                    { x: x + width, y: y + height }
                ],
                fillColor: fillColor,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                opacity: opacity
            });
            
            // Dibujar triángulo
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.closePath();
            
            if (fillColor && fillColor !== 'rgba(0, 0, 0, 0)' && fillColor !== 'transparent') {
                ctx.fillStyle = fillColor;
                ctx.fill();
                console.log(`✅ Triángulo relleno dibujado`);
            } else {
                console.log(`❌ Sin relleno de triángulo`);
            }
            
            if (strokeWidth > 0 && strokeColor && strokeColor !== 'rgba(0, 0, 0, 0)') {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
                console.log(`✅ Borde de triángulo dibujado`);
            } else {
                console.log(`❌ Sin borde de triángulo`);
            }
        } else {
            console.log(`❌ Tipo de forma no reconocido: ${specificShapeType}`);
        }
        
        // Resetear opacidad
        ctx.globalAlpha = 1;
    }
    
    drawTextOnContext(ctx, textObj) {
        if (!textObj.visible) return;
        
        const element = textObj.element;
        
        // CALCULAR FACTORES DE ESCALA
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / canvasRect.width;
        const scaleY = this.canvas.height / canvasRect.height;
        
        // Usar propiedades confirmadas si existen, sino obtener del DOM
        let fontSize, fontFamily, fontWeight, color, textAlign, textShadow, webkitTextStroke, textContent;
        let x, y, maxWidth, elementHeight;
        
        if (textObj.confirmed) {
            // Usar propiedades guardadas y ESCALAR LAS COORDENADAS
            fontFamily = textObj.fontFamily || 'Arial';
            fontWeight = textObj.fontWeight || 'normal';
            color = textObj.color || '#000000';
            textAlign = textObj.textAlign || 'left';
            textShadow = textObj.textShadow || 'none';
            webkitTextStroke = textObj.webkitTextStroke || 'none';
            textContent = textObj.textContent || '';
            
            // APLICAR ESCALA A LAS COORDENADAS Y DIMENSIONES
            x = textObj.x * scaleX;
            y = textObj.y * scaleY;
            maxWidth = textObj.width * scaleX;
            elementHeight = textObj.height * scaleY;
            
            // SOLUCIÓN EXACTA: Calcular el font-size basado en el tamaño visual real del texto
            const originalHeight = textObj.height; // 126px
            
            // Obtener el font-size CSS real que se estaba usando
            const originalFontSize = textObj.fontSize || 24; // 24px del CSS
            
            // Calcular la proporción real del texto respecto a su contenedor
            const fontToContainerRatio = originalFontSize / originalHeight;
            
            // Aplicar la misma proporción al contenedor escalado
            fontSize = Math.round(elementHeight * fontToContainerRatio);
            
            // Verificar que sea razonable (sin límites demasiado restrictivos)
            fontSize = Math.max(8, Math.min(fontSize, elementHeight * 0.8));
            
        } else {
            // Obtener del DOM actual y escalar
            const style = window.getComputedStyle(element);
            fontFamily = style.fontFamily;
            fontWeight = style.fontWeight;
            color = style.color;
            textAlign = style.textAlign;
            textShadow = style.textShadow;
            webkitTextStroke = style.webkitTextStroke;
            textContent = element.textContent || element.innerText;
            
            // Convertir coordenadas del DOM al canvas y escalar
            const elementRect = element.getBoundingClientRect();
            const originalElementWidth = elementRect.width;
            const originalElementHeight = elementRect.height;
            
            x = (elementRect.left - canvasRect.left) * scaleX;
            y = (elementRect.top - canvasRect.top) * scaleY;
            maxWidth = originalElementWidth * scaleX;
            elementHeight = originalElementHeight * scaleY;
            
            // Calcular fontSize basado en la proporción real del CSS
            const currentFontSize = parseInt(style.fontSize);
            const currentHeight = originalElementHeight;
            
            // Calcular la proporción real del texto respecto a su contenedor
            const fontToContainerRatio = currentFontSize / currentHeight;
            
            // Aplicar la misma proporción al contenedor escalado
            fontSize = Math.round(elementHeight * fontToContainerRatio);
            
            // Verificar que sea razonable
            fontSize = Math.max(8, Math.min(fontSize, elementHeight * 0.8));
        }
        
        console.log(`Texto exportado - BEFORE:`, {
            confirmed: textObj.confirmed,
            savedPosition: { x: textObj.x, y: textObj.y },
            savedDimensions: { width: textObj.width, height: textObj.height },
            element: textObj.element ? 'exists' : 'missing'
        });
        
        console.log(`Texto exportado - AFTER calculation (ESCALADO):`, {
            finalPosition: { x, y },
            finalDimensions: { width: maxWidth, height: elementHeight },
            calculatedFontSize: fontSize,
            scaleFactors: { scaleX, scaleY },
            canvasDimensions: { width: this.canvas.width, height: this.canvas.height },
            canvasSizeRatio: Math.min(this.canvas.width / 1080, this.canvas.height / 1920),
            fontSizeCalculation: {
                originalHeight: textObj.confirmed ? textObj.height : elementHeight / scaleY,
                originalFontSize: textObj.confirmed ? textObj.fontSize : parseInt(style.fontSize),
                scaledHeight: elementHeight,
                fontToContainerRatio: textObj.confirmed ? 
                    (textObj.fontSize / textObj.height) : 
                    (parseInt(style.fontSize) / (elementHeight / scaleY)),
                calculatedFontSize: fontSize,
                method: 'exact_proportion'
            }
        });
        
        console.log(`✅ USANDO DIMENSIONES CONFIRMADAS (ESCALADAS):`, {
            originalX: textObj.x,
            originalY: textObj.y,
            scaledX: x,
            scaledY: y,
            originalWidth: textObj.width,
            originalHeight: textObj.height,
            scaledWidth: maxWidth,
            scaledHeight: elementHeight,
            scaleX: scaleX,
            scaleY: scaleY
        });
        
        // Configurar fuente y color
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        
        // NO ajustar las coordenadas - usar la posición exacta del contenedor
        // La posición x,y ya representa la esquina superior izquierda del contenedor de texto
        
        // Configurar alineación de texto
        ctx.textAlign = 'left'; // Siempre usar left para mantener posición exacta
        ctx.textBaseline = 'top'; // Usar top para que y sea la posición superior exacta
        
        // Aplicar sombra si está habilitada
        if (textShadow && textShadow !== 'none') {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        // Aplicar contorno si está habilitado
        if (webkitTextStroke && webkitTextStroke !== 'none' && webkitTextStroke !== '0px') {
            ctx.strokeStyle = '#ffffff'; // Color por defecto
            ctx.lineWidth = 1;
            this.wrapText(ctx, textContent, x, y, maxWidth, fontSize * 1.2, true, textAlign);
        }
        
        // Dibujar un rectángulo de debug para ver el área del texto (DESHABILITADO)
        // ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        // ctx.lineWidth = 3;
        // ctx.strokeRect(x, y, maxWidth, elementHeight);
        
        // console.log(`RECTÁNGULO DIBUJADO EN (ESCALADO):`, {
        //     x: x,
        //     y: y, 
        //     width: maxWidth,
        //     height: elementHeight,
        //     textContent: textContent,
        //     scaleX: scaleX,
        //     scaleY: scaleY
        // });
        
        // Dibujar texto con ajuste de línea
        this.wrapText(ctx, textContent, x, y, maxWidth, fontSize * 1.2, false, textAlign);
        
        // Resetear efectos
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    wrapText(context, text, x, y, maxWidth, lineHeight, isStroke = false, textAlign = 'left') {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                // Calcular posición x según alineación
                let lineX = x;
                if (textAlign === 'center') {
                    const lineMetrics = context.measureText(line);
                    lineX = x + (maxWidth - lineMetrics.width) / 2;
                } else if (textAlign === 'right') {
                    const lineMetrics = context.measureText(line);
                    lineX = x + (maxWidth - lineMetrics.width);
                }
                
                if (isStroke) {
                    context.strokeText(line, lineX, y);
                } else {
                    context.fillText(line, lineX, y);
                }
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        // Dibujar la última línea
        let lineX = x;
        if (textAlign === 'center') {
            const lineMetrics = context.measureText(line);
            lineX = x + (maxWidth - lineMetrics.width) / 2;
        } else if (textAlign === 'right') {
            const lineMetrics = context.measureText(line);
            lineX = x + (maxWidth - lineMetrics.width);
        }
        
        if (isStroke) {
            context.strokeText(line, lineX, y);
        } else {
            context.fillText(line, lineX, y);
        }
    }
    
    clearAll() {
        if (confirm('¿Estás seguro de que quieres limpiar todo?')) {
            this.textElements.forEach(textObj => textObj.element.remove());
            this.textElements = [];
            this.selectedElement = null;
            this.currentImage = null;
            this.setupCanvas();
            this.imageInput.value = '';
        }
    }
    
    rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    showDebugInfo() {
        console.log('=== DEBUG INFO ===');
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        console.log('All elements:', this.allElements);
        
        if (this.allElements && this.allElements.length > 0) {
            console.log('Layers:');
            this.allElements.forEach((layer, index) => {
                console.log(`Layer ${index + 1} (${layer.type}):`, {
                    id: layer.id,
                    visible: layer.visible,
                    confirmed: layer.confirmed,
                    position: `(${layer.x}, ${layer.y})`,
                    dimensions: `${layer.width}x${layer.height}`,
                    zIndex: layer.zIndex,
                    content: layer.type === 'text' ? layer.textContent : 'N/A',
                    fontSize: layer.fontSize,
                    calculatedFontSize: layer.height ? Math.round(layer.height * 0.7) : 'N/A'
                });
                
                if (layer.type === 'text' && layer.element) {
                    const element = layer.element;
                    const rect = element.getBoundingClientRect();
                    const canvasRect = this.canvas.getBoundingClientRect();
                    console.log(`  - DOM position: (${rect.left - canvasRect.left}, ${rect.top - canvasRect.top})`);
                    console.log(`  - DOM dimensions: ${rect.width}x${rect.height}`);
                    console.log(`  - CSS font-size: ${window.getComputedStyle(element).fontSize}`);
                    console.log(`  - Text content: "${element.textContent}"`);
                }
            });
        }
        
        alert(`Debug info:\n` +
              `- Canvas: ${this.canvas.width}x${this.canvas.height}\n` +
              `- Total layers: ${this.allElements ? this.allElements.length : 0}\n` +
              `- Confirmed positions: ${this.allElements ? this.allElements.filter(l => l.confirmed).length : 0}\n` +
              `\nCheck console for detailed layer info including font sizes`);
    }
    
    // Función para extraer colores dominantes de la imagen
    extractImageColors() {
        if (!this.currentImage) return;
        
        // Crear un canvas temporal para análisis de colores
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Usar una versión más pequeña de la imagen para acelerar el análisis
        const sampleSize = 100;
        tempCanvas.width = sampleSize;
        tempCanvas.height = sampleSize;
        
        // Dibujar imagen redimensionada
        tempCtx.drawImage(this.currentImage, 0, 0, sampleSize, sampleSize);
        
        // Obtener datos de píxeles
        const imageData = tempCtx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;
        
        // Contar frecuencia de colores (agrupados por similitud)
        const colorCounts = {};
        
        for (let i = 0; i < data.length; i += 4) {
            const r = Math.floor(data[i] / 32) * 32; // Agrupar colores similares
            const g = Math.floor(data[i + 1] / 32) * 32;
            const b = Math.floor(data[i + 2] / 32) * 32;
            
            const colorKey = `${r},${g},${b}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // Encontrar los colores más frecuentes
        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5) // Tomar los 5 colores más frecuentes
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return { r, g, b };
            });
        
        this.imageColors = sortedColors;
        console.log('Colores dominantes extraídos:', this.imageColors);
    }
    
    // Función para crear gradiente basado en colores de imagen
    createImageGradient() {
        if (this.imageColors.length < 2) {
            console.warn('No hay suficientes colores dominantes para crear gradiente');
            return null;
        }
        
        const direction = this.imageGradientDirection.value;
        const intensity = parseFloat(this.imageGradientIntensity.value);
        
        let gradient;
        
        switch (direction) {
            case 'horizontal':
                gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
                break;
            case 'vertical':
                gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                break;
            case 'diagonal':
                gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'radial':
            default:
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const radius = Math.max(this.canvas.width, this.canvas.height) / 2;
                gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                break;
        }
        
        // Agregar colores al gradiente con la intensidad especificada
        const colors = this.imageColors.slice(0, 3); // Usar máximo 3 colores
        colors.forEach((color, index) => {
            const position = index / (colors.length - 1);
            const alpha = intensity;
            gradient.addColorStop(position, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
        });
        
        return gradient;
    }
    
    // Función para crear gradiente de imagen para cualquier contexto
    createImageGradientForContext(ctx) {
        if (this.imageColors.length < 2) {
            console.warn('No hay suficientes colores dominantes para crear gradiente');
            return null;
        }
        
        const direction = this.backgroundSettings.imageGradient?.direction || this.imageGradientDirection.value;
        const intensity = this.backgroundSettings.imageGradient?.intensity || parseFloat(this.imageGradientIntensity.value);
        
        let gradient;
        
        switch (direction) {
            case 'horizontal':
                gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
                break;
            case 'vertical':
                gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                break;
            case 'diagonal':
                gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'radial':
            default:
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const radius = Math.max(this.canvas.width, this.canvas.height) / 2;
                gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                break;
        }
        
        // Crear efecto glass/espejo con base gris oscuro y toques de color
        const colors = this.imageColors.slice(0, 3);
        
        // Procesar colores para efecto glass
        const processedColors = colors.map(color => {
            // Convertir a escala de grises y oscurecer
            const gray = (color.r * 0.299 + color.g * 0.587 + color.b * 0.114);
            const darkGray = Math.max(20, gray * 0.3); // Base gris oscuro
            
            // Agregar un toque sutil del color original
            const colorInfluence = 0.15; // 15% del color original
            const r = Math.round(darkGray + (color.r - darkGray) * colorInfluence);
            const g = Math.round(darkGray + (color.g - darkGray) * colorInfluence);
            const b = Math.round(darkGray + (color.b - darkGray) * colorInfluence);
            
            return { r, g, b };
        });
        
        // Crear gradiente con efecto glass
        if (direction === 'radial') {
            // Para radial: centro más claro, bordes más oscuros
            gradient.addColorStop(0, `rgba(${processedColors[0].r + 20}, ${processedColors[0].g + 20}, ${processedColors[0].b + 20}, ${intensity})`);
            if (processedColors[1]) {
                gradient.addColorStop(0.6, `rgba(${processedColors[1].r}, ${processedColors[1].g}, ${processedColors[1].b}, ${intensity})`);
            }
            gradient.addColorStop(1, `rgba(15, 15, 15, ${intensity})`); // Gris muy oscuro en los bordes
        } else {
            // Para lineales: gradiente suave entre colores procesados
            processedColors.forEach((color, index) => {
                const position = index / Math.max(processedColors.length - 1, 1);
                const alpha = intensity * (0.8 + Math.sin(position * Math.PI) * 0.2); // Variación sutil de opacidad
                gradient.addColorStop(position, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            });
            
            // Agregar punto final más oscuro
            gradient.addColorStop(1, `rgba(10, 10, 10, ${intensity})`);
        }
        
        return gradient;
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new ImageEditor();
});
