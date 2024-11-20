
const wmsconnection = require('../wmsdb')
const commonconnection = require('../commondb')

module.exports = {
  insertIntoRegionalBranch: insertIntoRegionalBranch,
  insertIntoMainRegionalBranch: insertIntoMainRegionalBranch,
  fetchPincodeDetails: fetchPincodeDetails,
  fetchRegionalPincodeDetails: fetchRegionalPincodeDetails,
  fetchMainRegionalLocDetails: fetchMainRegionalLocDetails,
  fetchStateListDetails: fetchStateListDetails,
  fetchCityListDetails: fetchCityListDetails,
  fetchLocationListDetails: fetchLocationListDetails,
  fetchLocationListDetailByLocCode: fetchLocationListDetailByLocCode
}


function createDataResponseObject(error, results) {

  return {
    error: error,
    results: results === undefined ? null : results === null ? null : results
  }
}


function insertIntoRegionalBranch(values, callBack) {
  const registerUserQuery = `INSERT INTO vestige_wms.RegionalBranchMapping
  (refId,  pincode,  ServingLocationID,  StateID,  StateName,  CityID,  CityName,  CountryCode,  CountryName,
  ServingLocationCode,  DeliveryType, isActive,  createdAt,  createdBy)  VALUES ?`;

  wmsconnection.query(registerUserQuery, [values], function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}


function insertIntoMainRegionalBranch(values, callBack) {
  const registerUserQuery = `INSERT INTO vestige_wms.mainregionalbranches
  (LocationID, StateID, AlternateLocationId, Status, DeliveryType, StateWarehouseId, createdBy, createdAt)
  VALUES ?`;

  wmsconnection.query(registerUserQuery, [values], function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}


function fetchPincodeDetails(values, callBack) {
  const registerUserQuery = `SELECT * FROM vestige_common.pincodeloopkup where pincode = ${values.pinCode} 
  and countryid =  ${values.countryCode};`;

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}

function fetchRegionalPincodeDetails(values, callBack) {
  const registerUserQuery = `select distinct 
  li.id as LocationID , li.locationcode as LocationCode , li.locationname  as Name, li.weekdata as weeklyOff  ,
  li.locationtypecode as LocationType , li.locationtypevalue as LocationTypeName,
  CASE
     WHEN locationtypecode = 'LOCWH' THEN 1
     ELSE 0
 END as warehouse,
   CASE
     WHEN (RBM.DeliveryType is null or  RBM.DeliveryType = 0) THEN 0
     ELSE 1
 END as deliveryType
  from (locationinfo li left outer join RegionalBranchMapping RBM on RBM.ServingLocationID = li.id ) 
 where RBM.stateid = ${values.stateID} and RBM.pincode = ${values.pinCode};`;


  wmsconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}


function fetchMainRegionalLocDetails(StateID, callBack) {
  const registerUserQuery = `select distinct
  li.id as LocationID , li.locationcode as LocationCode , li.locationname  as Name, li.weekdata as weeklyOff  ,
  li.locationtypecode as LocationType , li.locationtypevalue as LocationTypeName,
  CASE
     WHEN li.locationtypecode = 'LOCWH' THEN 1
     ELSE 0
 END as warehouse,
  CASE
     WHEN (mrb.DeliveryType is null or  mrb.DeliveryType = 0) THEN 0
     ELSE 1
 END as deliveryType
  from (locationinfo li left outer join mainregionalbranches mrb on mrb.LocationID = li.id ) 
 where mrb.stateid = ${StateID};`;

  wmsconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}


function fetchStateListDetails(countryId, callBack) {
  const registerUserQuery = `SELECT c.countryisocode as countrycode,c.countryname,c.status,c.taxtype,c.taxcalculationmode,
  c.financialyear as financialyearstartdt,com.companyname,com.companycode, c.countryisocode as pcode,
  s.isunionterritory,s.gststatecode,s.gststateid,s.statename,s.statename as name,s.statename as descr,
  s.id as statecode,s.gstin,s.id as code,s.signatoryname,s.signimagepath,s.cessstatus FROM statemst s 
   LEFT JOIN countrymst c on s.countryid=c.id  LEFT JOIN companyinfo com on com.companyregstate=s.gststateid
   WHERE  c.countryisocode='${countryId}' and c.status=1 ORDER BY s.statename`;

   console.log(registerUserQuery);

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}

function fetchCityListDetails(countryId, stateID, callBack) {
  const registerUserQuery = `SELECT s.gstin, s.id as pcode,ct.cityname as descr,ct.cityname as descr,ct.cityname as name, s.countryid as countryId,
  c.countryisocode as countryCode, c.countryname as countryName, ct.cityname,ct.id as citycode,ct.id as code from citymst ct left outer join 
 statemst s ON s.id=ct.stateid  left outer join countrymst c on c.id =  s.countryid
 WHERE s.id=${stateID} and c.countryisocode = '${countryId}' ORDER BY ct.cityname `;

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}


function fetchLocationListDetails(callBack) {
  const registerUserQuery = `select * from locationinfo order by id;`;
  console.log(registerUserQuery);
  wmsconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}


function fetchLocationListDetailByLocCode(locationCode, callBack) {
  const registerUserQuery = `select * from locationinfo where locationcode='${locationCode}';`;

  wmsconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}