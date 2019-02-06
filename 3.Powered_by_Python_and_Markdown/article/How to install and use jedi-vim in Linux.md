##### 1. Remove old Vim first

`apt purge vim*`

#### 2. Install essential python relyings

`apt install python3 python3-dev`

#### 3. Pull jedi-vim to local

```
mkdir ~/.vim
cd ~/.vim
rm * -fr
git clone https://github.com/davidhalter/jedi-vim.git .
```

#### 4. Install a new Vim version for python support

`apt install vim-nox`
