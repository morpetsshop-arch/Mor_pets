import { Product } from '../models/product.model.js';
export const list = (req, res) => {
  const category = req.query.categoria || '';
  res.render('catalog', { title: 'Catálogo', products: Product.byCategory(category), categories: Product.categories(), category });
};
export const show = (req, res) => {
  const product = Product.find(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'No encontrado' });
  res.render('product', { title: product.name, product });
};
