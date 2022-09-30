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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '63358911738de89ce77c45cc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam eveniet molestiae id ut, amet asperiores mollitia laudantium est repellat sequi.',
            price: price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})