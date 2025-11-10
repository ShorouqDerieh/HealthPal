const model=require('../models/catalogModel')
exports.viewAllListings=async (req,res)=>
{
    try{
        const request= await model.ViewItems()
        if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}