const Employee = require('../Models/employee');

const getDepartmentCounts = async (req, res) => {
    try {
        const departmentCounts = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        res.json(departmentCounts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
module.exports = { getDepartmentCounts };
