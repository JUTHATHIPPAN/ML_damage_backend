var express = require("express");
var cors = require("cors");

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var router = express.Router();

const database = require("../configs/database");
const { default: next } = require("next");

//hash password
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.delete("/remove", jsonParser, function (req, res, next) {
  var id = req.body.values.id;
  var sql = "DELETE FROM tb_member WHERE id= ?";
  database.query(sql, id, (err, result) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err });
    }
    if (result.affectedRows) {
      return res.status(200).json("remove success");
    }
    console.log(result);
    return res.status(201).json("no user found");
    // res.redirect('/index');
  });
});

router.patch("/update/PI", jsonParser, function (req, res, next) {
  var req_body = {
    id: req.body.values.id,
    email: req.body.values.email,
    first_name: req.body.values.first_name,
    last_name: req.body.values.last_name,
    mobile_no: req.body.values.mobile_no,
  };
  var sql = `
                UPDATE tb_member 
                SET 
                    email = '${req_body.email}',
                    first_name = '${req_body.first_name}',
                    last_name = '${req_body.last_name}',
                    mobile_no = ${req_body.mobile_no},
                    updated_date = CURRENT_TIMESTAMP
                WHERE id = ${req_body.id}
            `;
  database.query(sql, (err, result) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (result.changedRows) {
      return res.status(201).json("updated");
      
    }
    console.log(result);
    return res.status(401).json({ message: "no user found" });
  });
});
//GET requests should not have a body. Change the method from 'GET' to 'POST'

router.post("/search", jsonParser, (req, res) => {
  console.log(req.params);
  var keyword = req.body.values.id;
  var sql = ` SELECT a.email, a.first_name, a.last_name, a.mobile_no
              FROM tb_member a
              WHERE id = '${keyword}'`;

  database.query(sql, (err, result) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err });
    }
    return res.status(200).json(result);
  });
});

router.patch("/update", jsonParser, function (req, res, next) {
    var id= req.body.values.id
    var username= req.body.values.username
    var currentPassword= req.body.values.currentPassword
    var newPassword= req.body.values.newPassword

  database.query(
    `SELECT * FROM tb_member WHERE username=?`,
    [username],
    (err, tb_member, fields) => {
      if (err) {
        return res.status(400).json({ status: "error", message: err });
      }
      if (tb_member.length == 0) {
        return res.status(401).json({ status: "error", message: "no user found" });
      }
      console.log(tb_member[0]);
      const match = bcrypt.compare(currentPassword, tb_member[0].password);
      if (match) {
              bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                var sql = `
                          UPDATE tb_member 
                          SET
                              password = '${hash}',
                              updated_date = CURRENT_TIMESTAMP
                          WHERE id = ${id}
                          `;
                database.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({ status: "error", message: err });
                  }
                  console.log(result);
                  return res.status(201).json("updated");
                });
              });
        }  
        else {
            return res.status(400).json({message: "failed"});
        }
    }
);
});

module.exports = router;
