import { Product } from '../models/product.model.js';
export const home = (req, res) => res.render('home', { title: 'Inicio', featured: Product.all() });
export const contact = (req, res) => res.render('contact', { title: 'Contacto' });
