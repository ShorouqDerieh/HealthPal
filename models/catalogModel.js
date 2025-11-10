const db=require('../database')
class Catalog{
    static async ViewItems(){
        const sql=`SELECT * FROM listings WHERE status='AVAILABLE'`
        const [rows]=await db.query(sql)
        return rows
    }
}
module.exports=Catalog