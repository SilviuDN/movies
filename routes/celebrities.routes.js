const router = require("express").Router()

const Celebrity = require('./../models/Celebrity.model')

router.get('/create', (req, res) => {
    res.render('celebrities/new-celebrity')
})


router.post('/create', (req, res) => {
    const {name, image, occupation, catchPhrase} = req.body
    const validInput = name && image && occupation && catchPhrase

    if(!validInput){
        res.render('celebrities/new-celebrity', {errorMessage: 'All fields mandatory'})
    }

    Celebrity
        .findOne({name})
        .then(celeb => {
            if(celeb){
                console.log('exista deja: ', celeb)
                res.render('celebrities/new-celebrity', {errorMessage: 'Already registered'})
                throw 'Username must be unique'
            }
        })
        .then(res => {
            Celebrity
                .create({name, image, occupation, catchPhrase})
                .then( () => res.redirect('/'))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

})

router.get('/', (req, res) => {
    Celebrity
        .find({})
        .then( celebs => res.render('celebrities/celebrities', {celebs}))
        .catch(err => console.log(err))
})


module.exports = router;