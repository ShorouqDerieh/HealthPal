const { query } = require('../database');
const model=require('../repositories/catalogRepository')
exports.viewAllListings=async (req,res)=>
{
    try{
       if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Missing or invalid token" });
    } 
      const {kind,search,condition,sort,order}=req.query
        const request= await model.viewItems(
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
    const request=await model.viewOneItem(id)
     if (!request) return res.status(404).json({ message: 'item not found or unavailable' });
    res.status(200).json(request);
  }
  catch(err){
     console.error(err);
    res.status(500).json({ error: err.message });
  }
}
exports.addNewItem=async(req,res)=>{
  try{
    const item={
      inventory_item_id: req.body.inventory_item_id,
      lister_type: req.body.lister_type,
      status: req.body.status||"Availabile",
      created_at:new Date(),
      lister_user_id:req.user.id
    }
    const request=await model.addItem(item);
     if (!request) return res.status(404).json({ message: "Can't add item !" });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  }