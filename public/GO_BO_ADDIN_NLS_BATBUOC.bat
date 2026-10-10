@echo off
chcp 65001 >nul
title GO BO BAT BUOC ADD-IN TICH HOP NLS - AI KHOI WORD - THAY DINH THANH (0915.213717)
color 0A

echo =========================================================================
echo   CONG CU GO BO BAT BUOC TRIET DE ADD-IN TICH HOP NLS - AI KHOI WORD
echo   Tac gia: Thay gia Dinh Thanh - Hotline/Zalo: 0915.213717
echo =========================================================================
echo.

echo [1/4] Dang dong toan bo ung dung Microsoft Word...
taskkill /F /IM WINWORD.EXE /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Dang xoai toan bo file Add-in NLS-AI trong APPDATA...
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\*NLS*.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\TichHop_NLS_AI*.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\TichHop_NLS_AI.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\TichHop_NLS_AI_THCS.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\AI_Word_Assistant.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Word\STARTUP\*.dotm" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Templates\*NLS*.dotm" >nul 2>&1

echo [3/4] Dang quet va xoai Add-in trong he thong Program Files Office...
for %%d in (Office14 Office15 Office16 Office19 Office21) do (
    del /F /Q /A "C:\Program Files\Microsoft Office\root\%%d\STARTUP\*NLS*.dotm" >nul 2>&1
    del /F /Q /A "C:\Program Files (x86)\Microsoft Office\root\%%d\STARTUP\*NLS*.dotm" >nul 2>&1
    del /F /Q /A "C:\Program Files\Microsoft Office\%%d\STARTUP\*NLS*.dotm" >nul 2>&1
    del /F /Q /A "C:\Program Files (x86)\Microsoft Office\%%d\STARTUP\*NLS*.dotm" >nul 2>&1
    del /F /Q /A "C:\Program Files\Microsoft Office\root\%%d\STARTUP\*.dotm" >nul 2>&1
    del /F /Q /A "C:\Program Files (x86)\Microsoft Office\root\%%d\STARTUP\*.dotm" >nul 2>&1
)

echo [4/4] Dang xoa bo nho tam Custom Ribbon cua Word...
del /F /Q /A "%LOCALAPPDATA%\Microsoft\Office\*.officeUI" >nul 2>&1
del /F /Q /A "%APPDATA%\Microsoft\Office\*.officeUI" >nul 2>&1

echo.
echo =========================================================================
echo   THANH CONG: DA GO BO BAT BUOC TRIET DE BAN NLS-AI KHOI WORD!
echo   Bay gio Thay/Co mo lai Word se khong con thanh Tich hop NLS - AI nua.
echo   Hotline/Zalo ho tro Thay Dinh Thanh: 0915.213717
echo =========================================================================
echo.
pause
