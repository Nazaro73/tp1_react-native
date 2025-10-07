-- Migration v3: Ajout de la colonne archived pour soft delete
ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);
