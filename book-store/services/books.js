const pool = require('./db').pool;

module.exports = {
    selectBySearchTerm: async function(query){
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM books WHERE title like ? or author like ? or publisher like ? order by publication_year desc limit 36`,
                [`%${query}%`,`%${query}%`,`%${query}%`],
                function (err, results, fields) {
                    if(err)reject(err);
                    resolve(results);
                }
            );
        });
    },
    
    selectByISBN: async function(isbn){
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                    b.isbn, 
                    b.title, 
                    b.author, 
                    b.publication_year, 
                    b.publisher, 
                    b.image_url, 
                    avg(r.rating) as avg_rating, 
                    count(r.id) as votes  
                FROM books b 
                LEFT JOIN ratings r ON b.isbn = r.isbn 
                WHERE b.isbn = ? 
                GROUP BY 1,2,3,4,5,6
                LIMIT 1`,
                [isbn],
                function (err, results, fields) {
                    if(err)reject(err);

                    if(results.length > 0)resolve(results[0]);
                    reject(new Error("Book not found"));
                }
            );
        });
    },

    selectBestRated: async function(){
        return new Promise((resolve, reject) => {
            pool.query(
                `
                SELECT 
                    b.* 
                FROM books b
                WHERE 
                    isbn IN (SELECT isbn FROM best_rating_books ORDER BY score DESC)
                ORDER BY publication_year DESC
                LIMIT 36`,
                function (err, results, fields) {
                    if(err)reject(err);
                    resolve(results);
                }
            );
        });
    },

    selectByISBNList: async function(isbns){
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM books WHERE isbn in (?) limit 10`,
                [isbns],
                function (err, results, fields) {
                    if(err)reject(err);
                    resolve(results);
                }
            );
        });
    },
}
