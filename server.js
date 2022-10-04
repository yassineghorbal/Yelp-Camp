if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./helpers/ExpressError')
const app = express()
const connectDB = require('./config/db')
const colors = require('colors')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')


const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

connectDB()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


// *****Session*****

const secret = process.env.SECRET || 'xyzbca'

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        secret: 'xyzbca',
        touchAfter: 24 * 3600
    }),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

sessionConfig.store.on('error', function (e) {
    console.log("sessin store error: ", e.red.underline)
})

if (process.env.NODE_ENV === 'production') {
    sessionConfig.cookie.secure = true
}

app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(mongoSanitize())

// *****flash middleware*****
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.get('/fakeuser', async (req, res) => {
    const user = new User({ email: 'test@test.com', username: 'test' })
    const newUser = await User.register(user, '1234test')
    res.send(newUser)
})

app.use('/', userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server running on port ${port}`.cyan);
})