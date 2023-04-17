const { connect, connection } = require('mongoose');

connect('mongodb://localhost/sn_api_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
