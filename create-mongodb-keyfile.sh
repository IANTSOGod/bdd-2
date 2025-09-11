#!/bin/bash

# Génère un fichier de clé pour MongoDB Replica Set
# Ce fichier doit être identique sur tous les nœuds du replica set

echo "Création du fichier de clé MongoDB..."

# Génère une clé aléatoire de 1024 caractères
openssl rand -base64 756 > mongodb-keyfile

# Définit les permissions correctes (MongoDB est strict là-dessus)
chmod 400 mongodb-keyfile

echo "Fichier mongodb-keyfile créé avec succès!"
echo "Permissions définies à 400 (lecture seule pour le propriétaire)"

# Affiche le contenu pour vérification
echo "Contenu du fichier (premières lignes):"
head -3 mongodb-keyfile
echo "..."
echo "Fichier prêt à être utilisé avec Docker Compose"