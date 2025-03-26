function generatePassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    const allChars = upper + lower + numbers + symbols;
    
    if (length < 4) {
        throw new Error("Password length must be at least 4 for security.");
    }

    let password = [
        upper[Math.floor(Math.random() * upper.length)],   // Ensure at least one uppercase
        lower[Math.floor(Math.random() * lower.length)],   // Ensure at least one lowercase
        numbers[Math.floor(Math.random() * numbers.length)], // Ensure at least one number
        symbols[Math.floor(Math.random() * symbols.length)] // Ensure at least one special char
    ];

    // Fill the remaining length with random characters
    for (let i = 4; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle to remove predictable order
    return password.sort(() => Math.random() - 0.5).join("");
}

export default generatePassword;



