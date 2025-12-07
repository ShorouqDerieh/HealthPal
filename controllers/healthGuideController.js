const HealthGuide=require('../models/healthGuideModel')
exports.getAllGuides=async(req,res)=>{
try{
    const category=req.query.category
    const search=req.query.search
    const guide=await HealthGuide.getAll({category,search})
    res.json(guide)
}
 catch(err)
 {
    console.error(err);
    res.status(500).json({ error: err.message });
 }
}
exports.getGuideById=async(req,res)=>{
    try{
   const guide=await HealthGuide.getCustomGuideById(req.params.id)
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    return res.json(guide);
    }
    catch(err){
        console.error(err);
    res.status(500).json({ error: err.message });
    }
}
exports.createGuide=async(req,res)=>{
    try{
        if (!req.body.title || !req.body.body_html || !req.body.category) {
      return res.status(400).json({
        message: 'title, body_html and category are required'
      });
    }
    const author_user_id = req.user.id;
    //console.log('REQ.USER = ', req.user.id);
    const title=req.body.title
    const body_html=req.body.body_html
    const category=req.body.category
    const lang=req.body.lang
    const guide=await HealthGuide.addNewArticle({title,body_html,category,lang,author_user_id})
    return res.status(201).json(guide);
}
    catch(err){
        console.error(err);
    res.status(500).json({ error: err.message });
    }
}
    exports.editGuide=async(req,res)=>{
        try{
            const available=await HealthGuide.getCustomGuideById(req.params.id)
             if (!available) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    const title=req.body.title
    const body_html=req.body.body_html
    const category=req.body.category
    const lang=req.body.lang
        if (
      req.body.title === undefined &&
      req.body.body_html === undefined &&
      req.body.category === undefined &&
      req.bodylang === undefined
    ) {
      return res.status(400).json({
        message: 'At least one of title, body_html, category, lang is required to update'
      });
    }
    const update=await HealthGuide.updateArticle(req.params.id,{title,
      body_html,
      category,
      lang})
      return res.json(update);
        }
         catch(err){
        console.error(err);
    res.status(500).json({ error: err.message });
    }
    }

    exports.deleteGuide=async(req,res)=>{
        try{
        const available=await HealthGuide.getCustomGuideById(req.params.id)
             if (!available) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    const deleted=await HealthGuide.deleteArticle(req.params.id)
     if (!deleted) {
      return res.status(500).json({ message: "Failed to delete guide" });
    }
     return res.status(204).send(); 
        }
        catch(err){
             console.error(err);
    res.status(500).json({ error: err.message });
        }
    }