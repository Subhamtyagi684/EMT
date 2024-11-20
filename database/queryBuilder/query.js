const userQuery = {

    findUser: `select * from users;`,

    loginQuery: `select * from users where username=? and password=?`,

    userSession :`select * from users u left outer join tokens t on u.userID = t.userId where u.mobile = 9643131833`

}


module.exports = {
    userQuery
};