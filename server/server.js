const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 4000;
const secretKey = 'famebay1056'; 

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'fame123',
    password: '1234',
    database: 'dbequipment'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('A token is required for authentication');
    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Check if equipmentID exists
app.get('/equipments/check/:equipmentID', verifyToken, (req, res) => {
    const { equipmentID } = req.params;
    const query = 'SELECT * FROM equipment WHERE EquipmentID = ?';
    
    db.query(query, [equipmentID], (err, results) => {
        if (err) {
            console.error('Error checking equipment:', err);
            return res.status(500).send('Server Error');
        }

        if (results.length > 0) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for user credentials
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Error querying the database');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = results[0];

        // Verify password
        if (user.password !== password) { // Change this to a hashed password comparison if needed
            return res.status(400).send('Invalid username or password');
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: '2h' });
        return res.json({ token });
    });
});

// Get all equipments
app.get('/equipments', verifyToken, (req, res) => {
    const query = 'SELECT * FROM equipment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching equipments:', err);
            return res.status(500).send('Error fetching equipments');
        }
        res.json(results);
    });
});

// Add new equipment with category
app.post('/equipments', verifyToken, (req, res) => {
    const { equipmentID, name, description, purchaseDate, status, location, category } = req.body;
    const query = 'INSERT INTO equipment (EquipmentID, Name, Description, PurchaseDate, Status, Location, Category) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [equipmentID, name, description, purchaseDate, status, location, category], (err, results) => {
        if (err) {
            console.error('Error adding equipment:', err);
            return res.status(500).send('Error adding equipment');
        }
        res.status(201).send('Equipment added successfully');
    });
});

// Update equipment
app.put('/equipments/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { equipmentID, name, description, purchaseDate, status, location } = req.body;
    const query = 'UPDATE equipment SET EquipmentID = ?, Name = ?, Description = ?, PurchaseDate = ?, Status = ?, Location = ? WHERE id = ?';
    db.query(query, [equipmentID, name, description, purchaseDate, status, location, id], (err, results) => {
        if (err) {
            console.error('Error updating equipment:', err);
            return res.status(500).send('Error updating equipment');
        }
        res.send('Equipment updated successfully');
    });
});

// Delete equipment
app.delete('/equipments/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM equipment WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting equipment:', err);
            return res.status(500).send('Error deleting equipment');
        }
        res.send('Equipment deleted successfully');
    });
});

// Get locations
app.get('/locations', verifyToken, (req, res) => {
    const query = 'SELECT DISTINCT Location FROM equipment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching locations:', err);
            return res.status(500).send('Error fetching locations');
        }
        const locations = results.map(row => row.Location);
        res.json(locations);
    });
});

// Get total equipments count
app.get('/equipments/total', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM equipment';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error querying the database' });
        }
        res.json({ total: results[0].total });
    });
});

app.get('/categories', (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categories');
        } else {
            res.json(results);
        }
    });
});

app.get('/departments', (req, res) => {
    const query = 'SELECT * FROM department'; 
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching departments');
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
