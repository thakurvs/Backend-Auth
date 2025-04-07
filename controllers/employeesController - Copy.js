const data = {
    employees : require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

// console.log("Employees route loaded");
console.log("Loaded employees:", data.employees);

const getAllEmployees = (req, res) => {
    console.log("Loaded employees in getAllEmployees:", data.employees);
    res.json(data.employees);
}

const  createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }
    // Check if the employee already exists
    const existingEmployee = data.employees.find(employee => employee.firstname === newEmployee.firstname && employee.lastname === newEmployee.lastname);
    if (existingEmployee) {
        return res.status(409).json({ message: 'Employee already exists' });
    }
    // Check if the request body is valid
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }

    data.setEmployees([...data.employees, newEmployee]);
    // res.status(201).json(newEmployee);
    res.status(201).json(data.employees);
    console.log("New employee created:", newEmployee);
    console.log("All employees:", data.employees);
}

const updateEmployee = (req, res) => {
    const employeeId = parseInt(req.body.id);
    const employee = data.employees.find(emp => emp.id === employeeId);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = {
        id: employeeId,
        firstname: req.body.firstname || employee.firstname,
        lastname: req.body.lastname || employee.lastname,
    }

    // Check if the request body is valid
    if (!updatedEmployee.firstname || !updatedEmployee.lastname) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }

    data.setEmployees(data.employees.map(emp => (emp.id === employeeId ? updatedEmployee : emp)));
    // res.json(updatedEmployee);
    res.status(200).json(data.employees);
    console.log("Employee updated:", updatedEmployee);
    console.log("All employees:", data.employees);
}

const deleteEmployee = (req, res) => {
    const employeeId = parseInt(req.body.id);
    const employee = data.employees.find(emp => emp.id === employeeId);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    const filteredArray = data.employees.filter(emp => emp.id !== employeeId);
    data.setEmployees([...filteredArray]);
    res.json({ message: `Employee ${employeeId} deleted` });
    console.log("Employee deleted:", employeeId);
    console.log("All employees:", data.employees);
}

const getEmployee = (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = data.employees.find(emp => emp.id === employeeId);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
}

const getEmployeeByName = (req, res) => {
    const { firstname, lastname } = req.query;
    const employee = data.employees.find(emp => emp.firstname === firstname && emp.lastname === lastname);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
}

const getEmployeeByEmail = (req, res) => {
    const { email } = req.query;
    const employee = data.employees.find(emp => emp.email === email);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
}

const getEmployeeById = (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = data.employees.find(emp => emp.id === employeeId);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    // getEmployeeByName,
    // getEmployeeByEmail,
    // getEmployeeById
}


