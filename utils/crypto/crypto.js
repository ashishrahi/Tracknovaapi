import crypto from "crypto";


const algorithm = 'aes-256-cbc';
const key = "z3/9Y2V1zCWO3Us9fL9h5AQvcUDd+g5JCL5/vMDLYw8="; // 32-byte key
;
const iv = crypto.randomBytes(16);
// const iv = "717e52d4264d80ae9aacdf260bf92a6d";

//  encrypting data
const encryptData = (data)=>{
  if(!data){
    throw new Error("Data is not coming")
  }
  // console.log("key is: ",key)
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "base64"), iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
    encrypted += cipher.final("base64");
    return {
      encryptedData: encrypted,
      iv: iv.toString("base64"),
    };
}

export default encryptData;
