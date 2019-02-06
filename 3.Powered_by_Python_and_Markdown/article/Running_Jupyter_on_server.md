#### 1. install 
```
sudo -H pip install jupyter 
```

#### 2. create config
```
jupyter-notebook --generate-config
```

#### 3. set password
```
jupyter-notebook password
```

#### 4. set ip
```
vim ~/.jupyter/jupyter_notebook_config.json
```
```
{
  "NotebookApp": {
    "ip": "0.0.0.0",
    "port": 8888
  }
}
```

#### 5. run it
```
jupyter-notebook --allow-root
```

