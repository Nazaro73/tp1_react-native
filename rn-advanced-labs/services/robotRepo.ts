import { getDatabase } from '../db';
import { Robot, RobotInput, RobotType, RobotTypeValue } from '../validation/robotSchema';
import uuid from 'react-native-uuid';

export interface ListOptions {
  q?: string;           // Recherche par nom
  sort?: 'name' | 'year' | 'created_at';
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  includeArchived?: boolean;
}

/**
 * Repository pour gérer les opérations CRUD sur les robots
 */
export class RobotRepository {

  /**
   * Crée un nouveau robot
   */
  async create(robotInput: RobotInput): Promise<Robot> {
    const db = await getDatabase();
    const id = uuid.v4() as string;
    const now = Math.floor(Date.now() / 1000);

    try {
      console.log('➕ [RobotRepo] Création robot:', robotInput.name);

      await db.runAsync(
        `INSERT INTO robots (id, name, label, year, type, created_at, updated_at, archived)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [id, robotInput.name, robotInput.label, robotInput.year, robotInput.type, now, now]
      );

      const robot = await this.getById(id);
      if (!robot) {
        throw new Error('Robot créé mais introuvable');
      }

      console.log('✅ [RobotRepo] Robot créé:', id);
      return robot;
    } catch (error: any) {
      console.error('❌ [RobotRepo] Erreur création:', error);

      // Gestion erreur unicité
      if (error.message?.includes('UNIQUE constraint failed')) {
        throw new Error(`Un robot avec le nom "${robotInput.name}" existe déjà`);
      }

      throw error;
    }
  }

  /**
   * Met à jour un robot existant
   */
  async update(id: string, changes: Partial<RobotInput>): Promise<Robot> {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    try {
      console.log('✏️ [RobotRepo] Mise à jour robot:', id);

      // Construire la requête dynamiquement selon les champs à mettre à jour
      const fields: string[] = [];
      const values: any[] = [];

      if (changes.name !== undefined) {
        fields.push('name = ?');
        values.push(changes.name);
      }
      if (changes.label !== undefined) {
        fields.push('label = ?');
        values.push(changes.label);
      }
      if (changes.year !== undefined) {
        fields.push('year = ?');
        values.push(changes.year);
      }
      if (changes.type !== undefined) {
        fields.push('type = ?');
        values.push(changes.type);
      }

      // Toujours mettre à jour updated_at
      fields.push('updated_at = ?');
      values.push(now);

      // Ajouter l'id à la fin pour le WHERE
      values.push(id);

      const result = await db.runAsync(
        `UPDATE robots SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      if (result.changes === 0) {
        throw new Error('Robot introuvable');
      }

      const robot = await this.getById(id);
      if (!robot) {
        throw new Error('Robot modifié mais introuvable');
      }

      console.log('✅ [RobotRepo] Robot mis à jour:', id);
      return robot;
    } catch (error: any) {
      console.error('❌ [RobotRepo] Erreur mise à jour:', error);

      // Gestion erreur unicité
      if (error.message?.includes('UNIQUE constraint failed')) {
        throw new Error(`Un robot avec le nom "${changes.name}" existe déjà`);
      }

      throw error;
    }
  }

  /**
   * Supprime un robot (hard delete)
   */
  async remove(id: string): Promise<void> {
    const db = await getDatabase();

    try {
      console.log('🗑️ [RobotRepo] Suppression robot:', id);

      const result = await db.runAsync(
        'DELETE FROM robots WHERE id = ?',
        [id]
      );

      if (result.changes === 0) {
        throw new Error('Robot introuvable');
      }

      console.log('✅ [RobotRepo] Robot supprimé:', id);
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur suppression:', error);
      throw error;
    }
  }

  /**
   * Archive un robot (soft delete)
   */
  async archive(id: string): Promise<Robot> {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    try {
      console.log('📦 [RobotRepo] Archivage robot:', id);

      const result = await db.runAsync(
        'UPDATE robots SET archived = 1, updated_at = ? WHERE id = ?',
        [now, id]
      );

      if (result.changes === 0) {
        throw new Error('Robot introuvable');
      }

      const robot = await this.getById(id, true);
      if (!robot) {
        throw new Error('Robot archivé mais introuvable');
      }

      console.log('✅ [RobotRepo] Robot archivé:', id);
      return robot;
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur archivage:', error);
      throw error;
    }
  }

  /**
   * Désarchive un robot
   */
  async unarchive(id: string): Promise<Robot> {
    const db = await getDatabase();
    const now = Math.floor(Date.now() / 1000);

    try {
      console.log('📂 [RobotRepo] Désarchivage robot:', id);

      const result = await db.runAsync(
        'UPDATE robots SET archived = 0, updated_at = ? WHERE id = ?',
        [now, id]
      );

      if (result.changes === 0) {
        throw new Error('Robot introuvable');
      }

      const robot = await this.getById(id);
      if (!robot) {
        throw new Error('Robot désarchivé mais introuvable');
      }

      console.log('✅ [RobotRepo] Robot désarchivé:', id);
      return robot;
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur désarchivage:', error);
      throw error;
    }
  }

  /**
   * Récupère un robot par son ID
   */
  async getById(id: string, includeArchived: boolean = false): Promise<Robot | null> {
    const db = await getDatabase();

    try {
      const whereClause = includeArchived ? 'id = ?' : 'id = ? AND archived = 0';

      const row = await db.getFirstAsync<any>(
        `SELECT * FROM robots WHERE ${whereClause}`,
        [id]
      );

      if (!row) {
        return null;
      }

      return this.mapRowToRobot(row);
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur récupération:', error);
      throw error;
    }
  }

  /**
   * Liste les robots avec filtres et pagination
   */
  async list(options: ListOptions = {}): Promise<Robot[]> {
    const db = await getDatabase();

    try {
      const {
        q,
        sort = 'name',
        order = 'ASC',
        limit = 100,
        offset = 0,
        includeArchived = false
      } = options;

      let whereClause = includeArchived ? '1=1' : 'archived = 0';
      const params: any[] = [];

      // Filtre de recherche
      if (q && q.trim()) {
        whereClause += ' AND name LIKE ?';
        params.push(`%${q.trim()}%`);
      }

      // Tri
      const validSorts = ['name', 'year', 'created_at'];
      const sortField = validSorts.includes(sort) ? sort : 'name';
      const orderDirection = order === 'DESC' ? 'DESC' : 'ASC';

      // Pagination
      params.push(limit, offset);

      const query = `
        SELECT * FROM robots
        WHERE ${whereClause}
        ORDER BY ${sortField} ${orderDirection}
        LIMIT ? OFFSET ?
      `;

      console.log('📋 [RobotRepo] Liste robots:', { q, sort, order, limit, offset });

      const rows = await db.getAllAsync<any>(query, params);

      return rows.map(row => this.mapRowToRobot(row));
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur listage:', error);
      throw error;
    }
  }

  /**
   * Compte le nombre total de robots
   */
  async count(includeArchived: boolean = false): Promise<number> {
    const db = await getDatabase();

    try {
      const whereClause = includeArchived ? '1=1' : 'archived = 0';

      const result = await db.getFirstAsync<{ total: number }>(
        `SELECT COUNT(*) as total FROM robots WHERE ${whereClause}`
      );

      return result?.total || 0;
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur comptage:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un nom est unique
   */
  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const db = await getDatabase();

    try {
      let query = 'SELECT COUNT(*) as count FROM robots WHERE name = ? AND archived = 0';
      const params: any[] = [name];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const result = await db.getFirstAsync<{ count: number }>(query, params);

      return (result?.count || 0) === 0;
    } catch (error) {
      console.error('❌ [RobotRepo] Erreur vérification unicité:', error);
      throw error;
    }
  }

  /**
   * Exporte tous les robots en JSON
   */
  async exportToJSON(includeArchived: boolean = false): Promise<Robot[]> {
    console.log('📤 [RobotRepo] Export JSON');
    return this.list({ limit: 10000, includeArchived });
  }

  /**
   * Mappe une ligne SQL vers un objet Robot
   */
  private mapRowToRobot(row: any): Robot {
    return {
      id: row.id,
      name: row.name,
      label: row.label,
      year: row.year,
      type: row.type as RobotTypeValue,
      created_at: row.created_at,
      updated_at: row.updated_at,
      archived: row.archived === 1
    };
  }
}

// Instance singleton
export const robotRepo = new RobotRepository();
