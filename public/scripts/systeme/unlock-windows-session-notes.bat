@echo off
REM ============================================================================
REM  Nom: unlock-windows-session-notes.bat
REM  Objet: Notes non exécutables pour débloquer une session Windows (PIN/MDP oublié)
REM  Usage: FICHIER DE NOTES UNIQUEMENT. NE PAS L'EXÉCUTER. Toutes les lignes ci-
REM         dessous sont des instructions manuelles à suivre depuis l'environnement
REM         de récupération/clé USB. Les commandes sont commentées volontairement.
REM ============================================================================

REM 1) Démarrer sur une clé USB Windows (WinRE/WinPE) puis ouvrir l'invite de commande.

REM 2) Identifier la lettre du disque contenant Windows:
REM    > diskpart
REM    > list volume
REM    Repérer le volume où se trouve le dossier \Windows (ex: Z:)

REM    S'il n'y en a pas (pas de lettre sur le volume Windows):
REM    > select volume X
REM    > assign letter=Z
REM    > exit

REM 3) Vérifier la présence des fichiers cibles:
REM    > dir Z:\windows\system32\cmd.exe
REM    > dir Z:\windows\system32\utilman.exe

REM 4) Remplacer utilman.exe par cmd.exe (sauvegarder si besoin avant):
REM    (Optionnel) Sauvegarde:
REM    > copy Z:\windows\system32\utilman.exe Z:\windows\system32\utilman.exe.bak
REM    Remplacement:
REM    > copy Z:\windows\system32\cmd.exe Z:\windows\system32\utilman.exe
REM    Tapez O (Oui) si demandé pour remplacer.

REM 5) Redémarrer le PC normalement.

REM 6) À l'écran de connexion, cliquer sur le bouton "Ergonomie" (facilités d'accès):
REM    Une fenêtre CMD s'ouvre avec privilèges système.

REM 7) Changer le mot de passe du compte désiré:
REM    > net user nom_utilisateur nouveau_motdepasse
REM    Exemple:
REM    > net user martin 123456

REM 8) (Recommandé) Après récupération d'accès, restaurer utilman.exe d'origine:
REM    Démarrer à nouveau sur WinRE/WinPE si nécessaire et restaurer:
REM    > copy Z:\windows\system32\utilman.exe.bak Z:\windows\system32\utilman.exe
REM    (Remplacer si demandé)

REM 9) Considérations de sécurité:
REM    - N'effectuer ces opérations que sur des machines que vous êtes autorisé à dépanner.
REM    - Retirer toute sauvegarde résiduelle (utilman.exe.bak) une fois terminé.
REM    - Mettre en place des protections (BitLocker, comptes sécurisés) après usage.

REM Fin des notes.
