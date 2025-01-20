import { StatusCodes } from "http-status-codes";
import { CommGroup, CommMembers, EmailSetting, SmsSetting, CampaignDetail } from "../modals/index.js";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "../utils/apiResponse/index.js";
import mongoose from "mongoose";

//-------------GetCommGroup-------->
async function GetCommGroup(req, res) {
  const { PageNo, PageSize, Name, Type } = req.body;
  // query
  const query = {};
  if (Name) query.Name = Name;
  if (Type) query.Type = Type.toUpperCase();

  // Step 2: Pagination Setup
  const pageNo = PageNo || 1; // Default Page Number
  const pageSize = PageSize || 10; // Default Page Size
  const skip = (pageNo - 1) * pageSize; // Calculate documents to skip

  // Step 3: Fetch Total Count
  const totalCount = await CommGroup.countDocuments(query);

  // Step 4: Fetch Paginated Data
  const lNM = await CommGroup.find(query, { projection: { _id: 0 } }) // Exclude `_id` if not needed
    .skip(skip) // Skip previous pages
    .limit(pageSize); // Limit to page size

  // Step 5: Return Response
  return res.status(StatusCodes.OK).json(
    {
      Data: lNM,
      Status: "Success",
      PageNo: pageNo,
      PageSize: pageSize,
      RowCount: totalCount, // Total records count
      TotalPages: Math.ceil(totalCount / pageSize),
    } // Calculate total pages
  );

  // {
  // Data: lNM,
  // Status: "Success",
  // PageNo: pageNo,
  // PageSize: pageSize,
  // RowCount: totalCount, // Total records count
  // TotalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
  // };
}

//-------------UpsertCommGroup-------->
async function UpsertCommGroup(req, res) {
  try {
    let { groupId, name, description, type, isActive, createdBy, updatedBy } =
      req.body;
    console.log(req.body);

    let existingGroup = await CommGroup.findOne({ Name: name });
    console.log("existingGroup", existingGroup);

    // Check if it's a new record
    // zero means we are updating the record
    if (!groupId || groupId === 0) {
      if (existingGroup) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            Data: req.body,
            Status: "Failed",
            Message: "Record Already Exists!",
          });
      }

      // Get the highest GroupId and increment
      let lastGroup = await CommGroup.findOne().sort({ GroupId: -1 });
      groupId = (lastGroup?.GroupId || 0) + 1;

      // Create a new group
      const newGroup = new CommGroup({
        Name: name,
        GroupId: groupId,
        Type: type,
        Description: description,
        isActive: isActive,
        CreatedBy: createdBy,
        UpdatedBy: updatedBy,
      });
      await newGroup.save();

      return res
        .status(StatusCodes.CREATED)
        .json({
          Status: "Success",
          Message: "Added Successfully",
          Data: newGroup,
        });
    } else {
      // Update existing record
      let updatedGroup = await CommGroup.findOneAndUpdate(
        { GroupId: groupId },
        {
          Name: name,
          GroupId: groupId,
          Type: type,
          Description: description,
          isActive: isActive,
          CreatedBy: createdBy,
          UpdatedBy: updatedBy,
        },
        { new: true } // Return updated document
      );

      if (!updatedGroup) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ Status: "Failed", Message: "Internal error. Try again" });
      }

      return res
        .status(StatusCodes.OK)
        .json({
          Status: "Success",
          Message: "Updated Successfully",
          Data: updatedGroup,
        });
    }
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ Status: "Failed", Error: error.message });
  }
}

//-------------DeleteCommGroup-------->
async function DeleteCommGroup(req, res) {
  // let session;
  try {
    const model = req.body;

    // session = await mongoose.startSession();

    // session.startTransaction();

    // return
    // Check if GroupId is used in CommMembers
    const existingMember = await CommMembers.findOne({
      GroupId: model.groupId,
    });
    // .session(session);
    if (existingMember) {
      // await session.abortTransaction();
      // session.endSession();
      return res
        .status(StatusCodes.CONFLICT)
        .json({
          Status: "Failed",
          Message: "GroupId is used in CommMembers, so it can't be deleted.",
        });
    }

    // Delete CommGroup and associated CommMembers
    const deletedGroup = await CommGroup.findOneAndDelete({
      GroupId: model.groupId,
    });
    // .session(session);
    const deletedMembers = await CommMembers.deleteMany({
      GroupId: model.groupId,
    });
    // .session(session);

    // await session.commitTransaction();
    // session.endSession();

    if (!deletedGroup) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ Status: "Failed", Message: "GroupId not found!" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ Status: "Success", Message: "Deleted Successfully" });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ Status: "Failed", Error: error.message });
  }
}

//-------------GetCommGroupByEmpId-------->
async function GetCommGroupByEmpId(req, res) {
  const { EmpId } = req.body;
  console.log("EmpId", EmpId);

  try {
    const result = await CommGroup.aggregate([
      {
        $lookup: {
          from: "CommMembers", // Join with the CommMembers collection
          let: { groupId: "$GroupId" }, // Reference to the GroupId field in CommGroup
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$MemberId", EmpId] }, // Match the MemberId with EmpId
                    { $eq: ["$GroupId", "$$groupId"] }, // Match the GroupId
                  ],
                },
              },
            },
            // { $project: { _id: 1 } } // Only return the Id field (similar to the SQL SELECT Id)
          ],
          as: "Member", // The result of the join is stored in "Member"
        },
      },
      {
        $project: {
          // Project the required fields from CommGroup
          Grp: 1,
          IsSelected: {
            $cond: {
              if: { $gt: [{ $size: "$Member" }, 0] },
              then: true,
              else: false,
            }, // If Member array is non-empty, set IsSelected to true
          },
        },
      },
    ]);

    return res.status(StatusCodes.OK).json({
      Data: result,
      Status: "Success",
      RowCount: result.length,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------GetAllEmailSetting-------->
async function GetAllEmailSetting(req, res) {
  try {
    let query = {};
    const { id, name, email, pageNo, pageSize } = req.body;

    if (id) query.Id = id;
    if (name) query.Name = name;
    if (email) query.Email = email;

    const pageno = pageNo || 1;
    const pagesize = pageSize || 10;
    const skip = (pageno - 1) * pagesize;

    const result = await EmailSetting.find(query).skip(skip).limit(pageSize);

    return res
      .status(StatusCodes.OK)
      .json(new ApiSuccessResponse(StatusCodes.OK, result));
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiSuccessResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------UpsertEmailSetting-------->
async function UpsertEmailSetting(req, res) {
  try {
    const model = req.body;
    // let updated;

     let updated = await EmailSetting.findOneAndUpdate(
      { Id: model.id },
      { $set: { IsActive: true } }, // Activate only the matched record
      { new: true } // Return updated document & insert if not found
    );
    if (!updated) {
        updated =  new EmailSetting ({
        Id: model.id,
        Name: model.name,
        Email: model.email,
        Password: model.password,
        Host: model.host,
        Port: model.port,
        IsTls: model.isTls,
        IsSSl: model.isSSl,
        IsActive: model.isActive,
      });

      updated = await updated.save()
    }
    return res.json({ updated });
  } catch (error) {
    return res.json({ msg: error.message });
  }
}

//-------------GetAllSmsSetting-------->
async function GetAllSmsSetting(req, res){
    try {
        const {id, name, mobileNo, apiUrl, userName, password, isActive, pageNo, pageSize } = req.body;
        let query = {};
        if(id) query.Id = id; 
        if(name) query.Name = name; 
        if(mobileNo) query.MobileNo = mobileNo; 
        if(apiUrl) query.ApiUrl = apiUrl; 
        if(userName) query.UserName = userName; 
        if(password) query.Password = password; 
        if(isActive) query.IsActive = isActive; 
    
        const pageno = pageNo || 1;
        const pagesize = pageSize || 10;
        const skip = (pageno - 1) * pageSize;
    
        const result = await SmsSetting.find(query, {_id: 0}).skip(skip).limit(pagesize)
    
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(StatusCodes.OK, result));
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message))
    }
}

//-------------GetCampaignDetailById-------->
async function GetCampaignDetailById(req, res){
  const { CampaignId } = req.query;
  console.log(CampaignId);

    const result = await CampaignDetail.aggregate([
        {
          $match: {
            CampaignId: Number(CampaignId)
          }
        },
        {
          $lookup: {
            // Lookup CommGroup to get group details
            from: "CommGroup",
            localField: "GroupId",
            foreignField: "GroupId",
            as: "GroupDetails"
          }
        },
        {
          $lookup: {
            from: "EmpMaster",
            // Lookup EmpMaster to get employee details
            localField: "MemberId",
            foreignField: "Empid",
            as: "MemberDetails"
          }
        },
        {$unwind: { path: "$MemberDetails", preserveNullAndEmptyArrays: true }}
        ,
        {
          $project: {
            CampaignId: 1,
            GroupId: 1,
            MemberId: 1,
            Message: 1,
            EmailId: 1,
            MobileNo: 1,
            ReceiverType: {
              $literal: "Employee"
            },
            Name: "$MemberDetails.EmpName",
            IsSelected: {
              $cond: [
                {
                  $eq: ["$MemberId", null]
                },
                0,
                1
              ]
            } // If MemberId is null, set IsSelected to 0, otherwise 1
          }
        }
      ])

      return res.json(result)
}

//-------------GetCampaign-------->
async function GetCampaign(req, res){

}

export {
  GetCommGroup,
  UpsertCommGroup,
  DeleteCommGroup,
  GetCommGroupByEmpId,
  GetAllEmailSetting,
  UpsertEmailSetting,
  GetAllSmsSetting,
  GetCampaignDetailById,
  GetCampaign
};
