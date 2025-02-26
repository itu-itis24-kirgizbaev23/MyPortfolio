        // Your projects and currentIndex
        const projects = [
            { src: './assets/biamino/1.png', alt: 'Biamino' },
            { src: './assets/sneakercare/1.jpg', alt: 'Shop' },
            { src: './assets/phpapp/1.png', alt: 'App' },
            { src: './assets/termproject/1.png', alt: 'Game' },
            { src: './assets/gifty/1.png', alt: 'Gifty' }
          ];
      
          let currentIndex = 1;
      
          function updateSlides() {
            const carousel = document.querySelector('.carousel');
            const slides = carousel.children;
            
            const topIndex = (currentIndex - 1 + projects.length) % projects.length;
            const bottomIndex = (currentIndex + 1) % projects.length;
            
            if (slides[0]) {
              slides[0].innerHTML = `<img src="${projects[topIndex].src}" alt="${projects[topIndex].alt}">`;
            }
            if (slides[1]) {
              slides[1].innerHTML = `<img src="${projects[currentIndex].src}" alt="${projects[currentIndex].alt}">`;
            }
            if (slides[2]) {
              slides[2].innerHTML = `<img src="${projects[bottomIndex].src}" alt="${projects[bottomIndex].alt}">`;
            }
            
            slides[-1].className = "next-project";
            slides[0].className = "current-project";
            slides[1].className = "next-project";
          }
      
          function slide(clickedElement) {
            const carousel = document.querySelector('.carousel');
            const slides = Array.from(carousel.children);
            const clickedIndex = slides.indexOf(clickedElement);

            document.addEventListener("click", function() {
                document.querySelector(".click-hint").style.display = "none";
            }, { once: true });
            
            if (clickedIndex === 1) return;
            
            if (clickedIndex === 0) {
              currentIndex = (currentIndex - 1 + projects.length) % projects.length;
            } else if (clickedIndex === 2) {
              currentIndex = (currentIndex + 1) % projects.length;
            }
            
            const projectIds = ['biamino', 'sneakercare', 'app', 'game', 'gifty'];
            projectIds.forEach((id, index) => {
              const article = document.getElementById(id);
              if (article) {
                // Показываем статью, если индекс совпадает с currentIndex, иначе скрываем
                article.style.display = (index === currentIndex) ? 'flex' : 'none';
              }
            }
            );  

            updateSlides();
          }
      
          document.addEventListener('DOMContentLoaded', () => {
            updateSlides();
            
            // Attach click events to each slide
            const slides = document.querySelectorAll('.carousel > div');
            slides.forEach(slideEl => {
              slideEl.addEventListener('click', function() {
                slide(this);
              });
            });
          });


    function scrollDown() {
        window.scrollBy(0, window.innerHeight * 0.9);
    }

    function zoomIn(imgElement) {
        // Ищем или создаём оверлей
        let overlay = document.getElementById("zoom-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "zoom-overlay";
            Object.assign(overlay.style, {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "zoom-out",
                zIndex: 1000
            });
            // При клике на оверлей выполняется функция zoomOut
            overlay.addEventListener("click", zoomOut);
            document.body.appendChild(overlay);
        }
        
        // Ищем или создаём элемент для увеличенной картинки
        let zoomedImage = document.getElementById("zoomed-image");
        if (!zoomedImage) {
            zoomedImage = document.createElement("img");
            zoomedImage.id = "zoomed-image";
            Object.assign(zoomedImage.style, {
                maxWidth: "90%",
                maxHeight: "90%"
            });
            overlay.appendChild(zoomedImage);
        }
        
        // Устанавливаем источник картинки и показываем оверлей
        zoomedImage.src = imgElement.src;
        overlay.style.display = "flex";
    }
    
    function zoomOut() {
        const overlay = document.getElementById("zoom-overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
    }

/* -------------------------------------------------
         ПАРАМЕТРЫ ДЛЯ НАСТРОЙКИ
    -------------------------------------------------- */
    const NUM_POINTS         = 60;    // Кол-во точек (вершин)
    const MAX_DIST           = 150;   // Макс. дистанция для линии между точками
    const POINT_SIZE         = 3;     // Радиус кружка-узла
    const LINE_WIDTH         = 1;     // Толщина линий
    const SPEED              = 2;   // Базовая скорость точек
    const MOUSE_FORCE_DIST   = 120;   // Радиус отталкивания (точек и линий)
    const MOUSE_FORCE        = 0.1;  // Сила отталкивания
    const FRICTION           = 0.9;   // Коэффициент трения (чем меньше, тем быстрее затухание)

    /* -------------------------------------------------
         ИНИЦИАЛИЗАЦИЯ CANVAS
    -------------------------------------------------- */
    const canvas = document.querySelector('canvas'); // Ensure the canvas element is selected correctly
    const ctx    = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /* -------------------------------------------------
         КЛАСС ДЛЯ ТОЧКИ (УЗЛА СЕТИ)
    -------------------------------------------------- */
    class Point {
        constructor() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * SPEED;
            this.vy = (Math.random() - 0.5) * SPEED;
        }

        update() {
            // Обновляем координаты точки
            this.x += this.vx;
            this.y += this.vy;

            // Ограничиваем координаты точек рамками экрана
            if (this.x < 0) {
                this.x = 0;
                this.vx *= -1;
            }
            if (this.x > canvas.width) {
                this.x = canvas.width;
                this.vx *= -1;
            }
            if (this.y < 0) {
                this.y = 0;
                this.vy *= -1;
            }
            if (this.y > canvas.height) {
                this.y = canvas.height;
                this.vy *= -1;
            }

            // Применяем трение для затухания скорости
            this.vx *= FRICTION;
            this.vy *= FRICTION;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, POINT_SIZE, 0, 2 * Math.PI);
            ctx.fillStyle = '#d3d3d3';
            ctx.fill();
        }
    }

    /* -------------------------------------------------
         СОЗДАЁМ МАССИВ ТОЧЕК
    -------------------------------------------------- */
    const points = [];
    for (let i = 0; i < NUM_POINTS; i++) {
        points.push(new Point());
    }

    /* -------------------------------------------------
         ОТСЛЕЖИВАНИЕ КООРДИНАТ КУРСОРА
    -------------------------------------------------- */
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    /* -------------------------------------------------
         ФУНКЦИЯ: НАИБЛИЖАЙШАЯ ТОЧКА НА ОТРЕЗКЕ
         Вычисляет ближайшую точку на отрезке (x1,y1)-(x2,y2) к (px,py)
    -------------------------------------------------- */
    function getClosestPointOnSegment(px, py, x1, y1, x2, y2) {
        const vx = x2 - x1;
        const vy = y2 - y1;
        const wx = px - x1;
        const wy = py - y1;
        const dot = wx * vx + wy * vy;
        const lenSq = vx * vx + vy * vy;
        let t = dot / lenSq;
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        const cx = x1 + t * vx;
        const cy = y1 + t * vy;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return { cx, cy, dist };
    }

    /* -------------------------------------------------
         ФУНКЦИЯ: ОТТАЛКИВАНИЕ ОТ ЛИНИИ
         Если курсор близко к линии, то отталкиваем обе точки p1 и p2
    -------------------------------------------------- */
    function repelFromLine(p1, p2, mouseX, mouseY) {
        const { cx, cy, dist } = getClosestPointOnSegment(mouseX, mouseY, p1.x, p1.y, p2.x, p2.y);
        if (dist < MOUSE_FORCE_DIST) {
            const force = (MOUSE_FORCE_DIST - dist) * MOUSE_FORCE;
            let dx = cx - mouseX;
            let dy = cy - mouseY;
            const len = Math.sqrt(dx * dx + dy * dy) || 0.0001;
            dx /= len;
            dy /= len;
            p1.vx += force * dx * 0.5;
            p1.vy += force * dy * 0.5;
            p2.vx += force * dx * 0.5;
            p2.vy += force * dy * 0.5;
        }
    }

    /* -------------------------------------------------
         АНИМАЦИОННЫЙ ЦИКЛ
    -------------------------------------------------- */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Отталкивание точек от курсора
        if (mouse.x !== null && mouse.y !== null) {
            for (let p of points) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_FORCE_DIST) {
                    const force = (MOUSE_FORCE_DIST - dist) * MOUSE_FORCE;
                    const len = dist || 0.0001;
                    p.vx += (dx / len) * force;
                    p.vy += (dy / len) * force;
                }
            }
        }

        // Обновляем координаты точек
        for (let p of points) {
            p.update();
        }

        // Рисуем линии между точками и применяем отталкивание от линий
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = 1 - dist / MAX_DIST;
                    ctx.strokeStyle = `rgba(211, 211, 211, ${alpha})`;
                    ctx.lineWidth = LINE_WIDTH;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();

                    // Отталкивание от линии
                    if (mouse.x !== null && mouse.y !== null) {
                        repelFromLine(p1, p2, mouse.x, mouse.y);
                    }
                }
            }
        }

        // Рисуем точки (узлы) поверх линий
        for (let p of points) {
            p.draw();
        }

        requestAnimationFrame(animate);
    }

    animate();

