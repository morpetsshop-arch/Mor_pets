import { Cart } from '../models/cart.model.js';
import { config } from '../config/index.js';

export const view = (req, res) => res.render('cart', {
  title: 'Carrito',
  items: Cart.items(req.session),
  total: Cart.total(req.session),
  waUrl: Cart.whatsappUrl(req.session, config.brand.whatsapp)
});
export const add = (req, res) => { Cart.add(req.session, req.params.id); res.redirect('/carrito'); };
export const save = (req, res) => { Cart.save(req.session, req.body); res.redirect('/carrito'); };
export const duplicate = (req, res) => { Cart.save(req.session, req.body); Cart.duplicate(req.session, req.params.uid); res.redirect('/carrito'); };
export const remove = (req, res) => { Cart.save(req.session, req.body); Cart.remove(req.session, req.params.uid); res.redirect('/carrito'); };