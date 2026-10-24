const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        location : Joi.string().required(),
        image: Joi.any().optional(),
        price: Joi.number().required().min(0)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required()
    })
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().iso().required(),
        checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
        guests: Joi.number().min(1).max(20).required(),
        totalPrice: Joi.any().optional() // Ignored on the server
    }).required()
});
