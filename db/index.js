const { user } = require('pg/lib/defaults');
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_acme_item_tracker_db');

const { STRING, INTEGER } = Sequelize;

const User = conn.define('user', {
  name: {
    type: STRING 
  },
  ranking: {
    type: INTEGER,
    defaultValue: 5
  }
});

const Thing = conn.define('thing', {
  name: {
    type: STRING 
  },
  ranking: {
    type: INTEGER,
    defaultValue: 1
  }
});

Thing.belongsTo(User);

Thing.addHook('beforeValidate', (thing) => {
  if(!thing.userId){
    thing.userId = null;
  }
  if(thing.userId) {
    const users_things = Thing.findAll({
      where: {
        userId: thing.userId
      }}
    )
    if (users_things.length > 2) {
      return Promise.reject(new Error("Use has too many items already!"))
    }
  }
});

module.exports = {
  conn,
  User,
  Thing
};
