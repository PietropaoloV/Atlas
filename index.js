const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
//Make sure to install the required modules using npm install bcrypt and npm install util.promisify if you haven't already.

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);
    const queryParams = querystring.parse(reqUrl.query);
    const { method, pathname } = reqUrl;

    if (method === 'POST' && pathname === '/register') {
        handleRegister(req, res);
    } else if (method === 'POST' && pathname === '/login') {
        handleLogin(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 8000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Replace these functions with your actual database operations
async function registerUser(username, password) {
    // Simulate database insertion
    return Promise.resolve({ user_id: 1 });
}

async function loginUser(username, password) {
    // Simulate database query
    const user = { username: 'testuser', password: '$2b$10$VPPbqWX0eC4FTC1c4Oop3OMAMcjSZhaKJ3O1jLd6AwXpAWa5DMOSW' }; // Simulated user data

    // Verify the password using bcrypt
    const isPasswordValid = await promisify(bcrypt.compare)(password, user.password);

    if (isPasswordValid) {
        return user.user_id;
    } else {
        return null;
    }
}

function handleRegister(req, res) {
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', async () => {
        try {
            const { username, password } = JSON.parse(data);
            const user = await registerUser(username, password);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ user_id: user.user_id }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Registration failed' }));
        }
    });
}

function handleLogin(req, res) {
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', async () => {
        try {
            const { username, password } = JSON.parse(data);
            const user_id = await loginUser(username, password);
            if (user_id !== null) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ user_id }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Login failed' }));
        }
    });
}
