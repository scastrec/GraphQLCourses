const CryptoJS = require('crypto-js');
const crypto = require('crypto')
const SECRET = "QSDFGH?.?N XCFVGHJK. SVQCNVXCDFGHN";

const COLLECTION = 'USERS';


const getUser = function (username) {
    return new Promise(function (resolve, reject) {
        db.collection(COLLECTION).find({ username: username }).toArray(function (err, res) {
            if (!err) {
                if (res.length == 0) {
                    reject({
                        status: 404,
                        message: 'user not exist'
                    });
                } else {
                    resolve(res[0]);
                }
            } else {
                console.log("Error getUser:" + err);
                reject({
                    status: 500,
                    message: err
                });
            }
        });
    });
}

const signup = function (username, password, photoUrl) {
    return new Promise(function (resolve, reject) {
        getUser(username).then((user) => {
            console.warn("User " + username + " already exist");
            // error user already exist
            reject({
                status: 401,
                message: 'USER ALREADY EXIST'
            });
        }).catch((err) => {
                //What we want
                let hashPwd = CryptoJS.HmacSHA1(password, SECRET);
                console.log(hashPwd);
                var u = {
                    username: username,
                    password: password,
                    photoUrl: photoUrl,
                    date: new Date()
                };
                db.collection(COLLECTION).insertOne(u, function (err, result) {
                    if (!err) {
                        resolve({
                            id: u._id
                        });
                    } else {
                        console.log("Error signup:" + err);
                        reject({
                            status: 500,
                            message: err
                        });
                    }
                });
            })
    });
}

const signin = function (username, password) {
    return new Promise(function (resolve, reject) {
        getUser(username).then((user) => {
            if (user.password === password) {
                crypto.randomBytes(48, function (ex, buf) {
                    token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
                    //TODO save token
                    resolve({
                        token: token
                    });
                });
            } else {
                reject({
                    status: 401,
                    message: "Password inccorect"
                });
            }
        }).catch(function(e){
            console.log("Signin : user not exist");
            reject({
                status: 401,
                message: "User unkown"
            });
        });
    });
    // TODO TU about if no user exist
}

const checkToken = function (token) {

}

module.exports = { signup, signin, checkToken };