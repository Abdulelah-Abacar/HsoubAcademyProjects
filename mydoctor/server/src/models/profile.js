const profile = (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    speialization: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    workingHours: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    }
  });

  Profile.associate = models => {
    Profile.belongsTo(models.User);
  }
  return Profile;
};

module.exports = profile;