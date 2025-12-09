const db=require('../database')
class Catalog{
    //all items and search by filter or without
    static async viewItems({ kind = null,search='',condition=null,sort='name',order='asc'} = {}){
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
        const allowedSort=['name','expiration_date','created_at'];
         if (!allowedSort.includes(sort)) {
            sort = 'name';}
            order = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
            sql+=` ORDER BY ${sort} ${order}`;
        try{
            console.log('SORT SQL:', sort, order);
        const [rows]=await db.query(sql,params)
        return rows
    }
catch(err){
    console.error("Error in Catalog.ViewItems:", err.message);
    throw new Error("Database error while fetching catalog items");
}
}

static async viewOneItem(id){
    let sql = `
  SELECT
    listings.id                     AS listing_id,
    listings.lister_type,
    listings.status,
    inventory_items.name,
    inventory_items.kind,
    inventory_items.form_factor,
    inventory_items.dosage_or_specs,
    inventory_items.expiration_date,
    inventory_items.\`condition\`    AS \`condition\`,
    inventory_items.quantity,
    inventory_items.\`unit\`         AS \`unit\`,
    inventory_items.org_id,
    organizations.id                AS org_id,
    organizations.name              AS org_name,
    organizations.type              AS org_type,
    organizations.verified_at       AS org_verified_at,
    DATEDIFF(inventory_items.expiration_date, CURRENT_DATE) AS days_to_expiry
  FROM listings
  JOIN inventory_items
    ON listings.inventory_item_id = inventory_items.id
  JOIN organizations
    ON inventory_items.org_id = organizations.id
  WHERE listings.status = 'AVAILABLE'
    AND listings.id = ?
    AND (inventory_items.expiration_date IS NULL
         OR DATE(inventory_items.expiration_date) >= CURDATE())
    AND inventory_items.quantity > 0
  LIMIT 1
`;
try{
        const [rows]=await db.query(sql,[id])
        return rows[0]||null
    }
catch(err){
    console.error("Error in Catalog.ViewItem:", err.message);
    throw new Error("Item not found");
}
}


static async addItem(item){
    let sql=`INSERT INTO listings(inventory_item_id,lister_type,status,created_at,lister_user_id)
    VALUES(?,?,?,?,?)`
    const params=[item.inventory_item_id,item.lister_type,item.status,item.created_at,item.lister_user_id];
    const [result] = await db.query(sql, params);
    return result.insertId
}
static async editStatus(id,status){
    const sql= `UPDATE listings SET status = ? WHERE id = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result.affectedRows > 0;
}
}
module.exports=Catalog