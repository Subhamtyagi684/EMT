const itemSyncQuery = {

    itemSyncToElastic: `SELECT
    li.locationcode,
    im.itemimage,
    ROUND(SUM(inm.quantity),2) as iteminventory,
    ROUND(im.quantity, 2) AS cnciteminventory,
    im.allowcreditsale as cansaleflag, 
    im.itemcode,
    im.maxquantityallowed,
    im.allowpromotions,
    im.allowsale,
    im.serialnumber AS serialNumber,
    im.hsncode AS HSNCode,
    im.iscomposite,
    im.hsn_tax AS hsntax,
    im.uomcode,im.uomvalue,
    ROUND(im.itemweight,2) AS weight,
    ROUND(im.itemheight,2) AS height,
    ROUND(im.itemlength,2) AS length,
    ROUND(im.itemwidth,2) AS width,
    im.status as itemStatus,
    im.createddate as createdDate,
    im.updateddate as updatedDate,
    im.createdby as createdBy,
    im.updatedby as updatedBy,
    im.launchdate as launchDate,
    im.allowsale as allowSale,
    icd.countrycode,
    ild.positemshortdesc,
    ild.positemname,
    ild.namePoPrint,
    ild.invoicePrint AS printname,
    ild.positemname AS recepitname,
    ild.positemname AS displayname,
    ROUND(icd.gstcode,2) as gstcode,
    icd.subcategorycode,
    icd.subcategoryvalue,
   icd.subcategorycountrycode,
    ROUND(icd.mrp,2) as mrp,
    ROUND(icd.distributorprice,2) as distributorprice,
    ROUND(icd.pointvalue,2) as pointvalue,
    ROUND(icd.businessvalue,2) as businessvalue,
    ROUND(icd.itemcost,2) as itemcost,
    icd.categorycode,
    icd.categorycountrycode,
    icd.categoryvalue,
    ROUND(icd.transferprice,2) as transferprice,
    imd.baseurl
    FROM itemmasterinfo im  
    INNER JOIN itemcountrydata icd ON im.itemcode = icd.itemcode INNER JOIN itemlocaldata ild ON 
    im.itemcode = ild.itemcode LEFT JOIN itemimagedata imd ON imd.itemcode = ild.itemcode left join
    inventorymaster inm on inm.item_code = im.itemcode  and inm.country_code  =  icd.countrycode 
    INNER JOIN  batchdetail bd ON bd.batchno = inm.batchNo  AND bd.itemid = inm.item_code AND 
    bd.locationid = inm.location_code and bd.country_code = inm.country_code  and bd.bucketid=inm.bucket_code inner join
    locationinfo li on li.locationcode=inm.location_code  WHERE  ild.localvalue ='en'  and li.status=1 and
    li.locationcode ='B0010' AND im.countrycode = 'IN'  and icd.countrycode = 'IN'  AND im.activitycode IN ('ACT' , 'SEAS') 
    AND  inm.bucket_code = 5  AND inm.location_code ='B0010' AND bd.expdate > NOW() AND im.itemcode NOT IN 
    (SELECT bd.itemcode FROM blockedlocation bd WHERE bd.itemcode = im.itemcode AND bd.locationcode ='B0010') 
     group by inm.item_code HAVING iteminventory>0 ;`,
}


module.exports = {
    itemSyncQuery
};