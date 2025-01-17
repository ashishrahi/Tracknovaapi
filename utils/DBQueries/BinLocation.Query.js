import { BinLocation } from "../../modals/index.js";


////////////////////////////// AddUpdateBinLocationQuery //////////////////////////////////////////


export const AddUpdateBinLocationQuery = async (model) => {
 
    const { BinLocID, BinLocName,AreaID,...rest } = model; 
    
    try {
     
      if (!BinLocID || BinLocID === 0) {
     
        const existingRecord = await BinLocation.findOne({ BinLocName });

        if (existingRecord) {
          return {
            data: model,
            status: "Failed",
            message: "Record Already Exists!",
          };
        }
  
        // Get the max BinLocID and increment it
        const lastRecord = await BinLocation.findOne().sort({ BinLocID: -1 });
        const newBinLocID = (lastRecord?.BinLocID || 0) + 1;
  
        // Create a new BinLocation
        const newBinLocation = new BinLocation({
          BinLocID: newBinLocID,
          BinLocName:BinLocName,
          AreaID:AreaID,
          ...rest
        });
  console.log('newBinLocation:', newBinLocation)
        await newBinLocation.save();
  
        return {
          data: newBinLocation,
          status: "Success",
          message: "Added Successfully",
        };
      } else {
        // Find existing BinLocation by BinLocID and update
        const updatedBinLocation = await BinLocation.findOneAndUpdate(
          { BinLocID },
          { BinLocName, ...rest },
          { new: true } // Return the updated document
        );
  
        if (!updatedBinLocation) {
          return {
            status: "Failed",
            message: "BinLocation not found!",
          };
        }
  
        return {
          data: updatedBinLocation,
          status: "Success",
          message: "Updated Successfully",
        };
      }
    } catch (error) {
      return {
        status: "Failed",
        message: error.message,
      };
    }
  };
  
////////////////////////////// GetBinLocationQuery //////////////////////////////////////////


export const GetBinLocationQuery = async (userId) => {
    try {

        const aggregationPipeline = [
         
         {
            $lookup: {
              from: 'AreaWardMaster',
              localField: 'AreaID',
              foreignField: 'AreaID',
              as: 'AreaWardMaster',
            },
          },
          {
            $unwind: {
              path: '$AreaWardMaster',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ZoneMaster',
              localField: 'ZoneID',
              foreignField: 'ZoneID',
              as: 'ZoneMaster',
            },
          },
          {
            $unwind: {
              path: '$ZoneMaster',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
                BinLocID: 1,
                    BinLocName: { $ifNull: ['$BinLocName', ''] },
                    BinLocCode: { $ifNull: ['$BinLocCode', ''] },
                    ZoneID: 1,
                    RFID: 1,
                    Latitude: 1,
                    Longitude: 1,
                    LocationName: { $ifNull: ['$LocationName', ''] },
                    LocImage: 1,
                    Description: { $ifNull: ['$Description', ''] },
                    CreatedBy: 1,
                    UpdatedBy: 1,
                    CreatedOn: { $ifNull: ['$CreatedOn', new Date(0)] },
                    UpdatedOn: { $ifNull: ['$UpdatedOn', new Date(0)] },
                    AreaID: 1,
                    AreaWardMaster: {
                        AreaID: '$AreaWardMaster.AreaID',
                        AreaName: { $ifNull: ['$AreaWardMaster.AreaName', ''] },
                        WardNumber: { $ifNull: ['$AreaWardMaster.WardNumber', ''] },
                        ZoneID: '$AreaWardMaster.ZoneID',
                        CreatedBy: { $ifNull: ['$AreaWardMaster.CreatedBy', ''] },
                        UpdatedBy: { $ifNull: ['$AreaWardMaster.UpdatedBy', ''] },
                        CreatedOn: { $ifNull: ['$AreaWardMaster.CreatedOn', new Date(0)] },
                        UpdatedOn: { $ifNull: ['$AreaWardMaster.UpdatedOn', new Date(0)] }
                    },
                    ZoneMaster: {
                        ZoneID: '$ZoneMaster.ZoneID',
                        ZoneName: { $ifNull: ['$ZoneMaster.ZoneName', ''] },
                        ZoneAbbrevation: { $ifNull: ['$ZoneMaster.ZoneAbbrevation', ''] },
                        CreatedBy: { $ifNull: ['$ZoneMaster.CreatedBy', ''] },
                        UpdatedBy: { $ifNull: ['$ZoneMaster.UpdatedBy', ''] },
                        CreatedOn: { $ifNull: ['$ZoneMaster.CreatedOn', new Date(0)] },
                        UpdatedOn: { $ifNull: ['$ZoneMaster.UpdatedOn', new Date(0)] }
                    }
            },
          },
         
         ];
    
        // Execute aggregation query
        const result = await BinLocation.aggregate(aggregationPipeline);
    
        if (result.length > 0) {
          return { ParentMenu: result };
        } else {
          return { message: 'No user permissions found' };
        }
      } catch (error) {
        console.error(error);
        throw new Error('Server Error');
      }

}

////////////////////////////// DeleteBinLocationQuery //////////////////////////////////////////


export const DeleteBinLocationQuery = async (model) => {
  
  try {
    const {BinLocID, AreaID} = model
        if (AreaID !== 0) {
            const entity = await BinLocation.findOne({BinLocID:BinLocID});
            console.log(entity)

            if (!entity) {
                return {
                    status: 'Failed',
                    message: 'Bin Location not found',
                };
            }

            // Remove the bin location
            await BinLocation.findOneAndDelete({BinLocID:BinLocID});
        }

        return {
            status: 'Success',
            message: 'Delete Successfully',
        };
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message,
        };
    }
};

