# Make a Directory \(Not Recommended for Reading\)

## Method 1 with C

```c
#include<stdio.h>
#include<stdlib.h>

int main() {
    char command[] = "mkdir name_of_a_folder";
    int result = system(command);

    if (result != 0) {
        printf("Something was wrong when I create a folder.");
    }
}
```

You  could do the same thing with Python:

```python
import os
os.system("mkdir hi_yingshaoxo")
```

## Method 2 with C

```c
#include <stdio.h> 
#include <sys/stat.h>

void main() 
{ 
	if (mkdir("name_of_a_folder", 0777) == -1) {  // 0777 represents permission of "Everyone can read write and execute"
		printf("Unable to create directory\n"); 
    }
	else { 
		printf("Directory created\n"); 
	} 
} 
```

## C++

```cpp
#include <iostream>
#include <bits/stdc++.h> // for using strerror()
#include <sys/stat.h> // for using mkdir()

using namespace std;

int main() {
    if (mkdir("another_folder_name", 0777) == -1) // 0777 represents permission of "Everyone can read write and execute"
        cerr << "Something was wrong:  " << strerror(errno) << endl;
    else
        cout << "Directory created";
}
```

> The C library function **char \*strerror\(int errnum\)** searches an internal array for the error number **errnum** and returns a pointer to an error message string. The error strings produced by **strerror** depend on the developing platform and compiler.

## References:

{% embed url="https://www.unix.com/programming/23017-using-c-program-create-directories-unix.html" %}

{% embed url="https://www.geeksforgeeks.org/create-directoryfolder-cc-program/" %}

{% embed url="https://www.maketecheasier.com/file-permissions-what-does-chmod-777-means/" %}

{% embed url="https://www.tutorialspoint.com/c\_standard\_library/c\_function\_strerror.htm" %}

