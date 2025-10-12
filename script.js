// Función que aplica o remueve la clase 'responsive' al menú
function mostrarOcultarMenu() {
    var nav = document.getElementById("nav");
    if (nav.classList.contains("responsive")) {
        nav.classList.remove("responsive");
    } else {
        nav.classList.add("responsive");
    }
}

// Función para ocultar el menú después de seleccionar una opción
function seleccionar() {
    document.getElementById("nav").classList.remove("responsive");
}


// =========================================================
// LÓGICA DEL CARRUSEL DOBLE (Principal y de Imágenes Internas)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const carruselProyectos = document.querySelector('.carrusel-proyectos');
    if (!carruselProyectos) return;

    const carruselInner = document.querySelector('.carrusel-inner');
    const proyectos = document.querySelectorAll('.proyecto-item');
    const prevBtn = document.querySelector('.carrusel-nav .prev-btn');
    const nextBtn = document.querySelector('.carrusel-nav .next-btn');

    let currentIndex = 0;
    let itemsPerSlide = getItemsPerSlide(); // Determina 1 o 2 por slide

    // Función para determinar cuántos proyectos se ven por slide (1 o 2)
    function getItemsPerSlide() {
        // En resoluciones >= 768px (mismo valor del CSS), muestra 2 proyectos por slide
        return window.innerWidth >= 768 ? 2 : 1;
    }

    // Actualiza la posición y los puntos del carrusel principal
    function updateCarruselProyectos() {
        // Calcula el desplazamiento: (índice actual) * (100 / items por slide)
        const offset = -currentIndex * (100 / itemsPerSlide);
        carruselInner.style.transform = `translateX(${offset}%)`;

        // Lógica para deshabilitar los botones de navegación
        if (prevBtn && nextBtn) {
            // El índice máximo es el total de slides que caben
            const maxIndex = Math.ceil(proyectos.length / itemsPerSlide) - 1;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }

    // Navegación principal (Proyectos)
    function navigateProyectos(direction) {
        const maxIndex = Math.ceil(proyectos.length / itemsPerSlide) - 1;
        currentIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
        updateCarruselProyectos();
    }

    // Event listeners para las flechas del carrusel principal
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => navigateProyectos(-1));
        nextBtn.addEventListener('click', () => navigateProyectos(1));
    }

    // Actualizar al redimensionar la ventana
    window.addEventListener('resize', () => {
        const newItemsPerSlide = getItemsPerSlide();
        if (newItemsPerSlide !== itemsPerSlide) {
            itemsPerSlide = newItemsPerSlide;
            // Reiniciar el índice para asegurar que se muestre una fila completa
            currentIndex = 0; 
        }
        updateCarruselProyectos();
    });

    // Inicialización del carrusel principal
    updateCarruselProyectos();

    // ----------------------------------------------------
    // LÓGICA DEL CARRUSEL DE IMÁGENES INTERNAS (por proyecto)
    // ----------------------------------------------------

    proyectos.forEach((proyecto) => {
        const innerCarrusel = proyecto.querySelector('.carrusel-interno');
        const innerImgContainer = proyecto.querySelector('.carrusel-inner-img');
        const slides = proyecto.querySelectorAll('.carrusel-slide');
        const prevImgBtn = proyecto.querySelector('.prev-img-btn');
        const nextImgBtn = proyecto.querySelector('.next-img-btn');
        const indicatorsContainer = proyecto.querySelector('.indicators-interno');

        let currentImgIndex = 0;

        // Si solo hay una imagen, ocultar controles
        if (slides.length <= 1) {
            if (prevImgBtn) prevImgBtn.style.display = 'none';
            if (nextImgBtn) nextImgBtn.style.display = 'none';
            if (indicatorsContainer) indicatorsContainer.style.display = 'none';
            return; // No se necesita lógica de carrusel para un solo slide
        }

        // Crea los indicadores (puntos)
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentImgIndex = index;
                updateCarruselInterno();
            });
            indicatorsContainer.appendChild(dot);
        });

        // Actualiza la posición y los puntos del carrusel interno
        function updateCarruselInterno() {
            const offset = -currentImgIndex * 100;
            innerImgContainer.style.transform = `translateX(${offset}%)`;

            // Actualiza los puntos indicadores
            const dots = indicatorsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentImgIndex);
            });
        }

        // Navegación de imágenes internas
        function navigateInterno(direction) {
            // Usa el operador módulo (%) para un ciclo infinito de slides
            currentImgIndex = (currentImgIndex + direction + slides.length) % slides.length;
            updateCarruselInterno();
        }

        // Event listeners para las flechas de las imágenes internas
        prevImgBtn.addEventListener('click', () => navigateInterno(-1));
        nextImgBtn.addEventListener('click', () => navigateInterno(1));
        
        // Inicializar el carrusel interno
        updateCarruselInterno();
    });
});
