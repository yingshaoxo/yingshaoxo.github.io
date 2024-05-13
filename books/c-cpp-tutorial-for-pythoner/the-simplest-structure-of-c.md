# The simplest structure of C

{% code title="hi.c" %}
```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    printf("My name is yingshaoxo!");
    
    return 0;
}
```
{% endcode %}

* stdio = standard input and output
* printf = print formatted

Let me explain this program for you:

1. include `standard` `input and output` model
2. at the main function, we do something
3. we `print formatted`strings

## How to compile and run the above codes?

```text
gcc hi.c
./a.out
```

