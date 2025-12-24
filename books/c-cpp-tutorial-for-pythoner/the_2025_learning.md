# The complex structure of C

{% code title="main.c" %}
```c
#include <stdio.h> //for printf(), sprintf()
#include <stdlib.h> //for malloc()
#include <string.h> //for memcpy(), strlen()

unsigned char a_2d_list[4][3] = {
    {'1', '2', '3'},
    {'4', 0x35, '6'},
    {'7', '8', '9'},
    {'*', '0', '#'},
};

void hex_to_binary(unsigned char hex, unsigned int binary_0_or_1[8]) {
    for (int i = 7; i >= 0; i--) {
        binary_0_or_1[i] = hex & 1;
        hex >>= 1;
    }
}

int main()
{
    unsigned char *pointer_of_a_string;

    //allocate memory.
    pointer_of_a_string = malloc( (size_t)100 );
    if ( pointer_of_a_string == NULL ) {
        exit(0);
    } else {
        const char *temp_string = "dynamic string.";
        memcpy(pointer_of_a_string, temp_string, strlen(temp_string));

        char final_string[120];
        sprintf(final_string, "you will see a string created in runtime: '%s' \n\
sizeof: %d \n\
string length: %d \n\n\
", pointer_of_a_string, sizeof(temp_string), strlen(temp_string));

        printf(final_string);
    }

    free( pointer_of_a_string );

    //2d array and unsigned char
    for (int y=0; y<4; y++) {
        for (int x=0; x<3; x++) {
            unsigned int a_char = (unsigned int)a_2d_list[y][x]; // unsigned char == uint8_t
            printf("%c ", a_2d_list[y][x]);
        }
        printf("\n\n");
    }

    unsigned char temp_one_byte = 0x01;
    unsigned int one_byte_0_or_1[8];
    hex_to_binary(temp_one_byte, one_byte_0_or_1);
    for(int i=0; i<8; i++) {
        printf("%d", one_byte_0_or_1[i]);
    }
    printf("\n\n");

    return 0;
}
```
{% endcode %}

1. use c98 everywhere. do not recommand c++ or cpp. old 2000 year c98 compiler is less than 3MB. old c98 code only 1KB per one.
2. "unsigned char" is the 8 0_or_1 byte.

## How to compile and run the above codes?

```text
gcc -std=c99 main.c -o main.run
./main.run
```

