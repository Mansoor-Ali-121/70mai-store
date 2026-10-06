// Informational pages (support, about, policies…) that live on the official 70mai
// site rather than in this store. Product, collection and cart links stay internal.
export const officialUrl = (path = '') => `https://www.70mai.com/us/${path}${path && !path.endsWith('/') ? '/' : ''}`;
