# Learning
- iisnode file is auto generated when browser opens.
- No need to provide port because in server we decide what port should be assign.


# Choosing a Build Tool(webpack)


- Babel : For transpiling modern JavaScript to older syntax.

- Webpack: For bundling and optimizing code. <br/>
    - to install webpack
        ```npm install --save-dev webpack webpack-cli```
    - Create a Webpack Configuration file in root:
         ```Add a webpack.config.js file```
    - Add Script
        ```"build": "webpack"```
    
    - Content inside webpack.config.js


```javascript
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/app.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Name of the output file
  },
  target: 'node', // Specifies that the bundle is for Node.js
  mode: 'production', // Use 'development' for development mode
};

```

  



- esbuild: A faster alternative to Babel/webpack.
    - to install esbuid
        ```npm install --save-dev esbuild```
    - Now add script 
        ```"build": "esbuild src/index.js --bundle --platform=node --outfile=dist/index.js"```
    
- pkg: To package your Node.js project into a single executable file.

# How to host Node backend in IIS Server
- Double Click handler mapping. Add Module Mapping
    - Reuqest path: ```bundle.js``` or ```index.js``` as per the build file name
    - Module : ```iisnode```
    - Name: ```iisnode``` 

        ``Enjoy Hosting``

# Encrypting the data by Crypto

```javascript
import crypto from "crypto";


const algorithm = 'aes-256-cbc';
const key = "32-byte-key"; // 32-byte key
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

```

# How to add environment variable in IIS Server

- `Follow This Path: C:\Windows\System32\inetsrv\config\applicationHost.config.`
- Find the Application Pool option

```javascript
    <applicationPools>
        <add name="DefaultAppPool" />
            <add name="commonjsAPI" />
            <add name="workingCommonJSApi" />
            <add name="testingCommonJSApi" />
            <add name="webpack" />
            <add name="esbuild" />
            <!---- Application Name --/>
            <add name="finalHostApi" />
                <add name="envTestBackend" managedRuntimeVersion="v4.0"managedPipelineMode="Integrated">
                    <!-- <processModel ... /> -->
                    <environmentVariables>
                            <add name="DB_SERVER_NAME" value="value" />
                            <add name="DB_SERVER_PORT" value="value" />
                            <add name="DB_NAME" value="value" />
                            <add name="DB_USER" value="value" />
                            <add name="DB_PASSWORD" value="value" />
                    </environmentVariables>
            </add>
                <applicationPoolDefaults managedRuntimeVersion="v4.0">
                    <processModel identityType="ApplicationPoolIdentity" loadUserProfile="true" setProfileEnvironment="false" />
                </applicationPoolDefaults>
    </applicationPools>
```
