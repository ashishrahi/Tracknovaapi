import { StatusCodes } from "http-status-codes";

export function GetPeriods(req, res, next){
    let periods = [];
    const model = req.query;
    console.log(model)
    if (model.daysOnly === "false" && model.type === "Period") {
        periods = [
            { index: 1, startDate: new Date(Date.now() - 3600000), endDate: new Date(), daysOnly: false, displayLabel: "Last 1 Hour" },
            { index: 2, startDate: new Date(Date.now() - 2 * 3600000), endDate: new Date(), daysOnly: false, displayLabel: "Last 2 Hours" },
            { index: 3, startDate: new Date(Date.now() - 8 * 3600000), endDate: new Date(), daysOnly: false, displayLabel: "Last 8 Hours" },
            { index: 4, startDate: new Date(Date.now() - 12 * 3600000), endDate: new Date(), daysOnly: false, displayLabel: "Last 12 Hours" },
            { index: 5, startDate: new Date().setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Today" },
            { index: 6, startDate: new Date(Date.now() - 86400000).setHours(0, 0, 0, 0), endDate: new Date(Date.now() - 86400000).setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Yesterday" },
            { index: 7, startDate: new Date(Date.now() - 7 * 86400000).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 1 Week" },
            { index: 8, startDate: new Date(Date.now() - 15 * 86400000).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 15 Days" },
            { index: 9, startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 1 Month" },
            { index: 10, startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 2 Months" }
        ];
    } else {
        periods = [
            { index: 1, startDate: new Date(Date.now() - 86400000).setHours(0, 0, 0, 0), endDate: new Date(Date.now() - 86400000).setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Yesterday" },
            { index: 2, startDate: new Date(Date.now() - 7 * 86400000).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 1 Week" },
            { index: 3, startDate: new Date(Date.now() - 15 * 86400000).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 15 Days" },
            { index: 4, startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 1 Month" },
            { index: 5, startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).setHours(0, 0, 0, 0), endDate: new Date().setHours(23, 59, 59, 999), daysOnly: true, displayLabel: "Last 2 Months" }
        ];
    }

    // Adding Custom Period
    // if(model.type.trim() && model.type.trim() !== ""){
    //     periods.push({ index: 6, daysOnly: false, displayLabel: model.type });
    // }
  

    return res.status(StatusCodes.OK).json(periods);
}

