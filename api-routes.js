
const router = require('express').Router()
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)


const getCollection = async (dbName, collectionName) => {
	await client.connect()
	return client.db(dbName).collection(collectionName)
}

// todo: add your endpoints here
// GET /movies - This route should return a list of all movies in the database.
router.get('/movies', async (_, response) => {

    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find().toArray()
    response.json(movies)
})

//GET /movies/:id - This route should return a single movie by its id.
router.get('/movies/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getCollection('movie-api', 'movies')
    const movie = await collection.findOne({ _id: new ObjectId(id) })
    response.json(movie)
})

// POST /movies - This route should allow users to add a new movie to the database. 
router.post('/movies', async (request, response) => {
    const { body } = request
    const { title, year, director, genre } = body
    const movie = { title, year, director, genre }

    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.insertOne(movie)
    response.json(result)
})

//PUT /movies/:id - This route should allow users to update a movie in the database. 
router.put('/movies/:id', async (request, response) => {
    const { body, params } = request
    const { id } = params
    const { title, year, director, genre } = body
    const movie = { title, year, director, genre }

    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: movie })
    response.json(result)
	console.log("Movie Updated")
})

//DELETE /movies/:id - This route should allow users to delete a movie from the database.
router.delete('/movies/:id', async (request, response) => {
    const { id } = request.params //params is the is a reference to a property of the movies
    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    response.json(result)
})

//GET /movies/genre/:genre - This route should return a list of movies by genre.
router.get('/movies/genre/:genre', async (request, response) => {
    const { genre } = request.params //params is the is a reference to a property of the movies

    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find({ genre }).toArray()
    response.json(movies)
})

 //GET /movies/director/:director - This route should return a list of movies by director.
router.get('/movies/director/:director', async (request, response) => {
    const { director } = request.params //params is the is a reference to a property of the movies

    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find({ director }).toArray()
    response.json(movies)
})

module.exports = router



