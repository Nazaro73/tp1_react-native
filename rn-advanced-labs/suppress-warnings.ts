// Configuration pour supprimer les avertissements de développement
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  // Supprimer les avertissements de dépréciation pour pointerEvents
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' && 
      args[0].includes('props.pointerEvents is deprecated')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Supprimer les logs métro inutiles
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Metro waiting on') || args[0].includes('Bundled'))
    ) {
      return;
    }
    originalLog.apply(console, args);
  };
}