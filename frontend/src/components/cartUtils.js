export const CART_KEY = 'homeaway_cart';

export function readCart() {
    try {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        return [];
    }
}

export function writeCart(items) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('homeaway-cart-updated', { detail: items }));
    } catch (err) {
        console.error('Error writing cart to storage', err);
    }
}

export function addToCart(room) {
    const current = readCart();
    if (!current.some((item) => item._id === room._id)) {
        const updated = [...current, room];
        writeCart(updated);
    }
}

export function removeFromCart(roomId) {
    const current = readCart();
    const updated = current.filter((item) => item._id !== roomId);
    writeCart(updated);
}

export function clearCart() {
    writeCart([]);
}