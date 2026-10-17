export const config = {
  port: process.env.PORT ?? 3000,
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-secret',
  brand: { name: 'Morpets', slogan: 'Amor que se nota', whatsapp: process.env.WHATSAPP ?? '573000000000' }
};
export const cop = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
