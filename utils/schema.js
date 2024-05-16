//validation for every form object field
//install npm i joi for validation

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        tittle: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});


