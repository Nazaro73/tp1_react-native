-- Migration v2: Ajout d'index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);
CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);
CREATE INDEX IF NOT EXISTS idx_robots_type ON robots(type);
