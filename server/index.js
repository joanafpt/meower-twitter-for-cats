const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

//const db = monk('localhost/meower');
//usa a bd local quando localmente:
const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');
const filter = new Filter();
//a ordem em q se coloca o middleware importa, pois é utilizado de forma subsequente.
//assim, colocar o rateLimit antes do post para q apenas limite os post req e nao os get req
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Meow!'
    });
});

app.get('/meowslist', (req, res) => {
    mews.find()
        .then(mews => {
            res.json(mews);
        });
});

const postIsValid = (body) => {
    return body.name && body.name.toString().trim() !== '' &&
        body.message && body.message.toString().trim() !== ''
}

app.use(rateLimit({
    windowMs: 60 * 1000, //30 segs
    max: 1 //1 POST req a cada 60 segs
}));

app.post('/meow', (req, res) => {
    if (postIsValid(req.body)) {
        const meow = {
            name: filter.clean(req.body.name.toString()),
            message: filter.clean(req.body.message.toString()),//always prevent bad stuff from entering in your db!
            created: new Date()
        };
        mews
            .insert(meow)
            .then(createdMeow => {
                res.json(createdMeow);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey! There was an error here.'
        });
    }
});


app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
