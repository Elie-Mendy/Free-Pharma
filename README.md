# Free Pharma

## Présentation générale

Le projet Free Pharma présenté dans ce repository est un proof of concept pour une plateforme Web3 de de mise en relation entre freelances et porteurs de missions. 

Le projet répond aux besoins suivants :

* Garantir le paiement des missions en temps et en heure en basant les transactions sur un ensemble de smart contrats
* Permettre aux porteurs de mission d’économiser sur le temps et l’argent qu’implique actuellement le processus de recrutement. 


Néanmoins, le public cible théorique de ce projet n’etant pas familier aux technologies Web3 et cryptomonnaies. 
Ce projet s'éforce également de remplir les deux suivants :

* Proposer une interface qui inspire la confiance aux utilisateurs 
* Favoriser l’adoption des technologies Web3 par deux moyens :
  * proposer une rémunération en TOKEN natif PHARM 
    (en plus de rémunération en fiat si ce devait être un projet en production)
  * Inciter les gens à staker leurs TOKEN sur la plateforme contre récompense. (fonctionnalité principale de ce POC)

`Les rendements du staking sont annualisés, mais un mode Demo a été ajouté à l’application pour pouvoir la tester. (voir vidéo). En mode démo, une minute équivaut à une année.`

## Video Présentation

[Lien vers la vidéo](https://www.loom.com/share/14d65c3a354f40b386325679b59a8bd1)

## Website Demo (Vercel)

[Lien vers l'application web](https://free-pharma-frontend.vercel.app/)


## Commandes

La liste des commandes est la suivantes :
* `yarn blockchain` Lancement de la blockchain locale
* `yarn sc:deploy:local` Déploiement des smart contracts
* `yarn sc:seed:local` Peuplement de l'application en local via un script
* `yarn sc:deploy:sepolia` Déploiement des smart contracts sur le réseau de test sepolia
* `yarn sc:deploy:goerli` Déploiement des smart contracts sur le réseau de test goerli
* `yarn sc:test` Lancement des tests des smart contracts
* `yarn dapp:dev` Lancement de l'application en mode développement
* `yarn dapp:build` Build de l'application
* `yarn dapp:dev` Lancement de l'application en mode production

Le reste des commandes est disponible dans le fichier `package.json` 

## Installation du projet
```sh
git clone https://github.com/Elie-Mendy/Free-Pharma.git
cd frontend
yarn
cd ../hardhat-project
yarn
```

## Lancement l'application

### premier terminal
```sh
yarn blockchain
```

### deuxieme terminal
```sh
yarn sc:deploy:local        # deploiement des smart contracts
yarn dapp:build             # build de l'application
yarn dapp:start             # lancement de l'application
```

L'application sera accessible en local sur le port 3000 : `http://localhost:3000`



## Documentation

### documentation des fonctions
La documentation est générée automatiquement en reprenant les commentaires `natspec` associés
aux fonctions dessmart contracts.

Une fois le projet cloné en local il est possible d'accéder à cette dernière via un serveur local 
en accedant au fichier présents dans le répertoire `hardhat-pproject/docs`

### Spec fonctionnelle 
Les tests des smart contracts ont été rédigé de manière a etre utilisé comme une spec fonctionnelle
Pour vous familiariser avec le projet il est fortement recommandé de lire le code en vous appuyant sur 
le rapport le document `SPEC.md` 



## Smart Contrats

* **PHARM.sol** : Token PHARM utilisé pour la rémunération des freelances et pour le staking.

* **DataStorage.sol** : Contient l’ensemble des data relatives aux missions, aux freelances et aux porteurs de missions. 


* **IDataStorage.sol** : Interface du contrat DataStorage.sol

* **FreePharma.sol** : Contient la logique métier de l’application et les permissions des différents types d’utilisateurs. Interagie avec le contrat précédent pour la consommation et le stockage d’informations.


* **StakingManager.sol** : Gère le staking et l’attribution des récompenses en fonction du temps et des montants stakés.

* **PriceProvider.sol** : Fourni le prix de l’ETH (via chainlink) 

* **MockPriceProvider.sol** : Assure le rôle du contrat précédent pour l’environnement de développement en fournissant un prix fixe de l’ETH.

### Tests 

File                    |  % Stmts | % Branch |  % Funcs |  % Lines |
------------------------|----------|----------|----------|----------|
 contracts/             |    95.43 |     87.3 |       95 |    93.77 |
  DataStorage.sol       |       94 |    66.67 |    91.89 |    94.44 |
  FreePharma.sol        |      100 |    88.75 |      100 |    92.86 |
  MockPriceProvider.sol |      100 |      100 |      100 |      100 |
  PHARM.sol             |      100 |      100 |      100 |      100 |
  PriceProvider.sol     |        0 |      100 |       50 |    33.33 |
  StakingManager.sol    |    94.92 |    86.84 |      100 |    95.95 |
------------------------|----------|----------|----------|----------|
All files               |    95.43 |     87.3 |       95 |    93.77 |
------------------------|----------|----------|----------|----------|


### Adresses sur le réseau Sepolia

* **PHARM.sol** : 0x274Aa9f2A679c8d9E92872BcFE8276FE62d27fAB
* **DataStorage.sol** : 0x202924be57c704BF7c5188d59a98373a09E511b6
* **FreePharma.sol** : 0x94aC16B129833DEA9C8A9F4FA88cB13b2027024b
* **StakingManager.sol** : 0x33FbA86C427720361b324F010e5F2e9b0715d5eF
* **PriceProvider.sol** : 0x73E5fF0d8d0a4E629f23C23034609108853a45E8
___

## Technologies utilisées

##### BackEnd:

 - [Solidity](https://docs.soliditylang.org/fr/latest/index.html)
 - [Hardhat](https://hardhat.org/)
 - [Etherjs](https://docs.ethers.org/v5/)
 - [Chai](https://www.chaijs.com/)
 - [Mocha](https://mochajs.org/)
 - [Infura](https://infura.io/)

##### FrontEnd:

 - [NextJS](https://nextjs.org/)
 - [Vercel](https://vercel.com/)
 - [Chakra-UI](https://chakra-ui.com/)
 - [Raibowkit](https://www.rainbowkit.com/)
 - [Wagmi](https://wagmi.sh/)
 - [Viem](https://viem.sh/)
 - [WalletConnect](https://walletconnect.com/)
  
___

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.


###### Realised by [Elie-Mendy](https://github.com/Elie-Mendy) 
