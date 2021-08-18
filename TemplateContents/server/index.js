const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create an item

app.post("/items", async (req, res) => {
  try {
    const { description } = req.body;
    const newItem = await pool.query(
      `INSERT INTO $dbtname (description) VALUES($1) RETURNING *`,
      [description]
    );

    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all items

app.get("/items", async (req, res) => {
  try {
    const allItems = await pool.query(`SELECT * FROM $dbtname`);
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a example

app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tableItem = await pool.query(
      `SELECT * FROM $dbtname WHERE $dbtnameitem_id = $1`,
      [id]
    );

    res.json(tableItem.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a example

app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTableItem = await pool.query(
      `UPDATE $dbtname SET description = $1 WHERE $dbtnameitem_id = $2`,
      [description, id]
    );

    res.json(`Item was updated ==> ${updateTableItem}`);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a example

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteExample = await pool.query(
      `DELETE FROM $dbtname WHERE $dbtnameitem_id = $1`,
      [id]
    );
    res.json(`item was deleted ==> ${deleteExample}`);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
