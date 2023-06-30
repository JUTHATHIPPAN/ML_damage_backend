var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const sql = require('mssql');
const database = require('../configs/database');

// Hash password (register)
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function signUp(req, res) {
  try {
      const { name, username, password } = req.body.values;
    var IsActive = 1;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
        const request = new sql.Request(database);
        const query = `INSERT INTO [ML_damage].[dbo].[tb_account] (name, username, password, IsActive) VALUES ('${name}', '${username}', '${hash}', '${IsActive}')`;
        const result = await request.query(query);
        res.json(result.recordset);
      } catch (error) {
        console.error('Error executing the query:', error);
        res.status(500).send('Error executing the query');
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error hashing password');
  }
}

module.exports = {
  signUp,
};
