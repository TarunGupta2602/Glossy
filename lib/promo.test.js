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

test("shipping stays a flat ₹50 as the cart grows", () => {
    const small = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 200, quantity: 1 }],
        CATALOG
    );
    assert.equal(small.shippingFee, 50);

    const mid = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 700, quantity: 1 }],
        CATALOG
    );
    assert.equal(mid.shippingFee, 50);

    const higher = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 1000, quantity: 1 }],
        CATALOG
    );
    assert.equal(higher.shippingFee, 50);
    assert.equal(higher.cartTotal, 1050);

    const large = calculateBuy2Get1Free(
        [{ id: "a", name: "Item A", price: 1600, quantity: 1 }],
        CATALOG
    );
    assert.equal(large.shippingFee, 50);
});
