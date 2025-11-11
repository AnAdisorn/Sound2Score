@echo off
echo Sound2Score Backend Setup
echo =========================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -q -r requirements.txt

echo.
echo Starting Flask backend server...
echo Backend will be available at: http://localhost:5000
echo.

REM Run the Flask app
python app.py
