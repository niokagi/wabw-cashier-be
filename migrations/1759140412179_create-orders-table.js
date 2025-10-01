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
  pgm.createTable("orders", {
    id: "id",
    total_amount: { type: "decimal(10, 2)", notNull: true },
    payment_method: { type: "payment_method", notNull: true },
    customer_name: { type: "varchar(255)", notNull: false },
    user_id: {
      type: "varchar(255)",
      notNull: true,
      references: '"users"(id)',
      onDelete: "SET NULL",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("orders");
};
