@echo off
echo Starting Local Web Server...
echo Please ensure you have Python installed.
echo.
echo Open http://localhost:8000 in your browser.
echo.
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
python -m http.server 8000
pause
