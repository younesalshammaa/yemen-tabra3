const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Donation = sequelize.define('Donation', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  beneficiaries: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  raisedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active'
  }
});

module.exports = Donation;