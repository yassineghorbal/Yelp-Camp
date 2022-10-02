const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const connectDB = require('../config/db')
const dotenv = require('dotenv').config()
const colors = require('colors')

connectDB()

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 7; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '63358911738de89ce77c45cc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
            images: [
                {
                    url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1664665215/YelpCamp/lnlszjkmfowjc6mrt7tf.jpg',
                    filename: 'YelpCamp/lnlszjkmfowjc6mrt7tf',
                },
                {
                    url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1664665220/YelpCamp/rdconztsc88nuhfllwfk.jpg',
                    filename: 'YelpCamp/rdconztsc88nuhfllwfk',
                },
                {
                    url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1664665219/YelpCamp/yneawh52tms5kd7znvct.jpg',
                    filename: 'YelpCamp/yneawh52tms5kd7znvct',
                }
            ],
            price: price,
            geometry: {
                type: "Point",
                coordinates: [30.5, 50.5]
            }
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})