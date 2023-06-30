var express = require('express');
const sql = require('mssql');
const database = require('../configs/database');
var jwt = require("jsonwebtoken");
const secretKey = "dexon";

// Hash password (register)
const bcrypt = require('bcrypt');

async function signIn(req, res) {
    try {
      const { username, password } = req.body.values;
      const request = new sql.Request(database);
      const query = `SELECT * FROM [ML_damage].[dbo].[tb_account] WHERE username = '${username}'`;
      const result = await request.query(query);
  
      if (result.recordset.length === 0) {
        // User not found
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result.recordset[0];
      if (user.IsActive == 0) {
        // User is inactive
        return res.status(401).json({ message: 'User is inactive' });
      }

      bcrypt.compare(password, user.password, (err, bcryptResult) => {
        if (bcryptResult) {
          // Passwords match, user is authenticated
          const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
          res.json({ message: 'Authentication successful', token: token });
        } else {
          // Passwords don't match, authentication failed
          res.status(401).json({ message: 'Authentication failed' });
        }
      });
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).send('Error executing the query');
    }
  }

module.exports = {
  signIn,
};
