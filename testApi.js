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

console.log(fn("weferg erfergr errgvreg"));

set: (value) => {
  return value
    .split(" ") // Split string into words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ) // Capitalize each word
    .join(" ");
}


const correctKey = Object.keys({hello: "sdc"}).map(key => key.charAt(0).toUpperCase() + key.slice(2, key.length))

console.log(correctKey);

console.log(crypto.randomUUID())

const arr = [{UserId: 1}, {UserId:2}]

//  arr.map((perm) => (perm.UserId = 5));

let game = arr.map((perm) => (perm.UserId = 5));

console.log(game);
console.log("old", arr)


// Convert first letter of each key to lowercase for every object in the array
const response = data.map((obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    let newKey = key.charAt(0).toLowerCase() + key.slice(1);
    newObj[newKey] = obj[key];
  });
  return newObj;
});