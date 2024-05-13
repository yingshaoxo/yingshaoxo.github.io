# 4x4 Keypad with LCD

## Codes

```c
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
*/
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

void handle_keypad_number(int number) {
    char text[10];
    sprintf(text, "%d", number);
    print_string(0, 1, text);
}

int catch_keypad_input()
{
    if (input_of_row1) {
        set_column1_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                handle_keypad_number(1);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                handle_keypad_number(2);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row1) {
            delay(200);
            if (!input_of_row1) {
                handle_keypad_number(3);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;
        
    } else if (input_of_row2) {
        set_column1_to_1;
        if (!input_of_row2) {
            delay(200);
            if (!input_of_row2) {
                handle_keypad_number(4);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row2) {
            delay(200);
            if (!input_of_row2) {
                handle_keypad_number(5);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row2) {
            delay(200);
            if (!input_of_row2) {
                handle_keypad_number(6);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;

    } else if (input_of_row3) {
        set_column1_to_1;
        if (!input_of_row3) {
            delay(200);
            if (!input_of_row3) {
                handle_keypad_number(7);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row3) {
            delay(200);
            if (!input_of_row3) {
                handle_keypad_number(8);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row3) {
            delay(200);
            if (!input_of_row3) {
                handle_keypad_number(9);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;
        
    } else if (input_of_row4) {

    }
}

void initialize_keypad() {
    set_column_as_output;
    set_row_as_input;
    //set_all_columns_to_1;
    set_all_columns_to_0; // by default, columns need to set to low 
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; // close watchdog
    P1DIR = 0xFF;
    P1OUT = 0x00;

    initialize_LCD();
    initialize_keypad();

    while (1)
    {
        catch_keypad_input();
    }
}
```

