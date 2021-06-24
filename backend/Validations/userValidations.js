const yup = require('yup');

const userValidationSchema = yup.object({
    birthPlace: yup.string(),
    currentCity: yup.string().required("*current city is required"),
    profession: yup.string().required("*profession is required"),
    phone: yup.number().transform(value => (isNaN(value) ? undefined : value)),
    bio: yup.string(),
    interests: yup.array()
        .min(3, 'Pick at least 3 interests you have'),

});

module.exports = userValidationSchema;