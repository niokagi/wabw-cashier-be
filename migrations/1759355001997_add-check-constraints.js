/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  console.log("Adding CHECK constraints to tables...");
  pgm.addConstraint(
    "products",
    "products_price_non_negative",
    "CHECK (price >= 0)"
  );
  pgm.addConstraint(
    "products",
    "products_stock_non_negative",
    "CHECK (stock >= 0)"
  );
  pgm.addConstraint(
    "order_items",
    "order_items_quantity_positive",
    "CHECK (quantity > 0)"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  console.log("Dropping CHECK constraints...");
  pgm.dropConstraint("products", "products_price_non_negative");
  pgm.dropConstraint("products", "products_stock_non_negative");
  pgm.dropConstraint("order_items", "order_items_quantity_positive");
};
