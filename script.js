function setTheme(themeName) {
    // 1. Applique l'attribut data-theme au document HTML
    document.documentElement.setAttribute('data-theme', themeName);
    
    // 2. Permutation dynamique du logo selon le thème
    const logoImg = document.getElementById('site-logo');
    if (logoImg) {
        if (themeName === 'light') {
            logoImg.src = './img/logo_fond_blanc.png';
        } else if (themeName === 'dark') {
            logoImg.src = './img/logo_fond_noir.png';
        } else if (themeName === 'red') {
            logoImg.src = './img/logo_fond_rouge.png';
        }
    }

    // 3. Mise à jour visuelle des pastilles de sélection de thème
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.remove('active');
    });

    if (themeName === 'light') {
        document.querySelector('.dot-light')?.classList.add('active');
    } else if (themeName === 'dark') {
        document.querySelector('.dot-dark')?.classList.add('active');
    } else if (themeName === 'red') {
        document.querySelector('.dot-red')?.classList.add('active');
    }
}

let cart = [];
const PHONE_NUMBER = "221776518802";

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('active');
}

function addToCart(name, pricePerKg) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.kg += 1;
    } else {
        cart.push({ name: name, pricePerKg: pricePerKg, kg: 1 });
    }
    updateCartUI();
    toggleCart();
}

function updateKg(index, delta) {
    cart[index].kg += delta;
    if (cart[index].kg <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalPrice = document.getElementById('cart-total-price');

    const totalCount = cart.reduce((acc, item) => acc + item.kg, 0);
    badge.textContent = totalCount;

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Votre panier est actuellement vide.</p>`;
        totalPrice.textContent = "0 FCFA";
        return;
    }

    let html = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const subtotal = item.pricePerKg * item.kg;
        grandTotal += subtotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.name}</span>
                    <button class="cart-item-remove" onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="cart-item-controls">
                    <div class="kilo-picker">
                        <button class="kilo-btn" onclick="updateKg(${index}, -0.5)">-</button>
                        <span class="kilo-value">${item.kg} kg</span>
                        <button class="kilo-btn" onclick="updateKg(${index}, 0.5)">+</button>
                    </div>
                    <span class="cart-item-subtotal">${subtotal.toLocaleString()} FCFA</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalPrice.textContent = `${grandTotal.toLocaleString()} FCFA`;
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "*COMMANDE MAISON LADOUM PRESTIGE*\n";
    message += "-----------------------------------\n\n";

    let grandTotal = 0;
    cart.forEach(item => {
        const subtotal = item.pricePerKg * item.kg;
        grandTotal += subtotal;
        message += `• *${item.name}* : ${item.kg} kg (${subtotal.toLocaleString()} FCFA)\n`;
    });

    message += "\n-----------------------------------\n";
    message += `*TOTAL ESTIMÉ : ${grandTotal.toLocaleString()} FCFA*\n\n`;
    message += "Bonjour, je souhaite valider la commande de ces découpes.";

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}