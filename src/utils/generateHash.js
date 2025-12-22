import crypto from "crypto";

// Function to hash transaction data
export default function generateHash(data) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
}
