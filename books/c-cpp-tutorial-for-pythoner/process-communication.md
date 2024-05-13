# Process Communication \(Not Recommended for Reading\)

## How?

Use `Pipe` .

Pipe = pipeline

It's a pipeline who save message sequentially, like a [Queue](https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29). You can write or read a message to/from it.

## Write and read messages through a pipeline

```c
#include<stdio.h>
#include<unistd.h>

int main() {
    char message_list[2][30]={"Hi", "My name is yingshaoxo"}; // just a list of two words
    char message_we_get[30]; // used for storing what we will read from a pipeline later

    int status_of_that_pipeline; // indicate the state of a pipeline
    int pipe_descriptors[2]; // 0 for reading, 1 for writing
    status_of_that_pipeline = pipe(pipe_descriptors); // create a pipe by giving its an empty array (pipe_descriptors)

    if (status_of_that_pipeline == -1) {
        printf("Unable to create pipe\n");
        return 1;
    }

    printf("Writing to pipe...      Message 1 is %s\n", message_list[0]);
    write(pipe_descriptors[1], message_list[0], sizeof(message_list[0])); // write "Hi" to our pipeline

    read(pipe_descriptors[0], message_we_get, sizeof(message_we_get)); // read "Hi" from our pipeline
    printf("Reading from pipe...    Message 1 is %s\n", message_we_get);

    printf("Writing to pipe...      Message 2 is %s\n", message_list[1]);
    write(pipe_descriptors[1], message_list[1], sizeof(message_list[1])); // write "My name is yingshaoxo" to our pipeline

    read(pipe_descriptors[0], message_we_get, sizeof(message_we_get)); // read "My name is yingshaoxo" from our pipeline
    printf("Reading from pipe...    Message 2 is %s\n", message_we_get);

    return 0;
}
```

unistd.h = unix standard \(library\).header

> In the C and C++ programming languages, _unistd.h_ is the name of the header file that provides access to the POSIX \(Linux\) operating system API.

## Write and read messages through a pipeline between a parent and his child processes

```c
#include<stdio.h>
#include<unistd.h>

int main() {
    char message_list[2][40]={"Hi", "My name is yingjie (hero)"};
    char message_we_get[40];

    int status_of_that_pipeline;
    int pipe_descriptors[2];
    status_of_that_pipeline = pipe(pipe_descriptors);

    if (status_of_that_pipeline == -1) {
        printf("Unable to create pipe\n");
        return 1;
    }

    int process_id;
    process_id = fork(); // Fork() use for creates a new process, which is called child process
    // After a new child process created, both processes will execute the next instruction following the fork() system call.

    if (process_id == 0) { // Child process
        read(pipe_descriptors[0], message_we_get, sizeof(message_we_get));
        printf("Child Process - Reading from pipe...    Message 1 is %s\n", message_we_get);
        read(pipe_descriptors[0], message_we_get, sizeof(message_we_get));
        printf("Child Process - Reading from pipe...    Message 2 is %s\n", message_we_get);
    } else { //Parent process
        printf("Parent Process - Writing to pipe...    Message 1 is %s\n", message_list[0]);
        write(pipe_descriptors[1], message_list[0], sizeof(message_list[0]));
        printf("Parent Process - Writing to pipe...    Message 2 is %s\n", message_list[1]);
        write(pipe_descriptors[1], message_list[1], sizeof(message_list[1]));
    }

    return 0;
}
```

> Fork system call use for creates a new process, which is called _**child process**_, which runs concurrently with process \(which process called system call fork\) and this process is called _**parent process**_. After a new child process created, both processes will execute the next instruction following the fork\(\) system call.

Parent process runs first, child process runs second.

## Two-way Communications

```c
#include<stdio.h>
#include<unistd.h>

int main() {
    char pipe1_message[20] = "Hi";
    char pipe2_message[20] = "Hello";
    char message_we_get[20];

    int status_of_that_pipeline1;
    int pipe_descriptors1[2];
    status_of_that_pipeline1 = pipe(pipe_descriptors1);

    if (status_of_that_pipeline1 == -1) {
        printf("Unable to create pipe 1 \n");
        return 1;
    }

    int status_of_that_pipeline2;
    int pipe_descriptors2[2];
    status_of_that_pipeline2 = pipe(pipe_descriptors2);

    if (status_of_that_pipeline2 == -1) {
        printf("Unable to create pipe 2 \n");
        return 1;
    }

    int process_id;
    process_id = fork();

    if (process_id != 0) { // Parent process
        close(pipe_descriptors1[0]); // Close the unwanted pipe1 read side, unnecessary
        close(pipe_descriptors2[1]); // Close the unwanted pipe2 write side, unnecessary

        printf("In Parent: Writing to pipe 1...     Message is %s\n", pipe1_message);
        write(pipe_descriptors1[1], pipe1_message, sizeof(pipe1_message));

        read(pipe_descriptors2[0], message_we_get, sizeof(message_we_get)); // it will be stuck until a new message has been sent to pipeline2? Not sure
        printf("In Parent: Reading from pipe 2...   Message is %s\n", message_we_get);

    } else { // Child process
        close(pipe_descriptors1[1]); // Close the unwanted pipe1 write side, unnecessary
        close(pipe_descriptors2[0]); // Close the unwanted pipe2 read side, unnecessary

        read(pipe_descriptors1[0], message_we_get, sizeof(message_we_get)); // it will be stuck until a new message has been sent to pipeline1? Not sure
        printf("In Child: Reading from pipe 1...    Message is %s\n", message_we_get);

        printf("In Child: Writing to pipe 2...      Message is %s\n", pipe2_message);
        write(pipe_descriptors2[1], pipe2_message, sizeof(pipe2_message));
    }

    return 0;
}
```

## Crazy Combination

```c
#include<stdio.h> // for printf()
#include<unistd.h> // for pipeline creating
#include<sys/stat.h> // for using mkdir()
#include<stdlib.h> // for using system()
#include<string.h> // for using strcmp(). strcmp = string comparison

int main() {
    char parent_command[100] = "Create a folder for me, honey";
    char child_response[100] = "I'm done, darling";
    char message_parent_get[30];
    char message_child_get[30];

    int status_of_that_pipeline1;
    int pipe_descriptors1[2];
    status_of_that_pipeline1 = pipe(pipe_descriptors1);

    if (status_of_that_pipeline1 == -1) {
        printf("Unable to create pipe 1 \n");
        return 1;
    }

    int status_of_that_pipeline2;
    int pipe_descriptors2[2];
    status_of_that_pipeline2 = pipe(pipe_descriptors2);

    if (status_of_that_pipeline2 == -1) {
        printf("Unable to create pipe 2 \n");
        return 1;
    }

    int process_id;
    process_id = fork();

    if (process_id != 0) { // Parent process
        write(pipe_descriptors1[1], parent_command, sizeof(parent_command));

        while (1) {
            read(pipe_descriptors2[0], message_parent_get, sizeof(message_parent_get)); // it will be stuck until a new message has been sent to pipeline2
            if (strcmp(message_parent_get, child_response) == 0) {
                printf("\nparent got a message: %s", message_parent_get);
                printf("\nexit.");
                break;
            }
        }
    } else { // Child process
        read(pipe_descriptors1[0], message_child_get, sizeof(message_child_get)); // it will be stuck until a new message has been sent to pipeline1
        printf("\nchild got a message: %s", message_child_get);
        if (strcmp(message_child_get, parent_command) == 0) {
            printf("\nchild start to do his job");
            if (mkdir("log", 0777) == -1) {  // 0777 represents permission of "Everyone can read write and execute"
                printf("\nSomething was wrong when I create a folder.");
                write(pipe_descriptors2[1], child_response, sizeof(child_response));
            }
            else {
                printf("\nwritting logs...\n");
                char command[100];
                sprintf(command, "echo '%s' > log/honey.log", message_child_get);
                system(command); // run that command
                write(pipe_descriptors2[1], child_response, sizeof(child_response));
            }
        }
    }

    return 0;
}
```

## References:

{% embed url="https://www.tutorialspoint.com/inter\_process\_communication/inter\_process\_communication\_pipes.htm" %}

{% embed url="https://www.geeksforgeeks.org/fork-system-call/" %}

{% embed url="https://www.programmingsimplified.com/c-program-compare-two-strings" %}



