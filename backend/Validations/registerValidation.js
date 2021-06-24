const yup = require('yup');

const registerValidationSchema = yup.object({
    email: yup.string().email('*Must be a valid email').max(255).required('*Email is required...'),
    password: yup.string().required('*Set your password').min(4, '*Must be at least 6 characters long'),
    name: yup.string().required("*Enter Your Name..."),
    dateOfBirth: yup.date().required("*Birthday is required..."),
  
});

module.exports = registerValidationSchema;