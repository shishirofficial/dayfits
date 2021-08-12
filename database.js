var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'bmc7msmjgjkdcgzvzngf-mysql.services.clever-cloud.com', // Replace with your host name
  user: 'uzybdnh8bsywoovb',      // Replace with your database username
  password: 'fIZRlMTTdh5LPMucN3Yu',      // Replace with your database password
  database: 'bmc7msmjgjkdcgzvzngf' // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;


