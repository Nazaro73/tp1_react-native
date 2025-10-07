import * as SQLite from 'expo-sqlite';
import { File, Paths } from 'expo-file-system';

// Migrations SQL
const migrations = [
  `-- Migration v1: Création de la table robots
CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('industrial', 'service', 'medical', 'educational', 'other')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);`,

  `-- Migration v2: Ajout d'index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);
CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);
CREATE INDEX IF NOT EXISTS idx_robots_type ON robots(type);`,

  `-- Migration v3: Ajout de la colonne archived pour soft delete
ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);`
];

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Ouvre la base de données et exécute les migrations nécessaires
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    console.log('📦 [DB] Ouverture de la base de données robots.db');

    // Ouvrir la base de données
    dbInstance = await SQLite.openDatabaseAsync('robots.db');

    // Exécuter les migrations
    await runMigrations(dbInstance);

    console.log('✅ [DB] Base de données prête');
    return dbInstance;
  } catch (error) {
    console.error('❌ [DB] Erreur lors de l\'ouverture de la base:', error);
    throw error;
  }
}

/**
 * Exécute les migrations nécessaires
 */
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    // Récupérer la version actuelle
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentVersion = result?.user_version || 0;

    console.log(`🔄 [DB] Version actuelle: v${currentVersion}`);
    console.log(`🔄 [DB] Version cible: v${migrations.length}`);

    // Exécuter les migrations manquantes
    for (let i = currentVersion; i < migrations.length; i++) {
      const migrationVersion = i + 1;
      console.log(`⬆️ [DB] Migration v${migrationVersion}...`);

      try {
        await db.execAsync(migrations[i]);
        await db.execAsync(`PRAGMA user_version = ${migrationVersion}`);
        console.log(`✅ [DB] Migration v${migrationVersion} terminée`);
      } catch (migrationError) {
        console.error(`❌ [DB] Erreur migration v${migrationVersion}:`, migrationError);
        throw new Error(`Migration v${migrationVersion} échouée: ${migrationError}`);
      }
    }

    if (currentVersion === migrations.length) {
      console.log('✅ [DB] Base de données à jour');
    }
  } catch (error) {
    console.error('❌ [DB] Erreur lors des migrations:', error);
    throw error;
  }
}

/**
 * Ferme la base de données
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    console.log('🔒 [DB] Base de données fermée');
  }
}

/**
 * Récupère l'instance de la base de données
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    return await openDatabase();
  }
  return dbInstance;
}

/**
 * Réinitialise complètement la base de données (DANGER!)
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log('⚠️ [DB] Réinitialisation de la base de données...');

    if (dbInstance) {
      await dbInstance.closeAsync();
      dbInstance = null;
    }

    // Supprimer le fichier de la base
    const dbFile = new File(Paths.document, 'SQLite/robots.db');

    if (dbFile.exists) {
      await dbFile.delete();
      console.log('🗑️ [DB] Fichier de base supprimé');
    }

    // Rouvrir et recréer
    await openDatabase();
    console.log('✅ [DB] Base de données réinitialisée');
  } catch (error) {
    console.error('❌ [DB] Erreur lors de la réinitialisation:', error);
    throw error;
  }
}
