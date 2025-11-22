const hoodies = Array.from({ length: 6 }).map((_, i) => ({
  id: `h${i+1}`,
  title: 'Худи с принтом',
  price: 999 + (i ? 200 : 0),
  oldPrice: i === 0 ? 1199 : null
}));
const shorts = Array.from({ length: 6 }).map((_, i) => ({
  id: `s${i+1}`,
  title: 'Широкие шорты',
  price: 999,
  oldPrice: i === 0 ? 1199 : null
}));

function priceBlock(p, old){
  const hasSale = typeof old === 'number' && old > p;
  return `
    <div class="card__price">
      ${hasSale ? `<img class="icon--price" src="/icons/discount2.svg" alt="Скидка" title="Скидка" />` : ''}
      <span>${p.toLocaleString('ru-RU')} ₽</span>
      ${hasSale ? `<span class="card__price-old">${old.toLocaleString('ru-RU')} ₽</span>` : ''}
    </div>
  `;
}

function renderGrid(el, items){
  el.innerHTML = items.map(it => `
    <article class="card" data-id="${it.id}">
      <div class="card__media">
        <button class="card__fav" title="В избранное" aria-pressed="false">
          <img class="icon" src="/icons/heart.svg" alt="" />
        </button>
      </div>
      ${priceBlock(it.price, it.oldPrice)}
      <p class="card__title">${it.title}</p>
      <button class="card__btn">В корзину</button>
    </article>
  `).join('');
}

const cart = new Set(JSON.parse(localStorage.getItem('cart') || '[]'));
const saveCart = () => localStorage.setItem('cart', JSON.stringify([...cart]));

function setCartBtnState(btn, inCart) {
  btn.textContent = inCart ? 'В корзине' : 'В корзину';
  btn.classList.toggle('in-cart', inCart);
  btn.setAttribute('aria-pressed', String(inCart));
}

function initCartButtons() {
  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const btn = card.querySelector('.card__btn');
    if (btn) setCartBtnState(btn, cart.has(id));
  });
}

renderGrid(document.getElementById('grid-hoodies'), hoodies);
renderGrid(document.getElementById('grid-shorts'), shorts);
initCartButtons();

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card__btn');
  if (!btn) return;

  const card = btn.closest('.card');
  if (!card) return;
  const id = card.dataset.id;

  const inCart = cart.has(id);
  if (inCart) {
    cart.delete(id);
  } else {
    cart.add(id);
  }
  saveCart();
  setCartBtnState(btn, !inCart);
});