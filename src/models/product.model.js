import data from '../data/products.json' with { type: 'json' };
import aromas from '../data/aromas.json' with { type: 'json' };
export const Product = {
  all: () => data,
  byCategory: (c) => (c ? data.filter((p) => p.category === c) : data),
  find: (id) => data.find((p) => p.id === id),
  categories: () => [...new Set(data.map((p) => p.category))],
  aromas: () => aromas
};