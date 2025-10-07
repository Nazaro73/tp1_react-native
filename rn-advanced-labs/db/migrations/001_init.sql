-- Migration v1: Création de la table robots
CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('industrial', 'service', 'medical', 'educational', 'other')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
