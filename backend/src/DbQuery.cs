namespace WebApp;

public static class DbQuery
{
    // Setup the database connection from config
    private static string connectionString;

    // JSON columns for _CONTAINS_ validation
    public static Arr JsonColumns = Arr(new[] { "categories" });

    public static bool IsJsonColumn(string column) => JsonColumns.Includes(column);

    static DbQuery()
    {
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
        );
        var configJson = File.ReadAllText(configPath);
        var config = JSON.Parse(configJson);

        connectionString =
            $"Server={config.host};Port={config.port};Database={config.database};" +
            $"User={config.username};Password={config.password};";

        var db = new MySqlConnection(connectionString);
        db.Open();

        // Create tables if they don't exist
        if (config.createTablesIfNotExist == true)
        {
            CreateTablesIfNotExist(db);
        }

        // Seed data if tables are empty
        if (config.seedDataIfEmpty == true)
        {
            SeedDataIfEmpty(db);
        }

        db.Close();
    }

    private static void CreateTablesIfNotExist(MySqlConnection db)
    {
        var createTablesSql = @"
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
                allow ENUM('allow', 'disallow') NOT NULL DEFAULT 'allow',
                route VARCHAR(255) NOT NULL,
                `match` ENUM('true', 'false') NOT NULL DEFAULT 'true',
                comment VARCHAR(500) NOT NULL DEFAULT '',
                UNIQUE KEY unique_acl (userRoles, method, route)
            );

            CREATE TABLE IF NOT EXISTS users (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `first_name` VARCHAR(100) NOT NULL,
                `last_name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(254) UNIQUE NOT NULL,
                `password` VARCHAR(255) NOT NULL,
                `phone` VARCHAR(25),
                `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
                `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
                `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS refresh_tokens (
                token_hash VARCHAR(64) PRIMARY KEY NOT NULL,
                user_id INT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS email_verifications (
                token VARCHAR(64) PRIMARY KEY NOT NULL,
                user_id INT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                token VARCHAR(64) PRIMARY KEY NOT NULL,
                user_id INT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                is_used BOOLEAN NOT NULL DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `sound_systems` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `system_name` VARCHAR(50) NOT NULL,
                `description` text NOT NULL
            );

            CREATE TABLE IF NOT EXISTS `hall_types` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `type` ENUM ('Standard', 'IMAX', '4DX', 'Dolby Cinema', 'iSense', '3D') NOT NULL DEFAULT 'Standard',
                `description` text NOT NULL
            );

            CREATE TABLE IF NOT EXISTS `halls` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(100) NOT NULL,
                `type` INT NOT NULL,
                `row_count` INT NOT NULL,
                `sound_system` INT NOT NULL,
                `screen_size` SMALLINT NOT NULL,
                FOREIGN KEY (`sound_system`) REFERENCES `sound_systems` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`type`) REFERENCES `hall_types` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `hall_row_configs` (
                `hall_id` INT NOT NULL,
                `name` VARCHAR(10) NOT NULL,
                `number_of_seats` INT NOT NULL,
                PRIMARY KEY (`hall_id`, `name`),
                FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `seat_types` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` ENUM ('Standard', 'Premium', 'VIP', 'Handicap', 'Recliner') NOT NULL DEFAULT 'Standard',
                `surcharge` decimal(10,2) DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS `seats` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `hall_id` INT,
                `row_name` VARCHAR(10) NOT NULL,
                `number_in_row` INT NOT NULL,
                `type` INT NOT NULL,
                UNIQUE `unique_seat_id` (`hall_id`, `row_name`, `number_in_row`),
                FOREIGN KEY (`hall_id`,`row_name`) REFERENCES `hall_row_configs` (`hall_id`, `name`) ON DELETE CASCADE,
                FOREIGN KEY (`type`) REFERENCES `seat_types` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `movie_languages` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(100) NOT NULL UNIQUE,
                `code` VARCHAR(10) NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS `genres` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(100) NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS `movies` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `title` VARCHAR(255) NOT NULL,
                `original_title` VARCHAR(255) NULL,
                `tagline` VARCHAR(255) NOT NULL,
                `description` text NOT NULL,
                `description_short` varchar(255) NOT NULL,
                `duration` INT NOT NULL,
                `age_rating` ENUM ('B', '7', '11', '15') NOT NULL,
                `director` VARCHAR(255) NOT NULL,
                `release_date` DATE NOT NULL,
                `language_id` INT NOT NULL,
                `poster_url` VARCHAR(255),
                `image_small_url` VARCHAR(255),
                `image_large_url` VARCHAR(255),
                `image_xl_url` VARCHAR(255),
                `trailer_url` VARCHAR(255),
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (`language_id`) REFERENCES `movie_languages` (`id`) ON DELETE CASCADE
            );

            
            CREATE TABLE IF NOT EXISTS `movie_genres` (
                `movie_id` INT NOT NULL,
                `genre_id` INT NOT NULL,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`movie_id`, `genre_id`),
                FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `actors` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(100) NOT NULL UNIQUE,
                image_url varchar(255)
            );

            CREATE TABLE IF NOT EXISTS `movie_actors` (
                `movie_id` INT NOT NULL,
                `actor_id` INT NOT NULL,
                `character_name` VARCHAR(100) NOT NULL,
                `cast_order` INT NOT NULL DEFAULT 0,
                FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`actor_id`) REFERENCES `actors` (`id`) ON DELETE CASCADE,
                PRIMARY KEY (`movie_id`, `actor_id`)
            );

            CREATE TABLE IF NOT EXISTS `screenings` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `movie_id` INT NOT NULL,
                `hall_id` INT NOT NULL,
                `start_time` datetime NOT NULL,
                `end_time` datetime NOT NULL,
                `base_price` decimal(10,2) DEFAULT 100,
                FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `bookings` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `user_id` INT,
                `email` VARCHAR(254),
                `screening_id` INT NOT NULL,
                `booking_date` datetime DEFAULT current_timestamp,
                `total_price` decimal(10,2) DEFAULT 0,
                `status` ENUM ('pending', 'accepted', 'cancelled') NOT NULL default 'accepted',
                `booking_reference` VARCHAR(50) UNIQUE NOT NULL,
                FOREIGN KEY (`screening_id`) REFERENCES `screenings` (`id`),
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)  ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `price_category_seats` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `category` ENUM ('Adult', 'Child', 'Senior', 'Student', 'Handicap') NOT NULL,
                `discount_modifier` decimal(5,2) DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS `booking_seats` (
                `booking_id` INT NOT NULL,
                `seat_id` INT NOT NULL,
                `price_category_seat_id` INT NOT NULL,
                `final_price` decimal(10,2) NOT NULL,
                PRIMARY KEY (`booking_id`, `seat_id`),
                FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`price_category_seat_id`) REFERENCES `price_category_seats` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `payments` (
                `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
                `booking_id` INT NOT NULL,
                `payment_method` VARCHAR(50) NOT NULL,
                `amount` decimal(10,2) NOT NULL,
                `status` ENUM ('pending', 'accepted', 'declined'),
                `created` datetime DEFAULT current_timestamp,
                FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `seat_ghosts` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `screening_id` INT NOT NULL,
                `seat_id` INT NOT NULL,
                `session_id` VARCHAR(255) NOT NULL, /* ?? session id för vem som reserverat ?? */
                `reserved_at` datetime DEFAULT current_timestamp,
                `expires_at` datetime NOT NULL,
                FOREIGN KEY (`screening_id`) REFERENCES `screenings` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `snacks` (
            `id` INT PRIMARY KEY AUTO_INCREMENT,
            `name` VARCHAR(100) NOT NULL,
            `description` text NOT NULL,
            `price` decimal(10,2) NOT NULL
            );  
        ";

        // Execute each statement separately
        foreach (var sql in createTablesSql.Split(';'))
        {
            var trimmed = sql.Trim();
            if (!string.IsNullOrEmpty(trimmed))
            {
                var command = db.CreateCommand();
                command.CommandText = trimmed;
                command.ExecuteNonQuery();
            }
        }
    }

    private static void SeedDataIfEmpty(MySqlConnection db)
    {
        // Check if tables are empty and seed if needed
        var command = db.CreateCommand();

        // Seed ACL rules
        command.CommandText = "SELECT COUNT(*) FROM acl";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var aclData = @"
                INSERT INTO acl (userRoles, method, allow, route, `match`, comment) VALUES
                ('visitor, user', 'GET', 'disallow', '/secret.html', 'true', 'No access to /secret.html for visitors and normal users'),
                ('visitor,user, admin', 'GET', 'allow', '/api', 'false', 'Allow access to all routes not starting with /api'),
                ('visitor', 'POST', 'allow', '/api/users', 'true', 'Allow registration as new user for visitors'),
                ('visitor, user,admin', '*', 'allow', '/api/login', 'true', 'Allow access to all login routes'),
                ('admin', '*', 'allow', '/api/users', 'true', 'Allow admins to see and edit users'),
                ('admin', '*', 'allow', '/api/sessions', 'true', 'Allow admins to see and edit sessions'),
                ('admin', '*', 'allow', '/api/acl', 'true', 'Allow admins to see and edit acl rules'),
                ('visitor,user,admin', 'GET', 'allow', '/api/products', 'true', 'Allow all user roles to read products');
            ";
            command.CommandText = aclData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM users";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var usersData = @"       
            INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`) VALUES
            ('Erik', 'Andersson', 'erik.andersson@email.se', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', '+46701234567', 'admin'),
            ('Anna', 'Svensson', 'anna.svensson@email.se', '$2y$10$bcdefghijklmnopqrstuvwxyz1234567', '+46702345678', 'user'),
            ('Lars', 'Johansson', 'lars.johansson@email.se', '$2y$10$cdefghijklmnopqrstuvwxyz12345678', '+46703456789', 'user'),
            ('Maria', 'Karlsson', 'maria.karlsson@email.se', '$2y$10$defghijklmnopqrstuvwxyz123456789', '+46704567890', 'user'),
            ('Johan', 'Nilsson', 'johan.nilsson@email.se', '$2y$10$efghijklmnopqrstuvwxyz1234567890', '+46705678901', 'user');
            ";
            command.CommandText = usersData;
            command.ExecuteNonQuery();
        }


        command.CommandText = "SELECT COUNT(*) FROM sound_systems";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var sound_systemData = @"
                INSERT INTO `sound_systems` (`system_name`, `description`) VALUES
                    ('Dolby Atmos', 'Premium 3D surround sound with overhead speakers'),
                    ('DTS:X', 'Object-based immersive audio technology'),
                    ('Dolby Digital 7.1', 'Standard surround sound system'),
                    ('IMAX Enhanced', 'Enhanced audio for IMAX presentations');
            ";
            command.CommandText = sound_systemData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM hall_types";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hall_typeData = @"    
                INSERT INTO `hall_types` (`type`, `description`) VALUES
                ('Standard', 'Traditional cinema hall with standard seating'),
                ('IMAX', 'Large format screen with premium image quality'),
                ('4DX', 'Motion seats with environmental effects'),
                ('Dolby Cinema', 'Premium experience with Dolby Vision and Atmos'),
                ('3D', '3D projection capability');
            ";
            command.CommandText = hall_typeData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM halls";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hallData = @" 
                INSERT INTO `halls` (`name`, `type`, `row_count`, `sound_system`, `screen_size`) VALUES
                ('Stora Salongen', 1, 8, 1, 400),
                ('Lilla Salongen', 1, 6, 1, 500);
            ";
            command.CommandText = hallData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM hall_row_configs";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hallRowConfigData = @"
                INSERT INTO `hall_row_configs` (`hall_id`, `name`, `number_of_seats`) VALUES
                (1, 'A', 8), (1, 'B', 9), (1, 'C', 10), (1, 'D', 10),
                (1, 'E', 10), (1, 'F', 10), (1, 'G', 12), (1, 'H', 12),
                (2, 'A', 6), (2, 'B', 8), (2, 'C', 9), (2, 'D', 10),
                (2, 'E', 10), (2, 'F', 12);
            ";
            command.CommandText = hallRowConfigData;
            command.ExecuteNonQuery();
        }


        command.CommandText = "SELECT COUNT(*) FROM seat_types";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seat_typeData = @"
                INSERT INTO `seat_types` (`name`, `surcharge`) VALUES
                ('Standard', 0.00),
                ('Premium', 20.00),
                ('VIP', 50.00),
                ('Handicap', 0.00),
                ('Recliner', 35.00);
            ";
            command.CommandText = seat_typeData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM seats";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seatData = @"
                INSERT INTO `seats` (`hall_id`, `row_name`, `number_in_row`, `type`) VALUES
                (1, 'A', 1, 1),(1, 'A', 2, 1),(1, 'A', 3, 1),(1, 'A', 4, 1),(1, 'A', 5, 1),(1, 'A', 6, 1),(1, 'A', 7, 1),(1, 'A', 8, 1),
                (1, 'B', 1, 1),(1, 'B', 2, 1),(1, 'B', 3, 1),(1, 'B', 4, 1),(1, 'B', 5, 1),(1, 'B', 6, 1),(1, 'B', 7, 1),(1, 'B', 8, 1),(1, 'B', 9, 1),
                (1, 'C', 1, 1),(1, 'C', 2, 1),(1, 'C', 3, 1),(1, 'C', 4, 1),(1, 'C', 5, 1),(1, 'C', 6, 1),(1, 'C', 7, 1),(1, 'C', 8, 1),(1, 'C', 9, 1),(1, 'C', 10, 1),
                (1, 'D', 1, 1),(1, 'D', 2, 1),(1, 'D', 3, 1),(1, 'D', 4, 1),(1, 'D', 5, 1),(1, 'D', 6, 1),(1, 'D', 7, 1),(1, 'D', 8, 1),(1, 'D', 9, 1),(1, 'D', 10, 1),
                (1, 'E', 1, 1),(1, 'E', 2, 1),(1, 'E', 3, 1),(1, 'E', 4, 1),(1, 'E', 5, 1),(1, 'E', 6, 1),(1, 'E', 7, 1),(1, 'E', 8, 1),(1, 'E', 9, 1),(1, 'E', 10, 1),
                (1, 'F', 1, 1),(1, 'F', 2, 1),(1, 'F', 3, 1),(1, 'F', 4, 1),(1, 'F', 5, 1),(1, 'F', 6, 1),(1, 'F', 7, 1),(1, 'F', 8, 1),(1, 'F', 9, 1),(1, 'F', 10, 1),
                (1, 'G', 1, 1),(1, 'G', 2, 1),(1, 'G', 3, 1),(1, 'G', 4, 1),(1, 'G', 5, 1),(1, 'G', 6, 1),(1, 'G', 7, 1),(1, 'G', 8, 1),(1, 'G', 9, 1),(1, 'G', 10, 1),(1, 'G', 11, 1),(1, 'G', 12, 1),
                (1, 'H', 1, 1),(1, 'H', 2, 1),(1, 'H', 3, 1),(1, 'H', 4, 1),(1, 'H', 5, 1),(1, 'H', 6, 1),(1, 'H', 7, 1),(1, 'H', 8, 1),(1, 'H', 9, 1),(1, 'H', 10, 1),(1, 'H', 11, 1),(1, 'H', 12, 1),
                (2, 'A', 1, 1),(2, 'A', 2, 1),(2, 'A', 3, 1),(2, 'A', 4, 1),(2, 'A', 5, 1),(2, 'A', 6, 1),
                (2, 'B', 1, 1),(2, 'B', 2, 1),(2, 'B', 3, 1),(2, 'B', 4, 1),(2, 'B', 5, 1),(2, 'B', 6, 1),(2, 'B', 7, 1),(2, 'B', 8, 1),
                (2, 'C', 1, 1),(2, 'C', 2, 1),(2, 'C', 3, 1),(2, 'C', 4, 1),(2, 'C', 5, 1),(2, 'C', 6, 1),(2, 'C', 7, 1),(2, 'C', 8, 1),(2, 'C', 9, 1),
                (2, 'D', 1, 1),(2, 'D', 2, 1),(2, 'D', 3, 1),(2, 'D', 4, 1),(2, 'D', 5, 1),(2, 'D', 6, 1),(2, 'D', 7, 1),(2, 'D', 8, 1),(2, 'D', 9, 1),(2, 'D', 10, 1),
                (2, 'E', 1, 1),(2, 'E', 2, 1),(2, 'E', 3, 1),(2, 'E', 4, 1),(2, 'E', 5, 1),(2, 'E', 6, 1),(2, 'E', 7, 1),(2, 'E', 8, 1),(2, 'E', 9, 1),(2, 'E', 10, 1),
                (2, 'F', 1, 1),(2, 'F', 2, 1),(2, 'F', 3, 1),(2, 'F', 4, 1),(2, 'F', 5, 1),(2, 'F', 6, 1),(2, 'F', 7, 1),(2, 'F', 8, 1),(2, 'F', 9, 1),(2, 'F', 10, 1),(2, 'F', 11, 1),(2, 'F', 12, 1);
            ";
            command.CommandText = seatData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM movie_languages";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var movie_languageData = @"
            INSERT INTO `movie_languages` (`name`, `code`) VALUES
            ('Svenska', 'sv'),
            ('Engelska', 'en');
            ";
            command.CommandText = movie_languageData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM genres";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var genreData = @"
            INSERT INTO `genres` (`name`) VALUES
            ('Action'), ('Äventyr'), ('Komedi'), ('Drama'), ('Skräck'),
            ('Science Fiction'), ('Thriller'), ('Fantasy'), ('Romantik'),
            ('Western'), ('Krig'), ('Musikal'), ('Dokumentär'), ('Animerat');
            ";
            command.CommandText = genreData;
            command.ExecuteNonQuery();
        }

command.CommandText = "SELECT COUNT(*) FROM movies";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var moviesData = @"
        INSERT INTO `movies` (`title`, `original_title`, `tagline`, `description`, `description_short`, `duration`, `age_rating`, `director`, `release_date`, `language_id`, `poster_url`, `image_small_url`, `image_large_url`, `image_xl_url`, `trailer_url`) VALUES
        ('The Truman Show', NULL, 'Truman börjar ana att hela hans liv är en TV-show.', 'Truman Burbank lever ett till synes perfekt liv i småstaden Seahaven, men börjar misstänka att allt runt honom är iscensatt och att alla människor han möter är skådespelare i en TV-produktion.', 'En man inser att hans hela liv är en TV-show.', 103, '11', 'Peter Weir', '1998-06-05', 1, 'https://res.cloudinary.com/dveubqvv8/image/upload/v1773154407/THEYRUMANSHOW_yawyis.jpg', NULL, NULL, NULL, 'https://www.youtube.com/watch?v=dlnmQbPGuls'),
        ('Darkest Hour', NULL, 'Churchill måste fatta ödesbeslut under andra världskrigets mörkaste dagar.', 'I maj 1940 står Storbritannien inför hotet från Nazityskland. Den nyutnämnde premiärministern Winston Churchill tvingas välja mellan förhandling med Hitler eller fortsatt kamp mot övermakten.', 'Churchill tvingas välja mellan fred och krig under andra världskriget.', 125, '11', 'Joe Wright', '2017-12-22', 1, 'https://res.cloudinary.com/dveubqvv8/image/upload/v1773154059/DARKESTHOUR_fp37ul.jpg', NULL, NULL, NULL, 'https://www.youtube.com/watch?v=LtJ60u7SUSw'),
        ('Fight Club', NULL, 'En sömnlös kontorsslav startar en hemlig slagsmålsklubb.', 'En utbränd kontorsarbetare träffar den karismatiske Tyler Durden och de startar en underjordisk fight club där män slåss för att känna sig levande. Snart växer det till en farlig, anarkistisk rörelse han tappar kontrollen över.', 'En utbränd man startar en underjordisk slagsmålsklubb med ödesdigra konsekvenser.', 139, '15', 'David Fincher', '1999-10-15', 1, 'https://res.cloudinary.com/dveubqvv8/image/upload/v1773154059/FIGHTCLUB_xnsmd6.jpg', NULL, NULL, NULL, 'https://www.youtube.com/watch?v=dfeUzm6KF4g&t'),
        ('The Brothers Grimsby', NULL, 'En MI6-agent tvingas samarbeta med sin totalt hopplösa bror.', 'Nobby, en smått korkad fotbollshuligan med nio barn, återförenas med sin sedan länge försvunne bror Sebastian – som visar sig vara toppagent inom MI6. Tillsammans försöker de stoppa en global komplott på sitt väldigt kaotiska sätt.', 'En MI6-agent tvingas samarbeta med sin kaotiska storebror för att rädda världen.', 83, '15', 'Louis Leterrier', '2016-02-24', 1, 'https://res.cloudinary.com/dveubqvv8/image/upload/v1773153981/filmer/24/poster.jpg', NULL, NULL, NULL, 'https://www.youtube.com/watch?v=wtKUQw492xU'),
        ('Dune: Part Two', NULL, 'Episkt science fiction-äventyr', 'Paul Atreides förenas med Chani och Fremen medan han söker hämnd mot de konspirationer som förstörde hans familj. I mötet med valet mellan sitt livs kärlek och universums öde måste han förhindra en fruktansvärd framtid som bara han kan förutse.', 'Paul Atreides kämpar för hämnd och universums öde bland Fremen på Arrakis.', 166, '11', 'Denis Villeneuve', '2024-02-28', 2, 'filmer/1/poster_61b5883d5d9d47309b3ed97c470db25e', NULL, NULL, NULL, NULL),
        ('The Super Mario Bros. Movie', NULL, 'Animerat äventyr med Mario och Luigi', 'Medan Mario och Luigi arbetar för att rädda Brooklyn måste de resa genom kungadömet av svampar för att rädda Prinsessan Peach från den elake Bowser.', 'Mario och Luigi äventyrar genom svampriket för att rädda prinsessan från Bowser.', 92, 'B', 'Aaron Horvath', '2023-04-05', 2, 'filmer/3/poster_3a2d9f26479348ddbe20c03359377b0c', NULL, NULL, NULL, NULL),
        ('Barbie', NULL, 'Färgglad komedi om ikonisk docka', 'Barbie och Ken har den perfekta tiden i det färgglada och till synes perfekta Barbie Land. Men när de får chansen att uppleva den verkliga världen upptäcker de både glädjen och riskerna med att leva bland människor.', 'Barbie och Ken lämnar Barbie Land och upptäcker den verkliga världens glädje och kaos.', 114, '7', 'Greta Gerwig', '2023-07-21', 2, 'filmer/4/poster_8060f85491b54e56b37bfc2b18f76acb', NULL, NULL, NULL, NULL),
        ('Wonka', NULL, 'Musikaliskt ursprungsäventyr', 'Berättelsen om hur en ung Willy Wonka träffade Oompa-Loompas på ett av sina tidigaste äventyr.', 'Den unge Willy Wonka tar sina första steg mot att bli världens mest älskade chokladmakare.', 116, '7', 'Paul King', '2023-12-15', 2, 'filmer/5/poster_33f8974ab4d74d7bb4ed1187b686fe9b', NULL, NULL, NULL, NULL),
        ('Oppenheimer', NULL, 'Biografiskt drama om atombombens fader', 'Berättelsen om den amerikanske teoretiske fysikern J. Robert Oppenheimer och hans roll i utvecklingen av atombomben.', 'Den geniale fysikern J. Robert Oppenheimer leder skapandet av historiens mest destruktiva vapen.', 180, '11', 'Christopher Nolan', '2023-07-21', 2, 'filmer/9/poster_b93bdd17f2144420bfe36b0137f9ede1', NULL, NULL, NULL, NULL);
    ";
    command.CommandText = moviesData;
    command.ExecuteNonQuery();
}

command.CommandText = "SELECT COUNT(*) FROM movie_genres";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var movieGenreData = @"
        INSERT INTO `movie_genres` (`movie_id`, `genre_id`) VALUES
        (1, 4),  (1, 6),  (1, 7),
        (2, 4),  (2, 7),  (2, 11),
        (3, 1),  (3, 4),  (3, 7),
        (4, 1),  (4, 3),
        (5, 1),  (5, 2),  (5, 6),
        (6, 2),  (6, 3),  (6, 14),
        (7, 2),  (7, 3),  (7, 8),
        (8, 3),  (8, 8),  (8, 12),
        (9, 4),  (9, 7),  (9, 11);
    ";
    command.CommandText = movieGenreData;
    command.ExecuteNonQuery();
}

command.CommandText = "SELECT COUNT(*) FROM actors";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var actorData = @"
        INSERT INTO `actors` (`id`, `name`, `image_url`) VALUES
        (1,  'Billy Connolly',       '/images/actors/billy_connolly.jpg'),
        (2,  'Brad Pitt',            '/images/actors/brad_pitt.jpg'),
        (3,  'Chris Kattan',         '/images/actors/chris_kattan.jpg'),
        (4,  'Colin Quinn',          '/images/actors/colin_quinn.jpg'),
        (5,  'Dot Marie Jones',      '/images/actors/dot_marie_jones.jpg'),
        (6,  'Ed Harris',            '/images/actors/ed_harris.jpg'),
        (7,  'Ed Norton',            '/images/actors/ed_norton.jpg'),
        (8,  'Gary Oldman',          '/images/actors/gary_oldman.jpg'),
        (9,  'Helena Bonham Carter', '/images/actors/helena_bonham_carter.jpg'),
        (10, 'Isla Fisher',          '/images/actors/isla_fisher.jpg'),
        (11, 'Jared Leto',           '/images/actors/jared_leto.jpg'),
        (12, 'Jim Carrey',           '/images/actors/jim_carrey.jpg'),
        (13, 'Kristin Scott Thomas', '/images/actors/kristin_scott_thomas.jpg'),
        (14, 'Laura Linney',         '/images/actors/laura_linney.jpg'),
        (15, 'Lilly James',          '/images/actors/lilly_james.jpg'),
        (16, 'Mark McKinney',        '/images/actors/mark_mckinney.jpg'),
        (17, 'Mark Strong',          '/images/actors/mark_strong.jpg'),
        (18, 'Meat Loaf',            '/images/actors/meat_loaf.jpg'),
        (19, 'Molly Shannon',        '/images/actors/molly_shannon.jpg'),
        (20, 'Natascha McElhone',    '/images/actors/natascha_mcelhone.jpg'),
        (21, 'Noah Emmerich',        '/images/actors/noah_emmerich.jpg'),
        (22, 'Norman Reedus',        '/images/actors/norman_reedus.jpg'),
        (23, 'Penelope Cruz',        '/images/actors/penelope_cruz.jpg'),
        (24, 'Rebel Wilson',         '/images/actors/rebel_wilson.jpg'),
        (25, 'Ronald Pickup',        '/images/actors/ronald_pickup.jpg'),
        (26, 'Sacha Baron Cohen',    '/images/actors/sacha_baron_cohen.jpg'),
        (27, 'Sean Patrick',         '/images/actors/sean_patrick.jpg'),
        (28, 'Stephen Dillane',      '/images/actors/stephen_dillane.jpg'),
        (29, 'Will Ferrell',         '/images/actors/will_ferrell.jpg'),
        (30, 'Willem Dafoe',         '/images/actors/willem_dafoe.jpg'),
        (31, 'Timothée Chalamet',    '/images/actors/timothee_chalamet.jpg'),
        (32, 'Zendaya',              '/images/actors/zendaya.jpg'),
        (33, 'Rebecca Ferguson',     '/images/actors/rebecca_ferguson.jpg'),
        (34, 'Josh Brolin',          '/images/actors/josh_brolin.jpg'),
        (35, 'Austin Butler',        '/images/actors/austin_butler.jpg'),
        (36, 'Chris Pratt',          '/images/actors/chris_pratt.jpg'),
        (37, 'Charlie Day',          '/images/actors/charlie_day.jpg'),
        (38, 'Anya Taylor-Joy',      '/images/actors/anya_taylor_joy.jpg'),
        (39, 'Jack Black',           '/images/actors/jack_black.jpg'),
        (40, 'Keegan-Michael Key',   '/images/actors/keegan_michael_key.jpg'),
        (41, 'Margot Robbie',        '/images/actors/margot_robbie.jpg'),
        (42, 'Ryan Gosling',         '/images/actors/ryan_gosling.jpg'),
        (43, 'America Ferrera',      '/images/actors/america_ferrera.jpg'),
        (44, 'Kate McKinnon',        '/images/actors/kate_mckinnon.jpg'),
        (45, 'Issa Rae',             '/images/actors/issa_rae.jpg'),
        (46, 'Hugh Grant',           '/images/actors/hugh_grant.jpg'),
        (47, 'Olivia Colman',        '/images/actors/olivia_colman.jpg'),
        (48, 'Calah Lane',           '/images/actors/calah_lane.jpg'),
        (49, 'Cillian Murphy',       '/images/actors/cillian_murphy.jpg'),
        (50, 'Emily Blunt',          '/images/actors/emily_blunt.jpg'),
        (51, 'Matt Damon',           '/images/actors/matt_damon.jpg'),
        (52, 'Robert Downey Jr.',    '/images/actors/robert_downey_jr.jpg'),
        (53, 'Florence Pugh',        '/images/actors/florence_pugh.jpg');
    ";
    command.CommandText = actorData;
    command.ExecuteNonQuery();
}

command.CommandText = "SELECT COUNT(*) FROM movie_actors";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var movieActorData = @"
        INSERT INTO `movie_actors` (`movie_id`, `actor_id`, `character_name`, `cast_order`) VALUES
        (1, 12, 'Truman Burbank',       1),
        (1, 6,  'Christof',             2),
        (1, 14, 'Meryl / Hannah Gill',  3),
        (1, 21, 'Marlon',              4),
        (1, 20, 'Lauren / Sylvia',      5),
        (2, 8,  'Winston Churchill',    1),
        (2, 13, 'Clementine Churchill', 2),
        (2, 15, 'Elizabeth Layton',     3),
        (2, 28, 'Viscount Halifax',     4),
        (2, 25, 'Neville Chamberlain',  5),
        (3, 2,  'Tyler Durden',         1),
        (3, 7,  'Narrator',             2),
        (3, 9,  'Marla Singer',         3),
        (3, 18, 'Robert Paulsen',       4),
        (3, 11, 'Angel Face',           5),
        (4, 26, 'Nobby Butcher',        1),
        (4, 17, 'Sebastian Butcher',    2),
        (4, 10, 'Jodie Figgis',         3),
        (4, 24, 'Dawn Grobham',         4),
        (4, 23, 'Rhonda George',        5),
        (5, 31, 'Paul Atreides',        1),
        (5, 32, 'Chani',                2),
        (5, 33, 'Lady Jessica',         3),
        (5, 34, 'Gurney Halleck',       4),
        (5, 35, 'Feyd-Rautha',          5),
        (6, 36, 'Mario',                1),
        (6, 37, 'Luigi',                2),
        (6, 38, 'Princess Peach',       3),
        (6, 39, 'Bowser',               4),
        (6, 40, 'Toad',                 5),
        (7, 41, 'Barbie',               1),
        (7, 42, 'Ken',                  2),
        (7, 43, 'Gloria',               3),
        (7, 44, 'Weird Barbie',         4),
        (7, 45, 'President Barbie',     5),
        (8, 31, 'Willy Wonka',          1),
        (8, 46, 'Oompa Loompa',         2),
        (8, 47, 'Mrs. Scrubbit',        3),
        (8, 48, 'Noodle',               4),
        (8, 40, 'Chief of Police',      5),
        (9, 49, 'J. Robert Oppenheimer',1),
        (9, 50, 'Katherine Oppenheimer',2),
        (9, 51, 'Leslie Groves',        3),
        (9, 52, 'Lewis Strauss',        4),
        (9, 53, 'Jean Tatlock',         5);
    ";
    command.CommandText = movieActorData;
    command.ExecuteNonQuery();
}
        
command.CommandText = "SELECT COUNT(*) FROM screenings";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var screeningData = @"
        INSERT INTO `screenings` (`movie_id`, `hall_id`, `start_time`, `end_time`, `base_price`) VALUES
        (1, 1, '2026-04-01 21:00:00', '2026-04-01 22:43:00', 150.00),
        (1, 2, '2026-04-02 21:00:00', '2026-04-02 22:43:00', 150.00),
        (1, 1, '2026-04-08 18:00:00', '2026-04-08 19:43:00', 100.00),
        (1, 2, '2026-04-15 18:00:00', '2026-04-15 19:43:00', 100.00),
        (2, 1, '2026-04-03 21:00:00', '2026-04-03 23:05:00', 150.00),
        (2, 2, '2026-04-04 21:00:00', '2026-04-04 23:05:00', 150.00),
        (2, 2, '2026-04-09 18:00:00', '2026-04-09 20:05:00', 100.00),
        (2, 1, '2026-04-16 18:00:00', '2026-04-16 20:05:00', 100.00),
        (3, 1, '2026-04-05 21:00:00', '2026-04-05 23:19:00', 150.00),
        (3, 2, '2026-04-06 21:00:00', '2026-04-06 23:19:00', 150.00),
        (3, 1, '2026-04-10 18:00:00', '2026-04-10 20:19:00', 100.00),
        (3, 2, '2026-04-17 18:00:00', '2026-04-17 20:19:00', 100.00),
        (4, 1, '2026-04-07 21:00:00', '2026-04-07 22:23:00', 150.00),
        (4, 2, '2026-04-08 21:00:00', '2026-04-08 22:23:00', 150.00),
        (4, 2, '2026-04-11 18:00:00', '2026-04-11 19:23:00', 100.00),
        (4, 1, '2026-04-18 18:00:00', '2026-04-18 19:23:00', 100.00),
        (5, 1, '2026-04-09 21:00:00', '2026-04-09 23:46:00', 150.00),
        (5, 2, '2026-04-10 21:00:00', '2026-04-10 23:46:00', 150.00),
        (5, 1, '2026-04-12 18:00:00', '2026-04-12 20:46:00', 100.00),
        (5, 2, '2026-04-19 18:00:00', '2026-04-19 20:46:00', 100.00),
        (6, 1, '2026-04-11 21:00:00', '2026-04-11 22:32:00', 150.00),
        (6, 2, '2026-04-12 21:00:00', '2026-04-12 22:32:00', 150.00),
        (6, 2, '2026-04-13 17:00:00', '2026-04-13 18:32:00', 100.00),
        (6, 2, '2026-04-15 17:00:00', '2026-04-15 18:32:00', 100.00),
        (6, 2, '2026-04-17 17:00:00', '2026-04-17 18:32:00', 100.00),
        (6, 2, '2026-04-19 17:00:00', '2026-04-19 18:32:00', 100.00),
        (6, 2, '2026-04-21 17:00:00', '2026-04-21 18:32:00', 100.00),
        (6, 2, '2026-04-23 17:00:00', '2026-04-23 18:32:00', 100.00),
        (6, 2, '2026-04-25 17:00:00', '2026-04-25 18:32:00', 100.00),
        (6, 2, '2026-04-27 17:00:00', '2026-04-27 18:32:00', 100.00),
        (6, 2, '2026-04-29 18:00:00', '2026-04-29 19:32:00', 100.00),
        (6, 2, '2026-05-01 18:00:00', '2026-05-01 19:32:00', 100.00),
        (7, 1, '2026-04-13 21:00:00', '2026-04-13 22:54:00', 150.00),
        (7, 2, '2026-04-14 21:00:00', '2026-04-14 22:54:00', 150.00),
        (7, 2, '2026-04-16 17:00:00', '2026-04-16 18:54:00', 100.00),
        (7, 2, '2026-04-18 17:00:00', '2026-04-18 18:54:00', 100.00),
        (7, 2, '2026-04-20 17:00:00', '2026-04-20 18:54:00', 100.00),
        (7, 2, '2026-04-22 17:00:00', '2026-04-22 18:54:00', 100.00),
        (7, 2, '2026-04-24 17:00:00', '2026-04-24 18:54:00', 100.00),
        (7, 2, '2026-04-26 17:00:00', '2026-04-26 18:54:00', 100.00),
        (7, 2, '2026-04-28 17:00:00', '2026-04-28 18:54:00', 100.00),
        (7, 2, '2026-04-30 17:00:00', '2026-04-30 18:54:00', 100.00),
        (7, 2, '2026-05-02 18:00:00', '2026-05-02 19:54:00', 100.00),
        (7, 2, '2026-05-04 18:00:00', '2026-05-04 19:54:00', 100.00),
        (8, 1, '2026-04-14 21:00:00', '2026-04-14 22:56:00', 150.00),
        (8, 2, '2026-04-15 21:00:00', '2026-04-15 22:56:00', 150.00),
        (8, 1, '2026-04-20 18:00:00', '2026-04-20 19:56:00', 100.00),
        (8, 2, '2026-04-22 18:00:00', '2026-04-22 19:56:00', 100.00),
        (9, 1, '2026-04-16 21:00:00', '2026-04-17 00:00:00', 150.00),
        (9, 2, '2026-04-17 21:00:00', '2026-04-18 00:00:00', 150.00),
        (9, 1, '2026-04-23 18:00:00', '2026-04-23 21:00:00', 100.00),
        (9, 2, '2026-04-24 18:00:00', '2026-04-24 21:00:00', 100.00);
    ";
    command.CommandText = screeningData;
    command.ExecuteNonQuery();
}

        command.CommandText = "SELECT COUNT(*) FROM price_category_seats";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var priceCategorySeatData = @"
            INSERT INTO `price_category_seats` (`category`, `discount_modifier`) VALUES
            ('Adult', 0.00),
            ('Child', 0.50),
            ('Senior', 0.70),
            ('Student', 0.80),
            ('Handicap', 0.70);
        ";
            command.CommandText = priceCategorySeatData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM bookings";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var bookingData = @"
        INSERT INTO `bookings` (`id`, `user_id`, `email`, `screening_id`, `booking_date`, `total_price`, `status`, `booking_reference`) VALUES
        (1,  1,    'erik.andersson@email.se',  49, '2026-03-20 10:00:00', 300.00, 'accepted',  'BK-2026-001'),
        (2,  2,    'anna.svensson@email.se',   1,  '2026-03-20 11:00:00', 450.00, 'accepted',  'BK-2026-002'),
        (3,  3,    'lars.johansson@email.se',  33, '2026-03-20 12:00:00', 450.00, 'accepted',  'BK-2026-003'),
        (4,  4,    'maria.karlsson@email.se',  23, '2026-03-20 09:00:00', 150.00, 'accepted',  'BK-2026-004'),
        (5,  5,    'johan.nilsson@email.se',   5,  '2026-03-20 13:00:00', 300.00, 'accepted',  'BK-2026-005'),
        (6,  NULL, 'test.user1@test.se',       9,  '2026-03-20 14:00:00', 600.00, 'accepted',  'BK-2026-006'),
        (7,  NULL, 'test.user2@test.se',       21, '2026-03-21 09:00:00', 450.00, 'accepted',  'BK-2026-007'),
        (8,  NULL, 'test.user3@test.se',       35, '2026-03-21 10:00:00', 200.00, 'accepted',  'BK-2026-008'),
        (9,  NULL, 'test.user4@test.se',       13, '2026-03-21 11:00:00', 300.00, 'accepted',  'BK-2026-009'),
        (10, NULL, 'test.user5@test.se',       17, '2026-03-22 09:00:00', 150.00, 'accepted',  'BK-2026-010'),
        (11, NULL, 'test.user6@test.se',       45, '2026-03-22 10:00:00', 300.00, 'accepted',  'BK-2026-011'),
        (12, NULL, 'test.user7@test.se',       3,  '2026-03-22 11:00:00', 200.00, 'cancelled', 'BK-2026-012'),
        (13, NULL, 'test.user8@test.se',       11, '2026-03-22 12:00:00', 300.00, 'cancelled', 'BK-2026-013'),
        (14, NULL, 'test.user9@test.se',       7,  '2026-03-23 09:00:00', 200.00, 'accepted',  'BK-2026-014'),
        (15, NULL, 'test.user10@test.se',      19, '2026-03-23 10:00:00', 300.00, 'accepted',  'BK-2026-015'),
        (16, NULL, NULL,                       25, '2026-03-23 11:00:00', 150.00, 'accepted',  'BK-2026-016'),
        (17, NULL, NULL,                       37, '2026-03-24 09:00:00', 150.00, 'accepted',  'BK-2026-017'),
        (18, NULL, 'test.user11@test.se',      2,  '2026-03-20 10:00:00', 300.00, 'accepted',  'BK-2026-018'),
        (19, NULL, 'test.user12@test.se',      6,  '2026-03-21 09:00:00', 300.00, 'accepted',  'BK-2026-019'),
        (20, NULL, 'test.user13@test.se',      10, '2026-03-21 11:00:00', 450.00, 'accepted',  'BK-2026-020'),
        (21, NULL, 'test.user14@test.se',      14, '2026-03-22 09:00:00', 375.00, 'accepted',  'BK-2026-021'),
        (22, NULL, 'test.user15@test.se',      18, '2026-03-22 11:00:00', 300.00, 'accepted',  'BK-2026-022'),
        (23, NULL, 'test.user16@test.se',      22, '2026-03-23 09:00:00', 300.00, 'accepted',  'BK-2026-023'),
        (24, NULL, 'test.user17@test.se',      34, '2026-03-23 11:00:00', 450.00, 'accepted',  'BK-2026-024'),
        (25, NULL, 'test.user18@test.se',      46, '2026-03-24 09:00:00', 450.00, 'accepted',  'BK-2026-025'),
        (26, NULL, 'test.user19@test.se',      50, '2026-03-24 11:00:00', 300.00, 'accepted',  'BK-2026-026'),
        (27, NULL, 'test.user20@test.se',      4,  '2026-03-25 09:00:00', 200.00, 'cancelled', 'BK-2026-027'),
        (28, NULL, 'test.user21@test.se',      8,  '2026-03-25 11:00:00', 300.00, 'accepted',  'BK-2026-028'),
        (29, NULL, 'test.user22@test.se',      1,  '2026-03-25 13:00:00', 300.00, 'accepted',  'BK-2026-029'),
        (30, NULL, 'test.user23@test.se',      47, '2026-03-26 10:00:00', 250.00, 'accepted',  'BK-2026-030');
    ";
    command.CommandText = bookingData;
    command.ExecuteNonQuery();
}

        command.CommandText = "SELECT COUNT(*) FROM booking_seats";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var bookingSeatData = @"
        INSERT INTO `booking_seats` (`booking_id`, `seat_id`, `price_category_seat_id`, `final_price`) VALUES
        (1,  1,   1, 150.00), (1,  2,   1, 150.00),
        (2,  3,   1, 150.00), (2,  4,   1, 150.00), (2,  5,   1, 150.00),
        (3,  6,   1, 150.00), (3,  7,   1, 150.00), (3,  8,   2, 75.00),  (3,  9,   2, 75.00),
        (4,  82,  2, 50.00),  (4,  83,  2, 50.00),  (4,  84,  2, 50.00),
        (5,  10,  1, 150.00), (5,  11,  1, 150.00),
        (6,  12,  1, 150.00), (6,  13,  1, 150.00), (6,  14,  1, 150.00), (6,  15,  1, 150.00),
        (7,  16,  1, 150.00), (7,  17,  1, 150.00), (7,  18,  2, 75.00),  (7,  19,  2, 75.00),
        (8,  85,  2, 50.00),  (8,  86,  2, 50.00),  (8,  87,  2, 50.00),  (8,  88,  2, 50.00),
        (9,  20,  1, 150.00), (9,  21,  1, 150.00),
        (10, 22,  1, 150.00),
        (11, 23,  1, 150.00), (11, 24,  1, 150.00),
        (12, 25,  1, 100.00), (12, 26,  1, 100.00),
        (13, 27,  1, 100.00), (13, 28,  1, 100.00), (13, 29,  1, 100.00),
        (14, 89,  1, 100.00), (14, 90,  1, 100.00),
        (15, 30,  1, 100.00), (15, 31,  1, 100.00), (15, 32,  1, 100.00),
        (16, 91,  1, 100.00), (16, 92,  2, 50.00),
        (17, 93,  1, 100.00), (17, 94,  2, 50.00),  (17, 95,  2, 50.00),
        (18, 96,  1, 150.00), (18, 97,  1, 150.00),
        (19, 98,  1, 150.00), (19, 99,  1, 150.00),
        (20, 100, 1, 150.00), (20, 101, 1, 150.00), (20, 102, 1, 150.00),
        (21, 103, 1, 150.00), (21, 104, 1, 150.00), (21, 105, 2, 75.00),
        (22, 106, 1, 150.00), (22, 107, 1, 150.00),
        (23, 108, 1, 150.00), (23, 109, 2, 75.00),  (23, 110, 2, 75.00),
        (24, 111, 1, 150.00), (24, 112, 1, 150.00), (24, 113, 2, 75.00),  (24, 114, 2, 75.00),
        (25, 115, 1, 150.00), (25, 116, 1, 150.00), (25, 117, 1, 150.00),
        (26, 118, 1, 150.00), (26, 119, 1, 150.00),
        (27, 120, 1, 100.00), (27, 121, 1, 100.00),
        (28, 33,  1, 100.00), (28, 34,  1, 100.00), (28, 35,  1, 100.00),
        (29, 36,  1, 150.00), (29, 37,  1, 150.00),
        (30, 38,  1, 100.00), (30, 39,  1, 100.00), (30, 40,  2, 50.00);
    ";
    command.CommandText = bookingSeatData;
    command.ExecuteNonQuery();
}

        command.CommandText = "SELECT COUNT(*) FROM seat_ghosts";
if (Convert.ToInt32(command.ExecuteScalar()) == 0)
{
    var seatGhostData = @"
        INSERT INTO `seat_ghosts` (`screening_id`, `seat_id`, `session_id`, `reserved_at`, `expires_at`) VALUES
        (1, (SELECT id FROM seats WHERE hall_id=1 AND row_name='B' AND number_in_row=3), 'sess_abc001', '2026-03-18 14:00:00', '2026-03-18 14:15:00'),
        (1, (SELECT id FROM seats WHERE hall_id=1 AND row_name='B' AND number_in_row=4), 'sess_abc002', '2026-03-18 14:00:00', '2026-03-18 14:15:00'),
        (1, (SELECT id FROM seats WHERE hall_id=1 AND row_name='D' AND number_in_row=5), 'sess_abc003', '2026-03-18 14:02:00', '2026-03-18 14:17:00'),
        (1, (SELECT id FROM seats WHERE hall_id=1 AND row_name='D' AND number_in_row=6), 'sess_abc003', '2026-03-18 14:02:00', '2026-03-18 14:17:00'),
        (1, (SELECT id FROM seats WHERE hall_id=1 AND row_name='F' AND number_in_row=2), 'sess_abc004', '2026-03-18 14:05:00', '2026-03-18 14:20:00');
    ";
    command.CommandText = seatGhostData;
    command.ExecuteNonQuery();
}    

        command.CommandText = "SELECT COUNT(*) FROM snacks";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var snacksData = @"
                INSERT INTO `snacks` (`name`, `description`, `price`) VALUES
                ('Popcorn', 'Classic buttered popcorn', 50.00),
                ('Nachos', 'Crispy nachos with cheese dip', 60.00),
                ('Soda', 'Refreshing carbonated drink', 30.00),
                ('Candy', 'Assorted sweet candies', 40.00),
                ('Hot Dog', 'Grilled hot dog with toppings', 70.00);
            ";
            command.CommandText = snacksData;
            command.ExecuteNonQuery();
        }
    }
        
    // Helper to create an object from the DataReader
    private static dynamic ObjFromReader(MySqlDataReader reader)
    {
        var obj = Obj();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            var key = reader.GetName(i);
            var value = reader.GetValue(i);

            // Handle NULL values
            if (value == DBNull.Value)
            {
                obj[key] = null;
            }
            // Handle DateTime - convert to ISO string
            else if (value is DateTime dt)
            {
                obj[key] = dt.ToString("yyyy-MM-ddTHH:mm:ss");
            }
            // Handle boolean (MySQL returns sbyte for TINYINT(1))
            else if (value is sbyte sb)
            {
                obj[key] = sb != 0;
            }
            else if (value is bool b)
            {
                obj[key] = b;
            }
            // Handle JSON columns (MySQL returns JSON as string starting with [ or {)
            else if (value is string strValue && (strValue.StartsWith("[") || strValue.StartsWith("{")))
            {
                try
                {
                    obj[key] = JSON.Parse(strValue);
                }
                catch
                {
                    // If parsing fails, keep the original value and try to convert to number
                    obj[key] = strValue.TryToNum();
                }
            }
            else
            {
                // Normal handling - convert to string and try to parse as number
                obj[key] = value.ToString().TryToNum();
            }
        }
        return obj;
    }

    // Run a query - rows are returned as an array of objects
    public static Arr SQLQuery(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        var paras = parameters == null ? Obj() : Obj(parameters);
        using var db = new MySqlConnection(connectionString);
        db.Open();
        var command = db.CreateCommand();
        command.CommandText = @sql;
        var entries = (Arr)paras.GetEntries();
        entries.ForEach(x => command.Parameters.AddWithValue("@" + x[0], x[1]));
        if (context != null)
        {
            DebugLog.Add(context, new
            {
                sqlQuery = sql.Regplace(@"\s+", " "),
                sqlParams = paras
            });
        }
        var rows = Arr();
        try
        {
            if (sql.StartsWith("SELECT ", true, null))
            {
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    rows.Push(ObjFromReader(reader));
                }
                reader.Close();
            }
            else
            {
                rows.Push(new
                {
                    command = sql.Split(" ")[0].ToUpper(),
                    rowsAffected = command.ExecuteNonQuery()
                });
            }
        }
        catch (Exception err)
        {
            rows.Push(new { error = err.Message });
        }
        return rows;
    }

    // Run a query - only return the first row, as an object
    public static dynamic SQLQueryOne(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        return SQLQuery(sql, parameters, context)[0];
    }
}


