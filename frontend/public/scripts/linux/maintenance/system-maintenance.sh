#!/bin/bash
# Outil de maintenance système Linux (équivalent Windows maintenance tool)

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de pause
pause_return() {
    echo ""
    echo "Appuyez sur une touche pour revenir au menu..."
    read -n 1 -s
}

# Fonction pour afficher le titre
show_title() {
    clear
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${BLUE}      OUTIL DE MAINTENANCE SYSTÈME LINUX${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo ""
}

# Nettoyage des paquets
clean_packages() {
    echo -e "${YELLOW}=== Nettoyage des paquets ===${NC}"
    
    # Détecter le gestionnaire de paquets
    if command -v apt >/dev/null 2>&1; then
        echo "Nettoyage avec apt..."
        sudo apt autoremove -y
        sudo apt autoclean
        sudo apt clean
    elif command -v yum >/dev/null 2>&1; then
        echo "Nettoyage avec yum..."
        sudo yum autoremove -y
        sudo yum clean all
    elif command -v dnf >/dev/null 2>&1; then
        echo "Nettoyage avec dnf..."
        sudo dnf autoremove -y
        sudo dnf clean all
    elif command -v pacman >/dev/null 2>&1; then
        echo "Nettoyage avec pacman..."
        sudo pacman -Rns $(pacman -Qtdq) 2>/dev/null || true
        sudo pacman -Sc --noconfirm
    elif command -v zypper >/dev/null 2>&1; then
        echo "Nettoyage avec zypper..."
        sudo zypper clean --all
    else
        echo "Gestionnaire de paquets non supporté"
    fi
    
    echo -e "${GREEN}✓ Nettoyage des paquets terminé${NC}"
}

# Nettoyage des logs
clean_logs() {
    echo -e "${YELLOW}=== Nettoyage des logs ===${NC}"
    
    # Nettoyer les logs anciens (plus de 7 jours)
    sudo find /var/log -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
    sudo find /var/log -name "*.gz" -type f -mtime +30 -delete 2>/dev/null || true
    
    # Vider les logs système
    sudo journalctl --vacuum-time=7d 2>/dev/null || true
    
    echo -e "${GREEN}✓ Nettoyage des logs terminé${NC}"
}

# Nettoyage du cache
clean_cache() {
    echo -e "${YELLOW}=== Nettoyage du cache ===${NC}"
    
    # Cache utilisateur
    rm -rf ~/.cache/* 2>/dev/null || true
    
    # Cache système
    sudo rm -rf /tmp/* 2>/dev/null || true
    sudo rm -rf /var/tmp/* 2>/dev/null || true
    
    # Cache des applications
    sudo rm -rf /var/cache/* 2>/dev/null || true
    
    echo -e "${GREEN}✓ Nettoyage du cache terminé${NC}"
}

# Vérification de l'espace disque
check_disk_space() {
    echo -e "${YELLOW}=== Vérification de l'espace disque ===${NC}"
    
    df -h | grep -E "(Filesystem|/dev/)" | while read -r line; do
        usage=$(echo "$line" | awk '{print $5}' | sed 's/%//')
        if [ "$usage" -gt 90 ]; then
            echo -e "${RED}⚠ $line${NC}"
        elif [ "$usage" -gt 75 ]; then
            echo -e "${YELLOW}⚠ $line${NC}"
        else
            echo -e "${GREEN}✓ $line${NC}"
        fi
    done
}

# Vérification de la mémoire
check_memory() {
    echo -e "${YELLOW}=== Vérification de la mémoire ===${NC}"
    
    free -h
    echo ""
    
    # Vérifier l'utilisation de la swap
    swapon --show 2>/dev/null || echo "Aucune swap active"
}

# Mise à jour du système
update_system() {
    echo -e "${YELLOW}=== Mise à jour du système ===${NC}"
    
    if command -v apt >/dev/null 2>&1; then
        sudo apt update && sudo apt upgrade -y
    elif command -v yum >/dev/null 2>&1; then
        sudo yum update -y
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf upgrade -y
    elif command -v pacman >/dev/null 2>&1; then
        sudo pacman -Syu --noconfirm
    elif command -v zypper >/dev/null 2>&1; then
        sudo zypper update -y
    else
        echo "Gestionnaire de paquets non supporté"
    fi
    
    echo -e "${GREEN}✓ Mise à jour terminée${NC}"
}

# Vérification de la sécurité
security_check() {
    echo -e "${YELLOW}=== Vérification de la sécurité ===${NC}"
    
    # Vérifier les mises à jour de sécurité
    if command -v apt >/dev/null 2>&1; then
        echo "Mises à jour de sécurité disponibles:"
        apt list --upgradable 2>/dev/null | grep -i security || echo "Aucune mise à jour de sécurité"
    fi
    
    # Vérifier les connexions réseau
    echo ""
    echo "Connexions réseau actives:"
    ss -tuln | head -10
}

# Menu principal
show_menu() {
    show_title
    echo "  1) Nettoyage des paquets"
    echo "  2) Nettoyage des logs"
    echo "  3) Nettoyage du cache"
    echo "  4) Vérification de l'espace disque"
    echo "  5) Vérification de la mémoire"
    echo "  6) Mise à jour du système"
    echo "  7) Vérification de la sécurité"
    echo "  8) Maintenance complète"
    echo "  9) Quitter"
    echo ""
}

# Maintenance complète
full_maintenance() {
    echo -e "${BLUE}=== MAINTENANCE COMPLÈTE ===${NC}"
    echo "Cette opération peut prendre plusieurs minutes..."
    echo ""
    
    clean_packages
    echo ""
    clean_logs
    echo ""
    clean_cache
    echo ""
    check_disk_space
    echo ""
    check_memory
    echo ""
    security_check
    
    echo ""
    echo -e "${GREEN}✓ Maintenance complète terminée${NC}"
}

# Boucle principale
while true; do
    show_menu
    read -p "Choisissez une option (1-9): " choice
    
    case $choice in
        "1")
            clean_packages
            pause_return
            ;;
        "2")
            clean_logs
            pause_return
            ;;
        "3")
            clean_cache
            pause_return
            ;;
        "4")
            check_disk_space
            pause_return
            ;;
        "5")
            check_memory
            pause_return
            ;;
        "6")
            update_system
            pause_return
            ;;
        "7")
            security_check
            pause_return
            ;;
        "8")
            full_maintenance
            pause_return
            ;;
        "9")
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo "Choix invalide."
            sleep 1
            ;;
    esac
done
