const express = require('express');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('body-parser');
const mongoUrl = 'mongodb://localhost:27017';
let db;
let col_name = 'eduJan'