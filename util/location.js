const axios = require('axios');

const API_KEY = 'AIzaSyCdHoftFE53PWMUrY2t_MbD7OY-lE3C3Xg';

async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
}