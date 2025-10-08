#!/bin/bash
# Lister les disques et volumes (équivalent Get-PSDrive sur Windows)

echo "Disques et volumes disponibles:"
echo "==============================="

# Format: Lettre, FS, Taille(Go), Libre(Go), Santé
printf "%-8s %-10s %12s %12s %15s\n" "Point" "FS" "Taille(Go)" "Libre(Go)" "Santé"
echo "------------------------------------------------------------"

# Lister les points de montage avec df
df -h | tail -n +2 | while read -r line; do
    # Extraire les informations
    filesystem=$(echo "$line" | awk '{print $1}')
    size=$(echo "$line" | awk '{print $2}')
    used=$(echo "$line" | awk '{print $3}')
    available=$(echo "$line" | awk '{print $4}')
    use_percent=$(echo "$line" | awk '{print $5}' | sed 's/%//')
    mount_point=$(echo "$line" | awk '{print $6}')
    
    # Convertir en GB (approximatif)
    size_gb=$(echo "$size" | sed 's/G//' | sed 's/T/000/' | sed 's/M/0.001/')
    available_gb=$(echo "$available" | sed 's/G//' | sed 's/T/000/' | sed 's/M/0.001/')
    
    # Déterminer la couleur/santé
    if [ "$use_percent" -gt 90 ]; then
        health="Critique"
    elif [ "$use_percent" -gt 75 ]; then
        health="Attention"
    else
        health="OK"
    fi
    
    # Afficher seulement les points de montage principaux
    if [[ "$mount_point" =~ ^/($|[^/]+$) ]]; then
        printf "%-8s %-10s %12s %12s %15s\n" "$mount_point" "$filesystem" "$size_gb" "$available_gb" "$health"
    fi
done

echo ""
echo "Informations détaillées des disques:"
echo "===================================="
lsblk -f

echo ""
read -p "Appuyez sur Entrée pour fermer..."
