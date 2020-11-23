const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCdHoftFE53PWMUrY2t_MbD7OY-lE3C3Xg';

async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

    const data = response.data

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location for addresss', 422);
        throw error;
    }

  const coordinates = data.results[0].geometry.location;  
}