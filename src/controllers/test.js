const sql = require('mssql');
const db = require('../configs/database');

async function getData(req, res) {
  try {
    const request = new sql.Request(db);
    const query = 'SELECT * FROM [ML_damage].[dbo].[tb_basic_material]'; // Replace 'your_table' with the actual table name
    const result = await request.query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).send('Error executing the query');
  }
}

module.exports = {
  getData,
};
