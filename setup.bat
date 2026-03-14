@echo off
echo Installing main project dependencies...
call npm install

echo Installing Sanity Studio dependencies...
cd sanity-studio
call npm install
cd ..

echo Done! Run 'npm run dev' to start.
pause
