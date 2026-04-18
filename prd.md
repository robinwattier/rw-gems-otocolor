# DOCUMENTATION PRODUIT : LOGICIEL IA D'AUTO-COLORISATION 2D (OFFLINE)

## 1. LE MOTEUR CENTRAL : FONCTIONNEMENT DE BASE
Cette section décrit l'architecture de base du logiciel, garantissant la sécurité des données et la cohérence visuelle de l'outil.

* ARCHITECTURE OFFLINE (Privacy-First) : Le logiciel et le modèle de Machine Learning s'exécutent entièrement en local sur la machine de l'artiste. Aucune donnée, aucun dessin, ni aucune frame n'est envoyé sur le Cloud.
* MOTEUR DE VISION PAR ORDINATEUR : Intégration d'un modèle d'IA spécialisé dans la reconnaissance spatiale et la segmentation d'images. L'IA ne se contente pas de remplir des zones fermées (comme un pot de peinture classique), elle "comprend" le volume et l'anatomie du personnage.
* GESTIONNAIRE DE PALETTES : Outil d'assignation colorimétrique strict. Prise en charge des codes hexadécimaux, outil pipette, et création de bibliothèques de couleurs associées à des "Tags" (ex: #FF5733 = "Veste_Héros").
* INTERFACE UTILISATEUR (UI) : Espace de travail adapté aux animateurs comprenant une timeline (ligne du temps), un gestionnaire de calques (Line art / Couleurs / Background), et un canevas central de visualisation.
* CONTRÔLE DE COHÉRENCE : L'algorithme vérifie en temps réel le respect des palettes de référence pour éviter le "scintillement" (flickering) des couleurs entre deux frames.

---

## 2. SPÉCIFICITÉS PAR PHASES DE TRAVAIL (WORKFLOW)

### PHASE A : INGESTION & APPRENTISSAGE (Setup)
* CONTEXTE DE DÉPART : L'artiste importe ses séquences d'animation brutes (Line art) et ses documents de référence (Turn arounds, Model sheets).
* ASSIGNATION SÉMANTIQUE : L'utilisateur définit les zones de référence sur quelques images clés (Keyframes). Il indique à l'IA quelles couleurs (Hex) correspondent à quels éléments et pour quel objets, personnages (ex: cheveux, peau, t-shirt, accessoires).
* ENTRAÎNEMENT LOCAL (Few-Shot Learning) : L'IA analyse ces quelques images clés pour comprendre l'apparence du personnage, ses proportions et le mapping des couleurs, préparant ainsi le terrain pour la séquence complète.

### PHASE B : PROPAGATION AUTOMATIQUE (Auto-Colorisation)
* LANCEMENT DU PROCESSUS : L'artiste déclenche la colorisation sur le reste de la séquence (les "in-betweens" ou intervalles).
* ADAPTATION AUX MOUVEMENTS : Grâce à la vision par ordinateur, l'IA reconnaît les éléments du personnage même si l'angle de vue change (rotation de la tête, changement de perspective, poses dynamiques) et applique les couleurs correspondante.
* GESTION DES LIGNES OUVERTES : Contrairement aux outils traditionnels, l'IA est capable de fermer virtuellement les "trous" dans le line art (gaps) pour éviter que la couleur ne bave sur d'autres zones ou sur le décor.

### PHASE C : CONTRÔLE QUALITÉ & EXPORT (Retouches)
* HUMAN-IN-THE-LOOP : L'IA génère les calques de couleurs de manière non destructive. Si une erreur survient (ex: un bras confondu avec le torse lors d'une pose complexe), l'artiste peut corriger manuellement la zone sur une frame.
* RÉ-APPRENTISSAGE DYNAMIQUE : Dès que l'artiste corrige une frame manuellement, l'IA prend en compte cette correction instantanément pour ajuster les frames suivantes sans avoir à tout recalculer depuis le début.
* EXPORTATION : Export de la séquence colorisée dans les formats standards de l'industrie (Séquences PNG avec canal Alpha, PSD multicalques, MP4) pour intégration dans des logiciels de compositing (ex: After Effects, Toon Boom).
