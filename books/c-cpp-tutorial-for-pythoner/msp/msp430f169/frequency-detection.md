# Frequency or Speed Detection

## Method 1

```c
#include <msp430.h>
#include <stdio.h>

// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

void delay(unsigned int t) {
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

    delay(1);
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

    delay(1);
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
        delay(1);
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
    float_to_string(number, text, 4);
    print_string(x, y, text);
}

void screen_clean() {
    write_command(0x01);
}

void initialize_LCD() {
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use
                         // `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}

// ***************
// ****************
// SET Wheel_Speed_Detector!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
Give P3.0 a wave with different frequency
*/

unsigned long int milliseconds = 0;
unsigned long int how_many_0_we_got_during_the_time = 0;

void initTimer_B(void) {
    TBCCR0 = 0;      // Timer B Capture/Compare Register 0; Stop Timer
    TBCCTL0 |= CCIE; // Timer B Capture/Compare Control 0; Enable interrupt for CCR0.

    TBCTL = TBSSEL_2 + ID_0 + MC_1; // Timer B Control; TimerB Source-clock Select SMCLK, SMCLK = 1MHz, SMCLK divided by 1, up mode

    TBCCR0 = 1000 - 1; //Start Timer, Compare value for Up Mode to get 1ms delay per loop

    __enable_interrupt();
}

//Timer ISR
#pragma vector = TIMER0_B0_VECTOR
__interrupt void Timer_B_CCR0_ISR(void) {
    milliseconds++;
}

float wheel_speed_detection(unsigned long int timeout_in_millisecond) {
    milliseconds = 0;
    how_many_0_we_got_during_the_time = 0;

    while (1) {
        if (milliseconds > timeout_in_millisecond) {
            break;
        }
    }

    print_float(0, 1, how_many_0_we_got_during_the_time);
    print_float(0, 2, milliseconds);

    return (float)how_many_0_we_got_during_the_time / (float)milliseconds / 0.0014;
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P1DIR = 0xFF;
    P1OUT = 0x00;
    initialize_LCD();

    P1SEL &= (~BIT5); // Set P1.5 SEL as GPIO
    P1DIR &= (~BIT5); // Set P1.5 SEL as Input
    P1IES |= (BIT5);  // Falling Edge 1 -> 0
    P1IFG &= (~BIT5); // Clear interrupt flag for P1.5
    P1IE |= (BIT5);   // Enable interrupt for P1.5
    initTimer_B();

    while (1) {
        float frenquency = wheel_speed_detection(500);
        print_float(0, 4, frenquency);

        delay(1000 * 1);
        screen_clean();
    }
}

// Port 1 interrupt service routine
#pragma vector = PORT1_VECTOR
__interrupt void Port_1(void) {
    how_many_0_we_got_during_the_time++;
    P1IFG &= (~BIT5); // P1.5 IFG clear
}
```

For this method, we detect how many 0 we got during a period of time. Then we calculate the frequency.

## Method 2

```c
#include <msp430.h>
#include <stdio.h>

// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

void delay(unsigned int t) {
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

    delay(1);
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

    delay(1);
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
        delay(1);
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
    float_to_string(number, text, 4);
    print_string(x, y, text);
}

void screen_clean() {
    write_command(0x01);
}

void initialize_LCD() {
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use
                         // `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}

// ***************
// ****************
// SET Wheel_Speed_Detector!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
Give P3.0 a wave with different frequency
*/

unsigned long int milliseconds_for_frequency_detection = 0;
unsigned long int length_of_a_pulse_cycle_for_frequency_detection = 0;

void initialize_timer_A(void) {
    TACCR0 = 0;      // Timer A Capture/Compare Register 0; Stop Timer
    TACCTL0 |= CCIE; // Timer A Capture/Compare Control 0; Enable interrupt for CCR0.

    TACTL = TASSEL_2 + ID_0 + MC_1; // Timer A Control; TimerA Source-clock Select SMCLK, SMCLK = 1MHz, SMCLK divided by 1, up mode

    TACCR0 = 1000 - 1; //Start Timer, Compare value for Up Mode to get 1ms delay per loop

    __enable_interrupt();
}

//Timer ISR
#pragma vector = TIMER0_A0_VECTOR
__interrupt void Timer_A_CCR0_ISR(void) {
    milliseconds_for_frequency_detection++;
}

void initialize_interrupt_for_frequency_detection_pin() {
    P1SEL &= (~BIT5); // Set P1.5 SEL as GPIO
    P1DIR &= (~BIT5); // Set P1.5 SEL as Input
    P1IES &= (~BIT5); // Raising Edge 0 -> 1
    P1IFG &= (~BIT5); // Clear interrupt flag for P1.5
    P1IE &= (~BIT5);  // Disable interrupt for P1.5
}

#pragma vector = PORT1_VECTOR
__interrupt void Port_1(void) {
    if (P1IFG & BIT5) // is that interrupt request come frome BIT5? is there an rising or falling edge has been detected? Each PxIFGx bit is the interrupt flag for its corresponding I/O pin and is set when the selected input signal edge occurs at the pin.
    {
        if (!(P1IES & BIT5)) // is this the rising edge? (P1IES & BIT5) == 0
        {
            TACTL |= TACLR; // clears timer A
            milliseconds_for_frequency_detection = 0;
            P1IES |= BIT5; // set P1.5 to falling edge interrupt: P1IES = 1
        } else {
            length_of_a_pulse_cycle_for_frequency_detection =
                (long)milliseconds_for_frequency_detection * 1000 + (long)TAR; // calculating a cycle length; TAR is a us time unit at this case
            P1IES &= ~BIT5;                                                    // interrupt edge selection: rising edge on pin1.5: P1IES = 0
        }
        P1IFG &= ~BIT5; // clear flag, so it can start to detect new rising or falling edge, then a new call to this interrupt function will be allowed.
    }
}

float wheel_speed_detection(unsigned long int how_many_holes_a_wheel_have) {
    P1IE &= ~BIT5;  // disable interupt
    P1IFG &= ~BIT5; // clear flag, so it can start to detect new rising or falling edge, then a new call to this interrupt function will be allowed.
    P1IE |= BIT5;   // interrupt enable

    unsigned long int time_cost_for_a_wheel_cycle = how_many_holes_a_wheel_have * length_of_a_pulse_cycle_for_frequency_detection;
    print_number(0, 1, length_of_a_pulse_cycle_for_frequency_detection);
    print_number(0, 2, time_cost_for_a_wheel_cycle);
    float revolutions_per_minute = (float)60000000 / (float)time_cost_for_a_wheel_cycle; // minite speed of the wheel

    return revolutions_per_minute;
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P1DIR = 0xFF;
    P1OUT = 0x00;
    initialize_LCD();

    initialize_timer_A();
    initialize_interrupt_for_frequency_detection_pin();

    while (1) {
        float speed = wheel_speed_detection(20);
        print_float(0, 4, speed);

        delay(1000 * 1);
        screen_clean();
    }
}
```

For method 2, we use `rising edge or falling edge` to capture the time one pulse cycle cost. Then calculate the speed of the wheel.

## What I choose

```c
#include <msp430.h>
#include <stdio.h>

// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

void delay(unsigned int t) {
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

    delay(1);
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

    delay(1);
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
        delay(1);
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
    float_to_string(number, text, 4);
    print_string(x, y, text);
}

void screen_clean() {
    write_command(0x01);
}

void initialize_LCD() {
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use
                         // `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}

// ***************
// ****************
// SET Pulse time cost detector!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
Give P3.0 a wave with different frequency
*/

unsigned long int milliseconds_for_pulse_time_cost_detection = 0;
unsigned long int length_of_pulse_cycle = 0;

void initialize_timer_A(void) {
    TACCR0 = 0;      // Timer A Capture/Compare Register 0; Stop Timer
    TACCTL0 |= CCIE; // Timer A Capture/Compare Control 0; Enable interrupt for CCR0.

    TACTL = TASSEL_2 + ID_0 + MC_1; // Timer A Control; TimerA Source-clock Select SMCLK, SMCLK = 1MHz, SMCLK divided by 1, up mode

    TACCR0 = 1000 - 1; //Start Timer, Compare value for Up Mode to get 1ms delay per loop

    __enable_interrupt();
}

//Timer ISR
#pragma vector = TIMER0_A0_VECTOR
__interrupt void Timer_A_CCR0_ISR(void) {
    milliseconds_for_pulse_time_cost_detection++;
}

void initialize_interrupt_for_pulse_detection_pin() {
    P1SEL &= (~BIT5); // Set P1.5 SEL as GPIO
    P1DIR &= (~BIT5); // Set P1.5 SEL as Input
    P1IES &= (~BIT5); // Raising Edge 0 -> 1
    P1IFG &= (~BIT5); // Clear interrupt flag for P1.5
    P1IE &= (~BIT5);  // Disable interrupt for P1.5
}

#pragma vector = PORT1_VECTOR
__interrupt void Port_1(void) {
    if (P1IFG & BIT5) // is that interrupt request come frome BIT5? is there an rising or falling edge has been detected? Each PxIFGx bit is the interrupt flag for its corresponding I/O pin and is set when the selected input signal edge occurs at the pin.
    {
        if (!(P1IES & BIT5)) // is this the rising edge? (P1IES & BIT5) == 0
        {
            TACTL |= TACLR; // clears timer A
            milliseconds_for_pulse_time_cost_detection = 0;
            P1IES |= BIT5; // set P1.5 to falling edge interrupt: P1IES = 1
        } else {
            length_of_pulse_cycle = (long)milliseconds_for_pulse_time_cost_detection * 1000 + (long)TAR; // calculating a cycle length; TAR is a us time unit at this case
            P1IES &= ~BIT5;                                                                              // interrupt edge selection: rising edge on pin1.5: P1IES = 0
        }
        P1IFG &= ~BIT5; // clear flag, so it can start to detect new rising or falling edge, then a new call to this interrupt function will be allowed.
    }
}

unsigned long int pulse_time_cost_detection() {
    P1IE &= ~BIT5;  // disable interupt
    P1IFG &= ~BIT5; // clear flag, so it can start to detect new rising or falling edge, then a new call to this interrupt function will be allowed.
    P1IE |= BIT5;   // interrupt enable

    unsigned long int real_length_of_pulse_cycle = 2.8487 * length_of_pulse_cycle - 0.1926;
    return real_length_of_pulse_cycle;
}

unsigned long int get_wheel_speed(unsigned long int how_many_holes_a_wheel_have, unsigned long int time_cost_for_one_pulse_in_us) {
    unsigned long int time_cost_for_a_wheel_cycle = how_many_holes_a_wheel_have * time_cost_for_one_pulse_in_us;
    float revolutions_per_minute = (float)60000000 / (float)time_cost_for_a_wheel_cycle; // minite speed of the wheel

    return revolutions_per_minute;
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P1DIR = 0xFF;
    P1OUT = 0x00;
    initialize_LCD();


    initialize_timer_A();
    initialize_interrupt_for_pulse_detection_pin();

    while (1) {
        unsigned long int time_cost_in_us = pulse_time_cost_detection(20);
        print_string(0, 1, "One pulse length");
        print_float(0, 2, time_cost_in_us / (float)1000);

        delay(1000 * 1);
        screen_clean();
    }
}
```

