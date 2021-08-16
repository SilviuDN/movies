const router = require("express").Router();

const Movie = require('../models/Movie.model')
const Celebrity = require('../models/Celebrity.model')
const mongoose = require('mongoose')


router.get("/", (req, res, next) => {
    // what if the list if empty?
        Movie
        .find({})
        .populate('cast') //not necessary
        .then( movies => {
            res.render('movies/movies', {movies})
        })
        .catch( err => console.log(err))
    });

router.get("/create", (req, res, next) => {
    Celebrity
    .find({})
    .then( celebrities => {
        res.render('movies/new-movie', {celebrities})
    }
    )
    
});

    
router.post("/create", (req, res) => {
    const movie = req.body

    if(typeof movie.cast === 'string'){
        movie.cast = [movie.cast]
    }
    movie.cast.forEach(actorId => actorId = mongoose.Types.ObjectId(actorId))

    const {title, image, genre, plot, cast} = movie
    const validationConst = title && genre && image && plot && cast

    if(!validationConst){
        res.render('movies/new-movie', {errorMessage: `All fields are mandatory. Refresh page.`})
        return
    }   

    Movie
        .findOne({title})
        .then( foundMovie => {
            if(foundMovie){
                res.render('movies/new-movie', {errorMessage: `${movie} already registered.`})
                return
            }            
        })
        .then(() => {
            Movie
            .create( movie)
            .then( () => res.redirect('/movies'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))


});

router.get('/:id', (req, res, next) => {
    // res.send("Success!!!")
    const {id} = req.params
    Movie
        .findById(id)
        .populate('cast')
        .then(movie => {
            res.render('movies/movie-details', movie)
        })
})

router.post('/:id/delete', (req, res, next) => {
    const {id} = req.params

    Movie   
        .findByIdAndRemove(mongoose.Types.ObjectId(id))
        .then(deleted => {
            res.redirect('/movies')
        })
        .catch(err => res.send("Error. Can't delete, can't programm."))
})


router.get("/:id/edit", async (req, res, next) => {
    const {id} = req.params
    const celebs = await Celebrity.find({})

    Movie
        .findById(mongoose.Types.ObjectId(id))
        .populate('cast')  
        .then( movie => {
            movie.oldCastList = movie.cast
            movie.cast = celebs
            movie.cast.forEach( actor => {
                actor.selected = movie.oldCastList.some(oldActor => oldActor.name == actor.name)
                console.log(actor.name, actor.selected)
            })
            res.render('movies/edit-movie', movie )

        }   )
});

router.post('/:id/edit', (req, res, next) => {
    const {id} = req.params
    const {title, genre, image, plot, cast} = req.body
    Movie
        .findByIdAndUpdate(mongoose.Types.ObjectId(id), {title, genre, image, plot, cast})
        .then( () => res.redirect('/movies'))
        .catch( (err) => res.send(`Get a grip. You've got errors: ${err}`))
        
})



module.exports = router;