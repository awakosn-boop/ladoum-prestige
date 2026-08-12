let cart = [];
const PHONE_NUMBER = "221776518802";

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    document.querySelectorAll('.theme-dot').forEach(dot => dot.classList.remove('active'));
    if(themeName === 'light') document.querySelector('.dot-light')?.classList.add('active');
    if(themeName === 'dark') document.querySelector('.dot-dark')?.classList.add('active');
    if(themeName === 'red') document.querySelector('.dot-red')?.classList.add('active');
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('active');
}

/**
 * Ajouter au panier
 * @param {string} name 
 * @param {number} pricePerUnit (0 si sur devis)
 * @param {string} unitType 'kg' ou 'unit'
 */
function addToCart(name, pricePerUnit, unitType = 'kg') {
    const existing = cart.find(item => item.name === name);
    const initialQty = unitType === 'kg' ? 1 : 1;

    if (existing) {
        existing.qty += (unitType === 'kg' ? 0.5 : 1);
    } else {
        cart.push({
            name: name,
            price: pricePerUnit,
            qty: initialQty,
            type: unitType
        });
    }
    updateCartUI();
    toggleCart();
}

function updateQty(index, delta) {
    const item = cart[index];
    const minStep = item.type === 'kg' ? 0.5 : 1;
    
    item.qty += delta;
    if (item.qty <= 0) {
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
    const totalPriceContainer = document.getElementById('cart-total-price');

    // Compte du nombre total de lignes ou d'unités
    badge.textContent = cart.length;

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Votre panier est actuellement vide.</p>`;
        totalPriceContainer.textContent = "0 FCFA";
        return;
    }

    let html = '';
    let grandTotal = 0;
    let hasQuoteItems = false;

    cart.forEach((item, index) => {
        const isPriced = item.price > 0;
        const subtotal = isPriced ? item.price * item.qty : 0;
        if (isPriced) grandTotal += subtotal;
        else hasQuoteItems = true;

        const qtyLabel = item.type === 'kg' ? `${item.qty} kg` : `${item.qty} pc`;
        const step = item.type === 'kg' ? 0.5 : 1;
        const priceDisplay = isPriced ? `${subtotal.toLocaleString()} FCFA` : `Sur devis`;

        html += `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.name}</span>
                    <button class="cart-item-remove" onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="cart-item-controls">
                    <div class="kilo-picker">
                        <button class="kilo-btn" onclick="updateQty(${index}, -${step})">-</button>
                        <span class="kilo-value">${qtyLabel}</span>
                        <button class="kilo-btn" onclick="updateQty(${index}, ${step})">+</button>
                    </div>
                    <span class="cart-item-subtotal">${priceDisplay}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    let totalText = `${grandTotal.toLocaleString()} FCFA`;
    if (hasQuoteItems && grandTotal > 0) totalText += ` (+ sur devis)`;
    else if (hasQuoteItems && grandTotal === 0) totalText = "Sur devis";
    
    totalPriceContainer.textContent = totalText;
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "*COMMANDE - BOUCHERIE LADOUM PRESTIGE*\n";
    message += "-----------------------------------\n\n";

    let grandTotal = 0;
    let hasQuoteItems = false;

    cart.forEach(item => {
        const isPriced = item.price > 0;
        const subtotal = isPriced ? item.price * item.qty : 0;
        const qtyLabel = item.type === 'kg' ? `${item.qty} kg` : `${item.qty} pièce(s)`;

        if (isPriced) {
            grandTotal += subtotal;
            message += `• *${item.name}* : ${qtyLabel} (${subtotal.toLocaleString()} FCFA)\n`;
        } else {
            hasQuoteItems = true;
            message += `• *${item.name}* : ${qtyLabel} (Prix à confirmer)\n`;
        }
    });

    message += "\n-----------------------------------\n";
    if (grandTotal > 0) {
        message += `*TOTAL ESTIMÉ : ${grandTotal.toLocaleString()} FCFA*\n`;
    }
    if (hasQuoteItems) {
        message += `_Note : Inclut des pièces sur devis à confirmer._\n`;
    }
    message += "\nBonjour, je souhaite valider la commande de ces éléments.";

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// Gestion du Menu Hamburger Mobile
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    const icon = document.getElementById('burger-icon');
    
    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times'); // Transforme le burger en X
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('main-nav');
    const icon = document.getElementById('burger-icon');
    if (nav) {
        nav.classList.remove('active');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}