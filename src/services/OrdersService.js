import pool from '../db/client.js';
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

export default class OrdersService {
  constructor() {
    this._pool = pool;
  }

  async createOrder({ items, customerName, paymentMethod, userId }) {
    const client = await this._pool.connect();

    try {
      await client.query('BEGIN');
      let totalAmount = 0;
      const productDetails = [];

      for (const item of items) {
        const productResult = await client.query(
          'SELECT name, price, stock FROM products WHERE id = $1 FOR UPDATE',
          [item.productId]
        );

        if (productResult.rowCount === 0) {
          throw new InvariantError(`Produk dengan ID ${item.productId} tidak ditemukan.`);
        }

        const product = productResult.rows[0];

        if (product.stock < item.quantity) {
          throw new InvariantError(`Stok produk "${product.name}" tidak mencukupi.`);
        }

        productDetails.push({ ...item, price: product.price });
        totalAmount += Number(product.price) * item.quantity;
      }

      const orderQuery = {
        text: 'INSERT INTO orders(total_amount, payment_method, customer_name, user_id) VALUES($1, $2, $3, $4) RETURNING id',
        values: [totalAmount, paymentMethod, customerName, userId],
      };
      const orderResult = await client.query(orderQuery);
      const newOrderId = orderResult.rows[0].id;

      for (const detail of productDetails) {
        const orderItemQuery = {
          text: 'INSERT INTO order_items(order_id, product_id, quantity, price) VALUES($1, $2, $3, $4)',
          values: [newOrderId, detail.productId, detail.quantity, detail.price],
        };
        await client.query(orderItemQuery);

        const updateStockQuery = {
          text: 'UPDATE products SET stock = stock - $1 WHERE id = $2',
          values: [detail.quantity, detail.productId],
        };
        await client.query(updateStockQuery);
      }
      await client.query('COMMIT');

      return newOrderId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOrders() {
    const result = await this._pool.query(`
      SELECT o.id, o.total_amount, o.payment_method, o.customer_name, u.email as cashier_email, o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    return result.rows;
  }

  async getOrderById(orderId) {
    const orderResult = await this._pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rowCount === 0) {
      throw new NotFoundError(`Order dengan ID ${orderId} tidak ditemukan.`);
    }
    const order = orderResult.rows[0];

    const itemsResult = await this._pool.query(`
      SELECT oi.quantity, oi.price, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    return {
      ...order,
      items: itemsResult.rows,
    };
  }
}