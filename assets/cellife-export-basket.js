/* Product/quantity data only. No customer details or payment data are persisted. */
export const KEY = 'cellife-export-enquiry:v1';
export const MAX_ITEMS = 50;
export function normalizeEntries(value) {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) throw new Error('Invalid enquiry cart.');
  const seen = new Set();
  return value.map(item => {
    if (!item || !/^[a-z0-9][a-z0-9-]{0,199}$/.test(item.handle) || !/^\d{1,24}$/.test(String(item.variantId)) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw new Error('Invalid enquiry item.');
    const variantId = String(item.variantId);
    if (seen.has(variantId)) throw new Error('Duplicate enquiry item.');
    seen.add(variantId);
    return {handle: item.handle, variantId, quantity: item.quantity};
  });
}
export function mergeEntry(items, entry) {
  const next = normalizeEntries(items).map(item => ({...item}));
  const valid = normalizeEntries([entry])[0], existing = next.find(item => item.variantId === valid.variantId);
  if (existing) existing.quantity += valid.quantity;
  else next.push(valid);
  return normalizeEntries(next);
}
export function subtractSubmitted(items, submitted) {
  return normalizeEntries(items).map(item => ({...item, quantity: item.quantity - (submitted.find(sent => sent.variantId === item.variantId)?.quantity || 0)})).filter(item => item.quantity > 0);
}
export function summary(items) {
  return ['EXPORT PRODUCT ENQUIRY — NO PAYMENT / NOT A CONFIRMED ORDER', ...items.map(({entry, product, variant}) => [
    'Product: ' + product.title, 'Variant: ' + variant.title, 'Quantity: ' + entry.quantity,
    'SKU: ' + (variant.sku || 'Not supplied'), 'Barcode: ' + (variant.barcode || 'Not supplied'),
    'Product ID: ' + product.id, 'Variant ID: ' + variant.id,
    'Brand: ' + product.vendor, 'Type: ' + product.type,
    'Product URL: ' + product.url
  ].join('\n'))].join('\n\n');
}
