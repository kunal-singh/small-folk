# Headless Shopping Cart

- ### Exercise 1: Shopping Cart
  Create a shopping cart system that manages items and calculates totals.  
- #### Core Requirements:
- Add items (with quantity)
- Remove items
- Calculate total price
- Apply percentage discount
- Display cart summary
- #### Advanced Requirements:
  
	1. Delayed auto-save feature:

	- After each cart modification, save cart state after 2 seconds
	- Implement using both regular nested function and arrow function
	- Handle correct context passing in both implementations
	    
		2. Price alert system:

	- Register callback functions that execute when total exceeds threshold
	- Implement using both method assignment and arrow functions
	- Ensure callbacks have access to cart context
- #### Static Requirements:
	1. Global discount management:

	- Track store-wide discount rules
	- Apply discount calculations across all cart instances
	- Maintain discount history

		2. Cart analytics:

	- Track total number of active carts
	- Calculate store-wide statistics
	- Generate reports across all instances


- #### Example Usage:
  ```javascript
  // Instance methods
  const cart = createCart();
  cart.addItem({ name: "Laptop", price: 999, quantity: 1 });
  cart.applyDiscount(10);
  cart.displaySummary();
  
  // Static methods
  ShoppingCart.registerGlobalDiscount(15);
  ShoppingCart.getTotalActiveCards();
  ShoppingCart.consolidateCarts([cart1, cart2]);
  ```

  