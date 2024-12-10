const pool = require('./db').pool;

module.exports = {
    createOrUpdateBookRating: function(userId, isbn, rating){
        if(rating >= 0 && rating <= 10){
            return pool.query(`INSERT INTO ratings (user_id, isbn, rating) VALUES (?,?,?)
                ON DUPLICATE KEY UPDATE rating = ?, updated_at = current_timestamp`,
                [userId, isbn, rating, rating], function(err, results, fields){
                    if(err) throw err;
                    return results;
            });
        }else{
            throw Error("Invalid Rating");
        }
    }
}