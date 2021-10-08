Projet 6 Openclassrooms


Création d'une API sécurisée pour le site d'avis gastronomiques Pekocko. 

* Spécifications fonctionnelles : 
  - 1 modèle sauce
  - 1 modèle utilisateur
  - L'utilisateur doit pouvoir créer, modifier ou supprimer son profil.
  - L'utilisateur peut créer un avis Sauce, le modifier, le supprimer
  - L'utilisateur peut liker les sauces
  
* Spécifications techniques : 
  - Technologies : server Node.js, framework Express, MongoDB, packe mongoose pour toutes les opérations avec la DB.
  - Respect du RGPD et recommandations de l'OWASP
  - Mot de passe utilisateur chiffré (stockée chiffré dans la db)
  - 2 droits administrateurs : admin et user
  - Authentification renforcée sur les routes
  - Adresses mails uniques dans la db -> utilistion de mongoose
  - Opérations CRUD avec la base de données (hébergée sur MongoDb)
  - Erreurs renvoyées tel quel

* Installation : 
  - Frontend : NodeJS v 12.14 ou 14.0, Angular CLI v 7.0.2, node-sass -> npm run start pour le lancement (localhost:4200)
  - Backend : install and run nodemon (localhost:3000)

* Pekocko : 

![screenPeckoko](https://user-images.githubusercontent.com/79877110/136541469-433c92a4-f80d-4f57-8ad1-e6a8ce72b938.jpg)
