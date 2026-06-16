const pool = require("../config/db");

/* ===========================
   GET ALL PRODUCTS
=========================== */
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   CREATE PRODUCT
=========================== */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category,
      sku,
      reorder_level,
    } = req.body;

    if (!name || !price || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, Price and Quantity are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products
      (
        name,
        price,
        quantity,
        category,
        sku,
        reorder_level
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        name,
        price,
        quantity,
        category,
        sku || null,
        reorder_level || 10,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE PRODUCT
=========================== */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      quantity,
      category,
      sku,
      reorder_level,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        price = $2,
        quantity = $3,
        category = $4,
        sku = $5,
        reorder_level = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        price,
        quantity,
        category,
        sku,
        reorder_level,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   DELETE PRODUCT
=========================== */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   DASHBOARD STATS
=========================== */
const getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
    `);

    const products = result.rows;

    const totalProducts = products.length;

    const inventoryValue = products.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const lowStockItems = products.filter(
      (item) =>
        Number(item.quantity) <=
        Number(item.reorder_level || 10)
    ).length;

    const categories = new Set(
      products.map((item) => item.category)
    ).size;

    const healthyProducts = products.filter(
      (item) =>
        Number(item.quantity) >
        Number(item.reorder_level || 10)
    ).length;

    const healthScore = totalProducts
      ? Math.round(
          (healthyProducts / totalProducts) * 100
        )
      : 0;

    res.json({
      success: true,
      data: {
        totalProducts,
        inventoryValue,
        lowStockItems,
        categories,
        healthScore,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
};