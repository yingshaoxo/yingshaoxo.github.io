# Light Up Your First LED

```c
#include <Arduino.h>

void setup() {
  // put your setup code here, to run once:
  pinMode(P1_0, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(P1_0, HIGH);
  delay(1000);
  digitalWrite(P1_0, LOW);
  delay(1000);
}
```

> It's quit simple, right?

