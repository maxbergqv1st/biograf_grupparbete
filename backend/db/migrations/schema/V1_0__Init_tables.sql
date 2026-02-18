CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        data JSON
    );

CREATE TABLE IF NOT EXISTS acl (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        userRoles VARCHAR(255) NOT NULL,
        method VARCHAR(50) NOT NULL DEFAULT 'GET',
        allow ENUM ('allow', 'disallow') NOT NULL DEFAULT 'allow',
        route VARCHAR(255) NOT NULL,
        `match` ENUM ('true', 'false') NOT NULL DEFAULT 'true',
        comment VARCHAR(500) NOT NULL DEFAULT '',
        UNIQUE KEY unique_acl (userRoles, method, route)
    );

CREATE TABLE IF NOT EXISTS users (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `first_name` VARCHAR(100) NOT NULL,
        `last_name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(254) UNIQUE NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(25),
        `role` VARCHAR(50) NOT NULL DEFAULT 'user',
        `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        quantity VARCHAR(50) NOT NULL,
        `price$` DECIMAL(10, 2) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        categories JSON NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    `sound_system` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `system_name` VARCHAR(50) NOT NULL,
        `description` text NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    `hall_type` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `type` ENUM (
            'Standard',
            'IMAX',
            '4DX',
            'Dolby Cinema',
            'iSense',
            '3D'
        ) NOT NULL DEFAULT 'Standard',
        `description` text NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    `hall` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(100) NOT NULL,
        `type` INT NOT NULL,
        `row_count` INT NOT NULL,
        `sound_system` INT NOT NULL,
        `screen_size` SMALLINT NOT NULL,
        FOREIGN KEY (`sound_system`) REFERENCES `sound_system` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`type`) REFERENCES `hall_type` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `hall_row_config` (
        `hall_id` INT NOT NULL,
        `name` VARCHAR(10) NOT NULL,
        `number_of_seats` INT NOT NULL, -- Added manually by admin
        PRIMARY KEY (`hall_id`, `name`),
        FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `seat_type` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `name` ENUM (
            'Standard',
            'Premium',
            'VIP',
            'Handicap',
            'Recliner'
        ) NOT NULL DEFAULT 'Standard',
        `surcharge` decimal(10, 2) DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS
    `seat` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `hall_id` INT,
        `row_name` VARCHAR(10) NOT NULL,
        `number_in_row` INT NOT NULL,
        `type` INT NOT NULL,
        UNIQUE `unique_seat_id` (`hall_id`, `row_name`, `number_in_row`),
        FOREIGN KEY (`hall_id`, `row_name`) REFERENCES `hall_row_config` (`hall_id`, `name`) ON DELETE CASCADE,
        FOREIGN KEY (`type`) REFERENCES `seat_type` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `movie_language` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `movie_lang_enum` ENUM ('Svenska', 'Engelska') NOT NULL,
        `movie_lang_short_enum` ENUM ('Sv', 'En') NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    `genre` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `name` ENUM (
            'Action',
            'Äventyr',
            'Komedi',
            'Drama',
            'Skräck',
            'Science Fiction',
            'Thriller',
            'Fantasy',
            'Romantik',
            'Western',
            'Krig',
            'Musikal',
            'Dokumentär',
            'Animerat'
        ) NOT NULL
    );

CREATE TABLE IF NOT EXISTS
    `movie` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `description_short` VARCHAR(255) NOT NULL,
        `description` text NOT NULL,
        `duration_minutes` INT NOT NULL,
        `age_rating` ENUM ('B', '7', '11', '15') NOT NULL,
        `director` VARCHAR(255) NOT NULL,
        `release_date` DATE NOT NULL,
        `language` INT NOT NULL,
        `poster` varchar(100),
        FOREIGN KEY (`language`) REFERENCES `movie_language` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `movie_genre` (
        `movie_id` INT NOT NULL,
        `genre_id` INT NOT NULL,
        PRIMARY KEY (`movie_id`, `genre_id`),
        FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `screening` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `movie_id` INT NOT NULL,
        `hall_id` INT NOT NULL,
        `start_time` datetime NOT NULL,
        `end_time` datetime NOT NULL,
        `base_price` decimal(10, 2) DEFAULT 100,
        FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `booking` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `user_id` INT,
        `email` VARCHAR(254) NOT NULL,
        `screening_id` INT NOT NULL,
        `booking_date` datetime DEFAULT current_timestamp,
        `total_price` decimal(10, 2) DEFAULT 0,
        `status` ENUM ('pending', 'accepted', 'cancelled') NOT NULL default 'pending',
        `booking_reference` VARCHAR(50) UNIQUE NOT NULL,
        FOREIGN KEY (`screening_id`) REFERENCES `screening` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `price_category_seat` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `category` ENUM ('Adult', 'Child', 'Senior', 'Student', 'Handicap') NOT NULL,
        `discount_modifier` decimal(5, 2) DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS
    `booking_seat` (
        `booking_id` INT NOT NULL,
        `seat_id` INT NOT NULL,
        `price_category_seat_id` INT NOT NULL,
        `final_price` decimal(10, 2) NOT NULL,
        PRIMARY KEY (`booking_id`, `seat_id`),
        FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`price_category_seat_id`) REFERENCES `price_category_seat` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `payment` (
        `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
        `booking_id` INT NOT NULL,
        `payment_method` VARCHAR(50) NOT NULL,
        `amount` decimal(10, 2) NOT NULL,
        `status` ENUM ('pending', 'accepted', 'declined'),
        `created` datetime DEFAULT current_timestamp,
        FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `seat_ghost` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `screening_id` INT NOT NULL,
        `seat_id` INT NOT NULL,
        `session_id` VARCHAR(255) NOT NULL,
        /* ?? session id för vem som reserverat ?? */
        `reserved_at` datetime DEFAULT current_timestamp,
        `expires_at` datetime NOT NULL,
        FOREIGN KEY (`screening_id`) REFERENCES `screening` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    `snacks` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(100) NOT NULL,
        `description` text NOT NULL,
        `price` decimal(10, 2) NOT NULL
    );