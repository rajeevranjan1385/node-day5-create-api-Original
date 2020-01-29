//Creating an a RESTful API using Node and mongo DB
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

let url = 'mongodb://localhost:27017';
let port = 7800;
let app = express();
let db;
let collectionName = 'eduJan';

//GET call
app.get('/users', (req, res)=>{
  db.collection(collectionName).find({}).toArray((err, result)=>{
    if(err){
      res.status(401).send('Error occured while fetching data from database');
    }else{
      res.send(result);
    }
  })
})

//POST call
app.post('/createUser', (req, res)=>{
  db.collection(collectionName).insert(req.body, (err, result)=>{
    if(err){
      res.status(401).send('Error occured while inserting data to database');
    }else{
      res.status(200).send('Successfully Inserted');
    }
  })
})

//PUT call
app.put('/updateUser', (req,res)=>{
  db.collection(collectionName).findOneAndUpdate({'id': req.body.id}, {
    $set:{
      name: req.body.name,
      city:req.body.city,
      phone: req.body.phone
    }
    }, (err, result)=>{
      if(err){
        res.status(401).send('Error updating the data');
      }else{
        res.status(200).send('Updated Successfully');
      }
  })
})

//Delete call
app.delete('/deleteUser', (req, res)=>{
  db.collection(collectionName).findOneAndDelete({'id':req.body.id}, (err, result)=>{
    if(err){
      res.status(401).send('Error deleting the user');
    }else{
      res.status(200).send('User Deleted successfully');
    }
  })
})

//connect to database
MongoClient.connect(url, (err, client)=>{
  if(err){
    console.log('Error connecting to Database');
  }else{
    db = client.db('classpractice');
    app.listen(port, (err)=>{
      if(err){
        console.log('Error occured')
      }else{
        console.log(`Server is listening at port ${port}`);
      }
    })
  }
})