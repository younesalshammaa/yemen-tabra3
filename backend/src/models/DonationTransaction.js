const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DonationTransaction = sequelize.define('DonationTransaction', {
  donationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Donations',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  donorName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  donorPhone: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'DonationTransactions',
  timestamps: true
});

// ✅ إضافة العلاقة هنا
const Donation = require('./Donation');
Donation.hasMany(DonationTransaction, {
  foreignKey: 'donationId',
  as: 'transactions'
});
DonationTransaction.belongsTo(Donation, {
  foreignKey: 'donationId'
});

module.exports = DonationTransaction;