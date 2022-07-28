import { MongoClient } from 'mongodb'
import { uri } from './dbsecrets.js'
import express from 'express'
import cors from 'cors'

const client = new MongoClient(uri) //connects to db
const db = client.db('sample_mflix') //finds collection
const movieCollection = db.collection('movies')

const app = express()
const PORT = 4000

app.use(express.json()) // allow a POST with JSON
app.use(cors()) //allow anyone to hit this api this is a security thing

// if you go to hhtp://localhost:4000/
app.get('/', (req, res) => {
    res.status(200).send('Hello World! ... again')
})


// if you go to hhtp://localhost:4000/movies
app.get('/movies', (req, res) => {
  const query = {}
  //console.log(movieCollection.countDocuments(query)) //this will help find the problem if the code isnt bringing anything up
  movieCollection
    .find(query)
    .limit(10)
    .toArray((err, movies) => {
      res.status(200).json(movies)
    })
})

app.listen(PORT, () => {
  console.log(`Up and running on port ${PORT}`)
})

app.post('/movie', (req,res) => {
    const newMovie = req.body
    movieCollection.insertOne(newMovie, (err, results) => {
        if (err) {
            res.status(500).json({error: true})
        } else {
            res.status(201).json(results)
        }
    })
})