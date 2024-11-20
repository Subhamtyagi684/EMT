var url='https://apiv2.veston.in/api/';

var binTypeEnums= {
    Normal : 1,
    GDP : 2,
    PickTo : 3,
    QC : 4,
    Receiving : 5,
    PeigonHole : 6
  
  }

 const gstStateCode= {
    A10 : '07',
    A8 : '26',
    A6 : '04',
    A4 : '18',
    A12 : '24',
    A14 : '02',
    A15 : '01',
    A16 : '20',
    A17 : '29',
    A18 : '32',
    A20 : '23',
    A21 : '27',
    A22 : '14',
    A25 : '13',
    A26 : '21',
    A29 : '08',
    A30 : '11',
    A31 : '33',
    A62 : '36',
    A33 : '09',
    A34 : '05',
    A35 : '19',
    A1 : '37',
    A3 : '12',
    A5 : '10',
    A7 : '22',
    A11 : '30',
    A13 : '06',
    A23 : '17',
    A24 : '15',
    A27 : '34',
    A28 : '03',
    A32 : '16',
    A9  : '26',
  }

  const panNumberState= {
    A10 : 'AABCV8616R',
    A8 : '6AABCV8616',
    A6 : 'AABCV8616R',
    A4 : 'AABCV8616R',
    A12 : 'AABCV8616R',
    A14 : 'AABCV8616R',
    A15 : 'AABCV8616R',
    A16 : 'AABCV8616R',
    A17 : 'AABCV8616R',
    A18 : 'AABCV8616R',
    A20 : 'AABCV8616R',
    A21 : 'AABCV8616R',
    A22 : 'AABCV8616R',
    A25 : 'AABCV8616R',
    A26 : 'AABCV8616R',
    A29 : 'AABCV8616R',
    A30 : 'AABCV8616R',
    A31 : 'AABCV8616R',
    A62 : 'AABCV8616R',
    A33 : 'AABCV8616R',
    A34 : 'AABCV8616R',
    A35 : 'AABCV8616R',
    A1 : 'AABCV8616R',
    A3 : 'AABCV8616R',
    A5 : 'AABCV8616R',
    A7 : 'AABCV8616R',
    A11 : 'AABCV8616R',
    A13 : 'AABCV8616R',
    A23 : 'AABCV8616R',
    A24 : 'AEDPL7346D',
    A27 : 'AABCV8616R',
    A28 : 'AABCV8616R',
    A32 : 'AABCV8616R',
  }

  const Cesstax={
    cessTax3:"3",
    cessTaxPercentageZeropointtowFive:"0.25",
    cessTax6:"6",
    cessTaxPercentage1:"1",
    cessTax5:"5",
    cessTaxPercentage0:"0",
  
  }

  module.exports = {
    binTypeEnums,
    gstStateCode,
    panNumberState,
    Cesstax,
    url
  }