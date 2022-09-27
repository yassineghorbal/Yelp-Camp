const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./helpers/ExpressError')
const app = express()
const connectDB = require('./config/db')
const colors = require('colors')
const dotenv = require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

connectDB()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


// *****Session*****
const sessionConfig = {
    secret: 'xyzbca',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}
app.use(session(sessionConfig))
app.use(flash())

// *****flash middleware*****
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

app.get('/', (req, res) => {
    res.send('home page')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen('3000', () => {
    console.log('server running on port 3000');
})