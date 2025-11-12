const { query } = require('../database');
const model=require('../models/catalogModel')
exports.viewAllListings=async (req,res)=>
{
    try{
      const {kind,search,condition,sort,order}=req.query
        const request= await model.ViewItems(
          {
            kind,search,condition,sort,order
          }
        )
        if (!request) return res.status(404).json({ message: 'No Items Avaiable' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
exports.ViewOneItem=async(req,res)=>
{
  try{
    const id=Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid id parameter" });
    }
    const request=await model.ViewOneItem(id)
     if (!request) return res.status(404).json({ message: 'item not found or unavailable' });
    res.status(200).json(request);
  }
  catch(err){
     console.error(err);
    res.status(500).json({ error: err.message });
  }
}