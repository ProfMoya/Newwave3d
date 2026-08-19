const WHATSAPP_NUMBER = '5493515054755';
const BRAND_NAME = 'NewWave.3d';

function formatPrice(n) {
  return '$' + n.toLocaleString('es-AR');
}

function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function setGeneralWhatsappLinks() {
  const generalText = `Hola! Quiero consultar por el catálogo de ${BRAND_NAME}`;
  document.querySelectorAll('#header-whatsapp, #hero-whatsapp, #footer-whatsapp')
    .forEach(el => { el.href = waLink(generalText); });
}

function productWhatsappText(producto, variante) {
  const detalle = variante ? ` (${variante.nombre})` : '';
  return `Hola! Quiero consultar por: ${producto.nombre}${detalle}`;
}

let catalogProducts = [];

function applyFilter(cat) {
  const filtered = cat === 'Todos' ? catalogProducts : catalogProducts.filter(p => p.categoria === cat);
  renderGrid(filtered);
  document.querySelectorAll('.filter-btn[data-cat], .drawer-link[data-cat]').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
}

function renderFilters(categorias) {
  const wrap = document.getElementById('filters');
  wrap.innerHTML = '';
  categorias.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.type = 'button';
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.addEventListener('click', () => applyFilter(cat));
    wrap.appendChild(btn);
  });
}

function renderDrawerLinks(categorias) {
  const wrap = document.getElementById('drawer-links');
  if (!wrap) return;
  wrap.innerHTML = '';
  categorias.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'drawer-link' + (i === 0 ? ' active' : '');
    btn.type = 'button';
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.addEventListener('click', () => {
      applyFilter(cat);
      closeDrawer();
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    wrap.appendChild(btn);
  });

  const customLink = document.createElement('a');
  customLink.className = 'drawer-link drawer-link-custom';
  customLink.href = '#featured-custom';
  customLink.textContent = 'Pedido personalizado';
  customLink.addEventListener('click', () => closeDrawer());
  wrap.appendChild(customLink);
}

const WHATSAPP_ICON_SVG = '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

function featuredCustomHTML(p) {
  return `
    <section class="featured-card reveal-pending" aria-label="${p.nombre}">
      <div class="featured-content">
        <h2>${p.nombre}</h2>
        <p>${p.descripcion || ''}</p>
        <form class="custom-form featured-form">
          <label class="form-field">
            <span>Tu nombre</span>
            <input type="text" name="nombre" placeholder="¿Cómo te llamás?" required>
          </label>
          <label class="form-field">
            <span>Contanos tu idea</span>
            <textarea name="detalle" rows="2" placeholder="Qué querés imprimir, tamaño, color, cantidad..." required></textarea>
          </label>
          <button type="submit" class="btn btn-whatsapp card-cta">
            ${WHATSAPP_ICON_SVG}
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  `;
}

function attachCustomFormHandler(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const detalle = form.detalle.value.trim();
    const text = `Hola! Soy ${nombre}. Quiero hacer un pedido personalizado:\n${detalle}`;
    const btn = form.querySelector('.card-cta');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `${WHATSAPP_ICON_SVG}<span>¡Listo! Abriendo WhatsApp…</span>`;
    window.open(waLink(text), '_blank', 'noopener');
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 1600);
  });
}

function renderFeaturedCustom(p) {
  const container = document.getElementById('featured-custom');
  if (!container || !p) return;
  container.innerHTML = featuredCustomHTML(p);
  setupScrollReveal(container.querySelectorAll('.reveal-pending'));
  attachCustomFormHandler(container.querySelector('.custom-form'));
}

function cardHTML(p) {
  const variantesHTML = p.variantes.map(v => `
    <div class="variant-row">
      <span class="vname">${v.nombre}</span>
      <span class="vprice">${formatPrice(v.precio)}</span>
    </div>
  `).join('');

  const ctaVariante = p.variantes.length === 1 ? p.variantes[0] : null;
  const ctaHref = waLink(productWhatsappText(p, ctaVariante));

  return `
    <article class="card reveal-pending" data-cat="${p.categoria}">
      <div class="card-media" data-img="${p.imagen}" data-name="${p.nombre}">
        ${p.esImagenReferencia ? '<span class="badge-ref">Foto ilustrativa</span>' : ''}
        <span class="card-category">${p.categoria}</span>
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.nombre}</h3>
        <p class="card-desc">${p.descripcion || ''}</p>
        <div class="variant-list">${variantesHTML}</div>
        <a class="btn btn-whatsapp card-cta" href="${ctaHref}" target="_blank" rel="noopener">
          ${WHATSAPP_ICON_SVG}
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  `;
}

function renderGrid(productos) {
  const grid = document.getElementById('product-grid');
  if (!productos.length) {
    grid.innerHTML = '<p class="loading">No hay productos en esta categoría.</p>';
    return;
  }
  grid.innerHTML = productos.map(cardHTML).join('');

  const cards = grid.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${Math.min(i, 6) * 55}ms`;
  });
  setupScrollReveal(cards);

  grid.querySelectorAll('.card-media').forEach(media => {
    media.addEventListener('click', () => openLightbox(media.dataset.img, media.dataset.name));
  });
}

function setupScrollReveal(cards) {
  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.remove('reveal-pending'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  cards.forEach(card => io.observe(card));
}

const THEME_STORAGE_KEY = 'nw3d-theme';

function setupThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const updateLabel = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  };
  updateLabel();

  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
    updateLabel();
  });
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  let ticking = false;
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('is-open');
  setTimeout(() => { lightbox.hidden = true; }, 250);
}

function setupLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const toggle = document.getElementById('nav-toggle');
  backdrop.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  requestAnimationFrame(() => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
  });
}

function closeDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const toggle = document.getElementById('nav-toggle');
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
  setTimeout(() => { backdrop.hidden = true; }, 350);
}

function setupDrawer() {
  document.getElementById('nav-toggle').addEventListener('click', openDrawer);
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

async function init() {
  setGeneralWhatsappLinks();
  setupLightbox();
  setupHeaderScroll();
  setupDrawer();
  setupThemeToggle();

  try {
    const res = await fetch('data/productos.json');
    const all = await res.json();
    const customOrderProduct = all.find(p => p.tipo === 'formulario');
    catalogProducts = all.filter(p => p.tipo !== 'formulario');

    renderFeaturedCustom(customOrderProduct);

    const categorias = ['Todos', ...new Set(catalogProducts.map(p => p.categoria))];
    renderFilters(categorias);
    renderDrawerLinks(categorias);

    renderGrid(catalogProducts);
  } catch (err) {
    document.getElementById('product-grid').innerHTML =
      '<p class="loading">No se pudo cargar el catálogo. Intentá recargar la página.</p>';
    console.error(err);
  }
}

init();
