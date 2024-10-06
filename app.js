const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// body parser
app.use(express.json());

// template engine  
app.use('/public', express.static('public'))
app.set('view engine','ejs')

// set default route
app.use('/', require('./routes/news/news.js'))

// set default view folder
app.set('views','./views')

app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})