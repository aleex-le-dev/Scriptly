#!/bin/bash
# Gestionnaire de mises à jour des paquets (équivalent winget sur Linux)
# Supporte apt, yum, dnf, pacman, zypper selon la distribution

set -e

# Détecter le gestionnaire de paquets
detect_package_manager() {
    if command -v apt >/dev/null 2>&1; then
        echo "apt"
    elif command -v yum >/dev/null 2>&1; then
        echo "yum"
    elif command -v dnf >/dev/null 2>&1; then
        echo "dnf"
    elif command -v pacman >/dev/null 2>&1; then
        echo "pacman"
    elif command -v zypper >/dev/null 2>&1; then
        echo "zypper"
    else
        echo "unknown"
    fi
}

# Fonction de pause
pause_return() {
    echo ""
    echo "Appuyez sur une touche pour revenir au menu..."
    read -n 1 -s
}

# Menu principal
show_menu() {
    clear
    echo "==============================================="
    echo "      GESTIONNAIRE DE PAQUETS - MISES A JOUR"
    echo "==============================================="
    echo ""
    echo "  Gestionnaire détecté: $(detect_package_manager)"
    echo ""
    echo "  1) Mettre à jour la liste des paquets"
    echo "  2) Mettre à jour les paquets installés"
    echo "  3) Mettre à jour tout le système"
    echo "  4) Rechercher un paquet"
    echo "  5) Installer un paquet"
    echo "  6) Quitter"
    echo ""
}

# Mettre à jour la liste des paquets
update_package_list() {
    local pm=$(detect_package_manager)
    echo "=== Mise à jour de la liste des paquets ==="
    case $pm in
        "apt")
            sudo apt update
            ;;
        "yum")
            sudo yum check-update
            ;;
        "dnf")
            sudo dnf check-update
            ;;
        "pacman")
            sudo pacman -Sy
            ;;
        "zypper")
            sudo zypper refresh
            ;;
        *)
            echo "Gestionnaire de paquets non supporté"
            ;;
    esac
}

# Mettre à jour les paquets installés
upgrade_packages() {
    local pm=$(detect_package_manager)
    echo "=== Mise à jour des paquets installés ==="
    case $pm in
        "apt")
            sudo apt upgrade -y
            ;;
        "yum")
            sudo yum update -y
            ;;
        "dnf")
            sudo dnf upgrade -y
            ;;
        "pacman")
            sudo pacman -Su --noconfirm
            ;;
        "zypper")
            sudo zypper update -y
            ;;
        *)
            echo "Gestionnaire de paquets non supporté"
            ;;
    esac
}

# Mise à jour complète du système
full_system_update() {
    local pm=$(detect_package_manager)
    echo "=== Mise à jour complète du système ==="
    case $pm in
        "apt")
            sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
            ;;
        "yum")
            sudo yum update -y && sudo yum autoremove -y
            ;;
        "dnf")
            sudo dnf upgrade -y && sudo dnf autoremove -y
            ;;
        "pacman")
            sudo pacman -Syu --noconfirm
            ;;
        "zypper")
            sudo zypper update -y && sudo zypper clean
            ;;
        *)
            echo "Gestionnaire de paquets non supporté"
            ;;
    esac
}

# Rechercher un paquet
search_package() {
    local pm=$(detect_package_manager)
    echo -n "Entrez le nom du paquet à rechercher: "
    read package_name
    
    echo "=== Recherche de '$package_name' ==="
    case $pm in
        "apt")
            apt search "$package_name" | head -20
            ;;
        "yum")
            yum search "$package_name" | head -20
            ;;
        "dnf")
            dnf search "$package_name" | head -20
            ;;
        "pacman")
            pacman -Ss "$package_name" | head -20
            ;;
        "zypper")
            zypper search "$package_name" | head -20
            ;;
        *)
            echo "Gestionnaire de paquets non supporté"
            ;;
    esac
}

# Installer un paquet
install_package() {
    local pm=$(detect_package_manager)
    echo -n "Entrez le nom du paquet à installer: "
    read package_name
    
    echo "=== Installation de '$package_name' ==="
    case $pm in
        "apt")
            sudo apt install -y "$package_name"
            ;;
        "yum")
            sudo yum install -y "$package_name"
            ;;
        "dnf")
            sudo dnf install -y "$package_name"
            ;;
        "pacman")
            sudo pacman -S --noconfirm "$package_name"
            ;;
        "zypper")
            sudo zypper install -y "$package_name"
            ;;
        *)
            echo "Gestionnaire de paquets non supporté"
            ;;
    esac
}

# Boucle principale
while true; do
    show_menu
    read -p "Choisissez une option (1-6): " choice
    
    case $choice in
        "1")
            update_package_list
            pause_return
            ;;
        "2")
            upgrade_packages
            pause_return
            ;;
        "3")
            full_system_update
            pause_return
            ;;
        "4")
            search_package
            pause_return
            ;;
        "5")
            install_package
            pause_return
            ;;
        "6")
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo "Choix invalide."
            sleep 1
            ;;
    esac
done
