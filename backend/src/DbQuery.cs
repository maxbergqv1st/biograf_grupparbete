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
                `password_hash` VARCHAR(255) NOT NULL,
                `phone` VARCHAR(25),
                `role` VARCHAR(50) NOT NULL DEFAULT 'user',
                `created_at` timestamp DEFAULT (now())
            );

            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                quantity VARCHAR(50) NOT NULL,
                `price$` DECIMAL(10,2) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                categories JSON NOT NULL
            );

            CREATE TABLE IF NOT EXISTS `sound_system` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `system_name` VARCHAR(50) NOT NULL,
                `description` text NOT NULL
            );

            CREATE TABLE IF NOT EXISTS `hall_type` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `type` ENUM ('Standard', 'IMAX', '4DX', 'Dolby Cinema', 'iSense', '3D') NOT NULL DEFAULT 'Standard',
                `description` text NOT NULL
            );

            CREATE TABLE IF NOT EXISTS `hall` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(100) NOT NULL,
                `type` INT NOT NULL,
                `row_count` INT NOT NULL,
                `sound_system` INT NOT NULL,
                `screen_size` SMALLINT NOT NULL,
                FOREIGN KEY (`sound_system`) REFERENCES `sound_system` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`type`) REFERENCES `hall_type` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `hall_row_config` (
                `hall_id` INT NOT NULL,
                `name` VARCHAR(10) NOT NULL,
                `number_of_seats` INT NOT NULL, -- Added manually by admin
                PRIMARY KEY (`hall_id`, `name`),
                FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `seat_type` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` ENUM ('Standard', 'Premium', 'VIP', 'Handicap', 'Recliner') NOT NULL DEFAULT 'Standard',
                `surcharge` decimal(10,2) DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS `seat` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `hall_id` INT,
                `row_name` VARCHAR(10) NOT NULL,
                `number_in_row` INT NOT NULL,
                `type` INT NOT NULL,
                UNIQUE `unique_seat_id` (`hall_id`, `row_name`, `number_in_row`),
                FOREIGN KEY (`hall_id`,`row_name`) REFERENCES `hall_row_config` (`hall_id`, `name`) ON DELETE CASCADE,
                FOREIGN KEY (`type`) REFERENCES `seat_type` (`id`) ON DELETE CASCADE
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
                `duration` INT NOT NULL,
                `age_rating` ENUM ('B', '7', '11', '15') NOT NULL,
                `director` VARCHAR(255) NOT NULL,
                `release_date` DATE NOT NULL,
                `language_id` INT NOT NULL,
                `poster_url` VARCHAR(255),
                `trailer_url` VARCHAR(255),
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                `screening_date_start` DATE NOT NULL,
                `screening_date_end` DATE NOT NULL,
                FOREIGN KEY (`language_id`) REFERENCES `movie_languages` (`id`) ON DELETE RESTRICT
            );

            
            CREATE TABLE IF NOT EXISTS `movie_genres` (
                `movie_id` INT NOT NULL,
                `genre_id` INT NOT NULL,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`movie_id`, `genre_id`),
                FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `screenings` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `movie_id` INT NOT NULL,
                `hall_id` INT NOT NULL,
                `start_time` datetime NOT NULL,
                `end_time` datetime NOT NULL,
                FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `booking` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `user_id` INT,
                `email` VARCHAR(254) NOT NULL,
                `screening_id` INT NOT NULL,
                `booking_date` datetime DEFAULT current_timestamp,
                `total_price` decimal(10,2) DEFAULT 0,
                `status` ENUM ('pending', 'accepted', 'cancelled') NOT NULL default 'pending',
                `booking_reference` VARCHAR(50) UNIQUE NOT NULL,
                FOREIGN KEY (`screening_id`) REFERENCES `screening` (`id`),
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)  ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `price_category_seat` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `category` ENUM ('Adult', 'Child', 'Senior', 'Student', 'Handicap') NOT NULL,
                `discount_modifier` decimal(5,2) DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS `booking_seat` (
                `booking_id` INT NOT NULL,
                `seat_id` INT NOT NULL,
                `price_category_seat_id` INT NOT NULL,
                `final_price` decimal(10,2) NOT NULL,
                PRIMARY KEY (`booking_id`, `seat_id`),
                FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`price_category_seat_id`) REFERENCES `price_category_seat` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `payment` (
                `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
                `booking_id` INT NOT NULL,
                `payment_method` VARCHAR(50) NOT NULL,
                `amount` decimal(10,2) NOT NULL,
                `status` ENUM ('pending', 'accepted', 'declined'),
                `created` datetime DEFAULT current_timestamp,
                FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `seat_ghost` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `screening_id` INT NOT NULL,
                `seat_id` INT NOT NULL,
                `session_id` VARCHAR(255) NOT NULL, /* ?? session id för vem som reserverat ?? */
                `reserved_at` datetime DEFAULT current_timestamp,
                `expires_at` datetime NOT NULL,
                FOREIGN KEY (`screening_id`) REFERENCES `screening` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE CASCADE
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

        // Seed products
        command.CommandText = "SELECT COUNT(*) FROM products";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var productsData = new List<string>
            {
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Croissant', 'Buttery, flaky French-style croissant baked fresh daily with premium European butter. Perfect for breakfast with jam, afternoon coffee, or as the base for elegant sandwiches.\nGolden layers that melt in your mouth with authentic French pastry techniques.', '1 large', 0.99, 'croissant', '[""Bread & rice""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Gherkins', 'Crisp, tangy gherkin pickles packed in traditional brine with dill and spices. These small pickles add perfect acidity to sandwiches, charcuterie boards, and salads.\nA classic European-style pickle with authentic flavor that brightens any meal.', 'A can of 10', 4.5, 'gherkins', '[""Vegetables"",""Canned food""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Bay Leaves', 'Aromatic dried bay leaves from the Mediterranean, essential for soups, stews, and braised dishes. These whole leaves release their subtle, woodsy flavor slowly during cooking.\nRemove before serving for the perfect herbal note in your favorite recipes.', '1 bundle', 3.45, 'bay-leaves', '[""Vegetables"",""Spices""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Tomatoes', 'Fresh, vine-ripened tomatoes bursting with sweet, balanced flavor. Perfect for salads, sandwiches, or cooking.\nThese tomatoes have been allowed to ripen naturally on the vine for maximum taste and vibrant red color.', '1 lb', 2.5, 'tomatoes-on-the-vine', '[""Vegetables""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Basmati Rice', 'Premium long-grain basmati rice with a distinctive nutty aroma and fluffy texture. Aged for optimal flavor, this rice cooks to perfection with separate, non-sticky grains.\nIdeal for Indian dishes, pilafs, and everyday meals where quality matters.', '4 lb', 6.99, 'basmati-rice', '[""Bread & rice""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Green Olives', 'Plump, buttery green olives cured in traditional Mediterranean style. These olives have a mild, fruity flavor with a satisfying firm texture.\nPerfect for antipasto platters, salads, or enjoying straight from the can.', '1 lb, canned', 9.75, 'green-olives', '[""Canned food""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Parsley', 'Fresh, vibrant flat-leaf parsley with bright, clean flavor. Essential for Mediterranean cooking, garnishing, and adding fresh herb notes to any dish.\nThis aromatic herb brightens sauces, soups, and grain dishes beautifully.', '1 bundle', 2.75, 'parsley', '[""Vegetables"",""Spices""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Artichoke', 'Fresh, globe artichoke with tender heart and meaty leaves. Steam, grill, or stuff for an elegant side dish.\nThis versatile vegetable offers a subtle, nutty flavor and satisfying texture when properly prepared.', '1', 1.75, 'artichoke', '[""Vegetables""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Focaccia', 'Rustic Italian focaccia bread with herbs and olive oil, baked to golden perfection. Soft, airy interior with a slightly crispy crust.\nPerfect for sandwiches, dipping in olive oil, or serving alongside Mediterranean meals.', '1 large', 4.3, 'focaccia', '[""Bread & rice""]')",
                @"INSERT INTO products (name, description, quantity, `price$`, slug, categories) VALUES
                ('Rosemary', 'Fresh rosemary plant in a convenient pot for your kitchen windowsill. This aromatic herb adds pine-like fragrance to roasted meats, potatoes, and bread.\nSnip fresh sprigs as needed for cooking or cocktail garnishes.', '1 pot', 3.6, 'rosemary', '[""Vegetables"",""Spices""]')"
            };
            foreach (var sql in productsData)
            {
                command.CommandText = sql;
                command.ExecuteNonQuery();
            }
        }

        command.CommandText = "SELECT COUNT(*) FROM users";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var usersData = @"       
            INSERT INTO `users` (`first_name`, `last_name`, `email`, `password_hash`, `phone`, `role`) VALUES
            ('Erik', 'Andersson', 'erik.andersson@email.se', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', '+46701234567', 'admin'),
            ('Anna', 'Svensson', 'anna.svensson@email.se', '$2y$10$bcdefghijklmnopqrstuvwxyz1234567', '+46702345678', 'user'),
            ('Lars', 'Johansson', 'lars.johansson@email.se', '$2y$10$cdefghijklmnopqrstuvwxyz12345678', '+46703456789', 'user'),
            ('Maria', 'Karlsson', 'maria.karlsson@email.se', '$2y$10$defghijklmnopqrstuvwxyz123456789', '+46704567890', 'user'),
            ('Johan', 'Nilsson', 'johan.nilsson@email.se', '$2y$10$efghijklmnopqrstuvwxyz1234567890', '+46705678901', 'user');
            ";
            command.CommandText = usersData;
            command.ExecuteNonQuery();
        }


        command.CommandText = "SELECT COUNT(*) FROM sound_system";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var sound_systemData = @"
                INSERT INTO `sound_system` (`system_name`, `description`) VALUES
                    ('Dolby Atmos', 'Premium 3D surround sound with overhead speakers'),
                    ('DTS:X', 'Object-based immersive audio technology'),
                    ('Dolby Digital 7.1', 'Standard surround sound system'),
                    ('IMAX Enhanced', 'Enhanced audio for IMAX presentations');
            ";
            command.CommandText = sound_systemData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM hall_type";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hall_typeData = @"    
                INSERT INTO `hall_type` (`type`, `description`) VALUES
                ('Standard', 'Traditional cinema hall with standard seating'),
                ('IMAX', 'Large format screen with premium image quality'),
                ('4DX', 'Motion seats with environmental effects'),
                ('Dolby Cinema', 'Premium experience with Dolby Vision and Atmos'),
                ('3D', '3D projection capability');
            ";
            command.CommandText = hall_typeData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM hall";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hallData = @" 
                INSERT INTO `hall` (`name`, `type`, `row_count`, `sound_system`, `screen_size`) VALUES
                ('Salong 1', 1, 10, 3, 12),
                ('Salong 2', 2, 15, 4, 22),
                ('Salong 3', 1, 8, 1, 10),
                ('Salong 4', 4, 12, 1, 18);
            ";
            command.CommandText = hallData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM hall_row_config";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var hall_row_configData = @" 
                INSERT INTO `hall_row_config` (`hall_id`, `name`, `number_of_seats`) VALUES
                (1, 'A', 10), (1, 'B', 10), (1, 'C', 12), (1, 'D', 12), (1, 'E', 14),
                (1, 'F', 14), (1, 'G', 14), (1, 'H', 12), (1, 'I', 12), (1, 'J', 10),
                (2, 'A', 16), (2, 'B', 16), (2, 'C', 18), (2, 'D', 18), (2, 'E', 20),
                (2, 'F', 20), (2, 'G', 22), (2, 'H', 22), (2, 'I', 22), (2, 'J', 20),
                (2, 'K', 20), (2, 'L', 18), (2, 'M', 18), (2, 'N', 16), (2, 'O', 16),
                (3, 'A', 8), (3, 'B', 10), (3, 'C', 10), (3, 'D', 12),
                (3, 'E', 12), (3, 'F', 10), (3, 'G', 10), (3, 'H', 8),
                (4, 'A', 12), (4, 'B', 12), (4, 'C', 14), (4, 'D', 14), (4, 'E', 16),
                (4, 'F', 16), (4, 'G', 16), (4, 'H', 16), (4, 'I', 14), (4, 'J', 14),
                (4, 'K', 12), (4, 'L', 12);
            ";
            command.CommandText = hall_row_configData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM seat_type";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seat_typeData = @"
                INSERT INTO `seat_type` (`name`, `surcharge`) VALUES
                ('Standard', 0.00),
                ('Premium', 20.00),
                ('VIP', 50.00),
                ('Handicap', 0.00),
                ('Recliner', 35.00);
            ";
            command.CommandText = seat_typeData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM seat";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seatData = @"
                INSERT INTO `seat` (`hall_id`, `row_name`, `number_in_row`, `type`) VALUES
                (1, 'A', 1, 1), (1, 'A', 2, 1), (1, 'A', 3, 1), (1, 'A', 4, 1), (1, 'A', 5, 1),
                (1, 'A', 6, 1), (1, 'A', 7, 1), (1, 'A', 8, 1), (1, 'A', 9, 4), (1, 'A', 10, 4),
                (1, 'B', 1, 1), (1, 'B', 2, 1), (1, 'B', 3, 1), (1, 'B', 4, 1), (1, 'B', 5, 1),
                (1, 'B', 6, 1), (1, 'B', 7, 1), (1, 'B', 8, 1), (1, 'B', 9, 1), (1, 'B', 10, 1),
                (1, 'C', 1, 1), (1, 'C', 2, 1), (1, 'C', 3, 1), (1, 'C', 4, 2), (1, 'C', 5, 2),
                (1, 'C', 6, 2), (1, 'C', 7, 2), (1, 'C', 8, 2), (1, 'C', 9, 1), (1, 'C', 10, 1),
                (1, 'C', 11, 1), (1, 'C', 12, 1),
                (1, 'D', 1, 1), (1, 'D', 2, 1), (1, 'D', 3, 2), (1, 'D', 4, 2), (1, 'D', 5, 2),
                (1, 'D', 6, 2), (1, 'D', 7, 2), (1, 'D', 8, 2), (1, 'D', 9, 2), (1, 'D', 10, 1),
                (1, 'D', 11, 1), (1, 'D', 12, 1),
                (1, 'E', 1, 1), (1, 'E', 2, 1), (1, 'E', 3, 2), (1, 'E', 4, 2), (1, 'E', 5, 2),
                (1, 'E', 6, 2), (1, 'E', 7, 2), (1, 'E', 8, 2), (1, 'E', 9, 2), (1, 'E', 10, 2),
                (1, 'E', 11, 2), (1, 'E', 12, 1), (1, 'E', 13, 1), (1, 'E', 14, 1),
                (1, 'F', 1, 1), (1, 'F', 2, 1), (1, 'F', 3, 2), (1, 'F', 4, 3), (1, 'F', 5, 3),
                (1, 'F', 6, 3), (1, 'F', 7, 3), (1, 'F', 8, 3), (1, 'F', 9, 3), (1, 'F', 10, 3),
                (1, 'F', 11, 2), (1, 'F', 12, 1), (1, 'F', 13, 1), (1, 'F', 14, 1),
                (1, 'G', 1, 1), (1, 'G', 2, 1), (1, 'G', 3, 2), (1, 'G', 4, 2), (1, 'G', 5, 2),
                (1, 'G', 6, 2), (1, 'G', 7, 2), (1, 'G', 8, 2), (1, 'G', 9, 2), (1, 'G', 10, 2),
                (1, 'G', 11, 2), (1, 'G', 12, 1), (1, 'G', 13, 1), (1, 'G', 14, 1),
                (1, 'H', 1, 1), (1, 'H', 2, 1), (1, 'H', 3, 1), (1, 'H', 4, 1), (1, 'H', 5, 1),
                (1, 'H', 6, 1), (1, 'H', 7, 1), (1, 'H', 8, 1), (1, 'H', 9, 1), (1, 'H', 10, 1),
                (1, 'H', 11, 1), (1, 'H', 12, 1),
                (1, 'I', 1, 1), (1, 'I', 2, 1), (1, 'I', 3, 1), (1, 'I', 4, 1), (1, 'I', 5, 1),
                (1, 'I', 6, 1), (1, 'I', 7, 1), (1, 'I', 8, 1), (1, 'I', 9, 1), (1, 'I', 10, 1),
                (1, 'I', 11, 1), (1, 'I', 12, 1),
                (1, 'J', 1, 1), (1, 'J', 2, 1), (1, 'J', 3, 1), (1, 'J', 4, 1), (1, 'J', 5, 1),
                (1, 'J', 6, 1), (1, 'J', 7, 1), (1, 'J', 8, 1), (1, 'J', 9, 1), (1, 'J', 10, 1),
                (2, 'A', 1, 1), (2, 'A', 2, 1), (2, 'A', 3, 1), (2, 'A', 4, 1), (2, 'A', 5, 1), (2, 'A', 6, 1), (2, 'A', 7, 1), (2, 'A', 8, 1), (2, 'A', 9, 1), (2, 'A', 10, 1), (2, 'A', 11, 1), (2, 'A', 12, 1), (2, 'A', 13, 1), (2, 'A', 14, 1), (2, 'A', 15, 4), (2, 'A', 16, 4),
                (2, 'B', 1, 1), (2, 'B', 2, 1), (2, 'B', 3, 1), (2, 'B', 4, 1), (2, 'B', 5, 1), (2, 'B', 6, 1), (2, 'B', 7, 1), (2, 'B', 8, 1), (2, 'B', 9, 1), (2, 'B', 10, 1), (2, 'B', 11, 1), (2, 'B', 12, 1), (2, 'B', 13, 1), (2, 'B', 14, 1), (2, 'B', 15, 4), (2, 'B', 16, 4),
                (2, 'C', 1, 1), (2, 'C', 2, 1), (2, 'C', 3, 2), (2, 'C', 4, 2), (2, 'C', 5, 2), (2, 'C', 6, 2), (2, 'C', 7, 2), (2, 'C', 8, 2), (2, 'C', 9, 2), (2, 'C', 10, 2), (2, 'C', 11, 2), (2, 'C', 12, 2), (2, 'C', 13, 2), (2, 'C', 14, 2), (2, 'C', 15, 2), (2, 'C', 16, 2), (2, 'C', 17, 1), (2, 'C', 18, 1),
                (2, 'D', 1, 1), (2, 'D', 2, 1), (2, 'D', 3, 2), (2, 'D', 4, 2), (2, 'D', 5, 2), (2, 'D', 6, 2), (2, 'D', 7, 2), (2, 'D', 8, 2), (2, 'D', 9, 2), (2, 'D', 10, 2), (2, 'D', 11, 2), (2, 'D', 12, 2), (2, 'D', 13, 2), (2, 'D', 14, 2), (2, 'D', 15, 2), (2, 'D', 16, 2), (2, 'D', 17, 1), (2, 'D', 18, 1),
                (2, 'E', 1, 1), (2, 'E', 2, 1), (2, 'E', 3, 2), (2, 'E', 4, 2), (2, 'E', 5, 2), (2, 'E', 6, 2), (2, 'E', 7, 2), (2, 'E', 8, 2), (2, 'E', 9, 2), (2, 'E', 10, 2), (2, 'E', 11, 2), (2, 'E', 12, 2), (2, 'E', 13, 2), (2, 'E', 14, 2), (2, 'E', 15, 2), (2, 'E', 16, 2), (2, 'E', 17, 2), (2, 'E', 18, 2), (2, 'E', 19, 1), (2, 'E', 20, 1),
                (2, 'F', 1, 2), (2, 'F', 2, 2), (2, 'F', 3, 2), (2, 'F', 4, 2), (2, 'F', 5, 2), (2, 'F', 6, 2), (2, 'F', 7, 3), (2, 'F', 8, 3), (2, 'F', 9, 3), (2, 'F', 10, 3), (2, 'F', 11, 3), (2, 'F', 12, 3), (2, 'F', 13, 2), (2, 'F', 14, 2), (2, 'F', 15, 2), (2, 'F', 16, 2), (2, 'F', 17, 2), (2, 'F', 18, 2), (2, 'F', 19, 2), (2, 'F', 20, 2),
                (2, 'G', 1, 2), (2, 'G', 2, 2), (2, 'G', 3, 2), (2, 'G', 4, 2), (2, 'G', 5, 2), (2, 'G', 6, 2), (2, 'G', 7, 2), (2, 'G', 8, 3), (2, 'G', 9, 3), (2, 'G', 10, 3), (2, 'G', 11, 3), (2, 'G', 12, 3), (2, 'G', 13, 3), (2, 'G', 14, 2), (2, 'G', 15, 2), (2, 'G', 16, 2), (2, 'G', 17, 2), (2, 'G', 18, 2), (2, 'G', 19, 2), (2, 'G', 20, 2), (2, 'G', 21, 2), (2, 'G', 22, 2),
                (2, 'H', 1, 2), (2, 'H', 2, 2), (2, 'H', 3, 2), (2, 'H', 4, 2), (2, 'H', 5, 2), (2, 'H', 6, 2), (2, 'H', 7, 2), (2, 'H', 8, 3), (2, 'H', 9, 3), (2, 'H', 10, 3), (2, 'H', 11, 3), (2, 'H', 12, 3), (2, 'H', 13, 3), (2, 'H', 14, 2), (2, 'H', 15, 2), (2, 'H', 16, 2), (2, 'H', 17, 2), (2, 'H', 18, 2), (2, 'H', 19, 2), (2, 'H', 20, 2), (2, 'H', 21, 2), (2, 'H', 22, 2),
                (2, 'I', 1, 2), (2, 'I', 2, 2), (2, 'I', 3, 2), (2, 'I', 4, 2), (2, 'I', 5, 2), (2, 'I', 6, 2), (2, 'I', 7, 2), (2, 'I', 8, 3), (2, 'I', 9, 3), (2, 'I', 10, 3), (2, 'I', 11, 3), (2, 'I', 12, 3), (2, 'I', 13, 3), (2, 'I', 14, 2), (2, 'I', 15, 2), (2, 'I', 16, 2), (2, 'I', 17, 2), (2, 'I', 18, 2), (2, 'I', 19, 2), (2, 'I', 20, 2), (2, 'I', 21, 2), (2, 'I', 22, 2),
                (2, 'J', 1, 2), (2, 'J', 2, 2), (2, 'J', 3, 2), (2, 'J', 4, 2), (2, 'J', 5, 2), (2, 'J', 6, 2), (2, 'J', 7, 3), (2, 'J', 8, 3), (2, 'J', 9, 3), (2, 'J', 10, 3), (2, 'J', 11, 3), (2, 'J', 12, 3), (2, 'J', 13, 2), (2, 'J', 14, 2), (2, 'J', 15, 2), (2, 'J', 16, 2), (2, 'J', 17, 2), (2, 'J', 18, 2), (2, 'J', 19, 2), (2, 'J', 20, 2),
                (2, 'K', 1, 1), (2, 'K', 2, 1), (2, 'K', 3, 1), (2, 'K', 4, 1), (2, 'K', 5, 1), (2, 'K', 6, 1), (2, 'K', 7, 1), (2, 'K', 8, 1), (2, 'K', 9, 1), (2, 'K', 10, 1), (2, 'K', 11, 1), (2, 'K', 12, 1), (2, 'K', 13, 1), (2, 'K', 14, 1), (2, 'K', 15, 1), (2, 'K', 16, 1), (2, 'K', 17, 1), (2, 'K', 18, 1), (2, 'K', 19, 1), (2, 'K', 20, 1),
                (2, 'L', 1, 1), (2, 'L', 2, 1), (2, 'L', 3, 1), (2, 'L', 4, 1), (2, 'L', 5, 1), (2, 'L', 6, 1), (2, 'L', 7, 1), (2, 'L', 8, 1), (2, 'L', 9, 1), (2, 'L', 10, 1), (2, 'L', 11, 1), (2, 'L', 12, 1), (2, 'L', 13, 1), (2, 'L', 14, 1), (2, 'L', 15, 1), (2, 'L', 16, 1), (2, 'L', 17, 1), (2, 'L', 18, 1),
                (2, 'M', 1, 1), (2, 'M', 2, 1), (2, 'M', 3, 1), (2, 'M', 4, 1), (2, 'M', 5, 1), (2, 'M', 6, 1), (2, 'M', 7, 1), (2, 'M', 8, 1), (2, 'M', 9, 1), (2, 'M', 10, 1), (2, 'M', 11, 1), (2, 'M', 12, 1), (2, 'M', 13, 1), (2, 'M', 14, 1), (2, 'M', 15, 1), (2, 'M', 16, 1), (2, 'M', 17, 1), (2, 'M', 18, 1),
                (2, 'N', 1, 1), (2, 'N', 2, 1), (2, 'N', 3, 1), (2, 'N', 4, 1), (2, 'N', 5, 1), (2, 'N', 6, 1), (2, 'N', 7, 1), (2, 'N', 8, 1), (2, 'N', 9, 1), (2, 'N', 10, 1), (2, 'N', 11, 1), (2, 'N', 12, 1), (2, 'N', 13, 1), (2, 'N', 14, 1), (2, 'N', 15, 1), (2, 'N', 16, 1),
                (2, 'O', 1, 1), (2, 'O', 2, 1), (2, 'O', 3, 1), (2, 'O', 4, 1), (2, 'O', 5, 1), (2, 'O', 6, 1), (2, 'O', 7, 1), (2, 'O', 8, 1), (2, 'O', 9, 1), (2, 'O', 10, 1), (2, 'O', 11, 1), (2, 'O', 12, 1), (2, 'O', 13, 1), (2, 'O', 14, 1), (2, 'O', 15, 1), (2, 'O', 16, 1),
                (3, 'A', 1, 1), (3, 'A', 2, 1), (3, 'A', 3, 1), (3, 'A', 4, 1),
                (3, 'A', 5, 1), (3, 'A', 6, 1), (3, 'A', 7, 4), (3, 'A', 8, 4),
                (3, 'B', 1, 1), (3, 'B', 2, 1), (3, 'B', 3, 1), (3, 'B', 4, 1), (3, 'B', 5, 1),
                (3, 'B', 6, 1), (3, 'B', 7, 1), (3, 'B', 8, 1), (3, 'B', 9, 1), (3, 'B', 10, 1),
                (3, 'C', 1, 1), (3, 'C', 2, 2), (3, 'C', 3, 2), (3, 'C', 4, 2), (3, 'C', 5, 2),
                (3, 'C', 6, 2), (3, 'C', 7, 2), (3, 'C', 8, 2), (3, 'C', 9, 1), (3, 'C', 10, 1),
                (3, 'D', 1, 1), (3, 'D', 2, 2), (3, 'D', 3, 2), (3, 'D', 4, 5), (3, 'D', 5, 5),
                (3, 'D', 6, 5), (3, 'D', 7, 5), (3, 'D', 8, 5), (3, 'D', 9, 2), (3, 'D', 10, 2),
                (3, 'D', 11, 1), (3, 'D', 12, 1),
                (3, 'E', 1, 1), (3, 'E', 2, 2), (3, 'E', 3, 2), (3, 'E', 4, 5), (3, 'E', 5, 5),
                (3, 'E', 6, 5), (3, 'E', 7, 5), (3, 'E', 8, 5), (3, 'E', 9, 2), (3, 'E', 10, 2),
                (3, 'E', 11, 1), (3, 'E', 12, 1),
                (3, 'F', 1, 1), (3, 'F', 2, 1), (3, 'F', 3, 2), (3, 'F', 4, 2), (3, 'F', 5, 2),
                (3, 'F', 6, 2), (3, 'F', 7, 2), (3, 'F', 8, 1), (3, 'F', 9, 1), (3, 'F', 10, 1),
                (3, 'G', 1, 1), (3, 'G', 2, 1), (3, 'G', 3, 1), (3, 'G', 4, 1), (3, 'G', 5, 1),
                (3, 'G', 6, 1), (3, 'G', 7, 1), (3, 'G', 8, 1), (3, 'G', 9, 1), (3, 'G', 10, 1),
                (3, 'H', 1, 1), (3, 'H', 2, 1), (3, 'H', 3, 1), (3, 'H', 4, 1),
                (3, 'H', 5, 1), (3, 'H', 6, 1), (3, 'H', 7, 1), (3, 'H', 8, 1),
                (4, 'A', 1, 1), (4, 'A', 2, 1), (4, 'A', 3, 1), (4, 'A', 4, 1), (4, 'A', 5, 1), (4, 'A', 6, 1), (4, 'A', 7, 1), (4, 'A', 8, 1), (4, 'A', 9, 1), (4, 'A', 10, 1), (4, 'A', 11, 4), (4, 'A', 12, 4),
                (4, 'B', 1, 1), (4, 'B', 2, 1), (4, 'B', 3, 1), (4, 'B', 4, 1), (4, 'B', 5, 1), (4, 'B', 6, 1), (4, 'B', 7, 1), (4, 'B', 8, 1), (4, 'B', 9, 1), (4, 'B', 10, 1), (4, 'B', 11, 4), (4, 'B', 12, 4),
                (4, 'C', 1, 1), (4, 'C', 2, 1), (4, 'C', 3, 2), (4, 'C', 4, 2), (4, 'C', 5, 2), (4, 'C', 6, 2), (4, 'C', 7, 2), (4, 'C', 8, 2), (4, 'C', 9, 2), (4, 'C', 10, 2), (4, 'C', 11, 2), (4, 'C', 12, 2), (4, 'C', 13, 1), (4, 'C', 14, 1),
                (4, 'D', 1, 1), (4, 'D', 2, 1), (4, 'D', 3, 2), (4, 'D', 4, 2), (4, 'D', 5, 2), (4, 'D', 6, 2), (4, 'D', 7, 2), (4, 'D', 8, 2), (4, 'D', 9, 2), (4, 'D', 10, 2), (4, 'D', 11, 2), (4, 'D', 12, 2), (4, 'D', 13, 1), (4, 'D', 14, 1),
                (4, 'E', 1, 2), (4, 'E', 2, 2), (4, 'E', 3, 2), (4, 'E', 4, 2), (4, 'E', 5, 2), (4, 'E', 6, 5), (4, 'E', 7, 5), (4, 'E', 8, 5), (4, 'E', 9, 5), (4, 'E', 10, 2), (4, 'E', 11, 2), (4, 'E', 12, 2), (4, 'E', 13, 2), (4, 'E', 14, 2), (4, 'E', 15, 2), (4, 'E', 16, 2),
                (4, 'F', 1, 2), (4, 'F', 2, 2), (4, 'F', 3, 2), (4, 'F', 4, 2), (4, 'F', 5, 2), (4, 'F', 6, 5), (4, 'F', 7, 5), (4, 'F', 8, 5), (4, 'F', 9, 5), (4, 'F', 10, 2), (4, 'F', 11, 2), (4, 'F', 12, 2), (4, 'F', 13, 2), (4, 'F', 14, 2), (4, 'F', 15, 2), (4, 'F', 16, 2),
                (4, 'G', 1, 2), (4, 'G', 2, 2), (4, 'G', 3, 2), (4, 'G', 4, 2), (4, 'G', 5, 2), (4, 'G', 6, 5), (4, 'G', 7, 5), (4, 'G', 8, 5), (4, 'G', 9, 5), (4, 'G', 10, 2), (4, 'G', 11, 2), (4, 'G', 12, 2), (4, 'G', 13, 2), (4, 'G', 14, 2), (4, 'G', 15, 2), (4, 'G', 16, 2),
                (4, 'H', 1, 2), (4, 'H', 2, 2), (4, 'H', 3, 2), (4, 'H', 4, 2), (4, 'H', 5, 2), (4, 'H', 6, 5), (4, 'H', 7, 5), (4, 'H', 8, 5), (4, 'H', 9, 5), (4, 'H', 10, 2), (4, 'H', 11, 2), (4, 'H', 12, 2), (4, 'H', 13, 2), (4, 'H', 14, 2), (4, 'H', 15, 2), (4, 'H', 16, 2),
                (4, 'I', 1, 1), (4, 'I', 2, 1), (4, 'I', 3, 2), (4, 'I', 4, 2), (4, 'I', 5, 2), (4, 'I', 6, 2), (4, 'I', 7, 2), (4, 'I', 8, 2), (4, 'I', 9, 2), (4, 'I', 10, 2), (4, 'I', 11, 2), (4, 'I', 12, 2), (4, 'I', 13, 1), (4, 'I', 14, 1),
                (4, 'J', 1, 1), (4, 'J', 2, 1), (4, 'J', 3, 2), (4, 'J', 4, 2), (4, 'J', 5, 2), (4, 'J', 6, 2), (4, 'J', 7, 2), (4, 'J', 8, 2), (4, 'J', 9, 2), (4, 'J', 10, 2), (4, 'J', 11, 2), (4, 'J', 12, 2), (4, 'J', 13, 1), (4, 'J', 14, 1),
                (4, 'K', 1, 1), (4, 'K', 2, 1), (4, 'K', 3, 1), (4, 'K', 4, 1), (4, 'K', 5, 1), (4, 'K', 6, 1), (4, 'K', 7, 1), (4, 'K', 8, 1), (4, 'K', 9, 1), (4, 'K', 10, 1), (4, 'K', 11, 1), (4, 'K', 12, 1),
                (4, 'L', 1, 1), (4, 'L', 2, 1), (4, 'L', 3, 1), (4, 'L', 4, 1), (4, 'L', 5, 1), (4, 'L', 6, 1), (4, 'L', 7, 1), (4, 'L', 8, 1), (4, 'L', 9, 1), (4, 'L', 10, 1), (4, 'L', 11, 1), (4, 'L', 12, 1);
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
            var movieData = @"
            INSERT INTO `movies` (`title`, `original_title`, `tagline`, `description`, `duration`, `age_rating`, `director`, `release_date`, `language_id`) VALUES
            ('Dune: Part Two', NULL, 'Episkt science fiction-äventyr', 'Paul Atreides förenas med Chani och Fremen medan han söker hämnd mot de konspirationer som förstörde hans familj. I mötet med valet mellan sitt livs kärlek och universums öde måste han förhindra en fruktansvärd framtid som bara han kan förutse.', 166, '11', 'Denis Villeneuve', '2024-02-28', 2),
            ('Oppenheimer', NULL, 'Biografiskt drama om atombombens fader', 'Berättelsen om den amerikanske teoretiske fysikern J. Robert Oppenheimer och hans roll i utvecklingen av atombomben.', 180, '11', 'Christopher Nolan', '2023-07-21', 2),
            ('The Super Mario Bros. Movie', NULL, 'Animerat äventyr med Mario och Luigi', 'Medan Mario och Luigi arbetar för att rädda Brooklyn måste de resa genom kungadömet av svampar för att rädda Prinsessan Peach från den elake Bowser.', 92, 'B', 'Aaron Horvath', '2023-04-05', 2),
            ('Barbie', NULL, 'Färgglad komedi om ikonisk docka', 'Barbie och Ken har den perfekta tiden i det färgglada och till synes perfekta Barbie Land. Men när de får chansen att uppleva den verkliga världen upptäcker de både glädjen och riskerna med att leva bland människor.', 114, '7', 'Greta Gerwig', '2023-07-21', 2),
            ('Wonka', NULL, 'Musikaliskt ursprungsäventyr', 'Berättelsen om hur en ung Willy Wonka träffade Oompa-Loompas på ett av sina tidigaste äventyr.', 116, '7', 'Paul King', '2023-12-15', 2);
        ";
            command.CommandText = movieData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM movie_genres";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var movieGenreData = @"
            INSERT INTO `movie_genres` (`movie_id`, `genre_id`) VALUES
            (1, 1), (1, 2), (1, 6),
            (2, 4), (2, 7),
            (3, 2), (3, 3), (3, 10),
            (4, 3), (4, 8), (4, 9),
            (5, 2), (5, 3), (5, 8);
            ";
            command.CommandText = movieGenreData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM screenings";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var screeningData = @"
            INSERT INTO `screenings` (`movie_id`, `hall_id`, `start_time`, `end_time`) VALUES
            (1, 2, '2025-02-10 14:00:00', '2025-02-10 16:46:00'),
            (1, 2, '2025-02-10 18:00:00', '2025-02-10 20:46:00'),
            (1, 4, '2025-02-11 19:30:00', '2025-02-11 22:16:00'),
            (2, 4, '2025-02-10 17:00:00', '2025-02-10 20:00:00'),
            (2, 2, '2025-02-11 16:00:00', '2025-02-11 19:00:00'),
            (3, 1, '2025-02-10 15:00:00', '2025-02-10 16:32:00'),
            (3, 3, '2025-02-10 13:00:00', '2025-02-10 14:32:00'),
            (3, 1, '2025-02-11 11:00:00', '2025-02-11 12:32:00'),
            (4, 1, '2025-02-10 18:00:00', '2025-02-10 19:54:00'),
            (4, 3, '2025-02-11 15:30:00', '2025-02-11 17:24:00'),
            (5, 3, '2025-02-10 17:00:00', '2025-02-10 18:56:00'),
            (5, 1, '2025-02-11 13:30:00', '2025-02-11 15:26:00');
            ";
            command.CommandText = screeningData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM price_category_seat";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var priceCategorySeatData = @"
            INSERT INTO `price_category_seat` (`category`, `discount_modifier`) VALUES
            ('Adult', 0.00),
            ('Child', 0.50),
            ('Senior', 0.70),
            ('Student', 0.80),
            ('Handicap', 0.70);
        ";
            command.CommandText = priceCategorySeatData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM booking";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var bookingData = @"
            INSERT INTO `booking` (`user_id`, `email`, `screening_id`, `booking_date`, `total_price`, `status`, `booking_reference`) VALUES
            (1, 'erik.andersson@email.se', 1, '2025-02-08 10:30:00', 340.00, 'accepted', 'BK-2025-001'),
            (2, 'anna.svensson@email.se', 6, '2025-02-09 14:20:00', 240.00, 'accepted', 'BK-2025-002'),
            (3, 'lars.johansson@email.se', 9, '2025-02-09 16:45:00', 310.00, 'pending', 'BK-2025-003'),
            (4, 'maria.karlsson@email.se', 3, '2025-02-09 18:00:00', 540.00, 'accepted', 'BK-2025-004'),
            (NULL, 'guest@email.com', 7, '2025-02-10 09:15:00', 200.00, 'accepted', 'BK-2025-005');
        ";
            command.CommandText = bookingData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM booking_seat";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var booking_seatData = @"
            INSERT INTO `booking_seat` (`booking_id`, `seat_id`, `price_category_seat_id`, `final_price`) VALUES
            (1, (SELECT id FROM seat WHERE hall_id=2 AND row_name='F' AND number_in_row=8), 1, 200.00),
            (1, (SELECT id FROM seat WHERE hall_id=2 AND row_name='F' AND number_in_row=9), 1, 200.00),
            (2, (SELECT id FROM seat WHERE hall_id=1 AND row_name='E' AND number_in_row=5), 1, 140.00),
            (2, (SELECT id FROM seat WHERE hall_id=1 AND row_name='E' AND number_in_row=6), 1, 140.00),
            (3, (SELECT id FROM seat WHERE hall_id=1 AND row_name='F' AND number_in_row=5), 1, 180.00),
            (3, (SELECT id FROM seat WHERE hall_id=1 AND row_name='F' AND number_in_row=6), 4, 144.00),
            (4, (SELECT id FROM seat WHERE hall_id=4 AND row_name='E' AND number_in_row=6), 2, 107.50),
            (4, (SELECT id FROM seat WHERE hall_id=4 AND row_name='E' AND number_in_row=7), 2, 107.50),
            (5, (SELECT id FROM seat WHERE hall_id=3 AND row_name='C' AND number_in_row=5), 1, 120.00),
            (5, (SELECT id FROM seat WHERE hall_id=3 AND row_name='C' AND number_in_row=6), 2, 60.00);
        ";
            command.CommandText = booking_seatData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM payment";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var paymentData = @"
            INSERT INTO `payment` (`booking_id`, `payment_method`, `amount`, `status`) VALUES
            (1, 'Credit Card', 340.00, 'accepted'),
            (2, 'Swish', 240.00, 'accepted'),
            (3, 'Credit Card', 310.00, 'pending'),
            (4, 'Klarna', 270.00, 'accepted'),
            (5, 'Debit Card', 200.00, 'accepted');
        ";
            command.CommandText = paymentData;
            command.ExecuteNonQuery();
        }

        command.CommandText = "SELECT COUNT(*) FROM seat_ghost";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var seatGhostData = @"
            INSERT INTO `seat_ghost` (`screening_id`, `seat_id`, `session_id`, `reserved_at`, `expires_at`) VALUES
            (6, (SELECT id FROM seat WHERE hall_id=1 AND row_name='E' AND number_in_row=7), 'sess_abc123', '2025-02-10 12:00:00', '2025-02-10 12:15:00'),
            (7, (SELECT id FROM seat WHERE hall_id=3 AND row_name='D' AND number_in_row=8), 'sess_def456', '2025-02-10 12:05:00', '2025-02-10 12:20:00'),
            (9, (SELECT id FROM seat WHERE hall_id=1 AND row_name='F' AND number_in_row=8), 'sess_ghi789', '2025-02-10 12:10:00', '2025-02-10 12:25:00');
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
