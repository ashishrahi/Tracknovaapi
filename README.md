# Payload for JWT
```javascript
const payload = {
ownerId: isUserRegistered._id, // Company Owner details
userId: isUserRegistered.users[0]._id, // Company logged in user details
username: isUserRegistered.users[0].username, // Company loggedin username
email: isUserRegistered.users[0].email, // company logged in email
}

```
# Request body
- req object have 2 main things
  - `req.company` for company details
  - `req.user for` logged in user details


















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



```javascript

export const probWireTampQuery = `WITH FilteredNT AS (
  SELECT  devid, MAX(TrackTime) AS LatestTrackTime
  FROM NT
  WHERE cast(TrackTime as date) = @date
    AND acc = 0
    AND speed > 10 group by devid
),
JoinedData AS (
  SELECT 
    im.Devid,
    im.ItemMasterId,
    ISNULL(im.VehicleNo, '') AS VehicleNo,
    im.EmpId,
    ISNULL(em.EmpDeptId, 0) AS EmpDeptId,
    ISNULL(dm.DepartmentName, '') AS DepartmentName
  FROM ItemMaster im
  INNER JOIN FilteredNT fn ON im.Devid = fn.devid
  LEFT JOIN EmpMaster em ON im.EmpId = em.Empid
  LEFT JOIN Department dm ON em.EmpDeptId = dm.DepartmentId
)

SELECT
  ROW_NUMBER() OVER (ORDER BY jd.Devid) AS srno,
  lt.LatestTrackTime AS date,
  jd.ItemMasterId,
  jd.VehicleNo,
  jd.Devid,
  jd.EmpDeptId AS DeptId,
  jd.DepartmentName
FROM JoinedData jd
LEFT JOIN FilteredNT lt ON jd.Devid = lt.devid
`;

export const getVehicleNotMovedQuery = `WITH NTMV AS (
    SELECT DISTINCT devid
    FROM NT
    WHERE TrackTime >= @dateFrom
      AND TrackTime <= @dateTo
      AND acc = 1
),

-- Get distinct device IDs that match the conditions in ntrec
NTREC AS (
    SELECT DISTINCT devid
    FROM NT
    WHERE TrackTime >= @dateFrom
      AND TrackTime <= @dateTo
),
-- Fetch vehicle details with employee and department information
VEHS AS (
    SELECT 
        im.Devid,
        im.VehicleNo,
        im.ItemName,
        im.VehicleTypeId,
        im.VZoneID,
        em.EmpName,
        em.EmpMobileNo,
        d.DepartmentName
    FROM ItemMaster im
    LEFT JOIN EmpMaster em ON im.EmpId = em.Empid
    LEFT JOIN Department d ON em.EmpDeptId = d.DepartmentId
    WHERE UPPER(im.ItemFlag) = 'V' 
      AND im.Devid IS NOT NULL
),

-- Fetch vehicle types
VT AS (
    SELECT VehicleTypeId, VehicleTypename
    FROM VehicleTypeMaster
),
-- Fetch zone information
ZN AS (
    SELECT ZoneID, ZoneName
    FROM ZoneMaster
)

-- Combine results
SELECT
    ROW_NUMBER() OVER (ORDER BY v.Devid) AS SrNo,
    v.DepartmentName,
    v.Devid,
    v.VehicleNo,
    vt.VehicleTypename,
    v.EmpName,
    v.EmpMobileNo,
    zn.ZoneName,
    CASE 
        WHEN nr.devid IS NULL THEN 0
        ELSE 1
    END AS NTRecord
FROM VEHS v
LEFT JOIN VT vt ON vt.VehicleTypeId = v.VehicleTypeId
LEFT JOIN ZN zn ON zn.ZoneID = v.VZoneID
LEFT JOIN NTREC nr ON nr.devid = v.Devid
LEFT JOIN NTMV nm ON nm.devid = v.Devid
WHERE nr.devid IS NULL OR nm.devid IS NULL;
`;
export const getVehicleDistanceQuery = {
  distanceQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, Distance
FROM vDistanceTravelled
WHERE vehicleno = @vehicleno
  AND trackdate >= @datef
  AND trackdate <= @datet
ORDER BY trackdate;`,
  idleQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, SecondsIdle
            FROM vVehicleIdle
             WHERE vehicleno = 'UP78GT8446'
              AND trackdate >= '2024-01-12 12:44:09.637'
              AND trackdate <= '2024-01-12 10:39:45.130'
            ORDER BY trackdate;`,
};


```


``` EmpId Get method Controller: GetCommGroupByEmpId```# Tracknovaapi
