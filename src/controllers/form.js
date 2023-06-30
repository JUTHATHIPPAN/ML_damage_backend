var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../../configs/database');
const { default: next } = require("next");

router.post('/add', jsonParser, (req, res) => {
    var device_name = req.body.values.device_name
    var description = req.body.values.description
    var Sn = req.body.values.SN
    var phone = req.body.values.phone
    var model = req.body.values.model
    var sql = 'INSERT INTO tb_device (device_name, description, SN, phone, model ) VALUES (?, ?, ?, ?, ?)'

    database.query(sql, [device_name, description, Sn, phone, model], (err,results, fields) => {
            if (err){
                return res.json({status: 'error', message: err})
            }
            console.log(results);
            console.log(fields);
            return res.status(201).json({status: "ok"})
        }
    )
})

router.delete('/remove', jsonParser, function (req, res){
    var id = req.body.values.id
    var sql = 'DELETE FROM tb_device WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var request_body = {id : req.body.values.id,
                        device_name : req.body.values.device_name,
                        description : req.body.values.description,
                        Sn : req.body.values.SN,
                        phone : req.body.values.phone,
                        model : req.body.values.model}
    var sql = ` UPDATE tb_device 
                SET device_name = '${request_body.device_name}',
                    description = '${request_body.description}',
                    SN = '${request_body.Sn}',
                    phone = ${request_body.phone},
                    model = '${request_body.model}',
                    updated_date = CURRENT_TIMESTAMP
                WHERE id = ${request_body.id}`

    database.query(sql, (err, result) => {
        if (err){ return res.status(400).json({status: 'error', message: err}); }
        console.log(result);
        return res.status(201).json('updated')
    })
})

router.get('/list', jsonParser, (req, res, next) => {

    var sql = 'SELECT * FROM tb_device ORDER BY device_name DESC'

    database.query(sql, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        console.log(data)
        res.status(200).json({data});
    })
})

// router.post('/search', jsonParser, (req, res) => {
//     var keyword = req.body.values.device_name
//     var sql = `SELECT * FROM tb_device WHERE device_name = '${keyword}'`
//     database.query(sql, (err, result) => {
//         if (err){ return res.status(400).json({status: 'error', message: err});}
//         return res.status(200).json(result)
//     })
// })

router.get('/SNList', jsonParser,(req, res)=> {
    var sql = "SELECT DISTINCT SN FROM tb_position"
    database.query(sql, (err,data)=>{
        console.log(data);
        return res.json(data)
    })
})

module.exports = router;