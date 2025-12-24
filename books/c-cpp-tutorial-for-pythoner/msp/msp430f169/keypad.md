# 4x4 Keypad

## Keypad?

![](../../.gitbook/assets/4x4-matrix-keypad.png)

> Keypad: a miniature keyboard or set of buttons for operating a portable electronic device, telephone, or other equipment.

* C = column
* R = row

Sometimes, they use rows as input, columns as output.

Sometimes, they use columns as input, rows as output.

So, you need to do some experiment or check its documents to know how it works.

**We can't use interrupt function to do this job because we can't get a pin input value since we set that pin as an interrupt pin.  \(Maybe this just doesn't work with msp430f169, I don't know\)**

## Coding with interrupt \(failed\)

```c
/*
P2.0-3 need to connected to R1-R4
P2.4-7 need to connected to C1-C4

P1.0 need to connected to a LED
*/

#include<msp430.h>

#define BIT_of_rows (BIT0 | BIT1 | BIT2 | BIT3)
#define BIT_of_columns (BIT4 | BIT5 | BIT6 | BIT7)

#define set_row_as_input P2DIR &= ~BIT_of_rows
#define set_column_as_output P2DIR |= BIT_of_columns

#define set_all_columns_to_0 P2OUT &= ~BIT_of_columns
#define set_all_columns_to_1 P2OUT |= BIT_of_columns

#define enable_interrupt_of_rows P2IE |= BIT_of_rows
#define set_interrupt_edge_to_low_to_high P2IES &= ~BIT_of_rows
#define set_interrupt_edge_to_high_to_low P2IES |= BIT_of_rows

#define set_column1_to_0 P2OUT &= ~BIT4
#define set_column1_to_1 P2OUT |= BIT4

#define set_column2_to_0 P2OUT &= ~BIT5
#define set_column2_to_1 P2OUT |= BIT5

#define set_column3_to_0 P2OUT &= ~BIT6
#define set_column3_to_1 P2OUT |= BIT6

#define set_column4_to_0 P2OUT &= ~BIT7
#define set_column4_to_1 P2OUT |= BIT7

#define input_of_row1 (P2IN & BIT0)
#define input_of_row2 (P2IN & BIT1)
#define input_of_row3 (P2IN & BIT2)
#define input_of_row4 (P2IN & BIT3)

#define interrupt_from_row1 (P2IFG & BIT0)
#define interrupt_from_row2 (P2IFG & BIT1)
#define interrupt_from_row3 (P2IFG & BIT2)
#define interrupt_from_row4 (P2IFG & BIT3)

#define clean_interrupt_flag_of_row1 P2IFG &= ~BIT0
#define clean_interrupt_flag_of_row2 P2IFG &= ~BIT1
#define clean_interrupt_flag_of_row3 P2IFG &= ~BIT2
#define clean_interrupt_flag_of_row4 P2IFG &= ~BIT3

void delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void light_up_LED()
{
    P1OUT |= BIT0; // Toggle P1.0 using exclusive-OR
}

void light_off_LED()
{
    P1OUT &= ~BIT0; // Toggle P1.0 using exclusive-OR
}

void light_up_or_off_LED()
{
    P1OUT ^= BIT0; // Toggle P1.0 using exclusive-OR
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P1DIR |= BIT0;
    P1OUT &= ~BIT0;

    set_column_as_output;
    set_row_as_input;
    //set_all_columns_to_1;
    set_all_columns_to_0; // by default, columns need to set to low 

    enable_interrupt_of_rows;
    //set_interrupt_edge_to_low_to_high;
    set_interrupt_edge_to_high_to_low; // when you press a key, that row go low

    _BIS_SR(GIE);

    while(1) {
    }
}

#pragma vector = PORT2_VECTOR
__interrupt void Port_2_interrupt_procedure(void)
{
    if (interrupt_from_row1) {
        light_up_LED();

        clean_interrupt_flag_of_row1;
    } else if (interrupt_from_row2) {
        light_off_LED();

        clean_interrupt_flag_of_row2;
    } else if (interrupt_from_row3) {
        light_up_or_off_LED();

        clean_interrupt_flag_of_row3;
    } else if (interrupt_from_row4) {

        clean_interrupt_flag_of_row4;
    }
}
```

## Coding with normal IO

```c
/*
P2.0-3 need to connected to R1-R4
P2.4-7 need to connected to C1-C4

P1.0 need to connected to a LED
*/

#include<msp430.h>

#define BIT_of_rows (BIT0 | BIT1 | BIT2 | BIT3)
#define BIT_of_columns (BIT4 | BIT5 | BIT6 | BIT7)

#define set_row_as_input P2DIR &= ~BIT_of_rows
#define set_column_as_output P2DIR |= BIT_of_columns

#define set_all_columns_to_0 P2OUT &= ~BIT_of_columns
#define set_all_columns_to_1 P2OUT |= BIT_of_columns

#define set_column1_to_0 P2OUT &= ~BIT4
#define set_column1_to_1 P2OUT |= BIT4

#define set_column2_to_0 P2OUT &= ~BIT5
#define set_column2_to_1 P2OUT |= BIT5

#define set_column3_to_0 P2OUT &= ~BIT6
#define set_column3_to_1 P2OUT |= BIT6

#define set_column4_to_0 P2OUT &= ~BIT7
#define set_column4_to_1 P2OUT |= BIT7

#define input_of_row1 (P2IN & BIT0) == 0 // when you pressing a key, it returns 0
#define input_of_row2 (P2IN & BIT1) == 0
#define input_of_row3 (P2IN & BIT2) == 0
#define input_of_row4 (P2IN & BIT3) == 0

void delay(unsigned int t)
{
    while (t--)
    {
        // delay for 1ms
        __delay_cycles(1000);
    }
}

void light_up_LED()
{
    P1OUT |= BIT0; // Toggle P1.0 using exclusive-OR
}

void light_off_LED()
{
    P1OUT &= ~BIT0; // Toggle P1.0 using exclusive-OR
}

void light_up_or_off_LED()
{
    P1OUT ^= BIT0; // Toggle P1.0 using exclusive-OR
}

int catch_keypad_input()
{
    if (input_of_row1) {
        set_column1_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                light_up_LED();
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                light_off_LED();
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                light_up_or_off_LED();
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;
        
    } else if (input_of_row2) {
        light_off_LED();

    } else if (input_of_row3) {
        light_up_or_off_LED();
        
    } else if (input_of_row4) {

    }
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P1DIR |= BIT0;
    P1OUT &= ~BIT0;

    set_column_as_output;
    set_row_as_input;
    //set_all_columns_to_1;
    set_all_columns_to_0; // by default, columns need to set to low 

    while(1) {
        catch_keypad_input();
    }
}
```

## Coding with new method (2025 year version)
```
#include "msp430.h"
#include <stdio.h>




// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************
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




// ***************
// ****************
// SET Keypad!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
P2.0-3 need to connected to R1-R4
P2.4-7 need to connected to C1-C4

example:
    //P1DIR &= ~(BIT0 | BIT1 | BIT2 | BIT3);  // set P1 0-3 as input
    //P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3);  // set P2 0-3 as output
    #P1OUT &= ~BIT7 // set 1.7 to 0
    #P1OUT |= BIT7 // set 1.7 to 1
*/


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
    P1DIR |= (BIT0 | BIT1 | BIT2);
    P1OUT &= ~(BIT0 | BIT1 | BIT2);
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}

void handle_keypad_number(int number) {
    char text[10];
    sprintf(text, "%d", number);
    print_string(0, 1, text);
}

void initialize_keypad() {
    //example:
    //P1DIR &= ~(BIT0 | BIT1 | BIT2 | BIT3);  // set P1 0-3 as input
    //P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3);  // set P2 0-3 as output
    //#P1OUT &= ~BIT7 // set 1.7 to 0
    //#P1OUT |= BIT7 // set 1.7 to 1
    
    //set all to 0 first
    P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3 | BIT4 | BIT5 | BIT6 | BIT7);
    P2OUT &= ~(BIT0 | BIT1 | BIT2 | BIT3 | BIT4 | BIT5 | BIT6 | BIT7);

    //set r0,r1,r2,r3 as input
    P2DIR &= ~(BIT1 | BIT2 | BIT3 | BIT4);
}

int new_catch_keypad_input()
{
    unsigned int c1_to_c4_list[] = {BIT4, BIT5, BIT6, BIT7};
    int index = 0;

    //// row -1. test: when give 5v to c1_to_c4, without press button, the r1_to_r4 should be 0v.
    //index = 0;
    //while (index < 4) {
    //    P2OUT |= c1_to_c4_list[index];
    //    delay(500);
    //    P2OUT &= ~ c1_to_c4_list[index];
    //    initialize_keypad();
    //    delay(200);
    //    index += 1;
    //} 
    //return -1;
    

    // row 1. complex version
    index = 0;
    while (index < 4) {
        P2OUT |= c1_to_c4_list[index];
        if (P1IN & BIT0) {
            handle_keypad_number(1 + index);
            delay(500);
        }
        P2OUT &= ~ c1_to_c4_list[index];
        index += 1;
    } 

    //// row 1. complex version
    //index = 0;
    //while (index < 4) {
    //    int counting = 0;
    //    for (int i=0;i<10;i++) {
    //        int haha = 0;
    //        P2OUT |= c1_to_c4_list[index];
    //        if (P1IN & BIT0) {
    //            haha += 1;
    //        }
    //        P2OUT &= ~ c1_to_c4_list[index];
    //        if (!(P2IN & BIT0)) {
    //            haha += 1;
    //        }
    //        if (haha == 2) {
    //            counting += 1;
    //        }
    //    }
    //    if (counting >= 10) {
    //        handle_keypad_number(1 + index);
    //        delay(500);
    //    }
    //    index += 1;
    //} 

    delay(100);

    return -1;
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; // close watchdog

    initialize_LCD();
    initialize_keypad();

    print_string(0, 1, "   hi, yingshaoxo.");
    
    while (1)
    {
        int value = new_catch_keypad_input();
        if (value == -1) {
            print_string(0, 1, "   hi, yingshaoxo.");
        }
    }
}
```

## 4x3_1_line_analog_keypad (2025 year version)
```
#include "msp430.h"
#include <stdio.h>




// ***************
// ****************
// SET LCD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************
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




// ***************
// ****************
// SET Keypad!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
P1.4-7 need to connected to R1-R4
P2.4-7 need to connected to C1-C4

example:
    //P1DIR &= ~(BIT0 | BIT1 | BIT2 | BIT3);  // set P1 0-3 as input
    //P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3);  // set P2 0-3 as output
    #P1OUT &= ~BIT7 // set 1.7 to 0
    #P1OUT |= BIT7 // set 1.7 to 1
*/


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
    P1DIR |= (BIT0 | BIT1 | BIT2);
    P1OUT &= ~(BIT0 | BIT1 | BIT2);
    delay(1000); // delay for LCD to wake up

    write_command(0x30); // 30=0011 0000; use `basic instruction mode`, use `8-BIT interface`
    delay(20);
    write_command(0x0c); // 0c=0000 1100; DISPLAY ON, cursor OFF, blink OFF
    delay(20);
    write_command(0x01); // 0c=0000 0001; CLEAR

    delay(200);
}

void handle_keypad_number(int number) {
    char text[10];
    sprintf(text, "%d", number);
    print_string(0, 1, text);
}

int catch_keypad_input()
{
    int default_value = -1;

    ADC12CTL0 |= ADC12SC;
    if (ADC12IFG & BIT0) {
        // has new value
        
        int all = 0;
        int i;
        for (i=0; i<8; i++) {
            all += ADC12MEM0;
        }
        int average_value = all/8;
        float new_value = ((float)average_value) / ((float)(4096*5));

        int temp_value = (int)(new_value * 1000);
        //handle_keypad_number(temp_value);

        if ((temp_value >= 190) && (temp_value <= 200)) {
            default_value = -1;
        } else if ((temp_value >= 5) && (temp_value <= 10)) {
            default_value = 1;
        } else if ((temp_value >= 10) && (temp_value <= 17)) {
            default_value = 2;
        } else if ((temp_value >= 17) && (temp_value <= 23)) {
            default_value = 3;
        } else if ((temp_value >= 25) && (temp_value <= 29)) {
            default_value = 4;
        } else if ((temp_value >= 29) && (temp_value <= 35)) {
            default_value = 5;
        } else if ((temp_value >= 35) && (temp_value <= 40)) {
            default_value = 6;
        } else if ((temp_value >= 40) && (temp_value <= 44)) {
            default_value = 7;
        } else if ((temp_value >= 44) && (temp_value <= 47)) {
            default_value = 8;
        } else if ((temp_value >= 47) && (temp_value <= 50)) {
            default_value = 9;
        } else if ((temp_value >= 50) && (temp_value <= 53)) {
            default_value = 10;
        } else if ((temp_value >= 53) && (temp_value <= 57)) {
            default_value = 11;
        } else if ((temp_value >= 57) && (temp_value <= 63)) {
            default_value = 12;
        }

        ADC12IFG &= ~BIT0; // set it to 0 to indicate you received it
    }

    return default_value;
}

void initialize_keypad() {
    //P1DIR &= ~(BIT0 | BIT1 | BIT2 | BIT3);  // set P1 0-3 as input
    //P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3);  // set P2 0-3 as output
    //#P1OUT &= ~BIT7 // set 1.7 to 0
    //#P1OUT |= BIT7 // set 1.7 to 1

    ADC12CTL0 = SHT0_2 + ADC12ON;
    ADC12CTL1 = SHP;
    ADC12CTL0 |= ENC;
    delay(100);
    P6SEL |= BIT0; // use 6.0 as analog input
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; // close watchdog

    initialize_LCD();
    initialize_keypad();

    print_string(0, 1, "   hi, yingshaoxo.");
    
    while (1)
    {
        int value = catch_keypad_input();

        if (value == -1) {
            print_string(0, 1, "   hi, yingshaoxo.");
        } else {
            handle_keypad_number(value);
            delay(250);
        }
        delay(100);
    }
}
```
