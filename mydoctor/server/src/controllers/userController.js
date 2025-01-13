const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {models} = require("../models")

exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    speialization,
    address,
    location,
    workingHours,
    phone,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    if (userType === 'doctor') {
      await models.Profile.create({
        UserId: user.id,
        speialization,
        address,
        workingHours,
        phone,
      });
    }

    res.status(200).json({ message: 'تم إنشاء حسابك بنجاح' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحين',
      });
    }

    const authSuccess = await bcrypt.compare(password, user.password);

    if (!authSuccess) {
      return res.status(401).json({
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحين',
      });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );
    res.status(200).json({ accessToken: token });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.me = (req, res) => {
  const user = req.currentUser;
  res.json(user);
};

exports.getProfile = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: { id: req.currentUser.id },
      include: [{ model: models.Profile, as: 'Profile' }],
      attributes: { exclude: ['password'] },
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
