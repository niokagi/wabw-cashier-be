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
  pgm.createTable("order_items", {
    id: "id",
    order_id: {
      type: "integer",
      notNull: true,
      references: '"orders"(id)',
      onDelete: "CASCADE",
    },
    product_id: {
      type: "integer",
      notNull: true,
      references: '"products"(id)',
      onDelete: "RESTRICT",
    },
    quantity: { type: "integer", notNull: true },
    price: { type: "decimal(10, 2)", notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("order_items");
};
