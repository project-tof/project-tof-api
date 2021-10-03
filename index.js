require('dotenv').config();

const app = require('./src/config/express');
const PORT = process.env.PORT || 3030 ;

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}!`));
