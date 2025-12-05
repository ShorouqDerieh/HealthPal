require('dotenv').config();
const crypto = require('crypto');
const KEY = Buffer.from(process.env.AES_KEY, "hex");
const IV = Buffer.from(process.env.AES_IV, "hex");

module.exports = {
    encrypt(text) {
        const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }
};
