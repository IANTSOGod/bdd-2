try {
  console.log('Initializing single-node replica set...');

  // Configuration du replica set avec un seul nœud
  const config = {
    _id: 'rs0',
    version: 1,
    members: [
      {
        _id: 0,
        host: 'mongodb:27017',
      },
    ],
  };

  // Initialiser le replica set
  const result = rs.initiate(config);
  console.log('Replica set initialization result:', result);

  // Attendre que l'initialisation soit terminée
  console.log('Waiting for replica set to be ready...');
  let attempts = 0;
  while (attempts < 30) {
    try {
      const status = rs.status();
      const primary = status.members.find(
        (member) => member.stateStr === 'PRIMARY',
      );
      if (primary) {
        console.log('Replica set ready! Primary:', primary.name);
        break;
      }
    } catch (e) {
      // Pas encore prêt
    }
    sleep(1000);
    attempts++;
  }

  console.log('Single-node replica set configuration completed!');
} catch (error) {
  console.log('Note:', error.message);

  // Vérifier si le replica set existe déjà
  try {
    const existingStatus = rs.status();
    console.log('Replica set already configured:');
    existingStatus.members.forEach((member) => {
      console.log(`- ${member.name}: ${member.stateStr}`);
    });
  } catch (e) {
    console.log('Replica set might need manual configuration');
  }
}
