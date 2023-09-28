### Let's show detail logs when we were rebooting
1. edit `/etc/default/grub`, change the line `GRUB_CMDLINE_LINUX_DEFAULT="quiet"` to `GRUB_CMDLINE_LINUX_DEFAULT="splash"`

    > quiet: this option tells the kernel to NOT produce any output. (If you add this, you'll see a screen of printed messages)

    > splash: this option is used to start an eye-candy "loading" screen while all the core parts of the system are loaded in the background.

2. run `update-grub2` or `update-grub` to reload the config

### Can we just temporarily solve this problem?
1. edit `/etc/systemd/system.conf`
2. change a few lines of old config to: 
   ```
   DefaultTimeoutStartSec=5s
   DefaultTimeoutStopSec=5s
   ```
3. run `sudo systemctl daemon-reload`
