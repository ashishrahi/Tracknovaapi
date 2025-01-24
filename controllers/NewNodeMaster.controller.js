

async function AddUpdateNewNodeMaster(req, res, next){
    try {
        const { id, Name } = req.body;

        // Validate if Name is provided
        if (!Name || Name.trim() === "") {
            return res.status(400).json({ IsSuccess: false, Mesg: "New Node Name Is Required" });
        }

        if (!id || id === -1) {
            // Get the max id from the collection and increment
            const lastNode = await NewNodeMaster.findOne().sort({ id: -1 })
            const newId = (lastNode?.id || 0) + 1;

            const newNode = new NewNodeMaster({ id: newId, Name });
            await newNode.save();

            return res.status(201).json({ IsSuccess: true, Mesg: "Successfully Added" });
        } else {
            // Update existing record
            const updatedNode = await NewNodeMaster.findOneAndUpdate(
                { id }, 
                { Name }, 
                { new: true, runValidators: true }
            );

            if (!updatedNode) {
                return res.status(404).json({ IsSuccess: false, Mesg: "Node not found!" });
            }

            return res.status(200).json({ IsSuccess: true, Mesg: "Successfully Updated" });
        }
    } catch (error) {
        return res.status(500).json({ IsSuccess: false, Mesg: error.message || "An error occurred" });
    }
}

export { AddUpdateNewNodeMaster };