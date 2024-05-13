# Ultrasonic Sensor

## Basic Knowledge

### Time Units

* 1 millisencond = $$\frac{1\ second}{1000}$$ 
* 1 microsecond = $$\frac{1\ millisecond}{1000}$$ 

### Clock Cycle

**Clock Cycle** is the speed of a computer processor, or CPU, is determined by the clock cycle, which is the amount of time between two pulses of an oscillator. Generally speaking, the higher number of pulses per second, the faster the computer processor will be able to process information. The clock speed is measured in Hz, typically either megahertz \(MHz\) or gigahertz \(GHz\). For example, a 4GHz processor performs 4,000,000,000 clock cycles per second.

1 MHz = 1,000,000 Hz = 1000000 clock cycle per second

For example, if you have a computer which runs at 1 MHz, then, for 1 ms\(millisecond\), it will clock 1000 times \(or go through 1000 clock cycles\).

## Failed Codes 1

```c
#include <msp430.h> 
#include <stdio.h>

// Definition for the ultrasonic sensor
#define trigger_pin BIT3
#define echo_pin BIT4

#define set_trigger_pin_as_output P1DIR |= trigger_pin
#define set_echo_pin_as_input P1DIR &= ~echo_pin

#define set_trigger_pin_to_0 P1OUT &= ~trigger_pin
#define set_trigger_pin_to_1 P1OUT |= trigger_pin

#define input_from_echo_pin (P1IN & echo_pin)


void millisecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void microsecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1/1000 ms
        __delay_cycles(1);
    }
}

unsigned long int microseconds_to_clock_cycles(unsigned long int number) {
    return number;
}

unsigned long int clock_cycles_to_microseconds(unsigned long int number) {
    return number;
}

int initialize_ultrasonic_sensor() {
    set_trigger_pin_as_output;
    set_echo_pin_as_input;
}

int pulseIn(int state, unsigned long timeout) {
    // state is 0 or 1

    unsigned long pluse_width = 0;

    // for time control
    // convert the timeout from microseconds to a number of times through
    // the initial loop; it takes 16 clock cycles per iteration.
    unsigned long number_of_loops = 0;
    unsigned long max_loops = microseconds_to_clock_cycles(timeout)/16;

    // wait for any previous pulse to end
    while (input_from_echo_pin == state)
        if (number_of_loops++ == max_loops)
            return 0;

    // wait for the pulse to start
    while (input_from_echo_pin != state)
        if (number_of_loops++ == max_loops)
            return 0;

    // wait for the pulse to stop
    while (input_from_echo_pin == state) {
        if (number_of_loops++ == max_loops)
            return 0;

        pluse_width++;
    }

    // convert the reading to microseconds. The loop has been determined
    // to be 20 clock cycles long and have about 16 clocks between the edge
    // and the start of the loop. There will be some error introduced by
    // the interrupt handlers.
    return clock_cycles_to_microseconds(pluse_width * 21 + 16);
}

int ultrasonic_detection() {
    set_trigger_pin_to_0;
    microsecond_level_of_delay(2);
    set_trigger_pin_to_1;
    microsecond_level_of_delay(20);
    set_trigger_pin_to_0;

    unsigned long int duration = pulseIn(HIGH, 0);

    duration = duration / 59;
    if ((duration < 2) || (duration > 300)) {
        return 0;
    }

    return duration;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;    // stop watchdog timer

    return 0;
}
```

### pluseIn

`pluseIn(pluse input)` is a function which reads a pluse. For example, if `value` is `HIGH`, `pulseIn()` waits for the pin to go from `LOW` to `HIGH`, starts timing, then waits for the pin to go `LOW` and stops timing. Returns the length of the pulse in microseconds.

Or simply, `pluseIn(LOW)` will return the length of how long the signal is LOW.

## Failed Codes 2

```c
#include <msp430.h> 
#include <stdio.h>


// Definition for the LCD
#define CS1 P1OUT |= BIT0 //RS
#define CS0 P1OUT &= BIT0
#define SID1 P1OUT |= BIT1 //R/W
#define SID0 P1OUT &= ~BIT1
#define SCLK1 P1OUT |= BIT2 //E
#define SCLK0 P1OUT &= ~BIT2
// PSB connect to ground since we only use serial transition mode

void delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void send_byte(unsigned char eight_bits)
{
    unsigned int i;

    for (i = 0; i < 8; i++)
    {
        //1111 1000 & 1000 0000 = 1000 0000 = True
        //1111 0000 & 1000 0000 = 1000 0000 = True
        //1110 0000 & 1000 0000 = 1000 0000 = True
        //...
        //0000 0000 & 1000 0000 = 0000 0000 = False
        //The main purpose for this is to send a series of binary number from left to right
        if ((eight_bits << i) & 0x80)
        {
            serial_data_input_1;
        }
        else
        {
            serial_data_input_0;
        }
        // We use this to simulate clock:
        serial_clock_0;
        serial_clock_1;
    }
}

void write_command(unsigned char command)
{
    chip_select_1;

    send_byte(0xf8);
    /*
    f8=1111 1000;
    send five 1 first, so LCD will papare for receiving data; 
    then R/W = 0, RS = 0; 
    when RS = 0, won't write d7-d0 to RAM
    */
    send_byte(command & 0xf0);        //send d7-d4
    send_byte((command << 4) & 0xf0); //send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    delay(1);
    chip_select_0; // when chip_select from 1 to 0, serial counter and data will be reset
}

void write_data(unsigned char character)
{
    chip_select_1;

    send_byte(0xfa);
    /*
    fa=1111 1010; 

    send five 1 first, so LCD will papare for receiving data; 
    then R/W = 0, RS = 1; 
    when RS = 1, write d7-d0 to RAM
    */
    send_byte(character & 0xf0);        //send d7-d4
    send_byte((character << 4) & 0xf0); //send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    delay(1);
    chip_select_0;
}

void print_string(unsigned int x, unsigned int y, unsigned char *string)
{
    switch (y)
    {
    case 1:
        write_command(0x80 + x);
        break;
    case 2:
        write_command(0x90 + x);
        break;
    case 3:
        write_command(0x88 + x);
        break;
    case 4:
        write_command(0x98 + x);
        break;
    default:
        break;
    }

    while (*string > 0)
    {
        write_data(*string);
        string++;
        delay(1);
    }
}

void initialize_LCD()
{
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}


// Definition for the ultrasonic sensor
#define trigger_pin BIT3
#define echo_pin BIT4

#define set_trigger_pin_as_output P1DIR |= trigger_pin
#define set_echo_pin_as_input P1DIR &= ~echo_pin

#define set_trigger_pin_to_0 P1OUT &= ~trigger_pin
#define set_trigger_pin_to_1 P1OUT |= trigger_pin

#define input_from_echo_pin (P1IN & echo_pin)

void millisecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void microsecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1/1000 ms
        __delay_cycles(1);
    }
}

unsigned long int microseconds_to_clock_cycles(unsigned long int number) {
    return number;
}

unsigned long int clock_cycles_to_microseconds(unsigned long int number) {
    return number;
}

int initialize_ultrasonic_sensor() {
    set_trigger_pin_as_output;
    set_echo_pin_as_input;
}

int pulseIn(int state, unsigned long timeout) {
    // state is 0 or 1

    unsigned long pluse_width = 0;

    // for time control
    // convert the timeout from microseconds to a number of times through
    // the initial loop; it takes 16 clock cycles per iteration.
    unsigned long number_of_loops = 0;
    unsigned long max_loops = microseconds_to_clock_cycles(timeout)/16;

    // wait for any previous pulse to end
    while (input_from_echo_pin == state)
        if (number_of_loops++ == max_loops)
            return 0;

    // wait for the pulse to start
    while (input_from_echo_pin != state)
        if (number_of_loops++ == max_loops)
            return 0;

    // wait for the pulse to stop
    while (input_from_echo_pin == state) {
        if (number_of_loops++ == max_loops)
            return 0;

        pluse_width++;
    }

    // convert the reading to microseconds. The loop has been determined
    // to be 20 clock cycles long and have about 16 clocks between the edge
    // and the start of the loop. There will be some error introduced by
    // the interrupt handlers.
    return clock_cycles_to_microseconds(pluse_width * 21 + 16);
}

int ultrasonic_detection() {
    set_trigger_pin_to_0;
    microsecond_level_of_delay(2);
    set_trigger_pin_to_1;
    microsecond_level_of_delay(20);
    set_trigger_pin_to_0;

    unsigned long int duration = pulseIn(HIGH, 0);

    duration = duration / 59;
    if ((duration < 2) || (duration > 300)) {
        return 0;
    }

    return duration;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;    // stop watchdog timer

    P1DIR = 0xFF;
    P1OUT = 0x00;

    initialize_LCD();
    initialize_ultrasonic_sensor();

    while(1) {
        int result = ultrasonic_detection();

        char text[10];
        sprintf(text, "%d", result);
        print_string(0, 1, text);
    }

    return 0;
}
```

## Failed Codes 3

```c
#include <msp430.h> 
#include <stdio.h>

// Definition for the LCD
#define CS1 P1OUT |= BIT0 //RS
#define CS0 P1OUT &= BIT0
#define SID1 P1OUT |= BIT1 //R/W
#define SID0 P1OUT &= ~BIT1
#define SCLK1 P1OUT |= BIT2 //E
#define SCLK0 P1OUT &= ~BIT2
// PSB connect to ground since we only use serial transition mode

//data=00001100, always remember it's "d7 d6 d5 d4 d3 d2 d1 d0"
//if you need to know how to set d7-d0, just check ST7920V30_eng.pdf

#define chip_select_1 CS1 //RS
#define chip_select_0 CS0
#define serial_data_input_1 SID1 //R/W
#define serial_data_input_0 SID0
#define serial_clock_1 SCLK1 //E
#define serial_clock_0 SCLK0

void delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void send_byte(unsigned char eight_bits)
{
    unsigned int i;

    for (i = 0; i < 8; i++)
    {
        //1111 1000 & 1000 0000 = 1000 0000 = True
        //1111 0000 & 1000 0000 = 1000 0000 = True
        //1110 0000 & 1000 0000 = 1000 0000 = True
        //...
        //0000 0000 & 1000 0000 = 0000 0000 = False
        //The main purpose for this is to send a series of binary number from left to right
        if ((eight_bits << i) & 0x80)
        {
            serial_data_input_1;
        }
        else
        {
            serial_data_input_0;
        }
        // We use this to simulate clock:
        serial_clock_0;
        serial_clock_1;
    }
}

void write_command(unsigned char command)
{
    chip_select_1;

    send_byte(0xf8);
    /*
    f8=1111 1000;
    send five 1 first, so LCD will papare for receiving data; 
    then R/W = 0, RS = 0; 
    when RS = 0, won't write d7-d0 to RAM
    */
    send_byte(command & 0xf0);        //send d7-d4
    send_byte((command << 4) & 0xf0); //send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    delay(1);
    chip_select_0; // when chip_select from 1 to 0, serial counter and data will be reset
}

void write_data(unsigned char character)
{
    chip_select_1;

    send_byte(0xfa);
    /*
    fa=1111 1010; 

    send five 1 first, so LCD will papare for receiving data; 
    then R/W = 0, RS = 1; 
    when RS = 1, write d7-d0 to RAM
    */
    send_byte(character & 0xf0);        //send d7-d4
    send_byte((character << 4) & 0xf0); //send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    delay(1);
    chip_select_0;
}

void print_string(unsigned int x, unsigned int y, unsigned char *string)
{
    switch (y)
    {
    case 1:
        write_command(0x80 + x);
        break;
    case 2:
        write_command(0x90 + x);
        break;
    case 3:
        write_command(0x88 + x);
        break;
    case 4:
        write_command(0x98 + x);
        break;
    default:
        break;
    }

    while (*string > 0)
    {
        write_data(*string);
        string++;
        delay(1);
    }
}

void initialize_LCD()
{
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}


// Definition for the ultrasonic sensor
#define trigger_pin BIT3
#define echo_pin BIT4

#define set_trigger_pin_as_output P1DIR |= trigger_pin
#define set_echo_pin_as_input P1DIR &= ~echo_pin

#define set_trigger_pin_to_0 P1OUT &= ~trigger_pin
#define set_trigger_pin_to_1 P1OUT |= trigger_pin

#define input_from_echo_pin (P1IN & echo_pin)

void millisecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void microsecond_level_of_delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1/1000 ms
        __delay_cycles(1);
    }
}

unsigned long int microseconds_to_clock_cycles(unsigned long int number) {
    return number;
}

unsigned long int clock_cycles_to_microseconds(unsigned long int number) {
    return number;
}

int initialize_ultrasonic_sensor() {
    set_trigger_pin_as_output;
    set_echo_pin_as_input;
}

int high_pulseIn(unsigned long int timeout) {
    while(input_from_echo_pin == 0) {
    }

    unsigned long int pluse_width = 0;

    // for time control
    // convert the timeout from microseconds to a number of times through
    // the initial loop; it takes 16 clock cycles per iteration.
    unsigned long int number_of_loops = 0;
    unsigned long int max_loops = microseconds_to_clock_cycles(timeout)/16;

    // input_from_echo_pin will be 0 when you cover it with a plane.
    // it also means that 1 signal you have sent before is coming to you.

    // wait for the pulse to start
    while (input_from_echo_pin == 1) {
        if (number_of_loops++ == max_loops) {
               return 0;
        }

        pluse_width++;
    }

    // convert the reading to microseconds. The loop has been determined
    // to be 20 clock cycles long and have about 16 clocks between the edge
    // and the start of the loop. There will be some error introduced by
    // the interrupt handlers.

    return clock_cycles_to_microseconds(pluse_width * 16);
}

int ultrasonic_detection() {
    set_trigger_pin_to_0;
    microsecond_level_of_delay(15);
    set_trigger_pin_to_1;
    microsecond_level_of_delay(15);
    set_trigger_pin_to_0;

    unsigned long int duration = high_pulseIn(1000000);
    duration = duration * 1000 * 1000;

    int distance = (duration * 340 / 2) * 100;

    return distance;
}

int main(void)
{
    WDTCTL = WDTPW | WDTHOLD;    // stop watchdog timer

    P1DIR = 0xFF;
    P1OUT = 0x00;

    initialize_LCD();
    initialize_ultrasonic_sensor();

    while(1) {
        int result = ultrasonic_detection();

        char text[10];
        sprintf(text, "%d", result);
        print_string(0, 4, text);

        millisecond_level_of_delay(10);
    }

    return 0;
}
```

## Successful Version with LCD and Interruption and Timer

```c
#include <msp430.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// RS: P1.0
// R/W: P1.1
// E: P1.2
// ***************
// ****************
#define CS1 P1OUT |= BIT0 // RS
#define CS0 P1OUT &= BIT0
#define SID1 P1OUT |= BIT1 // R/W
#define SID0 P1OUT &= ~BIT1
#define SCLK1 P1OUT |= BIT2 // E
#define SCLK0 P1OUT &= ~BIT2
// PSB connect to ground since we only use serial transition mode

// data=00001100, always remember it's "d7 d6 d5 d4 d3 d2 d1 d0"
// if you need to know how to set d7-d0, just check ST7920V30_eng.pdf

#define chip_select_1 CS1 // RS
#define chip_select_0 CS0
#define serial_data_input_1 SID1 // R/W
#define serial_data_input_0 SID0
#define serial_clock_1 SCLK1 // E
#define serial_clock_0 SCLK0

void millisecond_of_delay(unsigned int t) {
    while (t--) {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void send_byte(unsigned char eight_bits) {
    unsigned int i;

    for (i = 0; i < 8; i++) {
        // 1111 1000 & 1000 0000 = 1000 0000 = True
        // 1111 0000 & 1000 0000 = 1000 0000 = True
        // 1110 0000 & 1000 0000 = 1000 0000 = True
        //...
        // 0000 0000 & 1000 0000 = 0000 0000 = False
        // The main purpose for this is to send a series of binary number from
        // left to right
        if ((eight_bits << i) & 0x80) {
            serial_data_input_1;
        } else {
            serial_data_input_0;
        }
        // We use this to simulate clock:
        serial_clock_0;
        serial_clock_1;
    }
}

void write_command(unsigned char command) {
    chip_select_1;

    send_byte(0xf8);
    /*
    f8=1111 1000;
    send five 1 first, so LCD will papare for receiving data;
    then R/W = 0, RS = 0;
    when RS = 0, won't write d7-d0 to RAM
    */
    send_byte(command & 0xf0);        // send d7-d4
    send_byte((command << 4) & 0xf0); // send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    millisecond_of_delay(1);
    chip_select_0; // when chip_select from 1 to 0, serial counter and data will
                   // be reset
}

void write_data(unsigned char character) {
    chip_select_1;

    send_byte(0xfa);
    /*
    fa=1111 1010;

    send five 1 first, so LCD will papare for receiving data;
    then R/W = 0, RS = 1;
    when RS = 1, write d7-d0 to RAM
    */
    send_byte(character & 0xf0);        // send d7-d4
    send_byte((character << 4) & 0xf0); // send d3-d0
    /*
    f0 = 1111 0000

    if character = 1100 0011
    first send 1100 0000 (d7-d4 0000)
    then send 0011 0000 (d3-d0 0000)
    */

    millisecond_of_delay(1);
    chip_select_0;
}

void print_string(unsigned int x, unsigned int y, unsigned char *string) {
    switch (y) {
    case 1:
        write_command(0x80 + x);
        break;
    case 2:
        write_command(0x90 + x);
        break;
    case 3:
        write_command(0x88 + x);
        break;
    case 4:
        write_command(0x98 + x);
        break;
    default:
        break;
    }

    while (*string > 0) {
        write_data(*string);
        string++;
        millisecond_of_delay(1);
    }
}

void print_number(int x, int y, long int number) {
    char text[20];
    sprintf(text, "%d", number);
    print_string(x, y, text);
}

void reverse_a_string_with_certain_length(char *str, int len) {
    int i = 0, j = len - 1, temp;
    while (i < j) {
        temp = str[i];
        str[i] = str[j];
        str[j] = temp;
        i++;
        j--;
    }
}

int int_to_string(int x, char str[], int d) {
    int i = 0;
    while (x) {
        str[i++] = (x % 10) + '0';
        x = x / 10;
    }

    // If number of digits required is more, then
    // add 0s at the beginning
    while (i < d)
        str[i++] = '0';

    reverse_a_string_with_certain_length(str, i);
    str[i] = '\0';
    return i;
}

void float_to_string(float n, char *res, int afterpoint) {
    // Extract integer part
    int ipart = (int)n;

    // Extract floating part
    float fpart = n - (float)ipart;

    // convert integer part to string
    int i = int_to_string(ipart, res, 0);

    // check for display option after point
    if (afterpoint != 0) {
        res[i] = '.'; // add dot

        // Get the value of fraction part upto given no.
        // of points after dot. The third parameter is needed
        // to handle cases like 233.007
        int power = 1;
        int count_num = 0;
        for (; count_num < afterpoint; count_num++) {
            power = power * 10;
        }
        fpart = fpart * power;

        int_to_string((int)fpart, res + i + 1, afterpoint);
    }
}

void print_float(int x, int y, float number) {
    char text[20];
    if (number < 0) {
        number = -number;
        char text2[20];
        strcpy(text, "-");
        float_to_string(number, text2, 4);
        strcat(text, text2);
    } else {
        float_to_string(number, text, 4);
    }
    print_string(x, y, text);
}

void screen_clean() {
    write_command(0x01);
}

void initialize_LCD() {
    P1DIR = 0xFF;
    P1OUT = 0x00;

    millisecond_of_delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use
                         // `8-BIT interface`
    millisecond_of_delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    millisecond_of_delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    millisecond_of_delay(200);
}

// ***************
// ****************
// SET ultrasonic sensor!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// trigger pin: P1.3
// echo pin: P1.4

// ***************
// ****************
#define trigger_pin BIT3
#define echo_pin BIT4

#define set_trigger_pin_as_output P1DIR |= trigger_pin
#define set_trigger_pin_to_0 P1OUT &= ~trigger_pin
#define set_trigger_pin_to_1 P1OUT |= trigger_pin

#define set_echo_pin_as_input P1DIR &= ~echo_pin
#define input_from_echo_pin (P1IN & echo_pin)

void initialize_ultrasonic_sensor() {
    set_trigger_pin_as_output;
    set_echo_pin_as_input;

    TB0CCTL0 |= CCIE;         // Timer B Capture/Compare Control 0; CCR0 interrupt enabled
    TB0CCR0 = 1000 - 1;       // Timer B Capture/Compare Register 0; 1ms at 1mhz
    TB0CTL = TBSSEL_2 + MC_1; // Timer B Control; SMCLK, UP mode

    P1IFG &= ~(echo_pin); // clear all interrupt flags

    //_BIS_SR(GIE); // global interrupt enable
    __enable_interrupt(); // you must enable all interrupt for thie code to work
}

unsigned long int ultrasonic_sensor_value;
#pragma vector = PORT1_VECTOR
__interrupt void Port_1(void) {
    if (P1IFG & echo_pin) // is that interrupt request come from echo_pin? is there an rising or falling edge has been detected? Each PxIFGx bit is the interrupt flag for its corresponding I/O pin and is set when the selected input signal edge occurs at the pin.
    {
        if (!(P1IES & echo_pin)) // is this the rising edge? (P1IES & echo_pin) == 0
        {
            TB0CCR0 = 50000;   // start to increase TBR microseconds
            P1IES |= echo_pin; // set P1 echo_pin to falling edge interrupt: P1IES = 1
        } else {
            ultrasonic_sensor_value = TB0R; // calculating ECHO length; TBR is a us time unit at this case
            P1IES &= ~echo_pin;             // interrupt edge selection: rising edge on ECHO pin: P1IES = 0
            P1IE &= ~echo_pin;              // disable interrupt
        }
        P1IFG &= ~echo_pin; // clear flag, so it can start to detect new rising or falling edge, then a new call to this interrupt function will be allowed.
    }
}

#pragma vector = TIMER0_B0_VECTOR
__interrupt void Timer_B(void) {
    // don't know why this have to be exist, but without it, TBR won't work
}

int ultrasonic_detection() {
    TB0CCR0 = 0; // stop timer, stop increase TBR

    set_trigger_pin_to_0; // stop pulse
    __delay_cycles(5);    // for 10us
    set_trigger_pin_to_1; // generate pulse
    __delay_cycles(10);   // for 10us
    set_trigger_pin_to_0; // stop pulse

    P1IFG &= ~(echo_pin); // interrupt flag: set to 0 to indicate No interrupt is pending
    P1IE |= echo_pin;     // interrupt enable: enable interrupt on ECHO pin

    __delay_cycles(6000); // delay for 6ms, so pin interrupt could finish his job. (distance < 100cm available)

    unsigned int distance = ultrasonic_sensor_value / 58.2; // converting ECHO length into cm

    return distance;
}

int main(void) {
    WDTCTL = WDTPW | WDTHOLD; // stop watchdog timer

    initialize_LCD();
    initialize_ultrasonic_sensor();

    while (1) {
        print_string(0, 4, "    "); // clear screen

        int distance = ultrasonic_detection();
        distance = 1.424 * distance;

        print_number(0, 4, distance);

        millisecond_of_delay(200);
    }

    return 0;
}
```

## References:

{% embed url="https://github.com/yingshaoxo/driver/blob/dbafd5f936facfd53a55293209c93da9aa5f8ca5/experience/old.ino\#L289" caption="" %}

{% embed url="https://www.arduino.cc/reference/en/language/functions/advanced-io/pulsein/" caption="" %}

{% embed url="https://forum.arduino.cc/index.php?topic=105289.0" caption="" %}

{% embed url="https://stackoverflow.com/questions/50346546/how-to-measure-frequency-in-arduino-using-pulsein-function" caption="" %}

{% embed url="https://stackoverflow.com/questions/43651954/what-is-a-clock-cycle-and-clock-speed" caption="" %}

{% embed url="http://karuppuswamy.com/wordpress/2015/03/12/msp430-launchpad-with-ultrasonic-distance-sensor-hc-sr04/" caption="" %}

{% embed url="https://www.instructables.com/id/Ultrasonic-Sensor-with-MSP430-and-IARCCS/" caption="" %}



