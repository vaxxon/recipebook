const db = require('../database')
var crypto = require('crypto')

const createSalt = () => {
    return crypto.randomBytes(16).toString('hex')
}

const encryptPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex')
}

exports.register = async (user) => {
    if (await exports.getByEmail(user.email)) {
        return false
    }
    let salt = createSalt()
    let encryptedPassword = encryptPassword(user.password, salt)
    return db.getPool().query("insert into users (email, name, salt, password) values ($1, $2, $3, $4) returning *", [user.email, user.name, salt, encryptedPassword])
}

exports.getByEmail = async (email) => {
    const { rows } = await db.getPool().query("select * from users where email = $1", [email])
    return db.camelize(rows)[0]
}

exports.login = async (login) => {
    let user = await exports.getByEmail(login.email)
    if (!user) {
        return null
    }
    let encryptedPassword = encryptPassword(login.password, user.salt)
    if (user.password === encryptedPassword) {
        return user
    }
    return null
}