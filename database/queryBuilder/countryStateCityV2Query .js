
const wmsconnection = require('../wmsdb')
const commonconnection = require('../commondb')

module.exports = {
  fetchCountryList: fetchCountryList,
  fetchAllStateList: fetchAllStateList,
  fetchAllCityList: fetchAllCityList
}


function createDataResponseObject(error, results) {

  return {
    error: error,
    results: results === undefined ? null : results === null ? null : results
  }
}


function fetchCountryList(callBack) {
  const registerUserQuery = `select * from countrymst order by id; `;

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}


function fetchAllStateList(callBack) {
  const registerUserQuery = `select s.* , c.countryname , c.id as countryId , c.countryisocode 
  from statemst s left outer join countrymst c on c.id = s.countryid order by id;`;

  console.log(registerUserQuery);

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}


function fetchAllCityList(callBack) {
  const registerUserQuery = `select c.* , s.statename , cm.countryname , cm.id as countryId , cm.countryisocode   from citymst c left outer join statemst s on s.id = c.stateid 
  left outer join countrymst cm on cm.id = s.countryid order by c.id;`;

  console.log(registerUserQuery);

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}
