@echo off
echo Nettoyage complet du projet React Native...

echo Suppression des node_modules...
if exist node_modules rmdir /s /q node_modules

echo Suppression du cache npm...
npm cache clean --force

echo Suppression des fichiers de cache...
if exist .expo del /s /q .expo\*
if exist .next rmdir /s /q .next
if exist .metro rmdir /s /q .metro

echo Reinstallation des dependances...
npm install

echo Nettoyage du cache Expo...
npx expo install --fix

echo Demarrage du serveur avec cache nettoye...
npx expo start --clear --reset-cache

echo Nettoyage termine!