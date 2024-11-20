
let SSqlConnection;

module.exports = injectedSSqlConnection => {

  SSqlConnection = injectedSSqlConnection

  return {
    fetchRegionalBranchMappingV1: fetchRegionalBranchMappingV1,
    fetchMainRegionalBranchesV1: fetchMainRegionalBranchesV1,
  }
}

function fetchRegionalBranchMappingV1(regionalCallback) {
  let buildQuery = `select distinct rbm.* ,pl.Countryid as CountryCode , cm.CountryName , lm.LocationCode as ServingLocationCode  from RegionalBranchMapping rbm
  left outer join PinCodeLookup pl on pl.PinCode =  rbm.pincode
  and  pl.Stateid = rbm.StateID and 
  pl.City = rbm.CityID  
  left outer join Location_Master lm on  lm.LocationId = rbm.ServingLocationID
  left outer join Country_Master cm on  cm.CountryId = pl.Countryid
  order by rbm.id;`

  SSqlConnection.ssqlquery(buildQuery, regionalCallback)
}


function fetchMainRegionalBranchesV1(mainRegionalCallback) {
  let buildQuery = `select * from MainRegionalBranches;`

  SSqlConnection.ssqlquery(buildQuery, mainRegionalCallback)
}
