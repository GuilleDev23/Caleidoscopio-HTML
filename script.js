// Estado global
let currentPage = 'home';
let selectedArticleId = null;
let isDarkMode = true; // Por defecto en modo oscuro
let accentColor = 'neon-blue'; // Color de acento por defecto para el modo oscuro

// Autenticación simple para admin
let isAdminAuthenticated = false;
const ADMIN_PASSWORD = "caleido2025"; // Cambia esta clave por seguridad

// Elementos del DOM
const rootDiv = document.getElementById('root');
const mainHeader = document.getElementById('main-header');
const mainContent = document.getElementById('main-content');
const mainFooter = document.getElementById('main-footer');
const themeToggleBtn = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');
const navHomeBtn = document.getElementById('nav-home');
const navArticlesBtn = document.getElementById('nav-articles');
const navAboutBtn = document.getElementById('nav-about');
const navAdminBtn = document.getElementById('nav-admin');
const subscriptionFormContainer = document.getElementById('subscription-form-container');
const modalContainer = document.getElementById('modal-container');
const modalTitleElem = document.getElementById('modal-title');
const modalBodyElem = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close-btn');

// --- Funciones de utilidad ---

function showModal(title, message) {
    modalTitleElem.textContent = title;
    modalBodyElem.textContent = message;
    modalContainer.classList.remove('hidden');
}

function hideModal() {
    modalContainer.classList.add('hidden');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);

    if (isDarkMode) {
        mainHeader.classList.remove('bg-gray-100', 'border-blue-600');
        mainHeader.classList.add('bg-gray-800', 'border-neon-blue');
        mainFooter.classList.remove('bg-gray-100', 'text-gray-600', 'border-blue-600');
        mainFooter.classList.add('bg-gray-800', 'text-gray-400', 'border-neon-blue');
        themeToggleBtn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        themeToggleBtn.classList.add('bg-gray-700', 'text-gray-200', 'hover:bg-gray-600');
        themeToggleBtn.textContent = '☀️';
        accentColor = 'neon-blue';
    } else {
        mainHeader.classList.remove('bg-gray-800', 'border-neon-blue');
        mainHeader.classList.add('bg-gray-100', 'border-blue-600');
        mainFooter.classList.remove('bg-gray-800', 'text-gray-400', 'border-neon-blue');
        mainFooter.classList.add('bg-gray-100', 'text-gray-600', 'border-blue-600');
        themeToggleBtn.classList.remove('bg-gray-700', 'text-gray-200', 'hover:bg-gray-600');
        themeToggleBtn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        themeToggleBtn.textContent = '🌙';
        accentColor = 'blue-600';
    }
    renderCurrentPage();
}

function getAccentClasses() {
    return {
        main: isDarkMode ? `border-${accentColor} bg-gradient-to-br from-gray-800 to-gray-900` : `border-blue-400 bg-gray-50`,
        heading: isDarkMode ? `text-${accentColor} drop-shadow-lg shadow-neon-blue` : 'text-blue-700',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-800',
        subText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        button: isDarkMode ? `bg-${accentColor} text-gray-900 shadow-neon-blue hover:bg-opacity-80` : 'bg-blue-600 text-white hover:bg-blue-700',
        input: isDarkMode ? `bg-gray-700 border-${accentColor} text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-${accentColor}` : `bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400`,
        cardBg: isDarkMode ? `bg-gray-800 border-2 border-${accentColor} border-opacity-50` : 'bg-gray-50 border border-gray-200',
        tableHeaderBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
        tableRowHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
        tableBodyBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
        commentBg: isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    };
}

// --- Enrutamiento y renderizado de página ---

function renderCurrentPage() {
    mainContent.innerHTML = '';
    switch (currentPage) {
        case 'home':
            renderHomePage();
            break;
        case 'articles':
            renderArticlesPage();
            break;
        case 'article':
            if (selectedArticleId !== null) {
                renderArticlePage(selectedArticleId);
            } else {
                mainContent.innerHTML = `<p class="text-center text-xl ${getAccentClasses().subText}">Artículo no especificado.</p>`;
            }
            break;
        case 'admin':
            renderAdminPage();
            break;
        case 'about':
            renderAboutUsPage();
            break;
        default:
            renderHomePage();
    }
    updateActiveNavButton();
    navAdminBtn.classList.remove('hidden');
}

function navigateTo(page, articleId = null) {
    currentPage = page;
    selectedArticleId = articleId;
    renderCurrentPage();
    window.scrollTo(0, 0);
}

function updateActiveNavButton() {
    const navButtons = [navHomeBtn, navArticlesBtn, navAboutBtn, navAdminBtn];
    navButtons.forEach(btn => {
        btn.classList.remove(`text-${accentColor}`, 'shadow-text-neon-blue');
        btn.classList.add(isDarkMode ? 'text-gray-200' : 'text-gray-700');
    });

    let activeBtn;
    if (currentPage === 'home') activeBtn = navHomeBtn;
    else if (currentPage === 'articles') activeBtn = navArticlesBtn;
    else if (currentPage === 'about') activeBtn = navAboutBtn;
    else if (currentPage === 'admin') activeBtn = navAdminBtn;

    if (activeBtn) {
        activeBtn.classList.remove(isDarkMode ? 'text-gray-200' : 'text-gray-700');
        activeBtn.classList.add(`text-${accentColor}`, 'shadow-text-neon-blue');
    }
}

// --- Componentes de página ---

function renderHomePage() {
    const classes = getAccentClasses();
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    // Tomar los 3 más recientes para "Noticias Destacadas"
    let latest = articles.slice(-3).reverse();

    mainContent.innerHTML = `
        <div class="space-y-12">
            <section class="p-6 rounded-xl shadow-xl border-2 ${classes.main}">
                <h2 class="text-4xl font-bold mb-6 text-center ${classes.heading}">Noticias Destacadas</h2>
                <div id="featured-posts-container" class="grid md:grid-cols-3 gap-6">
                    ${
                        latest.length
                        ? latest.map((art, idx) => `
                            <div class="p-4 rounded-xl shadow-lg border ${classes.cardBg} flex flex-col">
                                <h3 class="text-2xl font-bold mb-2 ${classes.heading}">${art.title}</h3>
                                ${art.image ? `<img src="${art.image}" alt="Imagen" class="mb-2 rounded max-h-40 object-cover">` : ''}
                                <p class="${classes.subText} mb-2">${art.content.substring(0, 100)}...</p>
                                <button class="mt-auto px-4 py-2 rounded-full font-bold ${classes.button}" onclick="showArticle(${articles.length - 1 - idx})">Ver más</button>
                            </div>
                        `).join('')
                        : `<p class="text-center text-lg ${classes.subText}">No hay noticias destacadas.</p>`
                    }
                </div>
            </section>
            <div class="grid lg:grid-cols-3 gap-12">
                <section class="lg:col-span-2 p-6 rounded-xl shadow-xl border-2 ${classes.main}">
                    <h2 class="text-4xl font-bold mb-6 text-center ${classes.heading}">Últimos Artículos</h2>
                    <div id="latest-articles-container" class="grid md:grid-cols-2 gap-6">
                        ${
                            articles.length
                            ? articles.slice().reverse().map((art, idx) => `
                                <div class="p-4 rounded-xl shadow-lg border ${classes.cardBg} flex flex-col">
                                    <h3 class="text-2xl font-bold mb-2 ${classes.heading}">${art.title}</h3>
                                    ${art.image ? `<img src="${art.image}" alt="Imagen" class="mb-2 rounded max-h-40 object-cover">` : ''}
                                    <p class="${classes.subText} mb-2">${art.content.substring(0, 100)}...</p>
                                    <button class="mt-auto px-4 py-2 rounded-full font-bold ${classes.button}" onclick="showArticle(${articles.length - 1 - idx})">Ver más</button>
                                </div>
                            `).join('')
                            : `<p class="text-center text-lg ${classes.subText}">No hay artículos publicados.</p>`
                        }
                    </div>
                </section>
                <aside class="lg:col-span-1 space-y-8">
                    <section class="p-6 rounded-xl shadow-xl border-2 ${classes.main}">
                        <h3 class="text-3xl font-bold mb-4 ${classes.heading}">Tendencias</h3>
                        <ul id="trending-posts-list">
                            <p class="text-lg ${classes.subText}">Aquí irían las tendencias.</p>
                        </ul>
                    </section>
                    <section class="p-6 rounded-xl shadow-xl border-2 ${classes.main}">
                        <h3 class="text-3xl font-bold mb-4 ${classes.heading}">Categorías</h3>
                        <div id="categories-list" class="flex flex-wrap gap-2">
                            <p class="text-lg ${classes.subText}">Aquí irían las categorías.</p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    `;
}

function renderArticlesPage() {
    const classes = getAccentClasses();
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    mainContent.innerHTML = `
        <div class="space-y-8">
            <h2 class="text-4xl font-bold text-center ${classes.heading} mb-6">Todos los Artículos</h2>
            <div id="category-filter-container" class="flex flex-wrap justify-center gap-3 mb-8">
                <p class="${classes.subText}">Aquí irían los filtros de categoría.</p>
            </div>
            <div id="articles-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${
                    articles.length
                    ? articles.map((art, idx) => `
                        <div class="p-4 rounded-xl shadow-lg border ${classes.cardBg} flex flex-col">
                            <h3 class="text-2xl font-bold mb-2 ${classes.heading}">${art.title}</h3>
                            ${art.image ? `<img src="${art.image}" alt="Imagen" class="mb-2 rounded max-h-40 object-cover">` : ''}
                            <p class="${classes.subText} mb-2">${art.content.substring(0, 100)}...</p>
                            <button class="mt-auto px-4 py-2 rounded-full font-bold ${classes.button}" onclick="showArticle(${idx})">Ver más</button>
                        </div>
                    `).join('')
                    : `<p class="text-center text-xl ${classes.subText}">Aquí irían los artículos.</p>`
                }
            </div>
        </div>
    `;
}

// Para mostrar un artículo desde la lista
window.showArticle = function(idx) {
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    selectedArticleId = idx;
    currentPage = 'article';
    renderArticlePage(idx);
};

function renderArticlePage(articleId) {
    const classes = getAccentClasses();
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    let art = articles[articleId];
    if (!art) {
        mainContent.innerHTML = `<p class="text-center text-xl ${classes.subText}">Artículo no encontrado.</p>`;
        return;
    }
    mainContent.innerHTML = `
        <div class="p-8 rounded-xl shadow-xl border-2 ${classes.main} ${classes.text}">
            <div id="article-content-wrapper">
                <h1 class="text-5xl font-extrabold mb-4 text-center ${classes.heading}">
                    ${art.title}
                </h1>
                <div class="flex flex-col items-center mb-4">
                    ${art.image ? `<img src="${art.image}" alt="Imagen" class="mb-4 rounded max-h-60 object-cover">` : ''}
                    ${art.video ? `<iframe class="mb-4 w-full max-w-xl aspect-video rounded" src="https://www.youtube.com/embed/${extractYouTubeId(art.video)}" frameborder="0" allowfullscreen></iframe>` : ''}
                    ${art.pdf ? `<a href="${art.pdf}" target="_blank" class="mb-4 underline text-blue-400">Ver PDF adjunto</a>` : ''}
                </div>
                <div class="prose max-w-none ${isDarkMode ? 'prose-invert text-gray-200' : 'text-gray-800'}" id="article-prose-content">
                    ${marked.parse(art.content)}
                </div>
            </div>
        </div>
    `;
}

// Extrae el ID de YouTube de una URL
function extractYouTubeId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : '';
}

function renderAboutUsPage() {
    const classes = getAccentClasses();
    const aboutContent = localStorage.getItem('aboutContent') || `
# Sobre CALEIDOSCOPIO

¡Bienvenido a CALEIDOSCOPIO! Somos un blog dedicado a desentrañar el complejo tapiz de nuestro mundo a través de análisis profundos y perspectivas frescas.

## Nuestra Misión

Nuestra misión es iluminar los ángulos menos explorados de la tecnología, la geopolítica, las geofinanzas y las noticias locales e internacionales.

## Nuestra Visión

Imaginamos CALEIDOSCOPIO como un faro de conocimiento y una comunidad vibrante donde las ideas fluyen libremente.

## Nuestro Equipo

Somos un colectivo apasionado de escritores, analistas y entusiastas de diversas disciplinas.

¡Gracias por ser parte de la comunidad CALEIDOSCOPIO!
`;
    mainContent.innerHTML = `
        <div class="p-8 rounded-xl shadow-xl border-2 ${classes.main} ${classes.text}">
            <div class="prose max-w-none ${isDarkMode ? 'prose-invert text-gray-200' : 'text-gray-800'}">
                ${marked.parse(aboutContent)}
            </div>
        </div>
    `;
}

// --- Panel de administración con autenticación y CRUD ---
function renderAdminPage() {
    const classes = getAccentClasses();
    mainContent.innerHTML = `
        <div class="space-y-8">
            <h1 class="text-4xl font-extrabold text-center ${classes.heading} mb-8">
                Panel de Administración
            </h1>
            <form id="add-article-form" class="space-y-4 p-4 rounded-lg border ${classes.main}">
                <input type="text" id="article-title" placeholder="Título del artículo" class="w-full p-2 rounded border ${classes.input}" required>
                <textarea id="article-content" placeholder="Contenido del artículo" class="w-full p-2 rounded border ${classes.input}" required></textarea>
                <input type="url" id="article-image" placeholder="URL de imagen (opcional)" class="w-full p-2 rounded border ${classes.input}">
                <input type="url" id="article-video" placeholder="URL de video de YouTube (opcional)" class="w-full p-2 rounded border ${classes.input}">
                <input type="url" id="article-pdf" placeholder="URL de PDF (opcional)" class="w-full p-2 rounded border ${classes.input}">
                <button type="submit" class="px-6 py-2 rounded-full font-bold ${classes.button}">Agregar Artículo</button>
            </form>
            <div id="admin-content-area" class="p-6 rounded-xl shadow-xl border-2 ${classes.main.replace('bg-gradient-to-br from-gray-800 to-gray-900', isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}">
                <h2 class="text-3xl font-bold mb-6 ${classes.heading}">Artículos Publicados</h2>
                <div id="posts-table-container" class="overflow-x-auto">
                    <!-- Aquí se listarán los artículos -->
                </div>
            </div>
            <div class="mt-8 p-4 rounded-lg border ${classes.main}">
                <h2 class="text-2xl font-bold mb-4 ${classes.heading}">Editar Sobre Nosotros</h2>
                <textarea id="about-content" class="w-full p-2 rounded border ${classes.input}" rows="6" placeholder="Contenido en Markdown">${localStorage.getItem('aboutContent') || ''}</textarea>
                <button id="save-about-btn" class="mt-2 px-6 py-2 rounded-full font-bold ${classes.button}">Guardar</button>
            </div>
        </div>
    `;

    let articles = JSON.parse(localStorage.getItem('articles') || '[]');

    function renderArticlesTable() {
        const container = document.getElementById('posts-table-container');
        if (!articles.length) {
            container.innerHTML = `<p class="text-center text-lg ${classes.subText}">No hay artículos.</p>`;
            return;
        }
        container.innerHTML = `
            <table class="min-w-full text-left">
                <thead><tr>
                    <th class="p-2">Título</th>
                    <th class="p-2">Acciones</th>
                </tr></thead>
                <tbody>
                    ${articles.map((art, idx) => `
                        <tr>
                            <td class="p-2">${art.title}</td>
                            <td class="p-2">
                                <button class="edit-btn px-2 py-1 rounded bg-yellow-500 text-white mr-2" data-idx="${idx}">Editar</button>
                                <button class="delete-btn px-2 py-1 rounded bg-red-600 text-white" data-idx="${idx}">Borrar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Botones de editar y borrar
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.getAttribute('data-idx');
                if (confirm('¿Seguro que deseas borrar este artículo?')) {
                    articles.splice(idx, 1);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    renderArticlesTable();
                }
            };
        });
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.getAttribute('data-idx');
                const art = articles[idx];
                document.getElementById('article-title').value = art.title;
                document.getElementById('article-content').value = art.content;
                document.getElementById('article-image').value = art.image || '';
                document.getElementById('article-video').value = art.video || '';
                document.getElementById('article-pdf').value = art.pdf || '';
                // Al guardar, reemplaza el artículo
                document.getElementById('add-article-form').onsubmit = function(e) {
                    e.preventDefault();
                    art.title = document.getElementById('article-title').value;
                    art.content = document.getElementById('article-content').value;
                    art.image = document.getElementById('article-image').value;
                    art.video = document.getElementById('article-video').value;
                    art.pdf = document.getElementById('article-pdf').value;
                    articles[idx] = art;
                    localStorage.setItem('articles', JSON.stringify(articles));
                    renderArticlesTable();
                    this.reset();
                    this.onsubmit = addArticleHandler;
                };
            };
        });
    }

    function addArticleHandler(e) {
        e.preventDefault();
        const newArticle = {
            title: document.getElementById('article-title').value,
            content: document.getElementById('article-content').value,
            image: document.getElementById('article-image').value,
            video: document.getElementById('article-video').value,
            pdf: document.getElementById('article-pdf').value
        };
        articles.push(newArticle);
        localStorage.setItem('articles', JSON.stringify(articles));
        renderArticlesTable();
        this.reset();
    }
    document.getElementById('add-article-form').onsubmit = addArticleHandler;

    renderArticlesTable();

    // Guardar Sobre Nosotros y navegar automáticamente a la página
    document.getElementById('save-about-btn').onclick = function() {
        const aboutText = document.getElementById('about-content').value;
        localStorage.setItem('aboutContent', aboutText);
        showModal('Guardado', 'El contenido de Sobre Nosotros ha sido actualizado.');
        setTimeout(() => {
            navigateTo('about');
        }, 800);
    };
}

function renderSubscriptionForm() {
    const classes = getAccentClasses();
    subscriptionFormContainer.innerHTML = `
        <div class="mt-8 p-6 rounded-lg border-2 ${classes.main.replace('bg-gradient-to-br from-gray-800 to-gray-900', isDarkMode ? 'bg-gray-900' : 'bg-gray-100')} shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-center ${classes.heading}">
                Recibe nuestras actualizaciones
            </h3>
            <p class="text-center ${classes.subText} mb-4">
                Suscríbete a nuestro boletín para no perderte ninguna noticia o artículo.
            </p>
            <form id="subscription-form" class="flex flex-col sm:flex-row gap-3">
                <input type="email" id="subscription-email" placeholder="Tu correo electrónico..."
                    class="flex-grow px-4 py-2 rounded-full border-2 ${classes.input}" required />
                <button type="submit" class="px-6 py-2 rounded-full font-bold transition-all duration-300 ${classes.button}">
                    Suscribirse
                </button>
            </form>
        </div>
    `;
    document.getElementById('subscription-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showModal('Suscripción', '¡Gracias por suscribirte a CALEIDOSCOPIO! (Funcionalidad simulada)');
    });
}

// --- Detectores de Eventos ---
document.getElementById('current-year').textContent = new Date().getFullYear();
document.body.classList.add('dark-mode');
navHomeBtn.addEventListener('click', () => navigateTo('home'));
navArticlesBtn.addEventListener('click', () => navigateTo('articles'));
navAboutBtn.addEventListener('click', () => navigateTo('about'));
navAdminBtn.addEventListener('click', () => {
    if (!isAdminAuthenticated) {
        const clave = prompt("Introduce la clave de administrador:");
        if (clave === ADMIN_PASSWORD) {
            isAdminAuthenticated = true;
            navigateTo('admin');
        } else {
            showModal("Acceso denegado", "Clave incorrecta.");
        }
    } else {
        navigateTo('admin');
    }
});
themeToggleBtn.addEventListener('click', toggleTheme);
modalCloseBtn.addEventListener('click', hideModal);
document.getElementById('save-about-btn').onclick = function() {
    const aboutText = document.getElementById('about-content').value;
    localStorage.setItem('aboutContent', aboutText);
    showModal('Guardado', 'El contenido de Sobre Nosotros ha sido actualizado.');
};
renderSubscriptionForm();
renderCurrentPage();
