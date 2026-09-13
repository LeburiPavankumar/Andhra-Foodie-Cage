const app = document.querySelector('#app');

const dishes = [
  { id: 'rice', category: 'Meals', name: 'Rice plate', price: 'INR-120', amount: 120, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=85', description: 'Steamed rice served with a delicious selection of Andhra sides and curry.' },
  { id: 'leg', category: 'Meals', name: 'Chicken leg piece', price: 'INR-80 (4 piece)', amount: 80, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=85', description: 'Juicy chicken leg pieces marinated with chilli, herbs and house spices.' },
  { id: 'kebab', category: 'Meals', name: 'Chicken kebab', price: 'INR-110 (6 piece)', amount: 110, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=85', description: 'Smoky, tender kebabs grilled with a bold Andhra spice rub.' },
  { id: 'chicken-curry', category: 'Meals', name: 'Chicken curry', price: 'INR-80 (6 piece)', amount: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=85', description: 'Tender chicken cooked in a rich gravy of chilli, pepper and aromatic spices.' },
  { id: 'paneer', category: 'Meals', name: 'Paneer Tikka', price: 'INR-80', amount: 80, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=85', description: 'Charred paneer cubes with peppers, yoghurt and fragrant masala.' },
  { id: 'veg-curry', category: 'Meals', name: 'Veg curry', price: 'INR-70', amount: 70, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=85', description: 'Seasonal vegetables simmered in a comforting, spicy curry.' },
  { id: 'fish', category: 'Meals', name: 'Fish Curry', price: 'INR-120', amount: 120, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=90', description: 'Fried Rohu fish dipped in delicious gravy having a spicy flavour of chilli, black pepper and other spices. Garnished by lemon, coriander and mint leaves which gives it a delicious taste.' },
  { id: 'raita', category: 'Sides', name: 'Cucumber raita', price: 'INR-40', amount: 40, image: 'https://images.unsplash.com/photo-1571167530149-c1105b9e7f47?auto=format&fit=crop&w=600&q=85', description: 'Cool yoghurt raita with cucumber, coriander and a pinch of spice.' },
  { id: 'salad', category: 'Sides', name: 'Fresh salad', price: 'INR-50', amount: 50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2e0b2?auto=format&fit=crop&w=600&q=85', description: 'Crisp seasonal vegetables dressed with lemon and herbs.' },
  { id: 'papad', category: 'Sides', name: 'Masala papad', price: 'INR-35', amount: 35, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=85', description: 'Crispy papad topped with onion, tomato and fresh coriander.' },
  { id: 'soya', category: 'Snacks', name: 'Soya chilli', price: 'INR-80', amount: 80, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=85', description: 'Crispy soya tossed in a glossy chilli garlic sauce.' },
  { id: 'prawn', category: 'Snacks', name: 'Prawn curry', price: 'INR-110', amount: 110, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=85', description: 'Succulent prawns cooked in a fragrant coastal curry.' }
];
const recommendations = [
  { name: 'Soya chilli', price: 'INR-80', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=85' },
  { name: 'Prawn curry', price: 'INR-110', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=85' }
];
let cart = {};
let liked = new Set([2]);
let selectedCategory = 'Meals';
let selectedItemId = 'fish';
let searchQuery = '';
let checkoutDetails = { name: '', phone: '', address: '' };
let selectedPayment = '';
let checkoutError = '';
let liveLocation = { status: 'waiting', latitude: null, longitude: null };
let locationWatcher = null;

function cartCount() { return Object.values(cart).reduce((total, quantity) => total + quantity, 0); }
function itemById(id) { return dishes.find(item => item.id === id); }
function changeCart(id, delta) {
  const nextQuantity = Math.max(0, (cart[id] || 0) + delta);
  if (nextQuantity) cart[id] = nextQuantity;
  else delete cart[id];
}

function status() { return '<div class="status-bar"><span>9:41</span><span class="status-icons"><i></i><span>⌁</span><i></i></span></div>'; }
function topbar(back, title, extra = '', backTarget = 'menu') { return `<div class="topbar"><button class="icon-btn" data-action="back" data-back-target="${backTarget}" aria-label="Back">${back ? '←' : ''}</button><div class="page-title">${title}</div><div>${extra}</div></div>`; }
function cartButton() { return `<button class="icon-btn cart-button" data-action="cart" aria-label="Cart">🛒<span class="badge">${cartCount()}</span></button>`; }
function headerActions() { return `<div class="header-actions"><button class="profile" data-action="favorites" aria-label="Favorites">♥<span class="mini-badge">${liked.size}</span></button><button class="profile" data-action="auth" aria-label="Sign in">◉</button>${cartButton()}</div>`; }

function welcome() {
  app.innerHTML = `<section class="screen welcome">${status()}<h1 class="brand">ANDHRA FOODIE CAGE</h1><div class="chef-art" aria-label="Chef inside a golden cage"><img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=90" alt="Chef preparing food" /></div><div class="welcome-footer"><div class="welcome-copy">WELCOME TO OUR<br />FOODIE CAGE</div><button class="arrow-btn" data-action="demo" aria-label="Continue to demo">❯❯</button></div></section>`;
}
function demo() {
  app.innerHTML = `<section class="screen demo-screen"><button class="icon-btn back-top" data-action="welcome" aria-label="Back">←</button><div class="demo-illustration"><img class="demo-food-image" src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=90" alt="Fresh Andhra curry with rice" /></div><div class="demo-copy"><span class="demo-kicker">YUMMY FOOD, HAPPY MOOD</span><h1>Fresh Andhra<br />flavours at home</h1><p>Choose your favourite meals and get them delivered hot to your doorstep.</p></div><div class="demo-bottom"><button class="demo-login" data-action="auth">LOGIN</button><button class="demo-signup" data-action="auth">SIGN UP</button><button class="demo-menu" data-action="menu" aria-label="Next screen">NEXT <span>❯❯</span></button></div></section>`;
}
function menu(category = selectedCategory) {
  selectedCategory = category;
  const visibleDishes = dishes.filter(dish => dish.category === category && dish.name.toLowerCase().includes(searchQuery.toLowerCase()));
  app.innerHTML = `<section class="screen menu">${topbar(true, 'Menu', headerActions(), 'demo')}<div class="tabs">${['Meals', 'Sides', 'Snacks'].map(tab => `<button class="tab ${tab === category ? 'active' : ''}" data-category="${tab}">${tab}</button>`).join('')}</div><label class="search-box"><span>⌕</span><input data-search type="search" value="${searchQuery}" placeholder="Search dishes" /></label><div class="grid">${visibleDishes.length ? visibleDishes.map(dish => `<article class="dish-card" data-dish="${dish.id}"><button class="heart ${liked.has(dish.id) ? 'liked' : ''}" data-like="${dish.id}" aria-label="Favorite">♥</button><img src="${dish.image}" alt="${dish.name}" /><h3>${dish.name}</h3><div class="price">${dish.price}</div><button class="card-add" data-add="${dish.id}" aria-label="Add ${dish.name} to cart">+</button></article>`).join('') : '<p class="no-results">No dishes found. Try another search.</p>'}</div></section>`;
}
function detail(id = selectedItemId) {
  const item = itemById(id) || itemById('fish');
  selectedItemId = item.id;
  const quantity = cart[item.id] || 0;
  const related = dishes.filter(candidate => candidate.id !== item.id && candidate.category === item.category).slice(0, 2);
  app.innerHTML = `<section class="screen detail">${topbar(true, '', headerActions())}<img class="detail-image" src="${item.image}" alt="${item.name}" /><div class="detail-info"><h1 class="detail-title">${item.name}<br />${item.price}</h1><strong>Description:</strong><p class="detail-description">${item.description}</p><div class="buy-row"><div class="quantity"><button data-action="decrease">−</button><span>${quantity}</span><button data-action="increase">+</button></div><button class="buy-btn" data-action="buy">BUY</button></div></div><div class="recommended"><h2>Recommended Dish</h2><div class="recommend-grid">${related.map(relatedItem => `<article class="recommend-card" data-dish="${relatedItem.id}"><img src="${relatedItem.image}" alt="${relatedItem.name}" /><div>${relatedItem.name}<br />${relatedItem.price}</div><button class="add-small" data-add="${relatedItem.id}">+</button></article>`).join('')}</div></div></section>`;
}
function cartScreen() {
  const cartItems = Object.entries(cart).map(([id, quantity]) => ({ item: itemById(id), quantity })).filter(entry => entry.item);
  const total = cartItems.reduce((sum, entry) => sum + (entry.item.amount * entry.quantity), 0);
  app.innerHTML = `<section class="screen cart-screen">${topbar(true, 'Basket', '')}<div class="cart-content">${cartItems.length ? cartItems.map(({ item, quantity }) => `<article class="cart-row"><img src="${item.image}" alt="${item.name}" /><div class="cart-row-info"><h3>${item.name}</h3><span>${item.price}</span><div class="cart-controls"><button data-cart-minus="${item.id}">−</button><b>${quantity}</b><button data-cart-plus="${item.id}">+</button></div></div></article>`).join('') : '<div class="empty-cart"><div>🛒</div><h2>Your basket is empty</h2><p>Add a dish from the menu to see it here.</p></div>'}<div class="cart-summary"><span>Total</span><strong>INR-${total}</strong></div><button class="checkout-btn" data-action="checkout" ${cartItems.length ? '' : 'disabled'}>PROCEED TO PAY</button></div></section>`;
}
function favoritesScreen() {
  const favoriteItems = dishes.filter(item => liked.has(item.id));
  app.innerHTML = `<section class="screen favorites-screen">${topbar(true, 'Favourites', '')}<div class="favorites-content">${favoriteItems.length ? `<p class="section-note">Your saved food, ready whenever you are.</p><div class="grid">${favoriteItems.map(item => `<article class="dish-card" data-dish="${item.id}"><button class="heart liked" data-like="${item.id}" aria-label="Remove ${item.name} from favorites">♥</button><img src="${item.image}" alt="${item.name}" /><h3>${item.name}</h3><div class="price">${item.price}</div><button class="card-add" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button></article>`).join('')}</div>` : '<div class="empty-cart"><div>♡</div><h2>No favourites yet</h2><p>Tap the heart on a dish to save it here.</p></div>'}</div></section>`;
}
function checkoutScreen() {
  app.innerHTML = `<section class="screen checkout-screen">${topbar(true, 'Delivery details', '')}<div class="checkout-content"><div class="checkout-intro"><span class="step-number">1</span><div><h2>Where should we deliver?</h2><p>We will use these details for your order.</p></div></div>${checkoutError ? `<p class="checkout-error">${checkoutError}</p>` : ''}<label class="form-label">Full name</label><input class="form-input" data-contact="name" value="${checkoutDetails.name}" placeholder="Your name" /><label class="form-label">Phone number</label><input class="form-input" data-contact="phone" value="${checkoutDetails.phone}" placeholder="10 digit mobile number" type="tel" /><label class="form-label">Delivery address</label><textarea class="form-input address-input" data-contact="address" placeholder="House no, street, city">${checkoutDetails.address}</textarea><button class="proceed-btn" data-action="payment">PROCEED TO PAY <span>→</span></button></div></section>`;
}
function paymentScreen() {
  app.innerHTML = `<section class="screen payment-screen">${topbar(true, 'Payment', '')}<div class="payment-content"><div class="checkout-intro"><span class="step-number">2</span><div><h2>Choose payment method</h2><p>Secure checkout for your ${cartCount()} item${cartCount() === 1 ? '' : 's'}.</p></div></div><div class="payment-options"><button class="payment-option ${selectedPayment === 'cod' ? 'selected' : ''}" data-payment="cod"><span class="payment-icon">▣</span><span><b>Pay on delivery</b><small>Pay when your order arrives</small></span><i>○</i></button><button class="payment-option ${selectedPayment === 'phonepe' ? 'selected' : ''}" data-payment="phonepe"><span class="payment-icon phonepe">पे</span><span><b>PhonePe</b><small>Pay securely with PhonePe</small></span><i>○</i></button><button class="payment-option ${selectedPayment === 'paytm' ? 'selected' : ''}" data-payment="paytm"><span class="payment-icon paytm">P</span><span><b>Paytm</b><small>Pay using your Paytm wallet</small></span><i>○</i></button><button class="payment-option ${selectedPayment === 'gpay' ? 'selected' : ''}" data-payment="gpay"><span class="payment-icon gpay">G</span><span><b>Google Pay</b><small>Fast UPI payment</small></span><i>○</i></button></div><button class="place-order-btn" data-action="place-order" ${selectedPayment ? '' : 'disabled'}>PLACE ORDER <span>→</span></button></div></section>`;
}
function trackingScreen() {
  const method = selectedPayment === 'cod' ? 'Pay on delivery' : selectedPayment === 'phonepe' ? 'PhonePe' : selectedPayment === 'paytm' ? 'Paytm' : 'Google Pay';
  app.innerHTML = `<section class="screen tracking-screen"><button class="icon-btn back-top" data-action="menu">←</button><div class="order-success"><div class="success-check">✓</div><h1>Order placed!</h1><p>Payment: ${method}</p><strong>Your order is on the way</strong></div><div class="live-map"><div class="map-road road-one"></div><div class="map-road road-two"></div><div class="map-pin restaurant">🍴</div><div class="map-pin rider">🛵</div><div class="map-pin home">⌂</div><div class="map-route"></div><div class="location-label" data-location-label>Waiting for live location...</div></div><div class="tracking-card"><div><span class="live-dot" data-live-dot></span><b data-live-title>Live delivery tracking</b></div><p data-location-copy>Allow location access to see your live position and coordinates.</p><button class="location-btn" data-action="location">USE MY LIVE LOCATION</button><div class="tracking-status"><span class="status-done">✓</span><span>Preparing your food</span><span class="status-done">✓</span><span>On the way</span><span class="status-pending">3</span><span>Delivered</span></div><button class="got-it" data-action="menu">BACK TO MENU</button></div></section>`;
  startLiveLocation();
}
function updateLocationUI() {
  const copy = app.querySelector('[data-location-copy]');
  const label = app.querySelector('[data-location-label]');
  const title = app.querySelector('[data-live-title]');
  const button = app.querySelector('[data-action="location"]');
  const rider = app.querySelector('.rider');
  if (!copy || !label) return;
  if (liveLocation.status === 'active') {
    const latitude = liveLocation.latitude.toFixed(5);
    const longitude = liveLocation.longitude.toFixed(5);
    copy.textContent = `Your live location: ${latitude}, ${longitude}`;
    label.textContent = `${latitude}, ${longitude}`;
    title.textContent = 'Live location active';
    button.textContent = 'LOCATION SHARING ON';
    button.disabled = true;
    button.classList.add('is-active');
    if (rider) { rider.style.left = `${Math.max(16, Math.min(84, 50 + liveLocation.longitude % 20))}%`; rider.style.top = `${Math.max(30, Math.min(78, 52 + liveLocation.latitude % 18))}%`; }
  } else if (liveLocation.status === 'denied') {
    copy.textContent = 'Location permission was not granted. Enable it in browser settings to track live.';
    label.textContent = 'Location unavailable';
    title.textContent = 'Live location unavailable';
    button.textContent = 'TRY LOCATION AGAIN';
  }
}
function startLiveLocation() {
  if (!navigator.geolocation) { liveLocation.status = 'denied'; updateLocationUI(); return; }
  liveLocation.status = 'waiting';
  navigator.geolocation.getCurrentPosition((position) => {
    liveLocation = { status: 'active', latitude: position.coords.latitude, longitude: position.coords.longitude };
    updateLocationUI();
    if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    locationWatcher = navigator.geolocation.watchPosition((nextPosition) => {
      liveLocation = { status: 'active', latitude: nextPosition.coords.latitude, longitude: nextPosition.coords.longitude };
      updateLocationUI();
    }, () => { liveLocation.status = 'denied'; updateLocationUI(); }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
  }, () => { liveLocation.status = 'denied'; updateLocationUI(); }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
}
function auth() {
  app.innerHTML = `<section class="screen auth"><button class="icon-btn back-top" data-action="back">←</button><div class="auth-photos"><img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=85" alt="Chef" /><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85" alt="Food" /></div><div class="auth-content"><div class="auth-tabs"><button class="auth-tab active">SIGN-IN</button><button class="auth-tab">SIGN-UP</button></div><label class="form-label">Email-id</label><input class="form-input" type="email" placeholder="" /><label class="form-label">Password</label><div class="password-wrap"><input class="form-input" type="password" /><button class="eye" data-action="eye">◉</button></div><div class="forgot">forgot password?</div><label class="remember"><input type="checkbox" />Remember me</label><button class="login-btn" data-action="login">LOG IN</button><div class="or">OR</div><div class="sign-in-copy">Sign in using:</div><div class="socials"><span>🔵</span><span>🌐</span><span>🐦</span></div></div></section>`;
}
function success() {
  app.innerHTML = `<section class="screen success"><button class="icon-btn back-top" data-action="menu">←</button><div class="delivery-art"></div><div class="success-panel"><h1>Thank<br />you</h1><p>your food will<br />be delivered to<br />your doorstep<br />soon.</p><button class="got-it" data-action="menu">Got it</button></div></section>`;
}
function render(screen) { screen === 'welcome' ? welcome() : screen === 'demo' ? demo() : screen === 'menu' ? menu() : screen === 'detail' ? detail() : screen === 'cart' ? cartScreen() : screen === 'favorites' ? favoritesScreen() : screen === 'checkout' ? checkoutScreen() : screen === 'payment' ? paymentScreen() : screen === 'tracking' ? trackingScreen() : screen === 'auth' ? auth() : success(); }

app.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  const like = event.target.closest('[data-like]')?.dataset.like;
  const dish = event.target.closest('[data-dish]')?.dataset.dish;
  const category = event.target.closest('[data-category]')?.dataset.category;
  const add = event.target.closest('[data-add]')?.dataset.add;
  const cartPlus = event.target.closest('[data-cart-plus]')?.dataset.cartPlus;
  const cartMinus = event.target.closest('[data-cart-minus]')?.dataset.cartMinus;
  const backTarget = event.target.closest('[data-back-target]')?.dataset.backTarget;
  const payment = event.target.closest('[data-payment]')?.dataset.payment;
  const contact = event.target.closest('[data-contact]')?.dataset.contact;
  if (contact) { checkoutDetails[contact] = event.target.value; checkoutError = ''; return; }
  if (like !== undefined) { liked.has(like) ? liked.delete(like) : liked.add(like); menu(); return; }
  if (category) { menu(category); return; }
  if (add) { changeCart(add, 1); menu(selectedCategory); return; }
  if (cartPlus) { changeCart(cartPlus, 1); cartScreen(); return; }
  if (cartMinus) { changeCart(cartMinus, -1); cartScreen(); return; }
  if (dish !== undefined) { detail(dish); return; }
  if (action === 'menu') render('menu');
  if (action === 'demo') render('demo');
  if (action === 'welcome') render('welcome');
  if (action === 'cart') cartScreen();
  if (action === 'favorites') favoritesScreen();
  if (action === 'auth') auth();
  if (action === 'back') { if (backTarget === 'demo') render('demo'); else if (backTarget === 'welcome') render('welcome'); else if (backTarget === 'cart') cartScreen(); else if (backTarget === 'payment') render('payment'); else menu(selectedCategory); }
  if (action === 'checkout') checkoutScreen();
  if (action === 'payment') { if (!checkoutDetails.name.trim() || !checkoutDetails.phone.trim() || !checkoutDetails.address.trim()) { checkoutError = 'Please enter your name, phone number and delivery address.'; checkoutScreen(); } else { checkoutError = ''; render('payment'); } }
  if (payment) { selectedPayment = payment; paymentScreen(); }
  if (action === 'place-order') render('tracking');
  if (action === 'location') startLiveLocation();
  if (action === 'increase') { changeCart(selectedItemId, 1); detail(selectedItemId); }
  if (action === 'decrease') { changeCart(selectedItemId, -1); detail(selectedItemId); }
  if (action === 'buy') { if (!cartCount()) changeCart(selectedItemId, 1); cartScreen(); }
  if (action === 'login') render('success');
  if (action === 'eye') { const input = event.target.previousElementSibling; input.type = input.type === 'password' ? 'text' : 'password'; }
});

app.addEventListener('input', (event) => {
  if (event.target.matches('[data-search]')) {
    searchQuery = event.target.value;
    menu(selectedCategory);
    const searchInput = app.querySelector('[data-search]');
    searchInput?.focus();
    searchInput?.setSelectionRange(searchQuery.length, searchQuery.length);
  }
  if (event.target.matches('[data-contact]')) checkoutDetails[event.target.dataset.contact] = event.target.value;
});

render('welcome');
