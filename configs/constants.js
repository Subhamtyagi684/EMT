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

exports.moduleNames = {
    CALL_SUMMARY:"CALL_SUMMARY",
    DASHBOARD:"DASHBOARD",
    USER_MANAGEMENT:"USER_MANAGEMENT",
}

exports.actionNames = {
    CALLS_HANDLED:"CALLS_HANDLED",
    CALL_RATINGS:"CALL_RATINGS",
    CALLS_LIST:"CALLS_LIST",
    CREATE_USER:"CREATE_USER",
    USER_LIST:"USER_LIST",
    MINUTES_CALLS_HANDLED:"MINUTES_CALLS_HANDLED",
    RESOLVED_FIRST_TIME:"RESOLVED_FIRST_TIME"
}