const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const SECRET_KEY = "secretkey";

app.use(bodyParser.json());

const users = [
    {
        id: 1,
        name: 'Aydın',
        surname: 'Demirci',
        age: 17,
        frameworks: 'React, Next',
        username: 'ayd1ndemirci',
        mail: 'demirciaydin013@gmail.com',
        role: 'admin'
    },
    {
        id: 2,
        name: 'John',
        surname: 'Doe',
        age: 32,
        frameworks: 'React, React Native, Next, Angular, HizzyJS',
        username: 'johndoe31',
        mail: 'example@gmail.com',
        role: 'moderator'
    }
];

app.post('/login', (req, res) => {
    const { username, mail } = req.body;

    const user = users.find((user) => user.username === username && user.mail === mail);

    if (!user) return res.status(401).json({ message: 'Invalid username or mail.' });

    const token = jwt.sign({
        id: user.id,
        frameworks: user.frameworks,
        role: user.role,
        username: user.username,
        name: user.name
    }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login is succesful!', token });

});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Token required!' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token!' });

        req.user = user;
        next();
    });
}

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, welcome to dashboard!` });
});

app.get('/admin', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Special for admins' });
    }

    res.json({ message: 'Welcome to admin panel' });
    console.log(req.user.role)
});

app.listen(PORT, () => {
    console.log(`Server is listening ${PORT} to port`)
})