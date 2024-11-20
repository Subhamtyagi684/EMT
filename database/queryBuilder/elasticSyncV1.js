
let SSqlConnection;

module.exports = injectedSSqlConnection => {

  SSqlConnection = injectedSSqlConnection

  return {
    fetchDistributorListV1: fetchDistributorListV1,
    fetchDistributorByIDV1: fetchDistributorByIDV1,
  }
}


function fetchDistributorListV1(offset, limit, registrationCallback) {
  // const registerUserQuery = `SELECT * FROM vestige_pv.distributorinfo limit ${offset} , ${limit};`
  const registerUserQuery = `select dm.DistributorId as id ,dm.UplineDistributorId as uplineID ,
  dm.DistributorTitle as titlecode ,dm.DistributorFirstName as firstName ,
  dm.DistributorLastName as lastName ,dm.DistributorDOB as dob ,dm.DistributorAddress1 as address1 ,
  dm.DistributorAddress2 as address2 ,Country.CountryCode as countrycode ,
  dm.DistributorStateCode stateid ,
  dm.DistributorCityCode as cityid ,
  dm.DistributorPinCode as pinCode ,
  case when dm.DistributorTeleNumber='' then '0' else Replace(Replace(replace(stuff(dm.DistributorTeleNumber,4,4,'****'),'-','')
  ,'\\',''),'|','') end as primaryphone ,case when dm.DistributorMobNumber='' then '0' else isnull(stuff(dm.DistributorMobNumber,4,4,'****'),'0') end as primarymobile ,
  Replace(REPLACE(dm.DistributorEMailID,CHAR(13),' '),CHAR(10),' ') as emailid ,
  dm.DistributorStatus as status ,dm.DistributorRegistrationDate as regdate ,
  isnull(dm.DistributorActivationDate,'1980-01-01') as activationdate ,
  case when dm.CreatedBy=452 then 'HO' else isnull(lm.locationcode,'B0010') end
  locationcode ,isnull(mdbc.TotalPv,0) as totalpv ,isnull(mdbc.HierarchyLevel,0) as hiearchyid ,
  dpw.PanNo as pannumber ,dbw.IFSC as ifsccode ,dbw.AccountNo as accountno ,bm.BankName as bankname ,
  gst.GstIn as gst ,dm.CreatedBy as createdby ,dm.CreatedDate as createddate ,dm.ModifiedDate as updatedate ,
  dm.ModifiedBy as updateby ,country.CountryName as countryname ,State.StateName as statename ,
  city.CityName as cityname ,Replace(Replace(REPLACE(upline.DistributorFirstName,CHAR(13),' '),CHAR(10),' '),'|','')+' '+
  Replace(Replace(REPLACE(upline.DistributorLastName,CHAR(13),' '),CHAR(10),' '),'|','') as uplineName ,
  0 as distsource ,case when dm.distributortitle in (1,3) then 'Male' else 'Female' end as gender ,
  Isnull((Select 0 from DistributorMaster dm2 (NOLOCK)
      where dm2.DistributorId = dm.DistributorId and not exists (
      Select 1 from [DistributorFormTracking](NOLOCK) df where df.DistributorId = dm2.DistributorId
      ) and  DistributorRegistrationDate < dateadd(Day,-60,getdate()) and CreatedBy=452 and locationId = 10),1)
dafreceived ,
case when isnull(kyc.doctypeid,'0')='0' then '' else kyc.docno end as kyc ,
  isnull(dm.FirstOrderTaken,0) as firstInvoice ,dm.password as password ,0 inttoken ,
  0 exttoken ,0 physicalFormAvailable ,null udf1 ,null udf2 ,null udf3 ,null udf4 ,null udf5 ,
  null invoiceno ,null branch ,null twitter_id ,null google_id ,null facebook_user_name ,
  null linkedin_id ,cotitle.Keyvalue1 as codistributortitle ,dm.Co_DistributorTitle as codistributortitlecode ,
  dm.Co_DistributorFirstName+' '+ dm.Co_DistributorLastName as codistributorname ,
  isnull(dm.Co_DistributorDOB,'1900-01-01') as codistributordob ,''
  primarynominee ,'' secondarynominee ,'' thirdnominee ,'' primarynomineerelation ,''
  secondnomineerelation ,'' thirdnomineerelation ,0 primarynomineeshare ,0 secondnomineeshare ,
  0 thirdnomineeshare ,'1980-01-01' primarynomineedob ,'1980-01-01' secondarynomineedob ,'1980-01-01'
  thirdnomineedob ,isnull(mdbc.PermLevelId,0) as permanentlevel ,
  isnull(mdbc.PrevCumPV,0) as prevcummulativepv ,isnull(mdbc.PrevCumBV,0) as prevcummulativebv ,
  isnull(mdbc.BonusPercent,0) as bonuspercent ,dm.DistributorMobNumber as otpmobile ,0
  otp ,'1980-01-01 00:00:00.000' as mobileconfirmedon ,0 as firstlogin ,0 as ishousefundachiever
  ,0 as iscarfundachiever ,0 as isambasdor from VestigeIndiaho.dbo.distributormaster(Nolock) dm
  left join VestigeIndiaho.dbo.country_master(Nolock) country
  on dm.distributorCountryCode= country.Countryid
  left join VestigeIndiaho.dbo.State_Master(NOlock)
  state on dm.DistributorStateCode=state.StateId
  left Join VestigeIndiaho.dbo.City_Master(NOlock) city on dm.DistributorCityCode=city.CityId
  left Join VestigeIndiaho.dbo.DistributorMaster(Nolock) upline on dm.uplinedistributorid=upline.Distributorid
  left join VestigeIndiaho.dbo.Location_Master(Nolock) lm on dm.locationid=lm.locationid
  Left Join pmmyvestigin.dbo.V_Bank_Working(Nolock) dbw on dm.distributorid=dbw.distributorid and dbw.Status=1
  Left join pmmyvestigin.dbo.V_Pan_Working(Nolock) dpw on dm.distributorid=dpw.distributorid and dpw.Status=1
  Left join VestigeIndiaho.dbo.GST_Header(NOlock) gst on dm.distributorid = gst.distributorid and gst.status=1
  Left Join VestigeIndiaho.dbo.DistributorBusiness_Current(Nolock) mdbc on dm.distributorid=mdbc.distributorid
  Left Join ( select row_number() over(partition by distributorid order by distributorid) as rowid ,
  distributorid ,DocTypeId ,Status ,isApproved ,docno from VestigeIndiaho.dbo.kyc_header (NOlock)
  --where distributorid =881235
  ) as kyc on
  dm.distributorid=kyc.distributorid and kyc.rowid=1
  left join pmmyvestigin.dbo.BankMaster(Nolock) bm on bm.bankid=dbw.bankid
  Left join VestigeIndiaho.dbo.parameter_master(Nolock) pmtitle
  on dm.distributortitle=pmtitle.KeyCode1 and pmtitle.ParameterCode='title'
  Left Join VestigeIndiaho.dbo.parameter_master(Nolock) cotitle on dm.Co_DistributorTitle=cotitle.keycode1 and cotitle.parametercode='title'
  where CountryCode = 'IN'
  order by id
  offset ${offset} rows
  fetch next ${limit} rows only`

  console.log(registerUserQuery);
  SSqlConnection.ssqlquery(registerUserQuery, registrationCallback)
}


function fetchDistributorByIDV1(distID, type, registrationCallback) {
  let buildQuery = '';
  if (type === 1) {
    const searchUserByIDQuery = `select dm.DistributorId as id ,dm.UplineDistributorId as uplineID ,
    dm.DistributorTitle as titlecode ,dm.DistributorFirstName as firstName ,
    dm.DistributorLastName as lastName ,dm.DistributorDOB as dob ,dm.DistributorAddress1 as address1 ,
    dm.DistributorAddress2 as address2 ,Country.CountryCode as countrycode ,
    dm.DistributorStateCode stateid ,
    dm.DistributorCityCode as cityid ,
    dm.DistributorPinCode as pinCode ,
    case when dm.DistributorTeleNumber='' then '0' else Replace(Replace(replace(stuff(dm.DistributorTeleNumber,4,4,'****'),'-','')
    ,'\\',''),'|','') end as primaryphone ,case when dm.DistributorMobNumber='' then '0' else isnull(stuff(dm.DistributorMobNumber,4,4,'****'),'0') end as primarymobile ,
    Replace(REPLACE(dm.DistributorEMailID,CHAR(13),' '),CHAR(10),' ') as emailid ,
    dm.DistributorStatus as status ,dm.DistributorRegistrationDate as regdate ,
    isnull(dm.DistributorActivationDate,'1980-01-01') as activationdate ,
    case when dm.CreatedBy=452 then 'HO' else isnull(lm.locationcode,'B0010') end
    locationcode ,isnull(mdbc.TotalPv,0) as totalpv ,isnull(mdbc.HierarchyLevel,0) as hiearchyid ,
    dpw.PanNo as pannumber ,dbw.IFSC as ifsccode ,dbw.AccountNo as accountno ,bm.BankName as bankname ,
    gst.GstIn as gst ,dm.CreatedBy as createdby ,dm.CreatedDate as createddate ,dm.ModifiedDate as updatedate ,
    dm.ModifiedBy as updateby ,country.CountryName as countryname ,State.StateName as statename ,
    city.CityName as cityname ,Replace(Replace(REPLACE(upline.DistributorFirstName,CHAR(13),' '),CHAR(10),' '),'|','')+' '+
    Replace(Replace(REPLACE(upline.DistributorLastName,CHAR(13),' '),CHAR(10),' '),'|','') as uplineName ,
    0 as distsource ,case when dm.distributortitle in (1,3) then 'Male' else 'Female' end as gender ,
    Isnull((Select 0 from DistributorMaster dm2 (NOLOCK)
        where dm2.DistributorId = dm.DistributorId and not exists (
        Select 1 from [DistributorFormTracking](NOLOCK) df where df.DistributorId = dm2.DistributorId
        ) and  DistributorRegistrationDate < dateadd(Day,-60,getdate()) and CreatedBy=452 and locationId = 10),1)
  dafreceived ,
  case when isnull(kyc.doctypeid,'0')='0' then '' else kyc.docno end as kyc ,
    isnull(dm.FirstOrderTaken,0) as firstInvoice ,dm.password as password ,0 inttoken ,
    0 exttoken ,0 physicalFormAvailable ,null udf1 ,null udf2 ,null udf3 ,null udf4 ,null udf5 ,
    null invoiceno ,null branch ,null twitter_id ,null google_id ,null facebook_user_name ,
    null linkedin_id ,cotitle.Keyvalue1 as codistributortitle ,dm.Co_DistributorTitle as codistributortitlecode ,
    dm.Co_DistributorFirstName+' '+ dm.Co_DistributorLastName as codistributorname ,
    isnull(dm.Co_DistributorDOB,'1900-01-01') as codistributordob ,''
    primarynominee ,'' secondarynominee ,'' thirdnominee ,'' primarynomineerelation ,''
    secondnomineerelation ,'' thirdnomineerelation ,0 primarynomineeshare ,0 secondnomineeshare ,
    0 thirdnomineeshare ,'1980-01-01' primarynomineedob ,'1980-01-01' secondarynomineedob ,'1980-01-01'
    thirdnomineedob ,isnull(mdbc.PermLevelId,0) as permanentlevel ,
    isnull(mdbc.PrevCumPV,0) as prevcummulativepv ,isnull(mdbc.PrevCumBV,0) as prevcummulativebv ,
    isnull(mdbc.BonusPercent,0) as bonuspercent ,dm.DistributorMobNumber as otpmobile ,0
    otp ,'1980-01-01 00:00:00.000' as mobileconfirmedon ,0 as firstlogin ,0 as ishousefundachiever
    ,0 as iscarfundachiever ,0 as isambasdor from VestigeIndiaho.dbo.distributormaster(Nolock) dm
    left join VestigeIndiaho.dbo.country_master(Nolock) country
    on dm.distributorCountryCode= country.Countryid
    left join VestigeIndiaho.dbo.State_Master(NOlock)
    state on dm.DistributorStateCode=state.StateId
    left Join VestigeIndiaho.dbo.City_Master(NOlock) city on dm.DistributorCityCode=city.CityId
    left Join VestigeIndiaho.dbo.DistributorMaster(Nolock) upline on dm.uplinedistributorid=upline.Distributorid
    left join VestigeIndiaho.dbo.Location_Master(Nolock) lm on dm.locationid=lm.locationid
    Left Join pmmyvestigin.dbo.V_Bank_Working(Nolock) dbw on dm.distributorid=dbw.distributorid and dbw.Status=1
    Left join pmmyvestigin.dbo.V_Pan_Working(Nolock) dpw on dm.distributorid=dpw.distributorid and dpw.Status=1
    Left join VestigeIndiaho.dbo.GST_Header(NOlock) gst on dm.distributorid = gst.distributorid and gst.status=1
    Left Join VestigeIndiaho.dbo.DistributorBusiness_Current(Nolock) mdbc on dm.distributorid=mdbc.distributorid
    Left Join ( select row_number() over(partition by distributorid order by distributorid) as rowid ,
    distributorid ,DocTypeId ,Status ,isApproved ,docno from VestigeIndiaho.dbo.kyc_header (NOlock)
    --where distributorid =881235
    ) as kyc on
    dm.distributorid=kyc.distributorid and kyc.rowid=1
    left join pmmyvestigin.dbo.BankMaster(Nolock) bm on bm.bankid=dbw.bankid
    Left join VestigeIndiaho.dbo.parameter_master(Nolock) pmtitle
    on dm.distributortitle=pmtitle.KeyCode1 and pmtitle.ParameterCode='title'
    Left Join VestigeIndiaho.dbo.parameter_master(Nolock) cotitle on dm.Co_DistributorTitle=cotitle.keycode1 and cotitle.parametercode='title'
    where CountryCode = 'IN'
    and dm.DistributorId ='${distID}';`
    buildQuery = searchUserByIDQuery;
  } else if (type === 2) {
    const searchUserByMobileQuery = `select dm.DistributorId as id ,dm.UplineDistributorId as uplineID ,
    dm.DistributorTitle as titlecode ,dm.DistributorFirstName as firstName ,
    dm.DistributorLastName as lastName ,dm.DistributorDOB as dob ,dm.DistributorAddress1 as address1 ,
    dm.DistributorAddress2 as address2 ,Country.CountryCode as countrycode ,
    dm.DistributorStateCode stateid ,
    dm.DistributorCityCode as cityid ,
    dm.DistributorPinCode as pinCode ,
    case when dm.DistributorTeleNumber='' then '0' else Replace(Replace(replace(stuff(dm.DistributorTeleNumber,4,4,'****'),'-','')
    ,'\\',''),'|','') end as primaryphone ,case when dm.DistributorMobNumber='' then '0' else isnull(stuff(dm.DistributorMobNumber,4,4,'****'),'0') end as primarymobile ,
    Replace(REPLACE(dm.DistributorEMailID,CHAR(13),' '),CHAR(10),' ') as emailid ,
    dm.DistributorStatus as status ,dm.DistributorRegistrationDate as regdate ,
    isnull(dm.DistributorActivationDate,'1980-01-01') as activationdate ,
    case when dm.CreatedBy=452 then 'HO' else isnull(lm.locationcode,'B0010') end
    locationcode ,isnull(mdbc.TotalPv,0) as totalpv ,isnull(mdbc.HierarchyLevel,0) as hiearchyid ,
    dpw.PanNo as pannumber ,dbw.IFSC as ifsccode ,dbw.AccountNo as accountno ,bm.BankName as bankname ,
    gst.GstIn as gst ,dm.CreatedBy as createdby ,dm.CreatedDate as createddate ,dm.ModifiedDate as updatedate ,
    dm.ModifiedBy as updateby ,country.CountryName as countryname ,State.StateName as statename ,
    city.CityName as cityname ,Replace(Replace(REPLACE(upline.DistributorFirstName,CHAR(13),' '),CHAR(10),' '),'|','')+' '+
    Replace(Replace(REPLACE(upline.DistributorLastName,CHAR(13),' '),CHAR(10),' '),'|','') as uplineName ,
    0 as distsource ,case when dm.distributortitle in (1,3) then 'Male' else 'Female' end as gender ,
    Isnull((Select 0 from DistributorMaster dm2 (NOLOCK)
        where dm2.DistributorId = dm.DistributorId and not exists (
        Select 1 from [DistributorFormTracking](NOLOCK) df where df.DistributorId = dm2.DistributorId
        ) and  DistributorRegistrationDate < dateadd(Day,-60,getdate()) and CreatedBy=452 and locationId = 10),1)
  dafreceived ,
  case when isnull(kyc.doctypeid,'0')='0' then '' else kyc.docno end as kyc ,
    isnull(dm.FirstOrderTaken,0) as firstInvoice ,dm.password as password ,0 inttoken ,
    0 exttoken ,0 physicalFormAvailable ,null udf1 ,null udf2 ,null udf3 ,null udf4 ,null udf5 ,
    null invoiceno ,null branch ,null twitter_id ,null google_id ,null facebook_user_name ,
    null linkedin_id ,cotitle.Keyvalue1 as codistributortitle ,dm.Co_DistributorTitle as codistributortitlecode ,
    dm.Co_DistributorFirstName+' '+ dm.Co_DistributorLastName as codistributorname ,
    isnull(dm.Co_DistributorDOB,'1900-01-01') as codistributordob ,''
    primarynominee ,'' secondarynominee ,'' thirdnominee ,'' primarynomineerelation ,''
    secondnomineerelation ,'' thirdnomineerelation ,0 primarynomineeshare ,0 secondnomineeshare ,
    0 thirdnomineeshare ,'1980-01-01' primarynomineedob ,'1980-01-01' secondarynomineedob ,'1980-01-01'
    thirdnomineedob ,isnull(mdbc.PermLevelId,0) as permanentlevel ,
    isnull(mdbc.PrevCumPV,0) as prevcummulativepv ,isnull(mdbc.PrevCumBV,0) as prevcummulativebv ,
    isnull(mdbc.BonusPercent,0) as bonuspercent ,dm.DistributorMobNumber as otpmobile ,0
    otp ,'1980-01-01 00:00:00.000' as mobileconfirmedon ,0 as firstlogin ,0 as ishousefundachiever
    ,0 as iscarfundachiever ,0 as isambasdor from VestigeIndiaho.dbo.distributormaster(Nolock) dm
    left join VestigeIndiaho.dbo.country_master(Nolock) country
    on dm.distributorCountryCode= country.Countryid
    left join VestigeIndiaho.dbo.State_Master(NOlock)
    state on dm.DistributorStateCode=state.StateId
    left Join VestigeIndiaho.dbo.City_Master(NOlock) city on dm.DistributorCityCode=city.CityId
    left Join VestigeIndiaho.dbo.DistributorMaster(Nolock) upline on dm.uplinedistributorid=upline.Distributorid
    left join VestigeIndiaho.dbo.Location_Master(Nolock) lm on dm.locationid=lm.locationid
    Left Join pmmyvestigin.dbo.V_Bank_Working(Nolock) dbw on dm.distributorid=dbw.distributorid and dbw.Status=1
    Left join pmmyvestigin.dbo.V_Pan_Working(Nolock) dpw on dm.distributorid=dpw.distributorid and dpw.Status=1
    Left join VestigeIndiaho.dbo.GST_Header(NOlock) gst on dm.distributorid = gst.distributorid and gst.status=1
    Left Join VestigeIndiaho.dbo.DistributorBusiness_Current(Nolock) mdbc on dm.distributorid=mdbc.distributorid
    Left Join ( select row_number() over(partition by distributorid order by distributorid) as rowid ,
    distributorid ,DocTypeId ,Status ,isApproved ,docno from VestigeIndiaho.dbo.kyc_header (NOlock)
    --where distributorid =881235
    ) as kyc on
    dm.distributorid=kyc.distributorid and kyc.rowid=1
    left join pmmyvestigin.dbo.BankMaster(Nolock) bm on bm.bankid=dbw.bankid
    Left join VestigeIndiaho.dbo.parameter_master(Nolock) pmtitle
    on dm.distributortitle=pmtitle.KeyCode1 and pmtitle.ParameterCode='title'
    Left Join VestigeIndiaho.dbo.parameter_master(Nolock) cotitle on dm.Co_DistributorTitle=cotitle.keycode1 and cotitle.parametercode='title'
    where CountryCode = 'IN'
    and dm.DistributorMobNumber ='${distID}';`
    buildQuery = searchUserByMobileQuery;
  }

  // console.log(buildQuery);

  SSqlConnection.ssqlquery(buildQuery, registrationCallback)
}
