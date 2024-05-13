# PID Controller

## Introduction

PID stands for **proportional–integral–derivative.**

We use this tech to insure an environment variable to keep staying at our target value. For example, keep temperature, pressure, force, feed rate, flow rate, position, speed stable.

## Pseudocode

```c
previous_error = 0
integral = 0
loop:
  error = setpoint - measured_value
  integral = integral + error * dt
  derivative = (error - previous_error) / dt
  output = Kp * error + Ki * integral + Kd * derivative
  previous_error = error
  wait(dt)
  goto loop
```

~~This could be extremely difficult to implement in single-chip micro-controller. So maybe I'll cover it in the end of this series.~~

## Experiment with PID controller and Analog Accelerometer

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
// SET Motor Driver!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Input 1: P3.1
// Input 2: P3.2
// Input 3: P3.3
// Input 4: P3.4
//
// Enable 1: P1.6
// Enable 2: P1.7
// ***************
// ****************

#define pin_of_motor1_driver_input1 BIT1
#define pin_of_motor1_driver_input2 BIT2

#define pin_of_motor2_driver_input1 BIT3
#define pin_of_motor2_driver_input2 BIT4

#define pin_of_motor1_driver_enable BIT6 // to give the power to the circuit
#define pin_of_motor2_driver_enable BIT7 // to give the power to the circuit

#define set_motor_control_pin_as_output P3DIR |= (pin_of_motor1_driver_input1 | pin_of_motor1_driver_input2 | pin_of_motor2_driver_input1 | pin_of_motor2_driver_input2)
#define set_motor_enable_pin_as_output P1DIR |= (pin_of_motor1_driver_enable | pin_of_motor2_driver_enable)

#define set_pin_of_motor1_driver_input1_to_0 \
    P3OUT &= ~pin_of_motor1_driver_input1 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor1_driver_input1_to_1 \
    P3OUT |= pin_of_motor1_driver_input1 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7
#define set_pin_of_motor1_driver_input2_to_0 \
    P3OUT &= ~pin_of_motor1_driver_input2 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor1_driver_input2_to_1 \
    P3OUT |= pin_of_motor1_driver_input2 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7

#define set_pin_of_motor2_driver_input1_to_0 \
    P3OUT &= ~pin_of_motor2_driver_input1 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor2_driver_input1_to_1 \
    P3OUT |= pin_of_motor2_driver_input1 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7
#define set_pin_of_motor2_driver_input2_to_0 \
    P3OUT &= ~pin_of_motor2_driver_input2 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor2_driver_input2_to_1 \
    P3OUT |= pin_of_motor2_driver_input2 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7

unsigned int a_period_of_time = 1000 - 1;

void update_motor_speed(int which_motor, float speed) {
    if (which_motor == 1) {
        TACCR1 = (int)(a_period_of_time * speed);
    } else if (which_motor == 2) {
        TACCR2 = (int)(a_period_of_time * speed);
    }
}

void initialize_motor_driver() {
    set_motor_control_pin_as_output;
    set_motor_enable_pin_as_output;

    P1SEL |= (pin_of_motor1_driver_enable | pin_of_motor2_driver_enable); // Peripheral module function is selected for the pin 1.6 and pin 1.7

    TACCR0 = a_period_of_time;

    TACCTL1 = OUTMOD_7; //Timer A Capture/Compare Control 1; PWM output mode: 7 - PWM reset/set
    update_motor_speed(1, 0);

    TACCTL2 = OUTMOD_7; //Timer A Capture/Compare Control 2; PWM output mode: 7 - PWM reset/set
    update_motor_speed(2, 0);

    TACTL = TASSEL_2 + MC_1; // Timer A Control (control all); SMCLK Clock = 1MHz; Up mode, count from 0 to TACCR1
}

void stop_motor(int which_motor) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_0;
        set_pin_of_motor1_driver_input2_to_0;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_0;
        set_pin_of_motor2_driver_input2_to_0;
    }

    update_motor_speed(1, 0);
    update_motor_speed(2, 0);
}

void make_the_motor_still(int which_motor) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_1;
        set_pin_of_motor1_driver_input2_to_1;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_1;
        set_pin_of_motor2_driver_input2_to_1;
    }
}

void motor_forward(int which_motor, float speed) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_1;
        set_pin_of_motor1_driver_input2_to_0;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_1;
        set_pin_of_motor2_driver_input2_to_0;
    }

    update_motor_speed(which_motor, speed);
}

void motor_backward(int which_motor, float speed) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_0;
        set_pin_of_motor1_driver_input2_to_1;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_0;
        set_pin_of_motor2_driver_input2_to_1;
    }

    update_motor_speed(which_motor, speed);
}

// ***************
// ****************
// SET Voltage Sensor!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Receiving analog value from P6.0
// ***************
// ****************

void initialize_voltage_sensor() {
    ADC12CTL0 = SHT0_2 + ADC12ON; // Set Sample/Hold time ;  Turn On ADC12
    ADC12CTL1 = SHP;              // Use sampling timer | ADC12 Sample/Hold Pulse Mode
    //ADC12IE = BIT0;               // Enable interrupt | ADC12 Interrupt Enable
    ADC12CTL0 |= ENC; // Conversion enabled | ADC12 Enable Conversion

    __delay_cycles(1000); // Wait for ADC Ref to settle
    P6SEL |= BIT0;        // P6.0 ADC option select | Port 6 Selection; set this pin as a Peripheral-pin, not just use a simple I/O Function anymore
}

float get_value_from_voltage_sensor() {
    ADC12CTL0 |= ADC12SC; // Sampling open | ADC12 Start Conversion

    while ((ADC12IFG & BIT0) == 0) {
        // If no new value was sent to ADC12MEM0, we wait here.
    }

    ADC12IFG &= ~BIT0; // set ADC interrupt flag to 0. After a new analog value has been giving to ADC12MEM0, ADC12IFG will be set to 1 automatically.

    return ADC12MEM0;
}

float map_range(float value, float fromLow, float fromHigh, float toLow, float toHigh) {
    // A function just like map() in arduino
    if (value < fromLow) {
        value = fromLow;
    } else if (value > fromHigh) {
        value = fromHigh;
    }

    float target_value = ((toHigh - toLow) / (fromHigh - fromLow)) * (value - fromLow) + toLow;

    return target_value;
}

float get_dynamic_approaching_speed(int target_distance, int real_distance, int approaching_length, float max_speed, float min_speed) {
    // loss: distance between target value and real value
    // approaching_length: when real value approaching this area, the speed need to get change to adapt the new situation
    int loss = abs(target_distance - real_distance);
    //print_float(0, 3, loss);
    float speed = loss / (approaching_length / max_speed);

    if (speed < min_speed) {
        speed = min_speed;
    }

    //print_float(0, 4, speed);
    return speed;
}

unsigned long int milliseconds_for_PID_controller = 0;
void initialize_PID_controller() {
    TACCR0 = 1000 - 1;       //Start Timer, Compare value for Up Mode to get 1ms delay per loop
    TACCTL0 |= CCIE;         // Timer A Capture/Compare Control 0; Enable interrupt for CCR0.
    TACTL = TASSEL_2 + MC_1; // Timer A Control (control all); SMCLK Clock = 1MHz; Up mode, count from 0 to TACCR1

    __enable_interrupt();
}

//Timer ISR
#pragma vector = TIMER0_A0_VECTOR
__interrupt void Timer_A_CCR0_ISR(void) {
    milliseconds_for_PID_controller++;
}

float previous_error = 0;
unsigned long int integral = 0;
float update_PID_controller_and_get_output(float target_value, float real_value, float time_delta) {
    if (milliseconds_for_PID_controller >= time_delta) {
        float Kp = 0.5;
        float Ki = 0.0001 * 2 * 1.34;
        float Kd = 0.1 / 2 / 2 / 2; // start from 1 Second

        float error = target_value - real_value;
        integral = integral + error * time_delta;
        float derivative = (error - previous_error) / time_delta;
        float output = Kp * error + Ki * integral + Kd * derivative;
        previous_error = error;

        print_number(0, 4, integral);
        /* 
        float max_integral = 0.02;
        if (integral > 0) {
            if (integral > max_integral) {
                integral = max_integral;
            }
        } else if (integral < 0) {
            if (-integral < -max_integral) {
                integral = -max_integral;
            }
        }
        float max_derivative = 10;
        if (derivative > 0) {
            if (derivative > max_derivative) {
                derivative = max_derivative;
            }
        } else if (derivative < 0) {
            if (-derivative < -max_derivative) {
                derivative = -max_derivative;
            }
        }
        */

        milliseconds_for_PID_controller = 0;
        return output;
    } else {
        return 0;
    }
}

void dynamiclly_control_motor(int which_motor, int target_value, int real_value) {
    float PID_output = update_PID_controller_and_get_output(target_value, real_value, 200);
    print_float(0, 3, PID_output);

    PID_output = PID_output / 180;
    //print_float(0, 4, PID_output);
    if (PID_output > 0) {
        motor_forward(which_motor, PID_output);
    } else if (PID_output < 0) {
        motor_backward(which_motor, -PID_output);
    } else if (PID_output == 0) {
        make_the_motor_still(which_motor);
    }
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop WDT

    initialize_LCD();
    initialize_motor_driver();
    initialize_voltage_sensor();
    initialize_PID_controller();

    while (1) {
        float value = get_value_from_voltage_sensor();
        print_float(0, 1, value);

        int angle = map_range(value, 430, 3600, -90, 90);
        print_number(0, 2, angle);

        dynamiclly_control_motor(1, 0 + 90, angle + 90);

        millisecond_of_delay(50);
        screen_clean();
    }
}
```

## PID controller with Object Hanging Control

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
// SET Keypad!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***************
// ****************

/*
P5.0-3 need to connected to R1-R4
P5.4-7 need to connected to C1-C4

1	2	3	Return(or back)
4	5	6	Menu
7	8	9	Cancel
	0	.	Enter

.: 10
Return: -1
Menu: -2
Cancel: -3
Enter: -4
*/
#define BIT_of_rows (BIT0 | BIT1 | BIT2 | BIT3)
#define BIT_of_columns (BIT4 | BIT5 | BIT6 | BIT7)

#define set_row_as_input P5DIR &= ~BIT_of_rows
#define set_column_as_output P5DIR |= BIT_of_columns

#define set_all_columns_to_0 P5OUT &= ~BIT_of_columns
#define set_all_columns_to_1 P5OUT |= BIT_of_columns

#define set_column1_to_0 P5OUT &= ~BIT4
#define set_column1_to_1 P5OUT |= BIT4

#define set_column2_to_0 P5OUT &= ~BIT5
#define set_column2_to_1 P5OUT |= BIT5

#define set_column3_to_0 P5OUT &= ~BIT6
#define set_column3_to_1 P5OUT |= BIT6

#define set_column4_to_0 P5OUT &= ~BIT7
#define set_column4_to_1 P5OUT |= BIT7

#define input_of_row1 (P5IN & BIT0) == 0 // when you pressing a key, it returns 0
#define input_of_row2 (P5IN & BIT1) == 0
#define input_of_row3 (P5IN & BIT2) == 0
#define input_of_row4 (P5IN & BIT3) == 0

int human_set_target_number = 20;
int input_start = 0;
char input_string[50];
void handle_keypad_number(int number) {
    // Do what you want to do with numbers

    /*
	1	2	3	Return(or back)
	4	5	6	Menu
	7	8	9	Cancel
		0	.	Enter

	.: 10
	Return: -1
	Menu: -2
	Cancel: -3
	Enter: -4
	*/

    if (input_start == 0) {
        screen_clean();
        if ((number >= 0) && (number < 10)) {
            char text[1];
            int_to_string(number, text, 1);
            strcat(input_string, text);
            print_string(0, 1, input_string);

            input_start = 1;
        }
    } else if (input_start == 1) {
        if ((number >= 0) && (number < 10)) {
            char text[1];
            int_to_string(number, text, 1);
            strcat(input_string, text);
            print_string(0, 1, input_string);
        } else if (number < 0) {
            if (number == -3) {
                print_string(0, 1, "Distance:__");
                strcpy(input_string, "");
                input_start = 0;
            } else if (number == -4) {
                int target_number = atoi(input_string);
                human_set_target_number = target_number;

                print_string(0, 1, "Distance:__");
                strcpy(input_string, "");
                input_start = 0;
            }
        }
    }
}

int catch_keypad_input() {
    if (input_of_row1) {
        set_column1_to_1;
        if (!input_of_row1) {
            millisecond_of_delay(200);
            if (!input_of_row1) {
                //handle_keypad_number(1);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row1) {
            millisecond_of_delay(200);
            if (!input_of_row1) {
                handle_keypad_number(0);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row1) {
            millisecond_of_delay(200);
            if (!input_of_row1) {
                handle_keypad_number(10);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;

        set_column4_to_1;
        if (!input_of_row1) {
            millisecond_of_delay(200);
            if (!input_of_row1) {
                handle_keypad_number(-4);
                set_column4_to_0;
                return 0;
            }
        }
        set_column4_to_0;

    } else if (input_of_row2) {
        set_column1_to_1;
        if (!input_of_row2) {
            millisecond_of_delay(200);
            if (!input_of_row2) {
                handle_keypad_number(7);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row2) {
            millisecond_of_delay(200);
            if (!input_of_row2) {
                handle_keypad_number(8);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row2) {
            millisecond_of_delay(200);
            if (!input_of_row2) {
                handle_keypad_number(9);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;

        set_column4_to_1;
        if (!input_of_row2) {
            millisecond_of_delay(200);
            if (!input_of_row2) {
                handle_keypad_number(-3);
                set_column4_to_0;
                return 0;
            }
        }
        set_column4_to_0;

    } else if (input_of_row3) {
        set_column1_to_1;
        if (!input_of_row3) {
            millisecond_of_delay(200);
            if (!input_of_row3) {
                handle_keypad_number(4);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row3) {
            millisecond_of_delay(200);
            if (!input_of_row3) {
                handle_keypad_number(5);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row3) {
            millisecond_of_delay(200);
            if (!input_of_row3) {
                handle_keypad_number(6);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;

        set_column4_to_1;
        if (!input_of_row3) {
            millisecond_of_delay(200);
            if (!input_of_row3) {
                handle_keypad_number(-2);
                set_column4_to_0;
                return 0;
            }
        }
        set_column4_to_0;

    } else if (input_of_row4) {
        set_column1_to_1;
        if (!input_of_row4) {
            millisecond_of_delay(200);
            if (!input_of_row4) {
                handle_keypad_number(1);
                set_column1_to_0;
                return 0; // must return, otherwise, a weird thing will happen
            }
        }
        set_column1_to_0;

        set_column2_to_1;
        if (!input_of_row4) {
            millisecond_of_delay(200);
            if (!input_of_row4) {
                handle_keypad_number(2);
                set_column2_to_0;
                return 0;
            }
        }
        set_column2_to_0;

        set_column3_to_1;
        if (!input_of_row4) {
            millisecond_of_delay(200);
            if (!input_of_row4) {
                handle_keypad_number(3);
                set_column3_to_0;
                return 0;
            }
        }
        set_column3_to_0;

        set_column4_to_1;
        if (!input_of_row4) {
            millisecond_of_delay(200);
            if (!input_of_row4) {
                handle_keypad_number(-1);
                set_column4_to_0;
                return 0;
            }
        }
        set_column4_to_0;
    }
}

void initialize_keypad() {
    set_column_as_output;
    set_row_as_input;

    //set_all_columns_to_1;
    set_all_columns_to_0; // by default, columns need to set to low
}

// ***************
// ****************
// SET Motor Driver!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 
// Input 1: P3.1
// Input 2: P3.2
// Input 3: P3.3
// Input 4: P3.4
// 
// Enable 1: P1.6
// Enable 2: P1.7
// ***************
// ****************

#define pin_of_motor1_driver_input1 BIT1
#define pin_of_motor1_driver_input2 BIT2

#define pin_of_motor2_driver_input1 BIT3
#define pin_of_motor2_driver_input2 BIT4

#define pin_of_motor1_driver_enable BIT6 // to give the power to the circuit
#define pin_of_motor2_driver_enable BIT7 // to give the power to the circuit

#define set_motor_control_pin_as_output P3DIR |= (pin_of_motor1_driver_input1 | pin_of_motor1_driver_input2 | pin_of_motor2_driver_input1 | pin_of_motor2_driver_input2)
#define set_motor_enable_pin_as_output P1DIR |= (pin_of_motor1_driver_enable | pin_of_motor2_driver_enable)

#define set_pin_of_motor1_driver_input1_to_0 \
    P3OUT &= ~pin_of_motor1_driver_input1 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor1_driver_input1_to_1 \
    P3OUT |= pin_of_motor1_driver_input1 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7
#define set_pin_of_motor1_driver_input2_to_0 \
    P3OUT &= ~pin_of_motor1_driver_input2 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor1_driver_input2_to_1 \
    P3OUT |= pin_of_motor1_driver_input2 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7

#define set_pin_of_motor2_driver_input1_to_0 \
    P3OUT &= ~pin_of_motor2_driver_input1 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor2_driver_input1_to_1 \
    P3OUT |= pin_of_motor2_driver_input1 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7
#define set_pin_of_motor2_driver_input2_to_0 \
    P3OUT &= ~pin_of_motor2_driver_input2 // P3 means Port3, and Port3 has 8 \
                                          // pins from P3.0 to P3.7
#define set_pin_of_motor2_driver_input2_to_1 \
    P3OUT |= pin_of_motor2_driver_input2 // P3 means Port3, and Port3 has 8 pins \
                                         // from P3.0 to P3.7

unsigned int a_period_of_time = 1000 - 1;
float previous_motor1_speed = 0;
float previous_motor2_speed = 0;

void update_motor_speed(int which_motor, float speed) {
    if (speed > 1) {
        speed = 1.0;
    }

    if (which_motor == 1) {
        TACCR1 = (int)(a_period_of_time * speed);
        previous_motor1_speed = speed;
    } else if (which_motor == 2) {
        TACCR2 = (int)(a_period_of_time * speed);
        previous_motor2_speed = speed;
    }
}

void initialize_motor_driver() {
    set_motor_control_pin_as_output;
    set_motor_enable_pin_as_output;

    P1SEL |= (pin_of_motor1_driver_enable | pin_of_motor2_driver_enable); // Peripheral module function is selected for the pin 1.6 and pin 1.7

    TACCR0 = a_period_of_time;

    TACCTL1 = OUTMOD_7; //Timer A Capture/Compare Control 1; PWM output mode: 7 - PWM reset/set
    update_motor_speed(1, 0);

    TACCTL2 = OUTMOD_7; //Timer A Capture/Compare Control 2; PWM output mode: 7 - PWM reset/set
    update_motor_speed(2, 0);

    TACTL = TASSEL_2 + MC_1; // Timer A Control (control all); SMCLK Clock = 1MHz; Up mode, count from 0 to TACCR1
}

void stop_motor(int which_motor) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_0;
        set_pin_of_motor1_driver_input2_to_0;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_0;
        set_pin_of_motor2_driver_input2_to_0;
    }

    update_motor_speed(1, 0);
    update_motor_speed(2, 0);
}

void make_the_motor_still(int which_motor) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_1;
        set_pin_of_motor1_driver_input2_to_1;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_1;
        set_pin_of_motor2_driver_input2_to_1;
    }
}

void motor_forward(int which_motor, float speed) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_1;
        set_pin_of_motor1_driver_input2_to_0;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_1;
        set_pin_of_motor2_driver_input2_to_0;
    }

    update_motor_speed(which_motor, speed);
}

void motor_backward(int which_motor, float speed) {
    if (which_motor == 1) {
        set_pin_of_motor1_driver_input1_to_0;
        set_pin_of_motor1_driver_input2_to_1;
    } else if (which_motor == 2) {
        set_pin_of_motor2_driver_input1_to_0;
        set_pin_of_motor2_driver_input2_to_1;
    }

    update_motor_speed(which_motor, speed);
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

float get_dynamic_approaching_speed(int target_distance, int real_distance, int approaching_length, float max_speed, float min_speed) {
    // loss: distance between target value and real value
    // approaching_length: when real value approaching this area, the speed need to get change to adapt the new situation
    int loss = abs(target_distance - real_distance);
    print_float(0, 3, loss);
    float speed = loss / (approaching_length / max_speed);

    if (speed < min_speed) {
        speed = min_speed;
    }

    print_float(0, 4, speed);
    return speed;
}

unsigned long int milliseconds_for_PID_controller = 0;
void initialize_PID_controller() {
    TACCR0 = 1000 - 1;       //Start Timer, Compare value for Up Mode to get 1ms delay per loop
    TACCTL0 |= CCIE;         // Timer A Capture/Compare Control 0; Enable interrupt for CCR0.
    TACTL = TASSEL_2 + MC_1; // Timer A Control (control all); SMCLK Clock = 1MHz; Up mode, count from 0 to TACCR1

    __enable_interrupt();
}

//Timer ISR
#pragma vector = TIMER0_A0_VECTOR
__interrupt void Timer_A_CCR0_ISR(void) {
    milliseconds_for_PID_controller++;
}

float previous_error = 0;
unsigned long int integral = 0;
float time_delta = 200;
float PID_raw_output_max = 0;
float PID_raw_output_min = 0;
float PID_output_range = 0;
float human_set_PID_output_range = 18;
float update_PID_controller_and_get_output(float target_value, float real_value) {
        float Kp = 0.2;
        float Ki = 0.00015;
        float Kd = 0.1; // start from 1 Second

        float error = target_value - real_value;
        integral = integral + error * time_delta;
        float derivative = (error - previous_error) / time_delta;
        float output = Kp * error + Ki * integral + Kd * derivative;
        previous_error = error;

        //print_number(0, 4, integral);

        // get the range of PID_controller_output
        if (output > PID_raw_output_max) {
            PID_raw_output_max = output;
        }
        if (output < PID_raw_output_min) {
            PID_raw_output_min = output;
        }

        milliseconds_for_PID_controller = 0;
        if (human_set_PID_output_range != 0) {
            PID_output_range = human_set_PID_output_range;
        } else {
            PID_output_range = PID_raw_output_max - PID_raw_output_min;
        }
        print_number(0, 4, PID_output_range);
        if (PID_output_range == 0) {
            return 0.2;
        } else {
            return output/PID_output_range;
        }
}

void dynamiclly_control_motor(int which_motor, int target_value, int real_value) {
    if (milliseconds_for_PID_controller >= time_delta) {
        float PID_output = update_PID_controller_and_get_output(target_value, real_value);
        print_float(0, 3, PID_output);

        if (PID_output > 0) {
            motor_forward(which_motor, PID_output);
        } else if (PID_output < 0) {
            motor_backward(which_motor, -PID_output);
        } else if (PID_output == 0) {
            make_the_motor_still(which_motor);
        }
    }
}

void dynamiclly_control_hanging_distance(int target_distance) {
    make_the_motor_still(1);
    millisecond_of_delay(200);

    int real_distance = ultrasonic_detection();
    print_number(0, 2, real_distance);

    dynamiclly_control_motor(1, target_distance, real_distance);
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    initialize_LCD();
    initialize_keypad();
    initialize_motor_driver();

    initialize_ultrasonic_sensor();
    initialize_PID_controller();

    print_string(0, 1, "Distance:__");
    while (1) {
        catch_keypad_input();

        dynamiclly_control_hanging_distance(human_set_target_number);

        millisecond_of_delay(100);
        print_string(0, 2, "        ");
    }
}
```

## References:

{% embed url="https://en.wikipedia.org/wiki/PID\_controller" %}

{% embed url="https://onion.io/2bt-pid-control-python/" %}

{% embed url="https://github.com/ivmech/ivPID" %}

{% embed url="https://github.com/m-lundberg/simple-pid" %}

{% embed url="https://www.elprocus.com/the-working-of-a-pid-controller/" %}



