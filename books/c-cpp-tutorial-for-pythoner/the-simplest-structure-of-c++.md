# The simplest structure of C++

{% code title="hi.cpp" %}
```cpp
#include <iostream>

using namespace std;

int main() {
    cout << "Hello There!\n";
    cout << "What's your name?\n";
    
    return 0;
}
```
{% endcode %}

* iostream = input and output stream
* std = standard \(library\)

Let me explain this program for you:

1. include `input and output stream` model
2. using `standard namespace`, at this namespace, we can use a lot standard `operator or functions`
3. at the main function, we do something
4. we put strings into `c output stream`. \(`cout` is an operator which was defined in `standard namespace`\)

## How to compile and run the above codes?

```text
gcc -lstdc++ hi.cpp
./a.out
```

