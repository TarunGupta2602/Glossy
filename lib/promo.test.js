import test from "node:test";
import assert from "node:assert/strict";
import { calculateBuy2Get1Free } from "./promo.js";

const CATALOG = [
    { id: "gift", name: "Gift", price: 50, main_image: "/logo.png" },
    { id: "other", name: "Other", price: 80, main_image: "/logo.png" },
];

test("activates one free gift when two paid items are in the cart", () => {
    const offer = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 100, quantity: 2 }],
        CATALOG
    );

    assert.equal(offer.completeSets, 1);
    assert.deepEqual(offer.freeProductIds, ["gift"]);
    assert.equal(offer.discountAmount, 50);
    // Paid total is cart subtotal only (+ shipping); gift MRP is not subtracted again
    assert.equal(offer.cartSubtotal, 200);
    assert.equal(offer.cartTotal, offer.cartSubtotal + offer.shippingFee);
});

test("three paid items still unlock one free gift", () => {
    const offer = calculateBuy2Get1Free(
        [
            { id: "a", name: "Item A", price: 100, quantity: 2 },
            { id: "b", name: "Item B", price: 200, quantity: 1 },
        ],
        CATALOG
    );

    assert.equal(offer.completeSets, 1);
    assert.deepEqual(offer.freeProductIds, ["gift"]);
    assert.equal(offer.cartSubtotal, 400);
    assert.equal(offer.cartTotal, offer.cartSubtotal + offer.shippingFee);
});

test("free shipping applies at ₹1000 paid subtotal", () => {
    const offer = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 1000, quantity: 1 }],
        CATALOG
    );
    assert.equal(offer.shippingFee, 0);
    assert.equal(offer.cartTotal, 1000);
});
