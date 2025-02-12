import { Node } from "../../modals/index.js";
import formattedData from '../dotnet-like-format/dotnetLikeData.js'


//////////////////////////////////////////////////  AddUpdateNewNodeMasterQuery //////////////////////////////////////////////////////////////////


export const AddUpdateNewNodeMasterQuery = async (modal) => {
   
  try {
    let { nodeId, nodeName,parentId,displayNo,location,icon } = modal;

    if (!nodeId || nodeId === 0) {
      // Get the highest nodeId
      const lastNode = await Node.findOne().sort({ NodeId: -1 });
      nodeId = (lastNode?.NodeId || 0) + 1;

      const newNode = new Node({
        NodeId:nodeId, 
        NodeName: nodeName,
        ParentId: parentId,
        DisplayNo: displayNo,
        Icon:icon,
        Location: location,
      });
      await newNode.save();

      return { 
             status: 1, 
             message: "Add Successfully", 
             data: newNode 
            }
    } else {
      // Update existing node
      const updatedNode = await Node.findOneAndUpdate(
        {NodeId: nodeId }, 
        {
          NodeName: nodeName, 
          ParentId: parentId, 
          Icon:icon,
          DisplayNo: displayNo,
          NodeLocation: displayNo, 
          Location:location, 
        }, 
        { new: true, upsert: true } // Create if not found
      );

      return { 
        status: 1, 
        message: "Successfully Updated", 
        data: updatedNode 
      };
    }
  } catch (error) {
    return { 
        status: 0, 
        message: error.message };
  }
}

//////////////////////////////////////////////////  GetAllNodesQuery //////////////////////////////////////////////////////////////////

export const GetAllNodesQuery = async (modal) => {

    try {
        const nodes = await Node.find().sort({ NodeName: 1 }).select("-_id").lean();
        const allNodes = formattedData(nodes)
        return{
            status: 1,
            message: 'List of nodes fetched successfully',
            data:allNodes ,
        }
      } catch (error) {
        return{
            status: 0,
            message: error.message,
        }
      }
}

//////////////////////////////////////////////////  GetAllNodesQuery //////////////////////////////////////////////////////////////////

export const DeleteNodeQuery = async (modal) => {
    try {
        const { nodeId } = modal;
        if (!nodeId) {
            return { 
                status: 0, 
                message: "NodeId is required" };
        }

        const entity = await Node.findOne({NodeId:nodeId});
        console.log("entity", entity);
        if (!entity) {
            return { 
                status: 0, 
                message: "Node not found" };
        }

        await Node.findOneAndDelete({NodeId:nodeId})

        return { 
             status: 1,
             message: "Deleted successfully", 
             };
    } catch (error) {
        return { 
            status: "Failed",
             message: error.message };
    }
   
}