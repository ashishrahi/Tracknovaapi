import { StatusCodes } from "http-status-codes";
import dotnetLikeData from "../utils/dotnet-like-format/dotnetLikeData.js";
import {
  CommGroup,
  CommMembers,
  EmailSetting,
  SmsSetting,
  CampaignDetail,
  Campaign,
  CampaignTemplate,
  EventSetting,
  ZoneMaster,
  ItemTypeMaster,
  ItemCategoryMaster,
  UnitMaster,
  TaxMaster,
  EmpMaster,
  FuelType,
  BrandMaster,
  VehicleTypeMaster,
} from "../modals/index.js";
import { getTenantDBModels } from "../db/index.js";

import {
  ApiSuccessResponse,
  CommonResponse,
  ApiErrorResponse,
} from "../utils/apiResponse/index.js";

import formattedData from "../utils/dotnet-like-format/dotnetLikeData.js";
import sendMailService from "../utils/emailService/nodeMailer.js";

//-------------GetCommGroup-------->
async function GetCommGroup(req, res) {
  const { CommGroup } = await getTenantDBModels();

  const { pageNo, pageSize } = req.body;

  const PageNo = pageNo;
  const PageSize = pageSize;
  let skip = (PageNo - 1) * PageSize;

  let data;

  if (pageNo === 0 && pageSize === 0) {
    data = await CommGroup.find().select("-_id").lean();
  } else {
    data = await CommGroup.find()
      .select("-_id")
      .lean() // Exclude `_id` if not needed
      .skip(skip) // Skip previous pages
      .limit(pageSize);
  }

  // Step 4: Fetch Paginated Data
  // if((PageNo && PageSize) > 0){
  // data = await CommGroup.find().select('-_id').lean() // Exclude `_id` if not needed
  // .skip(skip) // Skip previous pages
  //  .limit(pageSize); // Limit to page size
  // }else{
  //   data = await CommGroup.find().select('-_id').lean() // Exclude `_id` if not needed

  // }

  const newData = dotnetLikeData(data);
  const totalCount = newData.length;
  // Step 5: Return Response
  return res.status(StatusCodes.OK).json(
    new CommonResponse(
      1,
      "Data Fetched",
      newData,
      totalCount,
      null,
      pageNo,
      pageSize
    )
    // {
    //   Status: "Success",
    //   PageNo: pageNo,
    //   PageSize: pageSize,
    //   RowCount: totalCount, // Total records count
    //   TotalPages: Math.ceil(totalCount / pageSize),
    //   Data: lNM,

    // } // Calculate total pages
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
async function UpsertCommGroup(req, res, next) {
  try {
    const { CommGroup } = await getTenantDBModels();

    let { groupId, name, description, type, isActive, createdBy, updatedBy } =
      req.body;

    let existingGroup = await CommGroup.findOne({ Name: name });

    // Check if it's a new record
    // zero means we are updating the record
    if (!groupId || groupId === 0) {
      if (existingGroup) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(new CommonResponse(0, "Record Already Exists!", existingGroup));

        //   {
        //   Status: "Failed",
        //   Message: "Record Already Exists!",
        //   Data: req.body,
        // });
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
        IsActive: isActive,
        CreatedBy: createdBy,
        UpdatedBy: updatedBy,
      });
      await newGroup.save();

      return res
        .status(StatusCodes.CREATED)
        .json(new CommonResponse(1, "Added Successfully", newGroup));
      //   {
      //   Status: "Success",
      //   Message: "Added Successfully",
      //   Data: newGroup,
      // });
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
          .json(new CommonResponse(0, "Internal error. Try again"));
        // { Status: "Failed", Message: "Internal error. Try again" };
      }

      return res.status(StatusCodes.OK).json(
        new CommonResponse(1, "Updated successfully", updatedGroup)
        //   {
        //   Status: "Success",
        //   Message: "Updated Successfully",
        //   Data: updatedGroup,
        // }
      );
    }
  } catch (error) {
    const StatusCode = error.StatusCode || StatusCodes.BAD_REQUEST;
    const msg = error.message || error.ErrorMessage;
    next(new ApiErrorResponse(StatusCode, msg));
    // return res
    //   .status(StatusCodes.BAD_REQUEST)
    //   .json(new ApiErrorResponse(0, error.message))
  }
}

//-------------DeleteCommGroup-------->
async function DeleteCommGroup(req, res) {
  // let session;
  try {
    const { CommGroup } = await getTenantDBModels();

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
      return res.status(StatusCodes.CONFLICT).json({
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
        .json(new CommonResponse(0, "GroupId not found!"));
      // { Status: "Failed", Message: "GroupId not found!" });
    }

    return res
      .status(StatusCodes.OK)
      .json(new CommonResponse(1, "Deleted Successfully"));
    //   { Status: "Success", Message: "Deleted Successfully" }
    // );
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(0, error.message);
    // { Status: "Failed", Error: error.message });
  }
}

//-------------GetCommGroupByEmpId-------->
async function GetCommGroupByEmpId(req, res) {
  try {
    const { CommGroup } = await getTenantDBModels();
    const { EmpId } = req.body;

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

    return res.status(StatusCodes.OK).json(1);
    //   {
    //   Data: result,
    //   Status: "Success",
    //   RowCount: result.length,
    // });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message)
      );
  }
}

//-------------GetAllEmailSetting-------->
async function GetAllEmailSetting(req, res) {
  try {
    const { EmailSetting } = await getTenantDBModels();

    let query = {};
    const { id, name, email, pageNo, pageSize } = req.body;

    if (id) query.Id = id;
    if (name) query.Name = name;
    if (email) query.Email = email;

    const pageno = pageNo || 1;
    const pagesize = pageSize || 10;
    const skip = (pageno - 1) * pagesize;

    const result = await EmailSetting.find(query)
      .skip(skip)
      .limit(pageSize)
      .lean();
    const newData = dotnetLikeData(result);
    return res
      .status(StatusCodes.OK)
      .json(new CommonResponse(1, "Data Fetch Succesffuly !", newData));
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------UpsertEmailSetting-------->
async function UpsertEmailSetting(req, res, next) {
  try {
    const { EmailSetting } = await getTenantDBModels();
    const model = req.body;
    // let updated;
    // console.log('model:',model)
    let updated = await EmailSetting.findOneAndUpdate(
      { Id: model.id },
      { $set: { IsActive: model.isActive } } // Activate only the matched record
      // { new: false } // Return updated document & insert if not found
    );
    if (!updated) {
      updated = new EmailSetting({
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

      updated = await updated.save();
    }
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          true,
          StatusCodes.OK,
          "Updated Successfully",
          updated
        )
      );
  } catch (error) {
    const err = new Error(error.message);
    err.status = StatusCodes.BAD_REQUEST;
    return next(err);
    // return res.json({ msg: error.message });
  }
}

//-------------GetAllSmsSetting-------->
async function GetAllSmsSetting(req, res) {
  try {
    const { SmsSetting } = await getTenantDBModels();

    const {
      id,
      name,
      mobileNo,
      apiUrl,
      userName,
      password,
      isActive,
      pageNo,
      pageSize,
    } = req.body;
    let query = {};
    if (id) query.Id = id;
    if (name) query.Name = name;
    if (mobileNo) query.MobileNo = mobileNo;
    if (apiUrl) query.ApiUrl = apiUrl;
    if (userName) query.UserName = userName;
    if (password) query.Password = password;
    if (isActive) query.IsActive = isActive;

    const pageno = pageNo || 1;
    const pagesize = pageSize || 10;
    const skip = (pageno - 1) * pageSize;

    const result = await SmsSetting.find(query, { _id: 0 })
      .skip(skip)
      .limit(pagesize);

    return res
      .status(StatusCodes.OK)
      .json(new ApiSuccessResponse(true, StatusCodes.OK, "default", result));
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------GetCampaignDetailById-------->
async function GetCampaignDetailById(req, res, next) {
  try {
    const { CampaignDetail } = await getTenantDBModels();

    const { CampaignId } = req.query;

    const result = await CampaignDetail.aggregate([
      {
        $match: {
          CampaignId: Number(CampaignId),
        },
      },
      {
        $lookup: {
          // Lookup CommGroup to get group details
          from: "CommGroup",
          localField: "GroupId",
          foreignField: "GroupId",
          as: "GroupDetails",
        },
      },
      {
        $lookup: {
          from: "EmpMaster",
          // Lookup EmpMaster to get employee details
          localField: "MemberId",
          foreignField: "Empid",
          as: "MemberDetails",
        },
      },
      { $unwind: { path: "$MemberDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          CampaignId: 1,
          GroupId: 1,
          MemberId: 1,
          Message: 1,
          EmailId: 1,
          MobileNo: 1,
          ReceiverType: {
            $literal: "Employee",
          },
          Name: "$MemberDetails.EmpName",
          IsSelected: {
            $cond: [
              {
                $eq: ["$MemberId", null],
              },
              0,
              1,
            ],
          }, // If MemberId is null, set IsSelected to 0, otherwise 1
        },
      },
    ]);

    return res
      .status(StatusCodes.OK)
      .json(true, StatusCodes.OK, "default", result);
  } catch (error) {
    const err = new Error(error.message);
    err.status = StatusCodes.BAD_REQUEST;
    return next(err);
  }
}

//-------------GetCampaign-------->
async function GetCampaign(req, res) {
  try {
    const { Campaign } = await getTenantDBModels();

    const {
      campaignId,
      campaignName,
      campaignDate,
      campaignType,
      status,
      pageNo = 1,
      pageSize = 10,
    } = req.body;

    const query = {};
    if (campaignId) query.CampaignId = campaignId;
    if (campaignName) query.CampaignName = campaignName;
    if (campaignDate) query.CampaignDate = campaignDate;
    if (campaignType) query.CampaignType = campaignType;
    if (status) query.Status = status.toUpperCase();

    // Validate pagination inputs
    const skip = (pageNo - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Fetch campaign data with filtering and pagination
    const campaigns = await Campaign.find(query).skip(skip).limit(limit).lean();
    // .lean(); // Improves performance by returning plain JS objects
    const data = dotnetLikeData(campaigns);
    // Get total count of records matching the filter
    const totalCount = await Campaign.countDocuments(query);

    return res.status(StatusCodes.OK).json(
      new CommonResponse(1, "message", data, totalCount, pageNo, pageSize)
      //   {
      //   Data: campaigns,
      //   Status: "Success",
      //   PageNo: pageNo,
      //   PageSize: pageSize,
      //   RowCount: totalCount,
      // }
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      Status: "Failed",
      Error: error.message,
    });
  }
}

//-------------UpsertCampaign-------->
async function UpsertCampaign(req, res, next) {
  const response = { status: "Failed", message: "", data: null };
  try {
    const { Campaign, CampaignDetail } = await getTenantDBModels();

    const model = req.body;
    // console.log('model:',model)
    if (!model.campaignId || model.campaignId === 0) {
      // Check if campaign already exists

      const existingCampaign = await Campaign.findOne({
        CampaignName: model.campaignName,
      }).lean();

      // console.log('existingCampaign:', existingCampaign)

      if (existingCampaign) {
        return res.status(StatusCodes.OK).json({
          status: "Failed",
          message: "Campaign Already Exists!",
        });
      }

      // Get the last CampaignId and increment
      const lastCampaign = await Campaign.findOne()
        .sort({ CampaignId: -1 })
        .lean();

      model.campaignId = (lastCampaign?.CampaignId || 0) + 1;

      // Get last Id from CampaignDetail
      const lastDetail = await CampaignDetail.findOne().sort({ Id: -1 }).lean();

      let Id = (lastDetail?.Id || 0) + 1;
      // console.log("Id:", Id)

      // Process Groups
      let listGroups = model.listGroups.filter((ii) => ii.isSelected);

      // Filling data in listGroup

      listGroups.forEach((ii) => {
        ii.id = Id++;
        ii.campaignId = model.campaignId;
        ii.message = model.message;
      });

      listGroups = listGroups.map((group) => {
        let newGroup = {}; // Create a new object

        for (let key in group) {
          let newKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize key
          newGroup[newKey] = group[key]; // Assign the value to the new key
        }

        return newGroup;
      });
      console.log("listGroups", listGroups[0].GroupId);
      const isSuccess = await CampaignDetail.insertMany(listGroups);

      if (isSuccess.length < 0) {
        throw new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to save Group. Try again!"
        );
      }
      // Process Members
      let listMembers = model.listMembers.filter((ii) => ii.isSelected);
      listMembers.forEach((ii) => {
        ii.id = Id++;
        ii.campaignId = model.campaignId;
        ii.message = model.message;
        ii.groudId = listGroups[0]["GroupId"];
      });

      listMembers = listMembers.map((member) => {
        let newMembers = {}; // Create a new object

        for (let key in member) {
          let newKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize key
          newMembers[newKey] = member[key]; // Assign the value to the new key
        }

        return newMembers;
      });

      if (listMembers.length <= 0) {
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Please choose valid Members"
        );
      }

      const isSavedMemberSuccess = await CampaignDetail.insertMany(listMembers);

      if (isSavedMemberSuccess.length <= 0) {
        throw new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to save Members. Try again!"
        );
      }

      // Insert new campaign
      // console.log("model: ,", model)
      // return;

      let updatedCampaignModel = {};
      for (let key in model) {
        if (key !== "listMembers" && key !== "listGroups") {
          updatedCampaignModel[key.charAt(0).toUpperCase() + key.slice(1)] =
            model[key];
        }
      }
      const createdCampaign = await new Campaign(updatedCampaignModel).save();
      if (!createdCampaign) {
        throw new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create. Try again!"
        );
      }

      response.status = "Success";
      response.message = "Added Successfully";
      // return res.status(StatusCodes.OK).json(response)
    } else {
      // Update existing campaign
      await Campaign.findOneAndUpdate({ CampaignId: model.CampaignId }, model);
      response.status = "Success";
      response.message = "Updated Successfully";
    }

    if (model.isExecute) {
      /**
       * Send emails to selected members
       *
       * */
      const membersToSendMail = model.listMembers.filter(
        (member) => member.isSelected
      );
      const from = process.env.NODEMAILER_EMAIL_USER;

      let to = "";
      let subject = model.campaignName;
      let html = model.message;
      let mailOption = {
        mailType: model.status, // it should be like immediately, schedules
        mailSendStartDate: model.fromDate,
        mailSendFinishDate: model.toDate,
        mailSendFinishTime: model.toTime,
      };

      let index = 0;
      for (const member of membersToSendMail) {
        index = index + 1;
        let email = member["emailId"].toLowerCase();
        if (membersToSendMail.length === index) {
          to += email;
        } else {
          to += email + ", ";
        }
      }

      const isSucessToSendMail = await sendMailService(
        from,
        to,
        subject,
        "I am text",
        html,
        mailOption
      );

      // Send emails to employees in selected groups
      // const selectedGroups = model.ListGroups.filter(
      //   (ii) => ii.IsSelected && ii.ReceiverType === "Employee"
      // );

      // for (const group of selectedGroups) {
      //   const members = await CommMembers.find({ GroupId: group.GroupId });
      //   for (const member of members) {
      //     const emp = await EmpMaster.findOne({ Empid: member.MemberId });
      //     if (emp) await sendMail(emp.Email, model.CampaignName, group.Message);
      //   }
      // }

      response.message = "Mail Sent!!";
      return res.status(StatusCodes.OK).json(response);
    }
  } catch (error) {
    console.log(error);
    const StatusCode = error.StatusCode;
    const msg = error.ErrorMessage || error.message;
    return next(new ApiErrorResponse(StatusCode, msg));
    // response.status = "Failed";
    // response.message = error.message;
    // return res.status(StatusCodes.BAD_REQUEST).json(response);
  }

  // return res.status(StatusCodes.OK).json(response);
}

//-------------DeleteCampaign-------->
async function DeleteCampaign(req, res) {
  try {
    const { Campaign, CampaignDetail } = await getTenantDBModels();

    const model = req.body;
    const response = { status: "Failed", message: "" };
    // const session = await mongoose.startSession();

    // session.startTransaction();

    // Check if CampaignId is used in CampaignDetail
    const cam = await CampaignDetail.findOne({ CampaignId: model.campaignId });
    // .session(session);
    if (cam) {
      response.status = "Failed";
      response.message =
        "Campaign Id is used in CampaignDetail, so it can't be deleted.";
      return res.status(StatusCodes.CONFLICT).json(response);
    }

    if (model.campaignId !== 0) {
      // Delete Campaign
      const campaign = await Campaign.findOne({ CampaignId: model.campaignId });
      // .session(session);
      if (campaign) {
        await Campaign.deleteOne({ CampaignId: model.campaignId });
        // .session(session);
      }

      // Delete CampaignDetails
      const campaignDetails = await CampaignDetail.find({
        CampaignId: model.campaignId,
      });
      // .session(session);
      if (campaignDetails.length > 0) {
        await CampaignDetail.deleteMany({ CampaignId: model.campaignId });
        // .session(session);
      }
    }

    // Commit Transaction
    // await session.commitTransaction();
    // session.endSession();

    response.status = "Success";
    response.message = "Deleted Successfully";
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    // Rollback Transaction on Error
    // await session.abortTransaction();
    // session.endSession();

    response.status = "Failed";
    response.message = error.message;
    return res.status(StatusCodes.BAD_REQUEST).json(response);
  }
}

//-------------GetCampaignTemplate-------->
async function GetCampaignTemplate(req, res) {
  try {
 
    const { CampaignTemplate } = await getTenantDBModels()

    let query = {};
    const {
      templateId,
      templateType,
      SMSTemplateID,
      pageNo = 1,
      pageSize = 10,
    } = req.body;
    if (templateId) query.TemplateId = templateId;
    if (templateType) query.TemplateType = templateType;
    if (SMSTemplateID) query.SMSTemplateID = SMSTemplateID;
    // Apply filtering dynamically using MongoDB query
    const campaignTemplateResult = await CampaignTemplate.find(query)
      .skip((pageNo - 1) * pageSize) // Pagination: Skip records
      .limit(pageSize)
      .select("-_id")
      .lean(); // Limit the number of results
    const data = formattedData(campaignTemplateResult);
    // Execute query to get the total count of documents

    const totalCount = data.length;

    return res.status(StatusCodes.OK).json(
      new CommonResponse(
        1,
        "Fetch Successfully",
        data,
        totalCount,
        pageNo,
        pageSize
      )

      //   {
      //   status: "Success",
      //   data: campaignTemplateResult,
      //   pageNo: pageNo,
      //   pageSize: pageSize,
      //   rowCount: totalCount,
      // }
    );
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------UpsertCampaignTemplate-------->
async function UpsertCampaignTemplate(req, res) {
  const model = req.body;
  const response = {
    status: "",
    message: "",
    data: model,
  };

  try {
    const { CampaignTemplate } = await getTenantDBModels();

    if (!model.template.trim().length > 0) {
      throw new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Please provide valid template message."
      );
    }
    if (model.templateId === 0) {
      // Check if the template already exists
      const existingTemplate = await CampaignTemplate.findOne({
        Template: model.template,
      });

      if (existingTemplate) {
        response.status = 0;
        response.message = "Record Already Exists!";
        response.data = existingTemplate;
        return res.status(StatusCodes.CONFLICT).json(response);
      }

      // Find the highest TemplateId and increment it
      const lastTemplate = await CampaignTemplate.findOne().sort({
        TemplateId: -1,
      });
      const newTemplateId = parseInt(lastTemplate?.TemplateId ?? 0) + 1;
      // return res.json({lastTemplate})

      // Create new CampaignTemplate with valid TemplateId
      const newTemplate = new CampaignTemplate({
        // TemplateId
        TemplateId: Number(newTemplateId),
        Template: model.template,
        TemplateType: model.templateType,
        SMSTemplateId: model.SMSTemplateId,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });
      const savedTemplate = await newTemplate.save();
      // console.log("newTemplate", savedTemplate);
      // const newSavedTemplate = await newTemplate.save();

      response.status = 1;
      response.message = "Add Successfully";
      response.data = savedTemplate;

      return res.status(StatusCodes.OK).json(response);
    } else {
      // Update existing CampaignTemplate
      const template = await CampaignTemplate.findOneAndUpdate(
        { TemplateId: model.templateId },
        {
          templateId: model.templateId,
          Template: model.template,
          TemplateType: model.templateType,
          SMSTemplateId: model.SMSTemplateId,
          CreatedBy: model.createdBy,
          UpdatedBy: model.updatedBy,
        },
        {
          returnOriginal: true,
        }
      );
      // return res.json(template)

      if (!template) {
        response.status = 0;
        response.message = "Template not found!";
        response.data = null;
        return res.status(StatusCodes.FORBIDDEN).json(response);
      }

      response.status = 1;
      response.message = "Update Successfully";
      response.data = template;

      return res.status(StatusCodes.OK).json(response);
    }
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST || error.StatusCode)
      .json(
        new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          error.message || error.ErrorMessage
        )
      );
  }
}

//-------------DeleteCampaignTemplate-------->
async function DeleteCampaignTemplate(req, res) {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    const { Campaign, CampaignTemplate } = await getTenantDBModels();

    const model = req.body;
    const response = { status: "", message: "" };

    const existingCampaign = await Campaign.findOne({
      TemplateId: model.templateId,
    });
    // .session(session);

    if (existingCampaign) {
      response.status = "Failed";
      response.message =
        "Template ID is used in a campaign, so it can't be deleted.";
      // await session.abortTransaction();
      // session.endSession();
      return res.status(StatusCodes.CONFLICT).json(response);
    }

    if (model.templateId) {
      let deletedTemplate = await CampaignTemplate.findOne({
        TemplateId: model.templateId,
      });

      // .session(session);
      if (!deletedTemplate) {
        response.status = "Failed";
        response.message = "Template not found.";
        // await session.abortTransaction();
        // session.endSession();
        return res.status(StatusCodes.OK).json(response);
      }

      deletedTemplate = await CampaignTemplate.deleteOne({
        TemplateId: model.templateId,
      });
      response.status = "Success";
      response.message = "Deleted successfully.";
      return res.status(StatusCodes.OK).json(response);
    }

    // await session.commitTransaction();
    // session.endSession();
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    // console.log(error);

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message));
  }
}

//-------------GetEventSetting-------->
async function GetEventSetting(req, res) {
  try {
    const { EventSetting } = await getTenantDBModels();

    const {
      eventId,
      eventName,
      eventType,
      sendingType,
      isActive,
      pageNo = 1,
      pageSize = 10,
    } = req.body;
    let query = {};
    // Apply dynamic filter and fetch event settings
    if (eventId) query.EventId = eventId;
    if (eventName) query.EventName = eventName;
    if (eventType) query.EventType = eventType;
    if (sendingType) query.SendingType = sendingType;
    if (isActive) query.IsActive = isActive;
    const eventSettings = await EventSetting.find(query)
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const newData = dotnetLikeData(eventSettings);

    return res.status(StatusCodes.OK).json(
      new CommonResponse(
        1,
        "Fetch Successfully",
        newData,
        eventSettings.length,
        pageNo,
        pageSize
      )
      //   {
      //   data: eventSettings,
      //   status: "Success",
      //   pageNo: pageNo,
      //   pageSize: pageSize,
      //   rowCount: eventSettings.length,
      // }
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      error: error.message,
    });
  }
}

//-------------UpsertEventSetting-------->
async function UpsertEventSetting(req, res) {
  try {
    const { EventSetting } = await getTenantDBModels();

    const model = req.body;
    if (model.eventId === 0) {
      const existingEvent = await EventSetting.findOne({
        EventName: model.eventName,
      });
      if (existingEvent) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            new ApiErrorResponse(
              StatusCodes.BAD_REQUEST,
              "Record Already Exists!"
            )
          );
      }

      const lastEvent = await EventSetting.findOne().sort({ EventId: -1 });
      model.eventId = (lastEvent?.EventId || 0) + 1;
      const newEvent = new EventSetting({
        EventId: model.eventId,
        EventName: model.eventName,
        EventType: model.eventType,
        SendingType: model.sendingType.toUpperCase(),
        Message: model.message,
        IsActive: model.isActive,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });
      await newEvent.save();
      return res
        .status(StatusCodes.OK)
        .json(new CommonResponse(1, "Added Successfully"));
    } else {
      await EventSetting.findOneAndUpdate(
        { EventId: model.eventId },
        {
          EventId: model.eventId,
          EventName: model.eventName,
          EventType: model.eventType,
          SendingType: model.sendingType.toUpperCase(),
          Message: model.message,
          IsActive: model.isActive,
          CreatedBy: model.createdBy,
          UpdatedBy: model.updatedBy,
        },
        { new: true }
      );
      return res
        .status(StatusCodes.OK)
        .json(new CommonResponse(1, "Updated Successfully"));
    }
  } catch (error) {
    const status = error.StatusCode;
    const msg = error.ErrorMessage || error.message;
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiErrorResponse(status, msg));
  }
}

//-------------DeleteEventSetting-------->
async function DeleteEventSetting(req, res) {
  try {
    const { EventSetting } = await getTenantDBModels();

    const model = req.body;
    if (!model.eventId) {
      return res
        .status(StatusCodes.NOT_MODIFIED)
        .json({ status: "Failed", message: "Invalid Event ID" });
    }

    const deletedEvent = await EventSetting.findOneAndDelete({
      EventId: model.eventId,
    });
    if (!deletedEvent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "Failed", message: "Event not found!" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ status: "Success", message: "Deleted Successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", error: error.message });
  }
}

//-------------GetMasters-------->
async function GetMasters(req, res, next) {
  const query = req.body;
  try {
    const {
      ZoneMaster,
      ItemTypeMaster,
      ItemCategoryMaster,
      UnitMaster,
      TaxMaster,EmpMaster,BrandMaster,FuelType,VehicleTypeMaster
    } = await getTenantDBModels();

    let mastersData = {};

    if (!query.list1 || query.list1.length === 0) {
      mastersData = {
        zone: await ZoneMaster.find().lean(),
        itemType: await ItemTypeMaster.find().lean(),
        itemCategory: await ItemCategoryMaster.find().lean(),
        unit: await UnitMaster.find().lean(),
        tax: await TaxMaster.find().lean(),
        emp: await EmpMaster.find().lean(),
        brand: await BrandMaster.find().lean(),
        fuel: await FuelType.find().lean(),
        vehicleType: await VehicleTypeMaster.find().lean(),
      };
    } else {
      mastersData.filtered = await ZoneMaster.find({
        someField: { $in: query.list1 },
      }).lean();
    }

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(true, StatusCodes.OK, "default", mastersData)
      );
  } catch (error) {
    const err = new Error(error.message);
    err.status = StatusCodes.BAD_REQUEST;
    return next(err);
    // return { status: "Failed", message: error.message };
  }
}

//-------------UpsertSmsSetting-------->
async function UpsertSmsSetting(req, res) {
  try {
    const { SmsSetting } = await getTenantDBModels();

  const model = req.body;

    await SmsSetting.updateMany({}, { $set: { IsActive: false } }); // Deactivate all
    await SmsSetting.findOneAndUpdate(
      { Id: model.Id },
      { $set: { IsActive: true } },
      { new: true }
    );
    return req
      .status(StatusCodes.OK)
      .json({ status: "Success", message: "Updated Successfully" });
  } catch (error) {
    return req
      .status(StatusCodes.OK)
      .json({ status: "Failed", error: error.message });
  }
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
  GetCampaign,
  UpsertCampaign,
  DeleteCampaign,
  GetCampaignTemplate,
  UpsertCampaignTemplate,
  DeleteCampaignTemplate,
  GetEventSetting,
  UpsertEventSetting,
  DeleteEventSetting,
  GetMasters,
  UpsertSmsSetting,
};
