#!/bin/bash
cd "$(dirname "$0")"
echo "=========================================================="
echo "🐔 INICIANDO SERVIDOR LOCAL - POLLOS REIS"
echo "=========================================================="
echo "Disponible para todos los celulares en el Wi-Fi o repetidor:"
echo "👉 http://192.168.0.106:3000"
echo "=========================================================="
echo "Presiona Ctrl + C para detenerlo cuando quieras."
echo ""
npm run preview -- --host 0.0.0.0 --port 3000
