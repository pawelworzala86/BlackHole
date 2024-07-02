node bh %1

IF ERRORLEVEL 1 GOTO koniec

cd cache



ml64.exe /c %1.asm

link.exe /SUBSYSTEM:CONSOLE /MACHINE:X64 /ENTRY:entry_point /nologo /LARGEADDRESSAWARE %1.obj

cd ..

IF ERRORLEVEL 1 GOTO koniec


del out\%1.exe


copy .\cache\%1.exe .\out\%1.exe

del .\cache\%1.exe
del .\cache\%1.obj



cd out
%1.exe
cd ..





:koniec