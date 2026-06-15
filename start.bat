@echo off
echo ============================================
echo  FoodSafe AI - Food Transport Safety System
echo ============================================
echo.
echo [1/3] Starting Flask Backend...
start "FoodSafe Backend" cmd /k "cd /d d:\Food_transport_safety_using_AI\backend && python app.py"
timeout /t 5 /nobreak > nul

echo [2/3] Starting React Frontend...
start "FoodSafe Frontend" cmd /k "cd /d d:\Food_transport_safety_using_AI\frontend && cmd /c npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo ============================================
echo  System Starting Up...
echo  Backend  → http://localhost:5000
echo  Frontend → http://localhost:5173
echo ============================================
echo.
echo Demo Login Credentials:
echo   Admin   : admin@foodsafety.com   / Admin@123
echo   Manager : manager@foodsafety.com / Manager@123
echo   Driver  : driver@foodsafety.com  / Driver@123
echo.
start http://localhost:5173
pause
