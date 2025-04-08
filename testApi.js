/**
 * The function `fn` takes a string as input, capitalizes the first letter of each word, and returns
 * the modified string.
 * @param value - The function `fn` takes a string as input and capitalizes the first letter of each
 * word while converting the rest of the letters to lowercase.
 * @returns The function `fn` takes a string as input, splits it into words, capitalizes the first
 * letter of each word, converts the rest of the word to lowercase, and then joins the words back into
 * a single string.
 */
// db.nt.aggregate([
//     {
//       $lookup: {
//         from: "itemMaster",
//         localField: "devId",
//         foreignField: "devId",
//         as: "itemDetails"
//       }
//     },
//     { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $match: {
//         trackDate: {
//           $gte: ISODate("2024-01-09T12:44:09.637Z"),
//           $lte: ISODate("2024-01-10T10:39:45.130Z")
//         }
//       }
//     },
//     { $limit: 10 }
//   ]);

//   db.nt.aggregate([
//     // Step 1: Join with itemMaster
//     {
//       $lookup: {
//         from: "itemMaster",
//         localField: "devId",
//         foreignField: "devId",
//         as: "itemDetails"
//       }
//     },
//     { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },

//     // Step 2: Join with vehicleTypeMaster
//     {
//       $lookup: {
//         from: "vehicleTypeMaster",
//         localField: "itemDetails.vehicleTypeId",
//         foreignField: "vehicleTypeId",
//         as: "vehicleDetails"
//       }
//     },
//     { $unwind: { path: "$vehicleDetails", preserveNullAndEmptyArrays: true } },

//     // Step 3: Group by devId and trackDate
//     {
//       $group: {
//         _id: { devId: "$devId", trackDate: "$trackDate" },
//         devId: { $first: "$devId" },
//         vehicleNo: { $first: "$itemDetails.vehicleNo" },
//         vehicleTypeId: { $first: "$itemDetails.vehicleTypeId" },
//         vehicleTypename: { $first: "$vehicleDetails.vehicleTypename" },
//         distance: { $max: "$distance" }
//       }
//     },

//     // Step 4: Apply date filter and vehicleNo
//     {
//       $match: {
//         vehicleNo: "UP78GT8446",
//         "_id.trackDate": {
//           $gte: ISODate("2024-01-09T12:44:09.637Z"),
//           $lte: ISODate("2024-01-10T10:39:45.130Z")
//         }
//       }
//     },

//     // Step 5: Sort by trackDate
//     {
//       $sort: { "_id.trackDate": 1 }
//     },

//     // Step 6: Project required fields
//     {
//       $project: {
//         devId: 1,
//         vehicleNo: 1,
//         vehicleTypeId: 1,
//         vehicleTypename: 1,
//         trackDate: "$_id.trackDate",
//         distance: 1
//       }
//     }
//   ]);

// console.log("Hi")
// console.lo("Hi")

// console.log("Hi");
// // console..log("hi")
// console.log("1" + 1);
// console.log("1" - 1);

// if(true){
//   let num = 1;
// }

// console.log(num)
const fn = (value) => {
  return value
    .split(" ") // Split string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ");
}; // Join words back into a single string;


// set: (value) => {
//   return value
//     .split(" ") // Split string into words
//     .map(
//       (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     ) // Capitalize each word
//     .join(" ");
// }


// const correctKey = Object.keys({hello: "sdc"}).map(key => key.charAt(0).toUpperCase() + key.slice(2, key.length))

// console.log(correctKey);

// console.log(crypto.randomUUID())

// const arr = [{UserId: 1}, {UserId:2}]

// //  arr.map((perm) => (perm.UserId = 5));

// let game = arr.map((perm) => (perm.UserId = 5));

// console.log(game);
// console.log("old", arr)


// Convert first letter of each key to lowercase for every object in the array
// const response = data.map((obj) => {
//   let newObj = {};
//   Object.keys(obj).forEach((key) => {
//     let newKey = key.charAt(0).toLowerCase() + key.slice(1);
//     newObj[newKey] = obj[key];
//   });
//   return newObj;
// });



// console.log(new Date(1734201000000))



const vehitm = [
  { VehicleNo: 'ABC123', ItemName: 'Truck' },
  { VehicleNo: 'XYZ789', ItemName: 'Bus' }
];

const lisret1 = [
  { VehicleNo: 'ABC123', VehicleName: '' },
  { VehicleNo: 'XYZ789', VehicleName: '' },
  { VehicleNo: 'LMN456', VehicleName: '' } // Doesn't match any VehicleNo
];

// Update VehicleName in lisret1
lisret1.forEach(item => {
  const vehicle = vehitm.find(v => v.VehicleNo === item.VehicleNo);
  item["testing"] = vehicle ? vehicle.ItemName : ''; // If no match, set empty string
});

// console.log("lisret1", lisret1);

// console.log(new Date("2023-12-01"))



const regexForEmail = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"



let listGroups = [
  {
    id: 0,
    campaignId: 0,
    groupId: 1,
    memberId: 0,
    message: '',
    emailId: '',
    mobileNo: '',
    receiverType: '',
    name: '',
    isSelected: true
  },
  {
    id: 0,
    campaignId: 0,
    groupId: 2,
    memberId: 0,
    message: '',
    emailId: '',
    mobileNo: '',
    receiverType: '',
    name: '',
    isSelected: true
  },
  {
    id: 0,
    campaignId: 0,
    groupId: 3,
    memberId: 0,
    message: '',
    emailId: '',
    mobileNo: '',
    receiverType: '',
    name: '',
    isSelected: true
  }
]

listGroups = listGroups.map((group) => {
  let newGroup = {}; // Create a new object

  for (let key in group) {
    let newKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize key
    newGroup[newKey] = group[key]; // Assign the value to the new key
  }

  return newGroup;
});

// console.log("listGroups: ", listGroups)


const model = {
  campaignId: 5,
  campaignName: 'After holisdcvfdb',
  campaignDate: '2025-03-18',
  campaignType: 'Email',
  tamplateId: '6',
  message: '<p><strong>Subject:</strong> 📢 Office Closed Tomorrow</p><p>Dear [Team/All],</p><p>This is to inform you that the office will remain <strong>closed tomorrow ([Date])</strong> due to [Reason, e.g., a public holiday/maintenance, etc.].</p><p>Please plan your tasks accordingly and enjoy your day off! 🎉</p><p>For any urgent matters, feel free to reach out via email or [alternative contact method].</p><p>Best regards,</p><p> [Your Name]</p><p> [Your Designation]</p><p> [Company Name]</p>',
  status: 'Immediately',
  fromDate: '2025-03-18',
  toDate: '2025-03-18',
  toTime: '15:42:09',
  createdBy: 'Saurabh',
  updatedBy: 'Saurabh',
  createdOn: '2025-03-18',
  updatedOn: '2025-03-18',
  listGroups: [
    {
      id: 102,
      campaignId: 5,
      groupId: 1,
      memberId: 0,
      message: '<p><strong>Subject:</strong> 📢 Office Closed Tomorrow</p><p>Dear [Team/All],</p><p>This is to inform you that the office will remain <strong>closed tomorrow ([Date])</strong> due to [Reason, e.g., a public holiday/maintenance, etc.].</p><p>Please plan your tasks accordingly and enjoy your day off! 🎉</p><p>For any urgent matters, feel free to reach out via email or [alternative contact method].</p><p>Best regards,</p><p> [Your Name]</p><p> [Your Designation]</p><p> [Company Name]</p>',
      emailId: 'saurabh@gmail.com',
      mobileNo: '',
      receiverType: 'RealSuperAdmin',
      name: 'Office Inspection',
      isSelected: true
    }
  ],
  listMembers: [
    {
      id: 103,
      campaignId: 5,
      groupId: 0,
      memberId: 540,
      message: '<p><strong>Subject:</strong> 📢 Office Closed Tomorrow</p><p>Dear [Team/All],</p><p>This is to inform you that the office will remain <strong>closed tomorrow ([Date])</strong> due to [Reason, e.g., a public holiday/maintenance, etc.].</p><p>Please plan your tasks accordingly and enjoy your day off! 🎉</p><p>For any urgent matters, feel free to reach out via email or [alternative contact method].</p><p>Best regards,</p><p> [Your Name]</p><p> [Your Designation]</p><p> [Company Name]</p>',
      emailId: 'saurabh@gmail.com',
      mobileNo: '9889840089',
      receiverType: 'RealSuperAdmin',
      name: 'Saurabh',
      isSelected: true
    },
    {
      id: 104,
      campaignId: 5,
      groupId: 0,
      memberId: 539,
      message: '<p><strong>Subject:</strong> 📢 Office Closed Tomorrow</p><p>Dear [Team/All],</p><p>This is to inform you that the office will remain <strong>closed tomorrow ([Date])</strong> due to [Reason, e.g., a public holiday/maintenance, etc.].</p><p>Please plan your tasks accordingly and enjoy your day off! 🎉</p><p>For any urgent matters, feel free to reach out via email or [alternative contact method].</p><p>Best regards,</p><p> [Your Name]</p><p> [Your Designation]</p><p> [Company Name]</p>',
      emailId: 'testreal@gmail.com',
      mobileNo: '9889840089',
      receiverType: 'Employee',
      name: 'Testing',
      isSelected: true
    },
    {
      id: 105,
      campaignId: 5,
      groupId: 0,
      memberId: 538,
      message: '<p><strong>Subject:</strong> 📢 Office Closed Tomorrow</p><p>Dear [Team/All],</p><p>This is to inform you that the office will remain <strong>closed tomorrow ([Date])</strong> due to [Reason, e.g., a public holiday/maintenance, etc.].</p><p>Please plan your tasks accordingly and enjoy your day off! 🎉</p><p>For any urgent matters, feel free to reach out via email or [alternative contact method].</p><p>Best regards,</p><p> [Your Name]</p><p> [Your Designation]</p><p> [Company Name]</p>',
      emailId: 'admin@admin.com',
      mobileNo: '9889558866',
      receiverType: 'Employee',
      name: 'Sandeep',
      isSelected: true
    }
  ],
  srno: 0,
  isExecute: true
}


let updatedCampaignModel = {}
for (let key in model) {
  if (key !== "listMembers" && key !== "listGroups") {
    updatedCampaignModel[key.charAt(0).toUpperCase() + key.slice(1)] = model[key];
  }
}



// console.log("updatedCampaignModel", updatedCampaignModel)



console.log("Alt67KKKK7j@gmail.com".toLowerCase());



import { log } from "console";
// import fs from "fs";
import path from "path";

// const modelsPath = path.resolve("./models"); // Adjust path if needed
// const modelFile = fs.readdirSync(modelsPath).find((file) => file.endsWith("js"));

// console.log(modelFile)

import fs from "fs";

// Read and parse JSON file
const data = fs.readFileSync("./utils/db-default-data/RolePermission.json", "utf-8");
let dataa = JSON.parse(data);

function cleanDateFields(uy) {
  uy.forEach((item) => {
    if (item.createdAt && item.createdAt.$date) {
      item.createdAt = item.createdAt.$date;
    }
    if (item.updatedAt && item.updatedAt.$date) {
      item.updatedAt = item.updatedAt.$date;
    }
  });
}

// Call function
cleanDateFields(dataa);

// Log the cleaned data
const dataaaaa = {
  name: "khgjk"
}
// console.log(JSON.stringify(dataa));


import argon2 from "argon2";

console.log(await argon2.hash("Rakesh@123"));



console.log("HJXYU8265e".toUpperCase());