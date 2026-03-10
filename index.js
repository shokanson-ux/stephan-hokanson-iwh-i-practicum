const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage - GET all cars and display in a table
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-226547405?properties=name,make,model,year';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Cars | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Show form to add a new car
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - POST form data to create a new car record
app.post('/update-cobj', async (req, res) => {
    const newCar = {
        properties: {
            name: req.body.name,
            make: req.body.make,
            model: req.body.model,
            year: req.body.year
        }
    };
    const url = 'https://api.hubapi.com/crm/v3/objects/2-226547405';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, newCar, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));