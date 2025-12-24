# Cross Compile

## Definition

~~Use Linux to do a compilation to generate different platform executable software. Includes Windows, Android, IOS, and so on.~~

**Cross**-**compilation** is the act of **compiling** code for one computer system \(often known as the target\) on a different system, called the host.

## Linux for Windows

We use `mingw-w64` . \(It's based on gcc\)

```bash
sudo apt install mingw-w64
x86_64-w64-mingw32-gcc hello.c
```

> I recommand use 'i32' or 'x86' or 'i386'.

