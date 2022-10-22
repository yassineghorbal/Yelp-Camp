const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const connectDB = require('../config/db');
const dotenv = require('dotenv').config();
const colors = require('colors');

connectDB();

const sample = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: '633c309d1f43a4fc2f7872e6',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      images: [
        {
          url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1666435091/YelpCamp/Camping_tent_REI_Co-op_Base_Camp_6_m_rlyayt.jpg',
          filename: 'YelpCamp/Camping_tent_REI_Co-op_Base_Camp_6_m_rlyayt',
        },
        {
          url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1666435094/YelpCamp/N-NIGHT-Glen_Bernard_Camp-2007_h2zeln.jpg',
          filename: 'YelpCamp/N-NIGHT-Glen_Bernard_Camp-2007_h2zeln',
        },
        {
          url: 'https://res.cloudinary.com/dtwuh88nw/image/upload/v1666435089/YelpCamp/tent-camping-at-sunset_ppaeb0.jpg',
          filename: 'YelpCamp/tent-camping-at-sunset_ppaeb0',
        },
      ],
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
