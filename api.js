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
    db.collection(collectionName).insert(req.body, (err, result)=>{
        if(err){
            res.status(401).send('Error occured while inserting record to database');
        }else{
            res.status(200).send('Data inserted successfully');
        }
    })
})

//Get call (READ)
app.get('/user', (req, res) =>{
    db.collection(collectionName).find({}).toArray((err, result) =>{
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
            phone: req.body.phone
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
