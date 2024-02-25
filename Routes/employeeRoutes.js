const express = require('express');
const router = express.Router();
const { getDepartmentCounts } = require('../Controllers/employeeController'); 

router.get('/departmentCounts', getDepartmentCounts);

module.exports = router;
