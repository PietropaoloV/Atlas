const express = require('express');
const app = express();
app.use(express.json());

// Registration routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await registerUser(username, password);
        res.json({ user_id: user });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login routing
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user_id = await loginUser(username, password);
        if (user_id) {
            res.json({ user_id });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

async function registerUser(username, password) {
    try {
        // Hash the password using a secure hashing algorithm (e.g., bcrypt)
        const hashedPassword = await hashPassword(password);

        // Insert the user into the 'users' table
        const [user] = await knex('security')
            .insert({ username, password: hashedPassword })
            .returning('user_id');

        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}


async function loginUser(username, password) {
    try {
        // Retrieve the user's hashed password from the database
        const user = await knex('security').where('username', username).first();

        if (!user) {
            // User not found
            return null;
        }

        // Verify the password using a secure hashing algorithm
        const isPasswordValid = await verifyPassword(password, user.password);

        if (isPasswordValid) {
            // Password is valid, return the user_id
            return user.user_id;
        } else {
            // Password is invalid
            return null;
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}


// Start your server
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});