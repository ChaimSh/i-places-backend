const uuid = require("uuid/v4");
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/lacation')
const Place = require('../models/place');

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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = Place.

    if (!places || places.length === 0) {
       return next(
           new HttpError('Could not find places for provded id', 404)
           );
     }

    res.json({places});
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

const updatePlace = (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid Inputs passed', 422);
    }
    
    const {title, description} = req.body;
    const placeId = req.params.pid;

    const updatedPlaces = {...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({place: updatePlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a plce with that id', 404);
    }    
  
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
   res,status(200).json({massage: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;