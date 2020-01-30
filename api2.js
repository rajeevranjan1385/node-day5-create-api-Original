const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const mongoUrl = 'mongodb://localhost:27017';
const port = 7800;
let db;
let collectionName = 'eduJan';

app.use(bodyParser.urlencoded({extended: true})) //parse the url with utf-8 encoding 
app.use(bodyParser.json());     //after parsing convert it to JSON

//post call (CREATE)
app.post('/addUser', (req, res)=>{
    var randomId = Math.floor(Math.random()*10000);
    var data = {
        id:randomId,
        name: req.body.name,
        city: req.body.city,
        phone: req.body.phone,
        active: true
    }
    db.collection(collectionName).insert(data, (err, result)=>{
        if(err){
            res.status(401).send('Error occured while inserting record to database');
        }else{
            res.status(200).send('Data inserted successfully');
        }
    })
})

//Get call (READ)
app.get('/user', (req, res) =>{
    var query = {};
    if(req.query.id && req.query.name){
        query = {'id': parseInt(req.query.id), 'name': req.query.name, 'active': true}
    }else if(req.query.id){
        query = {'id': parseInt(req.query.id), 'active': true}
    }else{
        query = {'active': true}
    }
    db.collection(collectionName).find(query).toArray((err, result) =>{
        if(err){
            res.status(401).send('Error fetching data from database')
        }else{
            res.send(result);
        }
    })
})

//Put call (Update)
app.put('/updateUser', (req, res) =>{
    db.collection(collectionName).findOneAndUpdate({'id': req.body.id}, {
        $set:{
            id: req.body.id,
            name: req.body.name,
            city: req.body.city,
            phone: req.body.phone,
            active: req.body.active
        }
    }
    // ,{
    //     upsert: true
    // }
    ,(err, result) =>{
        if(err){
            res.status(401).send('Errorin updating the record');
        }else{
            res.send("Data Updated");
        }
    })
});

//Soft Delete call (DELETE)
app.put('/softDeleteUser', (req, res)=>{
    db.collection(collectionName).findOneAndUpdate({'id':req.body.id},{
        $set:{
            name: req.body.name,
            city: req.body.city,
            phone: req.body.phone,
            active: false
        }
    }, (err, result)=>{
        if(err){
            res.status(401).send('Error Soft Deleting the record');
        }else{
            res.send('Record Soft Deleted Successfully');
        }
    })
})

//Delete call (DELETE)
app.delete('/deleteUser', (req, res)=>{
    db.collection(collectionName).findOneAndDelete({'id':req.body.id}, (err, result)=>{
        if(err){
            res.status(401).send('Error Deleting the record');
        }else{
            res.send('Record Deleted Successfully');
        }
    })
})

//connection to database
MongoClient.connect(mongoUrl, (err, client)=>{
    if(err){
        console.log('Error while connecting to Database');
    }else{
        db = client.db('classpractice');
        app.listen(port, (err) =>{
            if(err){
                console.log('Some error occured');
            }else{
                console.log(`Server is listening at port ${port}`);
            }
        })
    }
})
