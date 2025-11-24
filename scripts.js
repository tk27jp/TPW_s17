// ============================================
// TARJETA DIGITAL ESTUDIANTE UTP
// Funcionalidades interactivas
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Tarjeta Digital UTP - Inicializada');

    // ============================================
    // CONFIGURACIÓN DE DATOS DEL ESTUDIANTE
    // ============================================

    const studentData = {
        name: 'Juan Carlos Pérez González',
        code: 'U20201234',
        career: 'Ingeniería de Sistemas',
        location: 'Lima, Perú',
        links: {
            github: 'https://github.com/usuario',
            linkedin: 'https://linkedin.com/in/usuario',
            portfolio: 'https://miportafolio.com',
            email: 'mailto:u20201234@utp.edu.pe',
            cv: 'documents/cv.pdf',
            instagram: 'https://instagram.com/usuario'
        }
    };

    // ============================================
    // ACTUALIZAR INFORMACIÓN DEL ESTUDIANTE
    // ============================================

    function updateStudentInfo() {
        const nameElement = document.getElementById('studentName');
        const codeElement = document.getElementById('studentCode');
        const careerElement = document.getElementById('studentCareer');

        if (nameElement) nameElement.textContent = studentData.name;
        if (codeElement) codeElement.textContent = studentData.code;
        if (careerElement) careerElement.textContent = studentData.career;

        console.log('ℹ️ Información del estudiante actualizada');
    }

    // Actualizar al cargar
    updateStudentInfo();

    // ============================================
    // GESTIÓN DE ENLACES
    // ============================================

    function setupLinks() {
        const linkItems = document.querySelectorAll('.link-item');

        linkItems.forEach(link => {
            const platform = link.getAttribute('data-platform');

            if (studentData.links[platform]) {
                link.href = studentData.links[platform];

                // Agregar evento de click con tracking
                link.addEventListener('click', function(e) {
                    const linkTitle = this.querySelector('.link-title').textContent;
                    console.log(`🖱️ Click en: ${linkTitle} (${platform})`);

                    // Agregar animación de click
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);

                    // Mostrar feedback visual
                    showToast(`Abriendo ${linkTitle}...`, 'info');
                });

                // Efecto hover mejorado
                link.addEventListener('mouseenter', function() {
                    this.style.borderColor = 'var(--utp-red-primary)';
                });

                link.addEventListener('mouseleave', function() {
                    this.style.borderColor = '';
                });
            }
        });

        console.log('🔗 Enlaces configurados');
    }

    setupLinks();

    // ============================================
    // BOTÓN COMPARTIR
    // ============================================

    const shareButton = document.getElementById('shareButton');

    if (shareButton) {
        shareButton.addEventListener('click', async function() {
            console.log('📤 Intentando compartir tarjeta...');

            const shareData = {
                title: `${studentData.name} - Estudiante UTP`,
                text: `Tarjeta digital de ${studentData.name} - ${studentData.career}`,
                url: window.location.href
            };

            // Verificar si el navegador soporta Web Share API
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    console.log('✅ Compartido exitosamente');
                    showToast('¡Tarjeta compartida!', 'success');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('❌ Error al compartir:', err);
                        fallbackShare();
                    }
                }
            } else {
                // Fallback: copiar URL al portapapeles
                fallbackShare();
            }
        });
    }

    // ============================================
    // COMPARTIR - FALLBACK
    // ============================================

    function fallbackShare() {
        const url = window.location.href;

        // Copiar al portapapeles
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    console.log('📋 URL copiada al portapapeles');
                    showToast('¡Enlace copiado al portapapeles!', 'success');
                })
                .catch(err => {
                    console.error('❌ Error al copiar:', err);
                    showToast('No se pudo copiar el enlace', 'error');
                });
        } else {
            // Método antiguo de copiar
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                console.log('📋 URL copiada (método legacy)');
                showToast('¡Enlace copiado!', 'success');
            } catch (err) {
                console.error('❌ Error al copiar:', err);
                showToast('No se pudo copiar el enlace', 'error');
            }

            document.body.removeChild(textArea);
        }
    }

    // ============================================
    // SISTEMA DE NOTIFICACIONES TOAST
    // ============================================

    function showToast(message, type = 'info') {
        // Remover toast anterior si existe
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Crear nuevo toast
        const toast = document.createElement('div');
        toast.className = 'toast';

        // Icono según tipo
        let icon = 'bi-info-circle';
        if (type === 'success') icon = 'bi-check-circle';
        if (type === 'error') icon = 'bi-exclamation-circle';

        toast.innerHTML = `
            <i class="bi ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Animación de entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-remove después de 3 segundos
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // ============================================
    // EFECTOS DE SCROLL (si la página crece)
    // ============================================

    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Detectar dirección del scroll
        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo
            document.body.classList.add('scrolling-down');
        } else {
            // Scroll hacia arriba
            document.body.classList.remove('scrolling-down');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ============================================
    // ANIMACIONES AL HACER VISIBLE
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.link-item, .student-info, .logo-container');
    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // DETECCIÓN DE DARK MODE (opcional)
    // ============================================

    function detectColorScheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
            console.log('🌙 Dark mode detectado');
            // Aquí podrías ajustar colores si quisieras
        } else {
            console.log('☀️ Light mode detectado');
        }
    }

    detectColorScheme();

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================

    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`⏱️ Página cargada en ${loadTime.toFixed(2)}ms`);

        // Contar elementos interactivos
        const linkCount = document.querySelectorAll('.link-item').length;
        console.log(`🔗 ${linkCount} enlaces configurados`);
    });

    // ============================================
    // PREVENIR COMPORTAMIENTOS NO DESEADOS
    // ============================================

    // Prevenir drag & drop no deseado
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Prevenir selección de texto en botones
    const buttons = document.querySelectorAll('button, .link-item');
    buttons.forEach(button => {
        button.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    });

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    // Validar email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Formatear código de estudiante
    function formatStudentCode(code) {
        return code.toUpperCase().trim();
    }

    // Generar URL de compartir
    function generateShareUrl() {
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?student=${encodeURIComponent(studentData.code)}`;
    }

    // ============================================
    // API PARA MODIFICAR DATOS (uso externo)
    // ============================================

    window.StudentCard = {
        updateName: function(name) {
            studentData.name = name;
            updateStudentInfo();
            console.log('✅ Nombre actualizado:', name);
        },

        updateCode: function(code) {
            studentData.code = formatStudentCode(code);
            updateStudentInfo();
            console.log('✅ Código actualizado:', code);
        },

        updateCareer: function(career) {
            studentData.career = career;
            updateStudentInfo();
            console.log('✅ Carrera actualizada:', career);
        },

        updateLink: function(platform, url) {
            if (studentData.links.hasOwnProperty(platform)) {
                studentData.links[platform] = url;
                setupLinks();
                console.log(`✅ Link ${platform} actualizado:`, url);
            } else {
                console.warn(`⚠️ Plataforma ${platform} no existe`);
            }
        },

        getData: function() {
            return { ...studentData };
        },

        showToast: showToast
    };

    // ============================================
    // LOG FINAL
    // ============================================

    console.log('<� Tarjeta Digital UTP completamente cargada');
    console.log('=� Para modificar datos usa: window.StudentCard.updateName("Nuevo Nombre")');
});

// ============================================
// EASTER EGG: Konami Code
// ============================================

(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        console.log('<� �KONAMI CODE ACTIVADO!');

        // Efecto confetti (usando emojis)
        const emojis = ['<�', '=�', '=�', '=�', 'P', '<�'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.position = 'fixed';
                emoji.style.left = Math.random() * 100 + 'vw';
                emoji.style.top = '-50px';
                emoji.style.fontSize = '30px';
                emoji.style.zIndex = '9999';
                emoji.style.pointerEvents = 'none';
                emoji.style.transition = 'all 3s ease-out';

                document.body.appendChild(emoji);

                setTimeout(() => {
                    emoji.style.top = '100vh';
                    emoji.style.transform = `rotate(${Math.random() * 720}deg)`;
                    emoji.style.opacity = '0';
                }, 50);

                setTimeout(() => {
                    emoji.remove();
                }, 3000);
            }, i * 100);
        }

        if (window.StudentCard && window.StudentCard.showToast) {
            window.StudentCard.showToast('<� �C�digo secreto activado!', 'success');
        }
    }
})();