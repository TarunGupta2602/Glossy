import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBuy2Get1Free, FREE_ITEM_PRODUCT_IDS } from './promo.js';

test('activates the free gift when two paid items are in the cart', () => {
  const offer = calculateBuy2Get1Free(
    [
      { id: 'a', name: 'Item A', price: 100, quantity: 2 },
    ],
    FREE_ITEM_PRODUCT_IDS,
    () => 0.1
  );

  assert.equal(offer.completeSets, 1);
  assert.deepEqual(offer.freeProductIds, [FREE_ITEM_PRODUCT_IDS[1]]);
  assert.equal(offer.discountAmount, 0);
});

test('selects a free product from the configured pool for three items and still gives one free gift', () => {
  const offer = calculateBuy2Get1Free(
    [
      { id: 'a', name: 'Item A', price: 100, quantity: 2 },
      { id: 'b', name: 'Item B', price: 200, quantity: 1 },
    ],
    FREE_ITEM_PRODUCT_IDS,
    () => 0.1
  );

  assert.equal(offer.completeSets, 1);
  assert.deepEqual(offer.freeProductIds, [FREE_ITEM_PRODUCT_IDS[1]]);
});
