const { query } = require('../database');
const model=require('../models/catalogModel')
exports.viewAllListings=async (req,res)=>
{
    try{
      const {kind,search,condition}=req.query
        const request= await model.ViewItems(
          {
            kind,search,condition
          }
        )
        if (!request) return res.status(404).json({ message: 'No Items Avaiable' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}