# first in first
you should chooce a better micro_controller that has 50+ pins, and 1MB+ memory, and have an open c compiler that can be running in both windows_xp or ubuntu_linux_2014(x86,i32,2000_year archtecture). I mean a simple compiler that can get running in terminal.

why the gcc compiled binary file can't directly upload to the msp430 chip?

why the hardware can get updated? it should be a fixed boot loader program.

## the code
hard to write, hard to debug, easy to burn the debugger hardware. i think all you need is a feature that similar to arduino 'print()' for debugging.

```
// msp430f169_mobile_phone_project.c --- by yingshaoxo, has bugs for sure.

#include "msp430.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


// author: yingshaoxo


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
    case 0:
        write_command(0x80 + x);
        break;
    case 1:
        write_command(0x90 + x);
        break;
    case 2:
        write_command(0x88 + x);
        break;
    case 3:
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

void smart_print_string(unsigned int y, unsigned int x, unsigned char *string)
{
    int length = strlen(string);
    unsigned char temp_string[16] = {'\0'};
    int temp_index = 0;
    int line_number = 0;
    for (int i=0; i<length; i++) {
        if (string[i] == '\n') {
            temp_index = 15;
        } else {
            temp_string[temp_index] = string[i];
        }
        if (temp_index >= 15) {
            temp_string[16] = '\0';
            print_string(x, y+line_number, temp_string);
            line_number += 1;
            temp_index = -1;
            for (int i2=0; i2<17; i2++) {
                temp_string[i2] = '\0';
            }
        }
        temp_index += 1;
    }
    print_string(x, y+line_number, temp_string);
    return;
}

void clear_the_screen() {
    write_command(0x01);
    return;
    //smart_print_string(0, 0, "                           ");
    //smart_print_string(1, 0, "                           ");
    //smart_print_string(2, 0, "                           ");
    //smart_print_string(3, 0, "                           ");
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
    print_string(1, 0, text);
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
            default_value = 0;
        } else if ((temp_value >= 10) && (temp_value <= 17)) {
            default_value = 1;
        } else if ((temp_value >= 17) && (temp_value <= 23)) {
            default_value = 2;
        } else if ((temp_value >= 25) && (temp_value <= 29)) {
            default_value = 3;
        } else if ((temp_value >= 29) && (temp_value <= 35)) {
            default_value = 4;
        } else if ((temp_value >= 35) && (temp_value <= 40)) {
            default_value = 5;
        } else if ((temp_value >= 40) && (temp_value <= 44)) {
            default_value = 6;
        } else if ((temp_value >= 44) && (temp_value <= 47)) {
            default_value = 7;
        } else if ((temp_value >= 47) && (temp_value <= 50)) {
            default_value = 8;
        } else if ((temp_value >= 50) && (temp_value <= 53)) {
            default_value = 9;
        } else if ((temp_value >= 53) && (temp_value <= 57)) {
            default_value = 10;
        } else if ((temp_value >= 57) && (temp_value <= 63)) {
            default_value = 11;
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

// ***************
// ****************
// SET Serial Communication!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// TX(transmit): P3.4
// RX(receive): P3.5
//
// One thing you have to know: Tx connect to Rx, Rx connect to Tx  !!!!!!!!!
//
// VCC: 3.3V
//
// ***************
// ****************

void initialize_serial_communication() {
    /* for 9500 baud */
    P3SEL |= 0x30;        // P3.4,5 = USART0 TXD/RXD
    ME1 |= UTXE0 + URXE0; // Enable USART0 TXD/RXD
    UCTL0 |= CHAR;        // 8-bit character
    UTCTL0 |= SSEL0;      // UCLK = ACLK
    UBR00 = 0x03;         // 32k/9600 - 3.41
    UBR10 = 0x00;         //
    UMCTL0 = 0x4A;        // Modulation
    UCTL0 &= ~SWRST;      // Initialize USART state machine

    /* for 115200 baud */
    //volatile unsigned int i;
    //WDTCTL = WDTPW + WDTHOLD; // Stop WDT
    //P3SEL |= 0x30;            // P3.4 and P3.5 = USART0 TXD/RXD

    //BCSCTL1 &= ~XT2OFF; // XT2on

    //do {
    //    IFG1 &= ~OFIFG; // Clear OSCFault flag
    //    for (i = 0xFF; i > 0; i--)
    //        ;                 // Time for flag to set
    //} while ((IFG1 & OFIFG)); // OSCFault flag still set?

    //BCSCTL2 |= SELM_2 + SELS; // MCLK = SMCLK = XT2 (safe)
    //ME1 |= UTXE0 + URXE0;     // Enable USART0 TXD/RXD
    //UCTL0 |= CHAR;            // 8-bit character
    //UTCTL0 |= SSEL1;          // UCLK = SMCLK
    //UBR00 = 0x45;             // 8MHz 115200
    //UBR10 = 0x00;             // 8MHz 115200
    //UMCTL0 = 0x00;            // 8MHz 115200 modulation
    //UCTL0 &= ~SWRST;          // Initialize USART state machine

    IE1 |= URXIE0; // Enable USART0 RX interrupt

    _BIS_SR(GIE); // just enable general interrupt
}

void send_bytes_to_serial(unsigned char *data) {
    int index = 0;
    while (index < 32)
    {
        unsigned char a_byte = data[index];
        while (!(IFG1 & UTXIFG0)) {
            // USART0 TX buffer ready?
        }
        if (a_byte == '\0') {
            break;
        }
        TXBUF0 = a_byte; // send a byte
        index += 1;
    }
    //while (!(IFG1 & UTXIFG0)) {
    //}
    //TXBUF0 = '\r';
    //while (!(IFG1 & UTXIFG0)) {
    //}
    //TXBUF0 = '\n';
    while (!(IFG1 & UTXIFG0)) {
    }
    TXBUF0 = 0x04; // transmision end mark, similar to \x04
}

unsigned char uart_raw_input[64] = {'\0'};
int uart_raw_input_index = 0;
int uart_input_sentence_start_record = 0;
unsigned char uart_input_sentence[64] = {'\0'};
int uart_input_sentence_index = 0;
#pragma vector = USART0RX_VECTOR
__interrupt void usart0_rx(void) {
    unsigned char a_char = (unsigned char)RXBUF0;

    uart_raw_input[uart_raw_input_index] = a_char;
    if (uart_raw_input_index >= 2) {
        if (uart_raw_input[uart_raw_input_index-2] == 0x4F) {
            if (uart_raw_input[uart_raw_input_index-1] == 0x4B) {
                uart_input_sentence_start_record = 1;
                uart_input_sentence_index = 0;
            }
        }
    }
    uart_raw_input_index += 1;
    if (uart_raw_input_index >= 63) {
        uart_raw_input[0] = '\0';
        uart_raw_input_index = 0;
    }

    if ((a_char == 0x04) || (a_char == 0x0D)) {
        uart_input_sentence_start_record = 0;
        uart_input_sentence[uart_input_sentence_index] = '\0';
    }
    if (uart_input_sentence_start_record == 1) {
        uart_input_sentence[uart_input_sentence_index] = a_char;
        uart_input_sentence_index += 1;
        if (uart_input_sentence_index >= 63) {
            uart_input_sentence_index = 0;
        }
    }

    //if (IFG1 & URXIFG0) {
    //    //print(U0RXBUF)
    //}
}

void enter_raw_interpreter_mode() {
    // if you do not want to enter the raw_mode, you use '\r' to end the line, '\r' == '0x0D', '\n' == '0x0A'
    unsigned char data[5] = { 0x0D, 0x03, 0x0D, 0x01, 0x04};
    //unsigned char *data = "\r\x03\r\x01\x04";
    int index = 0;
    while (index < 5)
    {
        unsigned char a_byte = data[index];
        while (!(IFG1 & UTXIFG0)) {
            // USART0 TX buffer ready?
        }
        TXBUF0 = a_byte; // send a byte
        index += 1;
    }
}

//________________________
//mobile phone related code
//________________________

int phone_status = 0;
/*
0: home page
1: program list page
2: in a program
*/

int current_program = 1;
/*
0: diary
1: terminal
2: book_reader
3: music
*/
int program_list_position_y = 1;

int input_method_status = 0;
/*
0: normal, just the up,down,left,right,ok
1: alphabet, for user to input a,b,c,d...x,y,z
   punctuation, for user to input punctuations
   number, for user to input 1,2,3...9,0
*/
unsigned char last_input_char = '\0';
int input_process_number = -1;
unsigned char temp_input_1 = '\0';

unsigned int use_built_in_shell = 1;
int terminal_rendering_position_y = 0;
int terminal_rendering_position_x = 1;
unsigned char terminal_text_array[3][16] = {
    {'>', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
};

void init_phone_status() {
    phone_status = 0;
    current_program = 1;
    use_built_in_shell = 1;
}

void prepare_a_new_empty_line_for_terminal() {
    memcpy(terminal_text_array[0], terminal_text_array[1], 16);
    memcpy(terminal_text_array[1], terminal_text_array[2], 16);
    memcpy(terminal_text_array[2], "                ", 16);
}

void add_a_char_to_terminal_text_array(unsigned char a_char) {
    if (a_char == '\n') {
        terminal_rendering_position_y += 1;
        terminal_rendering_position_x = 0;
        if (terminal_rendering_position_y > 2) {
            prepare_a_new_empty_line_for_terminal();
            terminal_rendering_position_y = 2;
        }
    } else if (a_char == '\b') {
        terminal_text_array[terminal_rendering_position_y][terminal_rendering_position_x-1] = ' ';
        terminal_rendering_position_x -= 1;
        if (terminal_rendering_position_x < 0) {
            terminal_rendering_position_x = 0;
        }
    } else {
        if (terminal_rendering_position_x > 15) {
            terminal_rendering_position_y += 1;
            terminal_rendering_position_x = 0;
        }
        if (terminal_rendering_position_y > 2) {
            prepare_a_new_empty_line_for_terminal();
            terminal_rendering_position_y = 2;
        }
        terminal_text_array[terminal_rendering_position_y][terminal_rendering_position_x] = a_char;
        terminal_rendering_position_x += 1;
    }
}

void show_terminal_text_array() {
    smart_print_string(0, 0, terminal_text_array[0]);
    smart_print_string(1, 0, terminal_text_array[1]);
    smart_print_string(2, 0, terminal_text_array[2]);
}

void real_python_eval(unsigned char *input_code, unsigned char *output_code) {

    unsigned char temp_input[32] = { '\0' };
    int should_print = 1;
    for (int i=0; i<32; i++) {
        if (input_code[i] == '=') {
            should_print = 0;
            break;
        }
    }
    if (should_print == 1) {
        sprintf(temp_input, "print(%s)", input_code);
    } else {
        sprintf(temp_input, "%s", input_code);
    }
    send_bytes_to_serial(temp_input);
    delay(500);
    memcpy(output_code, uart_input_sentence, 16);
    output_code[16] = '\0';
}

void mini_python_eval(unsigned char *input_code, unsigned char *output_code) {
    unsigned char operator[4] = {'+', '-', '*', '/'};
    unsigned char target_operator = '\0';
    for (int i=0; i<16; i++) {
        unsigned char a_char = input_code[i];
        for (int i2=0; i2<4; i2++) {
            if (operator[i2] == a_char) {
                target_operator = operator[i2];
                break;
            }
        }
        if (target_operator != '\0') {
            break;
        }
    }
    if (target_operator == '\0') {
        memcpy(output_code, input_code, 13);
        return;
    } else {
        unsigned char part_1[16];
        unsigned char part_2[16];
        unsigned int temp_index = 0;
        unsigned int switch_signal = 0;
        for (int i=0; i<16; i++) {
            if (switch_signal == 0) {
                part_1[temp_index] = input_code[i];
                temp_index += 1;
            } else {
                part_2[temp_index] = input_code[i];
                temp_index += 1;
            }
            if (input_code[i] == target_operator) {
                part_1[temp_index] = '\0';
                switch_signal = 1;
                temp_index = 0;
            }
            if (input_code[i] == '\0') {
                break;
            }
        }
        part_2[temp_index] = '\0';
        int number_1 = atoi((char *)part_1);
        int number_2 = atoi((char *)part_2);
        double result = 0;
        if (target_operator=='+') {
            result = (double)(number_1 + number_2);
        } else if (target_operator=='-') {
            result = (double)(number_1 - number_2);
        } else if (target_operator=='*') {
            result = (double)(number_1 * number_2);
        } else if (target_operator=='/') {
            result = (double)(number_1 / number_2);
        }
        char final_string[16];
        sprintf(final_string, "%.2f", result);
        memcpy(output_code, final_string, 13);
        return;
    }
}

int one_line_input_index = 0;
int one_line_output_index = 0;
unsigned char one_line_terminal_input[16] = { '\0' };
unsigned char one_line_terminal_output[16] = { '\0' };
void send_character_to_terminal(unsigned char a_char) {
    if (one_line_input_index > 15) {
        one_line_input_index = 0;
    }
    if (a_char != '\0') {
        if (a_char == '\n') {
            one_line_terminal_input[one_line_input_index] = '\0';

            one_line_terminal_output[0] = '\n';

            if (use_built_in_shell == 1) {
                mini_python_eval(one_line_terminal_input, &one_line_terminal_output[1]);
            } else {
                mini_python_eval(one_line_terminal_input, &one_line_terminal_output[1]);
            }

            sprintf(one_line_terminal_output, "%s\n>", one_line_terminal_output);

            one_line_input_index = 0;
            memcpy(one_line_terminal_input, "               ", 16);
        } else {
            one_line_terminal_input[one_line_input_index] = a_char;
            one_line_input_index += 1;
            one_line_terminal_output[0] = a_char;
            one_line_terminal_output[1] = '\0';
        }
    }
}
unsigned char get_character_from_terminal() {
    one_line_terminal_output[15] = '\0';
    if (one_line_terminal_output[0] != '\0') {
        unsigned char temp_value = one_line_terminal_output[one_line_output_index];
        one_line_output_index += 1;
        if (temp_value == '\0') {
            one_line_terminal_output[0] = '\0';
            one_line_output_index = 0;
        }
        if (one_line_output_index >= 15) {
            one_line_terminal_output[0] = '\0';
            one_line_output_index = 0;
        }
        return temp_value;
    }
    return '\0';
}

void render_input_method_indicator() {
    if (input_method_status == 0) {
        smart_print_string(3, 0, "input: none");
    } else if (input_method_status == 1) {
        if (input_process_number == -1) {
            smart_print_string(3, 0, "input: abc/123/,");
        } else if (input_process_number == 0) {
            if (temp_input_1 == '\0') {
            } else if (temp_input_1 == '1') {
                smart_print_string(3, 0, "select: 1abc()#");
            } else if (temp_input_1 == '2') {
                smart_print_string(3, 0, "select: 2def[]@");
            } else if (temp_input_1 == '3') {
                smart_print_string(3, 0, "select: 3g\\bhi{}");
            } else if (temp_input_1 == '4') {
                smart_print_string(3, 0, "select: 4jkl<>");
            } else if (temp_input_1 == '5') {
                smart_print_string(3, 0, "select: 5mno\\n+-");
            } else if (temp_input_1 == '6') {
                smart_print_string(3, 0, "select: 6pqr*/=");
            } else if (temp_input_1 == '7') {
                smart_print_string(3, 0, "select: 7stu'\"`");
            } else if (temp_input_1 == '8') {
                smart_print_string(3, 0, "select: 8vwx:;");
            } else if (temp_input_1 == '9') {
                smart_print_string(3, 0, "select: 9yz&|\\");
            } else if (temp_input_1 == '0') {
                smart_print_string(3, 0, "select: 0_,.?!");
            }
        }
    }
}

void rander_according_to_status() {
    clear_the_screen();

    if (phone_status == 0) {
        smart_print_string(0, 0, "Hi, welcome.");
    } else if (phone_status == 1) {
        smart_print_string(0, 0, "  diary");
        smart_print_string(1, 0, "  terminal");
        smart_print_string(2, 0, "  book_reader");
        smart_print_string(3, 0, "  music_player");
        smart_print_string(program_list_position_y, 0, "> ");
    } else if (phone_status == 2) {
        if (current_program == 0) {
            smart_print_string(0, 0, "welcome to diary");
            render_input_method_indicator();
        } else if (current_program == 1) {
            //smart_print_string(0, 0, "welcome to terminal");
            send_character_to_terminal(last_input_char);

            unsigned char a_char = '\0';
            while (1) {
                a_char = get_character_from_terminal();
                if (a_char != '\0') {
                    add_a_char_to_terminal_text_array(a_char);
                } else {
                    break;
                }
            }

            show_terminal_text_array();
            render_input_method_indicator();
        } else if (current_program == 2) {
            smart_print_string(0, 0, "welcome to book reader");
        } else if (current_program == 3) {
            smart_print_string(0, 0, "welcome to music player");
        }
    }
}

unsigned char _get_real_char_for_second_choose(int number, unsigned char *temp_char_array, int length) {
    for (int i=0; i<length; i++) {
        if (number == i) {
            return temp_char_array[i];
        }
    }
    return '\0';
}

void response_to_keypad_number(int number) {
    if (last_input_char != '\0') {
        last_input_char = '\0';
    }

    if (input_method_status == 0) {
        // in normal mode
        
        if ((phone_status == 0) || (phone_status == 1)) {
            // in home page or program selection page
            
            // confirm or cancel
            if (number == 0) {
                phone_status = 1; //go to program list page
            } else if (number == 2) {
                phone_status = 0; //go to home page
            }

            // up or down
            if (number == 1) {
                program_list_position_y -= 1; 
            } else if (number == 7) {
                program_list_position_y += 1; 
            }
            if (program_list_position_y >= 4) {
                program_list_position_y = 0;
            }
            if (program_list_position_y < 0) {
                program_list_position_y = 3;
            }

            // ok
            if (number == 4) {
                if (phone_status == 1) {
                    phone_status = 2;
                    current_program = program_list_position_y;
                }
            }
        } else if (phone_status == 2) {
            // in program

            // enter or delete
            if ((number == 0) || (number == 4)) {
                // enter
                //last_input_char = '\n';
            } else if (number == 2) {
                // delete
                //last_input_char = '\b';
            }
        }
    } else if (input_method_status == 1) {
        // in alphabet mode

        if (input_process_number == -1) {
            if (number == 0) {
                temp_input_1 = '1';
            } else if (number == 1) {
                temp_input_1 = '2';
            } else if (number == 2) {
                temp_input_1 = '3';
            } else if (number == 3) {
                temp_input_1 = '4';
            } else if (number == 4) {
                temp_input_1 = '5';
            } else if (number == 5) {
                temp_input_1 = '6';
            } else if (number == 6) {
                temp_input_1 = '7';
            } else if (number == 7) {
                temp_input_1 = '8';
            } else if (number == 8) {
                temp_input_1 = '9';
            } else if (number == 10) {
                temp_input_1 = '0';
            } else {
                temp_input_1 = '\0';
            }
            last_input_char = '\0';
            input_process_number = 0;
        } else if (input_process_number == 0) {
            if (temp_input_1 == '\0') {
            } else if (temp_input_1 =='1') {
                unsigned char temp_second_char[7] = {'1','a','b','c','(',')', '#'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='2') {
                unsigned char temp_second_char[7] = {'2','d','e','f','[',']', '@'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='3') {
                unsigned char temp_second_char[7] = {'3','g','\b','h','i','{','}'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='4') {
                unsigned char temp_second_char[6] = {'4','j','k','l','<','>'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='5') {
                unsigned char temp_second_char[7] = {'5','m','n','o','\n','+','-'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='6') {
                unsigned char temp_second_char[7] = {'6','p','q','r','*','/','='};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='7') {
                unsigned char temp_second_char[7] = {'7','s','t','u','\'','"', '`'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='8') {
                unsigned char temp_second_char[6] = {'8','v','w','x',':',';'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='9') {
                unsigned char temp_second_char[6] = {'9','y','z','&','|','\\'};
                last_input_char = _get_real_char_for_second_choose(number, temp_second_char, sizeof(temp_second_char));
            } else if (temp_input_1 =='0') {
                if (number == 0) {
                    last_input_char = '0';
                } else if (number == 1) {
                    last_input_char = '_';
                } else if (number == 2) {
                    last_input_char = ',';
                } else if (number == 3) {
                    last_input_char = '.';
                } else if (number == 4) {
                    last_input_char = '?';
                } else if (number == 5) {
                    last_input_char = '!';
                } else if (number == 10) {
                    last_input_char = ' ';
                }
            } else {
                last_input_char = '\0';
            }
            input_process_number = -1;
        }
    }

    // handle input_method
    if (number == 9) {
        input_method_status += 1;
        if (input_method_status >= 2) {
            input_method_status = 0;
        }
        if (input_method_status <= -1) {
            input_method_status = 1;
        }
        input_process_number = -1;
    }

    // handle the go home button; it can also be used to close the screen if you click it 2 times in a short time
    if (number == 11) {
        phone_status = 0;
    }

    rander_according_to_status();
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; // close watchdog

    initialize_LCD();
    initialize_keypad();
    init_phone_status();
    initialize_serial_communication();

    smart_print_string(0, 0, "Hi, welcome.");

    //delay(500);
    //enter_raw_interpreter_mode();
    //delay(500);
    //send_bytes_to_serial("print(98)");
    //smart_print_string(1, 0, "sent.");
    //while (1) {
    //    delay(1000);
    //    clear_the_screen();
    //    delay(200);
    //    smart_print_string(1, 0, uart_input_sentence);
    //}

    //delay(500);
    //enter_raw_interpreter_mode();

    unsigned char *temp_variable = malloc(sizeof(char)*4);
    temp_variable[0] = '>';
    temp_variable[1] = '_';
    temp_variable[2] = '<';
    temp_variable[3] = '\0';
    smart_print_string(1, 0, temp_variable);
    free(temp_variable);

    while (1)
    {
        int value = catch_keypad_input();

        if (value == -1) {
        } else {
            response_to_keypad_number(value);
            delay(100);
        }
        delay(50);
    }
}
```
