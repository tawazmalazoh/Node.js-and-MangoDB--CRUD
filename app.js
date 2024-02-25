const express = require('express');
const app = express();
// const userRoutes = require('./Routes/userRoutes');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');  
const Employee = require('./Models/employee');
const employeeRoutes = require('./Routes/employeeRoutes');

const session = require('express-session');



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Public')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: '3x@mpL3_S3cr3tK3y!', resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', employeeRoutes);


// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Use userRoutes for all user-related routes
//app.use('/users', userRoutes);

app.get('/', (req, res) => {  
    res.render('index'); 
});


app.get('/register', (req, res) => {
     res.render('signup', {redirect: false });
});



// registering new employee
const bcrypt = require('bcrypt');
const saltRounds = 10; 

app.post('/register', async (req, res) => {
    var { email, fullname, phone, position, department,password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        var newEmployee = new Employee({
            email: email,
            fullName: fullname,
            phone: phone,
            position: position,
            department: department,
            password: hashedPassword 
        });
        await newEmployee.save();
        res.render('signup', { message: `User "${fullname}" successfully created, proceed to login.`, redirect: true });
    } catch (error) {
        res.render('signup', { message: `Error creating user: ${error.message}`, redirect: true });
    }
});

app.post('/addEmployee', async (req, res) => {
    const { AddEmail, AddName, Addphone, Addposition, Adddepartment, Addpassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Addpassword, 10); // Assume saltRounds = 10
        await new Employee({
            email: AddEmail,
            fullName: AddName,
            phone: Addphone,
            position: Addposition,
            department: Adddepartment,
            password: hashedPassword
        }).save();

        
        const employees = await Employee.find({});
   
        res.render('home', { 
            user: req.session.user, 
            employees: employees, 
            message: 'Employee successfully added', 
            status: 'success' 
        });
    } catch (error) {
        console.log(error);
    
        const employees = await Employee.find({});
        res.render('home', { 
            user: req.session.user, 
            employees: employees, 
            message: 'Error adding employee', 
            status: 'danger' 
        });
    }
});






app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Employee.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            // Store user info in session
            req.session.user = user;
            res.redirect('/home'); 
        } else {
            res.render('index', { message: 'Invalid email or password' });
        }
    } catch (error) {
        res.render('index', { message: `Login error: ${error.message}` });
    }
});

app.get('/home', async (req, res) => {
    if (req.session.user) {
        const employees = await Employee.find({});    
        const message = req.query.message;
        const status = req.query.status;
        res.render('home', { user: req.session.user, employees: employees, message: message, status: status });
    } else {
        res.redirect('/login'); 
    }
});







app.post('/updateEmployee', async (req, res) => {
    const { employeeId, employeeName, employeePosition, employeeDepartment } = req.body;
    try {
        await Employee.findByIdAndUpdate(employeeId, {
            fullName: employeeName,
            position: employeePosition,
            department: employeeDepartment
        });
        res.redirect('/home?message=Employee updated successfully&status=success');
    } catch (error) {
        console.error(error);
        res.redirect(`/home?message=Error updating employee: ${error.message}&status=danger`);
    }
});

app.delete('/deleteEmployee/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (employee) {
            const message = `Employee ${employee.fullName} successfully deleted`;
            res.json({ success: true, message: message });
        } else {
            throw new Error('Employee not found');
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: `Error deleting employee: ${error.message}` });
    }
});


app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/'); 
        }
    });
});


app.get('/api/departmentCounts', async (req, res) => {
    try {
        const departmentCounts = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        res.json(departmentCounts);
    } catch (error) {
        console.error('Error fetching department counts:', error);
        res.status(500).send('Internal Server Error');
    }
});



//connecting to database- Mongo DB Connection
require('dotenv').config(); 
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
//mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const db = mongoose.connection;



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
