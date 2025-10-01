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
  pgm.createType("user_role", ["CASHIER", "ADMIN"]);
  pgm.createType("product_category", ["FOOD", "BEVERAGE", "SNACK", "DESSERT"]);
  pgm.createType("payment_method", [
    "CASH",
    "QRIS",
    "DEBIT_CARD",
    "CREDIT_CARD",
  ]);

  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = NOW(); 
       RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropType("user_role");
  pgm.dropType("product_category");
  pgm.dropType("payment_method");
  pgm.sql("DROP FUNCTION IF EXISTS update_updated_at_column()");
};
