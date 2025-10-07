import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/redux/store';
import type { Robot } from '../../validation/robotSchema';

// Sélecteurs de base
export const selectRobotsState = (state: RootState) => state.robots;
export const selectRobots = (state: RootState) => state.robots.items;
export const selectRobotsLoading = (state: RootState) => state.robots.isLoading;
export const selectRobotsError = (state: RootState) => state.robots.error;

// Sélecteur avec ID paramétré (curried function)
export const selectRobotById = (id: string) => (state: RootState): Robot | undefined =>
  state.robots.items.find((robot: Robot) => robot.id === id);

// Sélecteurs mémoïsés avec createSelector
export const selectRobotsSortedByName = createSelector(
  [selectRobots],
  (robots: Robot[]) => {
    console.log('🔄 [Selectors] Recalcul du tri des robots');
    return [...robots].sort((a: Robot, b: Robot) => a.name.localeCompare(b.name));
  }
);

export const selectRobotsSortedByYear = createSelector(
  [selectRobots],
  (robots: Robot[]) => {
    console.log('🔄 [Selectors] Recalcul du tri par année');
    return [...robots].sort((a: Robot, b: Robot) => b.year - a.year);
  }
);

export const selectRobotsCount = createSelector(
  [selectRobots],
  (robots: Robot[]) => robots.length
);

export const selectRobotsByType = createSelector(
  [selectRobots],
  (robots: Robot[]) => {
    console.log('🔄 [Selectors] Regroupement par type');
    return robots.reduce((acc: Record<string, Robot[]>, robot: Robot) => {
      if (!acc[robot.type]) {
        acc[robot.type] = [];
      }
      acc[robot.type].push(robot);
      return acc;
    }, {} as Record<string, Robot[]>);
  }
);

export const selectRobotsStats = createSelector(
  [selectRobots],
  (robots: Robot[]) => {
    console.log('🔄 [Selectors] Calcul des statistiques');
    const stats = {
      total: robots.length,
      byType: {} as Record<string, number>,
      averageYear: 0,
      newestYear: 0,
      oldestYear: 0,
    };

    if (robots.length === 0) return stats;

    // Compter par type
    robots.forEach((robot: Robot) => {
      stats.byType[robot.type] = (stats.byType[robot.type] || 0) + 1;
    });

    // Statistiques d'années
    const years = robots.map((r: Robot) => r.year);
    stats.averageYear = Math.round(years.reduce((sum: number, year: number) => sum + year, 0) / years.length);
    stats.newestYear = Math.max(...years);
    stats.oldestYear = Math.min(...years);

    return stats;
  }
);

// Sélecteur pour vérifier l'unicité d'un nom
export const selectIsNameUnique = (name: string, excludeId?: string) => 
  createSelector(
    [selectRobots],
    (robots: Robot[]) => {
      const trimmedName = name.trim().toLowerCase();
      return !robots.some((robot: Robot) => 
        robot.id !== excludeId && 
        robot.name.toLowerCase() === trimmedName
      );
    }
  );

// Sélecteur combiné pour l'état de chargement/erreur
export const selectRobotsUIState = createSelector(
  [selectRobotsLoading, selectRobotsError, selectRobotsCount],
  (isLoading: boolean, error: string | null, count: number) => ({
    isLoading,
    hasError: !!error,
    error,
    isEmpty: count === 0,
    hasData: count > 0,
  })
);