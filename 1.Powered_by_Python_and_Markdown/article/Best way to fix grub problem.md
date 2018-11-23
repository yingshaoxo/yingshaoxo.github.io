Try the following
```
grub rescue > ls

grub rescue > ls (hd0,msdos2) # let's assume this is the linux partition 

grub rescue > set root=(hd0,msdos2) 

grub rescue > set prefix=(hd0,msdos2)/boot/grub # or wherever grub is installed 

grub rescue > insmod normal # if this produced an error, reset root and prefix to something else .. 

grub rescue > normal
```


Run the following after you successfully boot
```
sudo update-grub 

sudo grub-install /dev/sdX 
# where /dev/sdX is your boot drive, use 'fdisk -l' to check it out.
```


If you have to copy a whole linux system, you could use `Clonezilla`
