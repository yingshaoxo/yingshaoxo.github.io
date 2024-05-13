# Serial

```cpp
#include <Arduino.h>

void setup() {
  Serial.begin(115200); // Baudrate for serial communication
}

void loop() {
  Serial.println("Whatever you like");
}
```

Then you can check the serial outputs from your computer by using:

`platformio device monitor -p /dev/ttyACM1 -b 115200`

