exports.expirePasswordInDays= 7;
exports.expirePasswordInManualDays=60;
exports.otpTypes = {
    firstReset:"FIRST_RESET_PASSWORD"
}
exports.expireOtpInSeconds = 30;
exports.expireJWTToken="1d";
exports.userStatusEnum = {
    "active":1,
    "inactive":2,
    "expired":3
}

exports.rolesAndPermissionStatusEnum = {
    "active":1,
    "inactive":2,
    "expired":3
}

exports.userTypesEnum = {
    "admin":1,
    "manager":2,
    "agent":3
}