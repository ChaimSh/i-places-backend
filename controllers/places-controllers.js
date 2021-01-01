const uuid = require("uuid/v4");
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/lacation')
const Place = require('../models/place');
const place = require("../models/place");

let DUMMY_PLACES = [{
    id: 'p1',
    title: 'Empire State building',
    description: 'very tall building',
    location: {
        lat: 40.7484474,
        lng: -73.9871516
    },
    address: '20 W #4th St, New York, NY 10001',
    creator: 'u1'
}]



const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
     let place;
   
    try{
     place = await Place.findById(placeId);
   } catch (err) {
     const error = new HttpError(
       "Sorry couldn't find that place.", 500
     );
     return next(error);
   }


    if (!place) {
       const error = new HttpError('Could not find a place for provded id', 404);
      return next(error);
    }

    res.json({place: place.toObject({getters: true}) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    
    let places;
    try {
         places = await Place.find({ creator: userId });
    } catch(err) {
        const error = new HttpError(
            'Fetching placed failed, please try again later.', 500
        );
        return next(error);
    }
    
    if (!places || places.length === 0) {
       return next(
           new HttpError('Could not find places for provded id', 404)
           );
     }

    res.json({places: places.map(place => place.toObject({ getters: true }))});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid Inputs passed', 422));
    }



    const { title, description, address, creator } = req.body;
    
    let coordinates
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'url from internet of a place',
        creator
    }); 

    try {
      await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed. Please try again.', 500
        );
        return next(error);
    }
     

    res.status(201).json({place: createdPlace});
};

const updatePlace = async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid Inputs passed', 422);
    }
    
    const {title, description} = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Could not update place', 500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save(); 
    } catch (err) {
        const error = new HttpError(
            'Could not update place', 500
        );
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
         'Could not delete place', 500
        );
        return next(error);
   }
    res,status(200).json({massage: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;