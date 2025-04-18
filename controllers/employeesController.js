const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({ message: 'No employees found' });
    res.json(employees);
}

const  createNewEmployee = async (req, res) => {
    // Check if the request body is valid
    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }   

    // create a new employee object
    try {
        const newEmployee = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }
        const result = await Employee.create(newEmployee);
        res.status(201).json(result);
        console.log("New employee created:", newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const updateEmployee = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }
    
    const employee =  await Employee.findOne({ _id: req.body.id }).exec();
    if(!employee) {
        return res.status(204).json({ message: `Employee ID ${req.body.id} not found` });
    }
    if(req.body?.firstname) employee.firstname = req.body.firstname;
    if(req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if(!employee) {
        return res.status(204).json({ message: `Employee ID ${req.body.id} not found` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployee = async (req, res) => {
    if(!req?.params?.id) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(204).json({ message: `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}


