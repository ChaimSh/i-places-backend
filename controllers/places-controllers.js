const HttpError = require('../models/http-error');


const DUMMY_PLACES = [{
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



const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    })

    if (!place) {
       throw new HttpError('Could not find a place for provded id', 404);
    }

    res.json({place});
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });

    if (!place) {
       return next(
           new HttpError('Could not find a place for provded id', 404)
           );
     }

    res.json({place});
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        title,
        description,
        lacation: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createPlace);
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;