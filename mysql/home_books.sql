USE book_store;

TRUNCATE TABLE `best_rating_books`; 
INSERT INTO `best_rating_books`
SELECT 
    isbn, 
    sum(rating) as vote_values, 
    count(1) as votes, 
    avg(rating) score 
FROM ratings 
GROUP BY 1 
HAVING votes > 50 
ORDER BY 4 DESC
LIMIT 100;