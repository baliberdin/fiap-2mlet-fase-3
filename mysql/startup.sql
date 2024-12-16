CREATE USER book_store@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON book_store.* TO book_store;

USE book_store;

CREATE TABLE `books` (
    `isbn` varchar(255) primary key not null,
    `title` longtext not null,
    `author` text default null,
    `publication_year` smallint default null,
    `publisher` varchar(255) default null,
    `image_url` varchar(1000) default null,
    `category` varchar(1000) default null
);

CREATE TABLE `users` (
    `id` bigint primary key auto_increment not null,
    `username` varchar(255) default null,
    `password` varchar(62) default null,
    UNIQUE KEY `un_user` (`username`)
);

CREATE TABLE `ratings` (
    `id` bigint primary key auto_increment not null,
    `user_id` bigint not null,
    `isbn` varchar(255) not null,
    `rating` tinyint not null,
    `created_at` datetime not null default current_timestamp,
    `updated_at` datetime not null default current_timestamp,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`isbn`) REFERENCES `books`(`isbn`) ON DELETE CASCADE,
    CONSTRAINT `un_rating` UNIQUE(`user_id`, `isbn`),
    INDEX indx_rating_created_at (`created_at`),
    INDEX indx_rating_updated_at (`created_at`)
);

CREATE TABLE `best_rating_books` (
    `isbn` varchar(255) primary key not null,
    `vote_values` bigint not null,
    `votes` bigint not null,
    `score` double default null
);

INSERT INTO `best_rating_books`
SELECT 
    isbn, 
    sum(rating) as vote_values, 
    count(1) as votes, 
    avg(rating) as score 
FROM ratings 
GROUP BY 1 
HAVING votes > 20 
ORDER BY 4 DESC
LIMIT 100;

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