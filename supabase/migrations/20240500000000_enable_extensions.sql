-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER DATABASE postgres SET "app.settings.app_metadata" = 'app_metadata';
ALTER DATABASE postgres SET "app.settings.user_metadata" = 'user_metadata'; 