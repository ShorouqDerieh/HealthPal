const model=require('../repositories/notificationPreferencesRepository')
exports.getMyPreferences=async(req,res)=>{
     try {
    const userId = req.user.id; 
    let prefs = await model.getByUserId(userId);
    if (!prefs) {
      prefs = {
        user_id: userId,
        email_enabled: 1,   
        sms_enabled: 0,     
        push_enabled: 0,   
        lang: 'ar',
      };
    }

    res.json({
      success: true,
      data: prefs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
exports.updateMyPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      email_enabled,
      sms_enabled,
      push_enabled,
      lang,
    } = req.body;
    const data = {
      email_enabled: email_enabled !== undefined ? !!email_enabled : true,
      sms_enabled: sms_enabled !== undefined ? !!sms_enabled : false,
      push_enabled: push_enabled !== undefined ? !!push_enabled : false,
      lang: lang || 'ar',
    };
    const updated = await model.upsert(userId, data);

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}