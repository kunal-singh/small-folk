import { describe, it, expect } from 'vitest';
import { ShoppingCart } from './index.js';

describe('ShoppingCart', () => {
  it('should be implemented', () => {
    expect(ShoppingCart.solve()).toBeDefined();
  });
});
