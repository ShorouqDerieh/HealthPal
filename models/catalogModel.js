const db=require('../database')
class Catalog{
    //all items and search by filter or without
    static async ViewItems({ kind = null,search='',condition=null} = {}){
         let sql=`SELECT listings.id as listing_id,
         listings.lister_type,
         listings.status,
         inventory_items.name,
         inventory_items.kind,
         inventory_items.form_factor,
         inventory_items.dosage_or_specs,
         inventory_items.expiration_date,
        inventory_items.condition,
        inventory_items.quantity,
        inventory_items.unit,
        inventory_items.org_id
        FROM listings JOIN inventory_items 
        ON listings.inventory_item_id=inventory_items.id
        WHERE listings.status='AVAILABLE'
        AND (inventory_items.expiration_date IS NULL OR inventory_items.expiration_date >= CURDATE())
         `;
        const params=[]
        if(kind){
            sql+=` AND inventory_items.kind=?`
            params.push(kind)
        }
        if(condition){
            sql+=` AND inventory_items.condition=?`
            params.push(condition)
        }
        if(search){
            sql+=` AND inventory_items.name LIKE ?`
            params.push(`%${search}%`)
        }
        const [rows]=await db.query(sql,params)
        return rows
    }
}
module.exports=Catalog