const db=require('../database')
class HealthGuide{
    static async getAll({category,search}={})
    {
        const params=[]
        let sql=`SELECT * FROM articles WHERE 1`
        let countSql = `SELECT COUNT(*) AS total FROM articles WHERE 1`;
        if(category)
        {
            sql+=` AND category=?`
            countSql+=` AND category=?`
            params.push(category)
        }
        if(search){
            sql += ' AND (title LIKE ? OR body_html LIKE ?)';
              countSql += ' AND (title LIKE ? OR body_html LIKE ?)';
             params.push(`%${search}%`,`%${search}%`)
        }
         const [rows] = await db.query(sql, params );
         const [countRows] = await db.query(countSql, params);
           const total = countRows[0].total;
        return {total,rows};
    }
    static async getCustomGuideById(id){
        const sql="SELECT * FROM articles WHERE id=?"
        const [rows]=await db.query(sql,[id])
        return rows[0]||null
    }
    static async addNewArticle({ title, body_html, category, lang = 'ar', author_user_id  }){
        const sql=`INSERT INTO articles (title, body_html, lang, category, published_at, author_user_id)
      VALUES (?, ?, ?, ?, NOW(), ?)`;
      const [result]=await db.query(sql,[title,body_html,lang,category,author_user_id])
        return this.getCustomGuideById(result.insertId);
    }
    static async updateArticle(id,{ title, body_html, category, lang }={}){
        const conditions = [];
        const params = [];
        if(title)
        {
           conditions.push('title = ?');
            params.push(title);
        }
        if(body_html)
        {
            conditions.push('body_html = ?');
            params.push(body_html);
        }
        if(category){
             conditions.push('category = ?');
            params.push(category);
        }
        if(lang)
        {
            conditions.push('lang = ?');
            params.push(lang);
        }
         if (!conditions.length) {
        return this.getCustomGuideById(id);
  }
        const sql=`UPDATE articles SET ${conditions.join(', ')} WHERE id=?`
        params.push(id)
        await db.query(sql,params)
          return this.getCustomGuideById(id);
    }

    static async deleteArticle(id){
        const sql=`DELETE FROM articles WHERE id=?`
        const [results]=await db.query(sql,[id])
        return results.affectedRows>0;
    }
}
module.exports=HealthGuide