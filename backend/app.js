const express = require('express');
const app = express();
require('dotenv').config()
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hello from express!'})
})
app.get('/api/photos/1', (req, res) => {
    res.send({message: 'Hello from express!'})
})
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`)});
module.exports = app;