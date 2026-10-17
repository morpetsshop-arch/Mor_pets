import { randomUUID } from 'node:crypto';
import { Product } from './product.model.js';
import { cop } from '../config/index.js';

const lines = (s) => (Array.isArray(s.cart) ? s.cart : (s.cart = []));
const clamp = (n) => Math.min(Math.max(n, 0), 99);

// junta líneas repetidas (mismo peso y mismo aroma) sumando cantidades
function merge(list) {
  const seen = new Map();
  for (const l of list) {
    const k = `${l.productId}|${l.aromaId}`;
    if (seen.has(k)) seen.get(k).qty = clamp(seen.get(k).qty + l.qty);
    else seen.set(k, { ...l });
  }
  return [...seen.values()];
}

export const Cart = {
  add(s, productId) {
    if (!Product.find(productId)) return;
    lines(s).push({ uid: randomUUID(), productId, aromaId: Product.find(productId).hasAromas === false ? null : Product.aromas()[0].id, qty: 1 });
    s.cart = merge(lines(s));
  },

  save(s, body = {}) {
    for (const l of lines(s)) {
      const a = body[`aroma_${l.uid}`];
      const q = parseInt(body[`qty_${l.uid}`], 10);
      if (l.aromaId && Product.aromas().some((x) => x.id === a)) l.aromaId = a;
      if (!Number.isNaN(q)) l.qty = clamp(q);
    }
    s.cart = merge(lines(s).filter((l) => l.qty > 0));
  },

  duplicate(s, uid) {
    const l = lines(s).find((x) => x.uid === uid);
    if (!l || !l.aromaId) return;
    const used = lines(s).filter((x) => x.productId === l.productId).map((x) => x.aromaId);
    const free = Product.aromas().find((a) => !used.includes(a.id));
    if (free) lines(s).push({ uid: randomUUID(), productId: l.productId, aromaId: free.id, qty: 1 });
  },

  remove(s, uid) { s.cart = lines(s).filter((l) => l.uid !== uid); },

  items: (s) => lines(s).map((l) => {
    const product = Product.find(l.productId);
    const aroma = l.aromaId ? Product.aromas().find((a) => a.id === l.aromaId) : null;
    return product && (aroma || !l.aromaId) ? { ...l, product, aroma, subtotal: product.price * l.qty } : null;
  }).filter(Boolean),

  count: (s) => Cart.items(s).reduce((t, i) => t + i.qty, 0),
  total: (s) => Cart.items(s).reduce((t, i) => t + i.subtotal, 0),

  whatsappUrl(s, wa) {
    const rows = Cart.items(s).map((i) => `• ${i.qty} x ${i.product.name}${i.aroma ? ' aroma ' + i.aroma.name : ''} (${cop(i.subtotal)})`);
    const text = `Hola Morpets, quiero hacer este pedido:\n${rows.join('\n')}\nTotal: ${cop(Cart.total(s))}\n\nMi dirección y barrio/localidad: `;
    return `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  }
};