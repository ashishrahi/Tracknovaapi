import mongoose from "mongoose";

export const MenuSchema = new mongoose.Schema({
    'MenuId':Number,
    "MenuName":String,
    "ParentId":Number,
    "PageUrl":String,
    "Icon":String,
    "DisplayNo":Number,
    "IsMenu":Boolean,
    "IsAdd":Boolean,
    "IsEdit":Boolean,
    "IsDel":Boolean,
    "IsView":Boolean,
    "IsPrint":Boolean,
    "IsExport":Boolean,
    "IsRelease":Boolean,
    "IsPost":Boolean,
    },{collection:'Menu'})
    
 export const Menu = mongoose.model('Menu',MenuSchema)