#!/bin/bash
# Vérifier le chiffrement des disques (équivalent BitLocker sur Linux)
# Utilise cryptsetup pour LUKS et lsblk pour lister les disques

echo "Disques disponibles:"
echo "==================="
lsblk -f | grep -E "(NAME|sd|nvme)" | head -20

echo ""
echo "Disques chiffrés (LUKS):"
echo "========================"
lsblk -f | grep -i luks || echo "Aucun disque LUKS trouvé"

echo ""
echo "Vérification des volumes chiffrés:"
echo "=================================="
for device in $(lsblk -ln -o NAME,TYPE | grep disk | awk '{print "/dev/"$1}'); do
    if cryptsetup isLuks "$device" 2>/dev/null; then
        echo "✓ $device est chiffré (LUKS)"
        cryptsetup luksDump "$device" 2>/dev/null | grep -E "(Cipher|Key Size|Hash)" | head -3
    else
        echo "✗ $device n'est pas chiffré"
    fi
done

echo ""
read -p "Appuyez sur Entrée pour fermer..."
