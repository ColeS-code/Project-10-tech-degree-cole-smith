'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {}
  Book.init({
    title: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "title"',
        },
        notEmpty: {
          msg: 'Please provide a vaue for "title"',
        },
      },
    },
    author: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
        notNull: {
          msg: 'Please provide a value for "author"'
        },
        notEmpty: {
          msg: 'Please provide a vaue for "author"',
        },
      },
    },

    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};