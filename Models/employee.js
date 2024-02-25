const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    fullName: { type: String, required: true, max: 50 },
    email: { type: String, required: true },
    phone: { type: String, required: true, match: [/\+\d{1,3}\d{3}\d{3}\d{4}/, 'Please fill a valid phone number'] },
    position: { type: String, required: true },
    department: { type: String, required: true, enum: ['Engineering', 'Sales', 'HR'] },
    password: { type: String, required: true },
});



module.exports = mongoose.model('Employee', employeeSchema);
