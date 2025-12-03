import bcrypt from 'bcrypt';

// Encrypting Password
const saltRounds = 10;
export const hashPassword = (password) => {
    // We use "genSaltSync" instead of "genSalt" to make it synchronous
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt)
    return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
};