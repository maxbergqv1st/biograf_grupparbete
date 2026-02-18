INSERT IGNORE INTO acl (userRoles, method, allow, route, `match`, comment)
VALUES
    (
        'visitor, user',
        'GET',
        'disallow',
        '/secret.html',
        'true',
        'No access to /secret.html for visitors and normal users'
    ),
    (
        'visitor,user, admin',
        'GET',
        'allow',
        '/api',
        'false',
        'Allow access to all routes not starting with /api'
    ),
    (
        'visitor',
        'POST',
        'allow',
        '/api/users',
        'true',
        'Allow registration as new user for visitors'
    ),
    (
        'visitor, user,admin',
        '*',
        'allow',
        '/api/login',
        'true',
        'Allow access to all login routes'
    ),
    (
        'admin',
        '*',
        'allow',
        '/api/users',
        'true',
        'Allow admins to see and edit users'
    ),
    (
        'admin',
        '*',
        'allow',
        '/api/sessions',
        'true',
        'Allow admins to see and edit sessions'
    ),
    (
        'admin',
        '*',
        'allow',
        '/api/acl',
        'true',
        'Allow admins to see and edit acl rules'
    ),
    (
        'visitor,user,admin',
        'GET',
        'allow',
        '/api/products',
        'true',
        'Allow all user roles to read products'
    );

INSERT IGNORE INTO `users` (
    `first_name`,
    `last_name`,
    `email`,
    `password_hash`,
    `phone`,
    `role`
)
VALUES
    (
        'Erik',
        'Andersson',
        'erik.andersson@email.se',
        '$2y$10$abcdefghijklmnopqrstuvwxyz123456',
        '+46701234567',
        'admin'
    ),
    (
        'Anna',
        'Svensson',
        'anna.svensson@email.se',
        '$2y$10$bcdefghijklmnopqrstuvwxyz1234567',
        '+46702345678',
        'user'
    ),
    (
        'Lars',
        'Johansson',
        'lars.johansson@email.se',
        '$2y$10$cdefghijklmnopqrstuvwxyz12345678',
        '+46703456789',
        'user'
    ),
    (
        'Maria',
        'Karlsson',
        'maria.karlsson@email.se',
        '$2y$10$defghijklmnopqrstuvwxyz123456789',
        '+46704567890',
        'user'
    ),
    (
        'Johan',
        'Nilsson',
        'johan.nilsson@email.se',
        '$2y$10$efghijklmnopqrstuvwxyz1234567890',
        '+46705678901',
        'user'
    );

INSERT IGNORE INTO `sound_system` (`system_name`, `description`)
VALUES
    (
        'Dolby Atmos',
        'Premium 3D surround sound with overhead speakers'
    ),
    (
        'DTS:X',
        'Object-based immersive audio technology'
    ),
    (
        'Dolby Digital 7.1',
        'Standard surround sound system'
    ),
    (
        'IMAX Enhanced',
        'Enhanced audio for IMAX presentations'
    );

INSERT IGNORE INTO `hall_type` (`type`, `description`)
VALUES
    (
        'Standard',
        'Traditional cinema hall with standard seating'
    ),
    (
        'IMAX',
        'Large format screen with premium image quality'
    ),
    ('4DX', 'Motion seats with environmental effects'),
    (
        'Dolby Cinema',
        'Premium experience with Dolby Vision and Atmos'
    ),
    ('3D', '3D projection capability');

INSERT IGNORE INTO `hall` (
    `name`,
    `type`,
    `row_count`,
    `sound_system`,
    `screen_size`
)
VALUES
    ('Salong 1', 1, 10, 3, 12),
    ('Salong 2', 2, 15, 4, 22),
    ('Salong 3', 1, 8, 1, 10),
    ('Salong 4', 4, 12, 1, 18);

INSERT IGNORE INTO `hall_row_config` (`hall_id`, `name`, `number_of_seats`)
VALUES
    (1, 'A', 10),
    (1, 'B', 10),
    (1, 'C', 12),
    (1, 'D', 12),
    (1, 'E', 14),
    (1, 'F', 14),
    (1, 'G', 14),
    (1, 'H', 12),
    (1, 'I', 12),
    (1, 'J', 10),
    (2, 'A', 16),
    (2, 'B', 16),
    (2, 'C', 18),
    (2, 'D', 18),
    (2, 'E', 20),
    (2, 'F', 20),
    (2, 'G', 22),
    (2, 'H', 22),
    (2, 'I', 22),
    (2, 'J', 20),
    (2, 'K', 20),
    (2, 'L', 18),
    (2, 'M', 18),
    (2, 'N', 16),
    (2, 'O', 16),
    (3, 'A', 8),
    (3, 'B', 10),
    (3, 'C', 10),
    (3, 'D', 12),
    (3, 'E', 12),
    (3, 'F', 10),
    (3, 'G', 10),
    (3, 'H', 8),
    (4, 'A', 12),
    (4, 'B', 12),
    (4, 'C', 14),
    (4, 'D', 14),
    (4, 'E', 16),
    (4, 'F', 16),
    (4, 'G', 16),
    (4, 'H', 16),
    (4, 'I', 14),
    (4, 'J', 14),
    (4, 'K', 12),
    (4, 'L', 12);

INSERT IGNORE INTO `seat_type` (`name`, `surcharge`)
VALUES
    ('Standard', 0.00),
    ('Premium', 20.00),
    ('VIP', 50.00),
    ('Handicap', 0.00),
    ('Recliner', 35.00);

INSERT IGNORE INTO `seat` (`hall_id`, `row_name`, `number_in_row`, `type`)
VALUES
    -- Hall 1 / Row A
    (1, 'A', 1, 1),
    (1, 'A', 2, 1),
    (1, 'A', 3, 1),
    (1, 'A', 4, 1),
    (1, 'A', 5, 1),
    (1, 'A', 6, 1),
    (1, 'A', 7, 1),
    (1, 'A', 8, 1),
    (1, 'A', 9, 4),
    (1, 'A', 10, 4),
    -- Hall 1 / Row B
    (1, 'B', 1, 1),
    (1, 'B', 2, 1),
    (1, 'B', 3, 1),
    (1, 'B', 4, 1),
    (1, 'B', 5, 1),
    (1, 'B', 6, 1),
    (1, 'B', 7, 1),
    (1, 'B', 8, 1),
    (1, 'B', 9, 1),
    (1, 'B', 10, 1),
    -- Hall 1 / Row C
    (1, 'C', 1, 1),
    (1, 'C', 2, 1),
    (1, 'C', 3, 1),
    (1, 'C', 4, 2),
    (1, 'C', 5, 2),
    (1, 'C', 6, 2),
    (1, 'C', 7, 2),
    (1, 'C', 8, 2),
    (1, 'C', 9, 1),
    (1, 'C', 10, 1),
    (1, 'C', 11, 1),
    (1, 'C', 12, 1),
    -- Hall 1 / Row D
    (1, 'D', 1, 1),
    (1, 'D', 2, 1),
    (1, 'D', 3, 2),
    (1, 'D', 4, 2),
    (1, 'D', 5, 2),
    (1, 'D', 6, 2),
    (1, 'D', 7, 2),
    (1, 'D', 8, 2),
    (1, 'D', 9, 2),
    (1, 'D', 10, 1),
    (1, 'D', 11, 1),
    (1, 'D', 12, 1),
    -- Hall 1 / Row E
    (1, 'E', 1, 1),
    (1, 'E', 2, 1),
    (1, 'E', 3, 2),
    (1, 'E', 4, 2),
    (1, 'E', 5, 2),
    (1, 'E', 6, 2),
    (1, 'E', 7, 2),
    (1, 'E', 8, 2),
    (1, 'E', 9, 2),
    (1, 'E', 10, 2),
    (1, 'E', 11, 2),
    (1, 'E', 12, 1),
    (1, 'E', 13, 1),
    (1, 'E', 14, 1),
    -- Hall 1 / Row F
    (1, 'F', 1, 1),
    (1, 'F', 2, 1),
    (1, 'F', 3, 2),
    (1, 'F', 4, 3),
    (1, 'F', 5, 3),
    (1, 'F', 6, 3),
    (1, 'F', 7, 3),
    (1, 'F', 8, 3),
    (1, 'F', 9, 3),
    (1, 'F', 10, 3),
    (1, 'F', 11, 2),
    (1, 'F', 12, 1),
    (1, 'F', 13, 1),
    (1, 'F', 14, 1),
    -- Hall 1 / Row G
    (1, 'G', 1, 1),
    (1, 'G', 2, 1),
    (1, 'G', 3, 2),
    (1, 'G', 4, 2),
    (1, 'G', 5, 2),
    (1, 'G', 6, 2),
    (1, 'G', 7, 2),
    (1, 'G', 8, 2),
    (1, 'G', 9, 2),
    (1, 'G', 10, 2),
    (1, 'G', 11, 2),
    (1, 'G', 12, 1),
    (1, 'G', 13, 1),
    (1, 'G', 14, 1),
    -- Hall 1 / Row H
    (1, 'H', 1, 1),
    (1, 'H', 2, 1),
    (1, 'H', 3, 1),
    (1, 'H', 4, 1),
    (1, 'H', 5, 1),
    (1, 'H', 6, 1),
    (1, 'H', 7, 1),
    (1, 'H', 8, 1),
    (1, 'H', 9, 1),
    (1, 'H', 10, 1),
    (1, 'H', 11, 1),
    (1, 'H', 12, 1),
    -- Hall 1 / Row I
    (1, 'I', 1, 1),
    (1, 'I', 2, 1),
    (1, 'I', 3, 1),
    (1, 'I', 4, 1),
    (1, 'I', 5, 1),
    (1, 'I', 6, 1),
    (1, 'I', 7, 1),
    (1, 'I', 8, 1),
    (1, 'I', 9, 1),
    (1, 'I', 10, 1),
    (1, 'I', 11, 1),
    (1, 'I', 12, 1),
    -- Hall 1 / Row J
    (1, 'J', 1, 1),
    (1, 'J', 2, 1),
    (1, 'J', 3, 1),
    (1, 'J', 4, 1),
    (1, 'J', 5, 1),
    (1, 'J', 6, 1),
    (1, 'J', 7, 1),
    (1, 'J', 8, 1),
    (1, 'J', 9, 1),
    (1, 'J', 10, 1),
    -- Hall 2 / Row A
    (2, 'A', 1, 1),
    (2, 'A', 2, 1),
    (2, 'A', 3, 1),
    (2, 'A', 4, 1),
    (2, 'A', 5, 1),
    (2, 'A', 6, 1),
    (2, 'A', 7, 1),
    (2, 'A', 8, 1),
    (2, 'A', 9, 1),
    (2, 'A', 10, 1),
    (2, 'A', 11, 1),
    (2, 'A', 12, 1),
    (2, 'A', 13, 1),
    (2, 'A', 14, 1),
    (2, 'A', 15, 4),
    (2, 'A', 16, 4),
    -- Hall 2 / Row B
    (2, 'B', 1, 1),
    (2, 'B', 2, 1),
    (2, 'B', 3, 1),
    (2, 'B', 4, 1),
    (2, 'B', 5, 1),
    (2, 'B', 6, 1),
    (2, 'B', 7, 1),
    (2, 'B', 8, 1),
    (2, 'B', 9, 1),
    (2, 'B', 10, 1),
    (2, 'B', 11, 1),
    (2, 'B', 12, 1),
    (2, 'B', 13, 1),
    (2, 'B', 14, 1),
    (2, 'B', 15, 4),
    (2, 'B', 16, 4),
    -- Hall 2 / Row C
    (2, 'C', 1, 1),
    (2, 'C', 2, 1),
    (2, 'C', 3, 2),
    (2, 'C', 4, 2),
    (2, 'C', 5, 2),
    (2, 'C', 6, 2),
    (2, 'C', 7, 2),
    (2, 'C', 8, 2),
    (2, 'C', 9, 2),
    (2, 'C', 10, 2),
    (2, 'C', 11, 2),
    (2, 'C', 12, 2),
    (2, 'C', 13, 2),
    (2, 'C', 14, 2),
    (2, 'C', 15, 2),
    (2, 'C', 16, 2),
    (2, 'C', 17, 1),
    (2, 'C', 18, 1),
    -- Hall 2 / Row D
    (2, 'D', 1, 1),
    (2, 'D', 2, 1),
    (2, 'D', 3, 2),
    (2, 'D', 4, 2),
    (2, 'D', 5, 2),
    (2, 'D', 6, 2),
    (2, 'D', 7, 2),
    (2, 'D', 8, 2),
    (2, 'D', 9, 2),
    (2, 'D', 10, 2),
    (2, 'D', 11, 2),
    (2, 'D', 12, 2),
    (2, 'D', 13, 2),
    (2, 'D', 14, 2),
    (2, 'D', 15, 2),
    (2, 'D', 16, 2),
    (2, 'D', 17, 1),
    (2, 'D', 18, 1),
    -- Hall 2 / Row E
    (2, 'E', 1, 1),
    (2, 'E', 2, 1),
    (2, 'E', 3, 2),
    (2, 'E', 4, 2),
    (2, 'E', 5, 2),
    (2, 'E', 6, 2),
    (2, 'E', 7, 2),
    (2, 'E', 8, 2),
    (2, 'E', 9, 2),
    (2, 'E', 10, 2),
    (2, 'E', 11, 2),
    (2, 'E', 12, 2),
    (2, 'E', 13, 2),
    (2, 'E', 14, 2),
    (2, 'E', 15, 2),
    (2, 'E', 16, 2),
    (2, 'E', 17, 2),
    (2, 'E', 18, 2),
    (2, 'E', 19, 1),
    (2, 'E', 20, 1),
    -- Hall 2 / Row F
    (2, 'F', 1, 2),
    (2, 'F', 2, 2),
    (2, 'F', 3, 2),
    (2, 'F', 4, 2),
    (2, 'F', 5, 2),
    (2, 'F', 6, 2),
    (2, 'F', 7, 3),
    (2, 'F', 8, 3),
    (2, 'F', 9, 3),
    (2, 'F', 10, 3),
    (2, 'F', 11, 3),
    (2, 'F', 12, 3),
    (2, 'F', 13, 2),
    (2, 'F', 14, 2),
    (2, 'F', 15, 2),
    (2, 'F', 16, 2),
    (2, 'F', 17, 2),
    (2, 'F', 18, 2),
    (2, 'F', 19, 2),
    (2, 'F', 20, 2),
    -- Hall 2 / Row G
    (2, 'G', 1, 2),
    (2, 'G', 2, 2),
    (2, 'G', 3, 2),
    (2, 'G', 4, 2),
    (2, 'G', 5, 2),
    (2, 'G', 6, 2),
    (2, 'G', 7, 2),
    (2, 'G', 8, 3),
    (2, 'G', 9, 3),
    (2, 'G', 10, 3),
    (2, 'G', 11, 3),
    (2, 'G', 12, 3),
    (2, 'G', 13, 3),
    (2, 'G', 14, 2),
    (2, 'G', 15, 2),
    (2, 'G', 16, 2),
    (2, 'G', 17, 2),
    (2, 'G', 18, 2),
    (2, 'G', 19, 2),
    (2, 'G', 20, 2),
    (2, 'G', 21, 2),
    (2, 'G', 22, 2),
    -- Hall 2 / Row H
    (2, 'H', 1, 2),
    (2, 'H', 2, 2),
    (2, 'H', 3, 2),
    (2, 'H', 4, 2),
    (2, 'H', 5, 2),
    (2, 'H', 6, 2),
    (2, 'H', 7, 2),
    (2, 'H', 8, 3),
    (2, 'H', 9, 3),
    (2, 'H', 10, 3),
    (2, 'H', 11, 3),
    (2, 'H', 12, 3),
    (2, 'H', 13, 3),
    (2, 'H', 14, 2),
    (2, 'H', 15, 2),
    (2, 'H', 16, 2),
    (2, 'H', 17, 2),
    (2, 'H', 18, 2),
    (2, 'H', 19, 2),
    (2, 'H', 20, 2),
    (2, 'H', 21, 2),
    (2, 'H', 22, 2),
    -- Hall 2 / Row I
    (2, 'I', 1, 2),
    (2, 'I', 2, 2),
    (2, 'I', 3, 2),
    (2, 'I', 4, 2),
    (2, 'I', 5, 2),
    (2, 'I', 6, 2),
    (2, 'I', 7, 2),
    (2, 'I', 8, 3),
    (2, 'I', 9, 3),
    (2, 'I', 10, 3),
    (2, 'I', 11, 3),
    (2, 'I', 12, 3),
    (2, 'I', 13, 3),
    (2, 'I', 14, 2),
    (2, 'I', 15, 2),
    (2, 'I', 16, 2),
    (2, 'I', 17, 2),
    (2, 'I', 18, 2),
    (2, 'I', 19, 2),
    (2, 'I', 20, 2),
    (2, 'I', 21, 2),
    (2, 'I', 22, 2),
    -- Hall 2 / Row J
    (2, 'J', 1, 2),
    (2, 'J', 2, 2),
    (2, 'J', 3, 2),
    (2, 'J', 4, 2),
    (2, 'J', 5, 2),
    (2, 'J', 6, 2),
    (2, 'J', 7, 3),
    (2, 'J', 8, 3),
    (2, 'J', 9, 3),
    (2, 'J', 10, 3),
    (2, 'J', 11, 3),
    (2, 'J', 12, 3),
    (2, 'J', 13, 2),
    (2, 'J', 14, 2),
    (2, 'J', 15, 2),
    (2, 'J', 16, 2),
    (2, 'J', 17, 2),
    (2, 'J', 18, 2),
    (2, 'J', 19, 2),
    (2, 'J', 20, 2),
    -- Hall 2 / Row K
    (2, 'K', 1, 1),
    (2, 'K', 2, 1),
    (2, 'K', 3, 1),
    (2, 'K', 4, 1),
    (2, 'K', 5, 1),
    (2, 'K', 6, 1),
    (2, 'K', 7, 1),
    (2, 'K', 8, 1),
    (2, 'K', 9, 1),
    (2, 'K', 10, 1),
    (2, 'K', 11, 1),
    (2, 'K', 12, 1),
    (2, 'K', 13, 1),
    (2, 'K', 14, 1),
    (2, 'K', 15, 1),
    (2, 'K', 16, 1),
    (2, 'K', 17, 1),
    (2, 'K', 18, 1),
    (2, 'K', 19, 1),
    (2, 'K', 20, 1),
    -- Hall 2 / Row L
    (2, 'L', 1, 1),
    (2, 'L', 2, 1),
    (2, 'L', 3, 1),
    (2, 'L', 4, 1),
    (2, 'L', 5, 1),
    (2, 'L', 6, 1),
    (2, 'L', 7, 1),
    (2, 'L', 8, 1),
    (2, 'L', 9, 1),
    (2, 'L', 10, 1),
    (2, 'L', 11, 1),
    (2, 'L', 12, 1),
    (2, 'L', 13, 1),
    (2, 'L', 14, 1),
    (2, 'L', 15, 1),
    (2, 'L', 16, 1),
    (2, 'L', 17, 1),
    (2, 'L', 18, 1),
    -- Hall 2 / Row M
    (2, 'M', 1, 1),
    (2, 'M', 2, 1),
    (2, 'M', 3, 1),
    (2, 'M', 4, 1),
    (2, 'M', 5, 1),
    (2, 'M', 6, 1),
    (2, 'M', 7, 1),
    (2, 'M', 8, 1),
    (2, 'M', 9, 1),
    (2, 'M', 10, 1),
    (2, 'M', 11, 1),
    (2, 'M', 12, 1),
    (2, 'M', 13, 1),
    (2, 'M', 14, 1),
    (2, 'M', 15, 1),
    (2, 'M', 16, 1),
    (2, 'M', 17, 1),
    (2, 'M', 18, 1),
    -- Hall 2 / Row N
    (2, 'N', 1, 1),
    (2, 'N', 2, 1),
    (2, 'N', 3, 1),
    (2, 'N', 4, 1),
    (2, 'N', 5, 1),
    (2, 'N', 6, 1),
    (2, 'N', 7, 1),
    (2, 'N', 8, 1),
    (2, 'N', 9, 1),
    (2, 'N', 10, 1),
    (2, 'N', 11, 1),
    (2, 'N', 12, 1),
    (2, 'N', 13, 1),
    (2, 'N', 14, 1),
    (2, 'N', 15, 1),
    (2, 'N', 16, 1),
    -- Hall 2 / Row O
    (2, 'O', 1, 1),
    (2, 'O', 2, 1),
    (2, 'O', 3, 1),
    (2, 'O', 4, 1),
    (2, 'O', 5, 1),
    (2, 'O', 6, 1),
    (2, 'O', 7, 1),
    (2, 'O', 8, 1),
    (2, 'O', 9, 1),
    (2, 'O', 10, 1),
    (2, 'O', 11, 1),
    (2, 'O', 12, 1),
    (2, 'O', 13, 1),
    (2, 'O', 14, 1),
    (2, 'O', 15, 1),
    (2, 'O', 16, 1),
    -- Hall 3 / Row A
    (3, 'A', 1, 1),
    (3, 'A', 2, 1),
    (3, 'A', 3, 1),
    (3, 'A', 4, 1),
    (3, 'A', 5, 1),
    (3, 'A', 6, 1),
    (3, 'A', 7, 4),
    (3, 'A', 8, 4),
    -- Hall 3 / Row B
    (3, 'B', 1, 1),
    (3, 'B', 2, 1),
    (3, 'B', 3, 1),
    (3, 'B', 4, 1),
    (3, 'B', 5, 1),
    (3, 'B', 6, 1),
    (3, 'B', 7, 1),
    (3, 'B', 8, 1),
    (3, 'B', 9, 1),
    (3, 'B', 10, 1),
    -- Hall 3 / Row C
    (3, 'C', 1, 1),
    (3, 'C', 2, 2),
    (3, 'C', 3, 2),
    (3, 'C', 4, 2),
    (3, 'C', 5, 2),
    (3, 'C', 6, 2),
    (3, 'C', 7, 2),
    (3, 'C', 8, 2),
    (3, 'C', 9, 1),
    (3, 'C', 10, 1),
    -- Hall 3 / Row D
    (3, 'D', 1, 1),
    (3, 'D', 2, 2),
    (3, 'D', 3, 2),
    (3, 'D', 4, 5),
    (3, 'D', 5, 5),
    (3, 'D', 6, 5),
    (3, 'D', 7, 5),
    (3, 'D', 8, 5),
    (3, 'D', 9, 2),
    (3, 'D', 10, 2),
    (3, 'D', 11, 1),
    (3, 'D', 12, 1),
    -- Hall 3 / Row E
    (3, 'E', 1, 1),
    (3, 'E', 2, 2),
    (3, 'E', 3, 2),
    (3, 'E', 4, 5),
    (3, 'E', 5, 5),
    (3, 'E', 6, 5),
    (3, 'E', 7, 5),
    (3, 'E', 8, 5),
    (3, 'E', 9, 2),
    (3, 'E', 10, 2),
    (3, 'E', 11, 1),
    (3, 'E', 12, 1),
    -- Hall 3 / Row F
    (3, 'F', 1, 1),
    (3, 'F', 2, 1),
    (3, 'F', 3, 2),
    (3, 'F', 4, 2),
    (3, 'F', 5, 2),
    (3, 'F', 6, 2),
    (3, 'F', 7, 2),
    (3, 'F', 8, 1),
    (3, 'F', 9, 1),
    (3, 'F', 10, 1),
    -- Hall 3 / Row G
    (3, 'G', 1, 1),
    (3, 'G', 2, 1),
    (3, 'G', 3, 1),
    (3, 'G', 4, 1),
    (3, 'G', 5, 1),
    (3, 'G', 6, 1),
    (3, 'G', 7, 1),
    (3, 'G', 8, 1),
    (3, 'G', 9, 1),
    (3, 'G', 10, 1),
    -- Hall 3 / Row H
    (3, 'H', 1, 1),
    (3, 'H', 2, 1),
    (3, 'H', 3, 1),
    (3, 'H', 4, 1),
    (3, 'H', 5, 1),
    (3, 'H', 6, 1),
    (3, 'H', 7, 1),
    (3, 'H', 8, 1),
    -- Hall 4 / Row A
    (4, 'A', 1, 1),
    (4, 'A', 2, 1),
    (4, 'A', 3, 1),
    (4, 'A', 4, 1),
    (4, 'A', 5, 1),
    (4, 'A', 6, 1),
    (4, 'A', 7, 1),
    (4, 'A', 8, 1),
    (4, 'A', 9, 1),
    (4, 'A', 10, 1),
    (4, 'A', 11, 4),
    (4, 'A', 12, 4),
    -- Hall 4 / Row B
    (4, 'B', 1, 1),
    (4, 'B', 2, 1),
    (4, 'B', 3, 1),
    (4, 'B', 4, 1),
    (4, 'B', 5, 1),
    (4, 'B', 6, 1),
    (4, 'B', 7, 1),
    (4, 'B', 8, 1),
    (4, 'B', 9, 1),
    (4, 'B', 10, 1),
    (4, 'B', 11, 4),
    (4, 'B', 12, 4),
    -- Hall 4 / Row C
    (4, 'C', 1, 1),
    (4, 'C', 2, 1),
    (4, 'C', 3, 2),
    (4, 'C', 4, 2),
    (4, 'C', 5, 2),
    (4, 'C', 6, 2),
    (4, 'C', 7, 2),
    (4, 'C', 8, 2),
    (4, 'C', 9, 2),
    (4, 'C', 10, 2),
    (4, 'C', 11, 2),
    (4, 'C', 12, 2),
    (4, 'C', 13, 1),
    (4, 'C', 14, 1),
    -- Hall 4 / Row D
    (4, 'D', 1, 1),
    (4, 'D', 2, 1),
    (4, 'D', 3, 2),
    (4, 'D', 4, 2),
    (4, 'D', 5, 2),
    (4, 'D', 6, 2),
    (4, 'D', 7, 2),
    (4, 'D', 8, 2),
    (4, 'D', 9, 2),
    (4, 'D', 10, 2),
    (4, 'D', 11, 2),
    (4, 'D', 12, 2),
    (4, 'D', 13, 1),
    (4, 'D', 14, 1),
    -- Hall 4 / Row E
    (4, 'E', 1, 2),
    (4, 'E', 2, 2),
    (4, 'E', 3, 2),
    (4, 'E', 4, 2),
    (4, 'E', 5, 2),
    (4, 'E', 6, 5),
    (4, 'E', 7, 5),
    (4, 'E', 8, 5),
    (4, 'E', 9, 5),
    (4, 'E', 10, 2),
    (4, 'E', 11, 2),
    (4, 'E', 12, 2),
    (4, 'E', 13, 2),
    (4, 'E', 14, 2),
    (4, 'E', 15, 2),
    (4, 'E', 16, 2),
    -- Hall 4 / Row F
    (4, 'F', 1, 2),
    (4, 'F', 2, 2),
    (4, 'F', 3, 2),
    (4, 'F', 4, 2),
    (4, 'F', 5, 2),
    (4, 'F', 6, 5),
    (4, 'F', 7, 5),
    (4, 'F', 8, 5),
    (4, 'F', 9, 5),
    (4, 'F', 10, 2),
    (4, 'F', 11, 2),
    (4, 'F', 12, 2),
    (4, 'F', 13, 2),
    (4, 'F', 14, 2),
    (4, 'F', 15, 2),
    (4, 'F', 16, 2),
    -- Hall 4 / Row G
    (4, 'G', 1, 2),
    (4, 'G', 2, 2),
    (4, 'G', 3, 2),
    (4, 'G', 4, 2),
    (4, 'G', 5, 2),
    (4, 'G', 6, 5),
    (4, 'G', 7, 5),
    (4, 'G', 8, 5),
    (4, 'G', 9, 5),
    (4, 'G', 10, 2),
    (4, 'G', 11, 2),
    (4, 'G', 12, 2),
    (4, 'G', 13, 2),
    (4, 'G', 14, 2),
    (4, 'G', 15, 2),
    (4, 'G', 16, 2),
    -- Hall 4 / Row H
    (4, 'H', 1, 2),
    (4, 'H', 2, 2),
    (4, 'H', 3, 2),
    (4, 'H', 4, 2),
    (4, 'H', 5, 2),
    (4, 'H', 6, 5),
    (4, 'H', 7, 5),
    (4, 'H', 8, 5),
    (4, 'H', 9, 5),
    (4, 'H', 10, 2),
    (4, 'H', 11, 2),
    (4, 'H', 12, 2),
    (4, 'H', 13, 2),
    (4, 'H', 14, 2),
    (4, 'H', 15, 2),
    (4, 'H', 16, 2),
    -- Hall 4 / Row I
    (4, 'I', 1, 1),
    (4, 'I', 2, 1),
    (4, 'I', 3, 2),
    (4, 'I', 4, 2),
    (4, 'I', 5, 2),
    (4, 'I', 6, 2),
    (4, 'I', 7, 2),
    (4, 'I', 8, 2),
    (4, 'I', 9, 2),
    (4, 'I', 10, 2),
    (4, 'I', 11, 2),
    (4, 'I', 12, 2),
    (4, 'I', 13, 1),
    (4, 'I', 14, 1),
    -- Hall 4 / Row J
    (4, 'J', 1, 1),
    (4, 'J', 2, 1),
    (4, 'J', 3, 2),
    (4, 'J', 4, 2),
    (4, 'J', 5, 2),
    (4, 'J', 6, 2),
    (4, 'J', 7, 2),
    (4, 'J', 8, 2),
    (4, 'J', 9, 2),
    (4, 'J', 10, 2),
    (4, 'J', 11, 2),
    (4, 'J', 12, 2),
    (4, 'J', 13, 1),
    (4, 'J', 14, 1),
    -- Hall 4 / Row K
    (4, 'K', 1, 1),
    (4, 'K', 2, 1),
    (4, 'K', 3, 1),
    (4, 'K', 4, 1),
    (4, 'K', 5, 1),
    (4, 'K', 6, 1),
    (4, 'K', 7, 1),
    (4, 'K', 8, 1),
    (4, 'K', 9, 1),
    (4, 'K', 10, 1),
    (4, 'K', 11, 1),
    (4, 'K', 12, 1),
    -- Hall 4 / Row L
    (4, 'L', 1, 1),
    (4, 'L', 2, 1),
    (4, 'L', 3, 1),
    (4, 'L', 4, 1),
    (4, 'L', 5, 1),
    (4, 'L', 6, 1),
    (4, 'L', 7, 1),
    (4, 'L', 8, 1),
    (4, 'L', 9, 1),
    (4, 'L', 10, 1),
    (4, 'L', 11, 1),
    (4, 'L', 12, 1);

INSERT IGNORE INTO `movie_language` (`movie_lang_enum`, `movie_lang_short_enum`)
VALUES
    ('Svenska', 'Sv'),
    ('Engelska', 'En');

INSERT IGNORE INTO `genre` (`name`)
VALUES
    ('Action'),
    ('Äventyr'),
    ('Komedi'),
    ('Drama'),
    ('Skräck'),
    ('Science Fiction'),
    ('Thriller'),
    ('Fantasy'),
    ('Romantik'),
    ('Animerat');

INSERT IGNORE INTO `movie` (
    `title`,
    `description_short`,
    `description`,
    `duration_minutes`,
    `age_rating`,
    `director`,
    `release_date`,
    `language`
)
VALUES
    (
        'Dune: Part Two',
        'Episkt science fiction-äventyr',
        'Paul Atreides förenas med Chani och Fremen medan han söker hämnd mot de konspirationer som förstörde hans familj. I mötet med valet mellan sitt livs kärlek och universums öde måste han förhindra en fruktansvärd framtid som bara han kan förutse.',
        166,
        '11',
        'Denis Villeneuve',
        '2024-02-28',
        2
    ),
    (
        'Oppenheimer',
        'Biografiskt drama om atombombens fader',
        'Berättelsen om den amerikanske teoretiske fysikern J. Robert Oppenheimer och hans roll i utvecklingen av atombomben.',
        180,
        '11',
        'Christopher Nolan',
        '2023-07-21',
        2
    ),
    (
        'The Super Mario Bros. Movie',
        'Animerat äventyr med Mario och Luigi',
        'Medan Mario och Luigi arbetar för att rädda Brooklyn måste de resa genom kungadömet av svampar för att rädda Prinsessan Peach från den elake Bowser.',
        92,
        'B',
        'Aaron Horvath',
        '2023-04-05',
        2
    ),
    (
        'Barbie',
        'Färgglad komedi om ikonisk docka',
        'Barbie och Ken har den perfekta tiden i det färgglada och till synes perfekta Barbie Land. Men när de får chansen att uppleva den verkliga världen upptäcker de både glädjen och riskerna med att leva bland människor.',
        114,
        '7',
        'Greta Gerwig',
        '2023-07-21',
        2
    ),
    (
        'Wonka',
        'Musikaliskt ursprungsäventyr',
        'Berättelsen om hur en ung Willy Wonka träffade Oompa-Loompas på ett av sina tidigaste äventyr.',
        116,
        '7',
        'Paul King',
        '2023-12-15',
        2
    );

INSERT IGNORE INTO `movie_genre` (`movie_id`, `genre_id`)
VALUES
    (1, 1),
    (1, 2),
    (1, 6),
    (2, 4),
    (2, 7),
    (3, 2),
    (3, 3),
    (3, 10),
    (4, 3),
    (4, 8),
    (4, 9),
    (5, 2),
    (5, 3),
    (5, 8);

INSERT IGNORE INTO `screening` (
    `movie_id`,
    `hall_id`,
    `start_time`,
    `end_time`,
    `base_price`
)
VALUES
    (
        1,
        2,
        '2025-02-10 14:00:00',
        '2025-02-10 16:46:00',
        150.00
    ),
    (
        1,
        2,
        '2025-02-10 18:00:00',
        '2025-02-10 20:46:00',
        150.00
    ),
    (
        1,
        4,
        '2025-02-11 19:30:00',
        '2025-02-11 22:16:00',
        180.00
    ),
    (
        2,
        4,
        '2025-02-10 17:00:00',
        '2025-02-10 20:00:00',
        160.00
    ),
    (
        2,
        2,
        '2025-02-11 16:00:00',
        '2025-02-11 19:00:00',
        140.00
    ),
    (
        3,
        1,
        '2025-02-10 15:00:00',
        '2025-02-10 16:32:00',
        120.00
    ),
    (
        3,
        3,
        '2025-02-10 13:00:00',
        '2025-02-10 14:32:00',
        100.00
    ),
    (
        3,
        1,
        '2025-02-11 11:00:00',
        '2025-02-11 12:32:00',
        100.00
    ),
    (
        4,
        1,
        '2025-02-10 18:00:00',
        '2025-02-10 19:54:00',
        130.00
    ),
    (
        4,
        3,
        '2025-02-11 15:30:00',
        '2025-02-11 17:24:00',
        110.00
    ),
    (
        5,
        3,
        '2025-02-10 17:00:00',
        '2025-02-10 18:56:00',
        120.00
    ),
    (
        5,
        1,
        '2025-02-11 13:30:00',
        '2025-02-11 15:26:00',
        110.00
    );

INSERT IGNORE INTO `price_category_seat` (`category`, `discount_modifier`)
VALUES
    ('Adult', 0.00),
    ('Child', 0.50),
    ('Senior', 0.70),
    ('Student', 0.80),
    ('Handicap', 0.70);

INSERT IGNORE INTO `booking` (
    `user_id`,
    `email`,
    `screening_id`,
    `booking_date`,
    `total_price`,
    `status`,
    `booking_reference`
)
VALUES
    (
        1,
        'erik.andersson@email.se',
        1,
        '2025-02-08 10:30:00',
        340.00,
        'accepted',
        'BK-2025-001'
    ),
    (
        2,
        'anna.svensson@email.se',
        6,
        '2025-02-09 14:20:00',
        240.00,
        'accepted',
        'BK-2025-002'
    ),
    (
        3,
        'lars.johansson@email.se',
        9,
        '2025-02-09 16:45:00',
        310.00,
        'pending',
        'BK-2025-003'
    ),
    (
        4,
        'maria.karlsson@email.se',
        3,
        '2025-02-09 18:00:00',
        540.00,
        'accepted',
        'BK-2025-004'
    ),
    (
        NULL,
        'guest@email.com',
        7,
        '2025-02-10 09:15:00',
        200.00,
        'accepted',
        'BK-2025-005'
    );

INSERT IGNORE INTO `booking_seat` (
    `booking_id`,
    `seat_id`,
    `price_category_seat_id`,
    `final_price`
)
VALUES
    (
        1,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 2
                AND row_name = 'F'
                AND number_in_row = 8
        ),
        1,
        200.00
    ),
    (
        1,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 2
                AND row_name = 'F'
                AND number_in_row = 9
        ),
        1,
        200.00
    ),
    (
        2,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'E'
                AND number_in_row = 5
        ),
        1,
        140.00
    ),
    (
        2,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'E'
                AND number_in_row = 6
        ),
        1,
        140.00
    ),
    (
        3,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'F'
                AND number_in_row = 5
        ),
        1,
        180.00
    ),
    (
        3,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'F'
                AND number_in_row = 6
        ),
        4,
        144.00
    ),
    (
        4,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 4
                AND row_name = 'E'
                AND number_in_row = 6
        ),
        2,
        107.50
    ),
    (
        4,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 4
                AND row_name = 'E'
                AND number_in_row = 7
        ),
        2,
        107.50
    ),
    (
        5,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 3
                AND row_name = 'C'
                AND number_in_row = 5
        ),
        1,
        120.00
    ),
    (
        5,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 3
                AND row_name = 'C'
                AND number_in_row = 6
        ),
        2,
        60.00
    );

INSERT IGNORE INTO `payment` (
    `booking_id`,
    `payment_method`,
    `amount`,
    `status`
)
VALUES
    (1, 'Credit Card', 340.00, 'accepted'),
    (2, 'Swish', 240.00, 'accepted'),
    (3, 'Credit Card', 310.00, 'pending'),
    (4, 'Klarna', 270.00, 'accepted'),
    (5, 'Debit Card', 200.00, 'accepted');

INSERT IGNORE INTO `seat_ghost` (
    `screening_id`,
    `seat_id`,
    `session_id`,
    `reserved_at`,
    `expires_at`
)
VALUES
    (
        6,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'E'
                AND number_in_row = 7
        ),
        'sess_abc123',
        '2025-02-10 12:00:00',
        '2025-02-10 12:15:00'
    ),
    (
        7,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 3
                AND row_name = 'D'
                AND number_in_row = 8
        ),
        'sess_def456',
        '2025-02-10 12:05:00',
        '2025-02-10 12:20:00'
    ),
    (
        9,
        (
            SELECT
                id
            FROM
                seat
            WHERE
                hall_id = 1
                AND row_name = 'F'
                AND number_in_row = 8
        ),
        'sess_ghi789',
        '2025-02-10 12:10:00',
        '2025-02-10 12:25:00'
    );

INSERT IGNORE INTO `snacks` (`name`, `description`, `price`)
VALUES
    ('Popcorn', 'Classic buttered popcorn', 50.00),
    ('Nachos', 'Crispy nachos with cheese dip', 60.00),
    ('Soda', 'Refreshing carbonated drink', 30.00),
    ('Candy', 'Assorted sweet candies', 40.00),
    ('Hot Dog', 'Grilled hot dog with toppings', 70.00);