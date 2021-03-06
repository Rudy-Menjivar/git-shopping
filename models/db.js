/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const globalModelConfig = {
  underscored: true,
  timestamps: true
};

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", err);
  });

const SessionModel = sequelize.define(
  "Session",
  {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(10000)
  },
  globalModelConfig
);

const UserModel = sequelize.define(
  "User",
  {
    uid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: Sequelize.STRING(30),
    email: Sequelize.STRING(255),
    password_hash: Sequelize.STRING(255)
  },
  globalModelConfig
);

sequelize.sync({
  alter: true
});

const getUserById = uid => UserModel.findOne({ where: { uid } });
const getUserByUsername = username => UserModel.findOne({ where: { username } });
const getUserByEmail = email => UserModel.findOne({ where: { email } });

const isUsernameInUse = async username => {
  return (await getUserByUsername(username)) !== null;
};

const isEmailInUse = async email => {
  return (await getUserByEmail(email)) ? true : false;
};

const createUserRecord = userObj => new Promise(async (resolve, reject) => {
  const passwdHash = await createPasswordHash(userObj.password);
  UserModel.create({
    email: userObj.email,
    username: userObj.username,
    password_hash: passwdHash
  })
    .then((createdUser) => {
      resolve(createdUser);
    })
    .catch(err => reject(err));
});

const createPasswordHash = password => new Promise(async (resolve, reject) => {
  try {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      resolve(hash);
    });
  }
  catch (err) {
    reject(err);
  }
});

const isPasswordHashVerified = (hash, password) => new Promise(async (resolve, reject) => {
  try {
    bcrypt.compare(password, hash, (err, res) => {
      resolve(res);
    });
  }
  catch (err) {
    reject(err);
  }
});

module.exports = session => {
  const SequelizeStore = require("connect-session-sequelize")(session.Store);

  const SessionStore = new SequelizeStore({
    db: sequelize,
    table: "Session"
  });

  return {
    SessionStore,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    isUsernameInUse,
    isEmailInUse,
    createUserRecord,
    isPasswordHashVerified
  };
};
