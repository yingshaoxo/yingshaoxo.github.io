# Read Key or Button State

## Simple example

```c
/*
The P5.1 LED will light up when you give 3.3V to P5.0
*/
#include <msp430.h>

int main(void) {
    WDTCTL = WDTPW + WDTHOLD; // Stop WDT

    P5DIR &= ~BIT0; // set P5.0 as input, BIT0=0x0001
    P5DIR |= BIT1;  // set P5.1 as output, BIT1=0x0002

    while (1) {
        int input_value_from_port5_pin0 = (P5IN & BIT0); // if there's no 3.3v input at P5.0, (P5IN & BIT0) will return 0
        if (input_value_from_port5_pin0 == 0) {
            P5OUT |= BIT1; // P5.1 = 1, Light up the LED
        } else {
            P5OUT &= ~BIT1; // P5.1 = 0, Turn off the LED
        }
    }
}
```

## Complex one

```c
#include <msp430.h> 

#define original_button_state 0x01 //0000 0001
#define values_from_input_key (P1IN & original_button_state)

/*
#define values_from_input_key (P1IN & 0x0f)

P1 0-3 should connect to 4 switches(physical keys, or simply buttons)
0x0f = 0000 1111
P1IN = Port 1 input = yyyy xxxx
yyyy xxxx are binary numbers, I mean 1 or 0
we don't know yyyy. But no matter what kind of yyyy is, after & operation, it should remain its original value. 1111 0000 & 0000 1111 = 0000 0000
and one thing we definitely know. if we press key1-4, xxxx will be changed according to our actions

if 4 buttons were connected and no button was being pressed, it is 1111
say if key0 has been pressing, then it becomes 1110

The reason for using `yyyyxxxx & 00001111` may simply to ignore the state of yyyy. Because no matter what value yyyy is, 0 or 1, after & operation with 0, it's still 0
*/

/*
0x01: 0000 0001

original: 0000 0001
&: 0000 0001

pressing: 0000 0000
&: 0000 0000
*/

void delay(int times)
{
    unsigned int tmp;
    for (; times >= 0; times--)
    {
        for (tmp = 12000; tmp > 0; tmp--)
        {
            ;
        }
    }
}

void main(void)
{
    WDTCTL = WDTPW | WDTHOLD;   // stop watchdog timer

    P1DIR &= ~(BIT0 | BIT1 | BIT2 | BIT3);  // set P1 0-3 as input
    P2DIR |= (BIT0 | BIT1 | BIT2 | BIT3);  // set P2 0-3 as output
    P2OUT = 0x00; // clear P2 output

    unsigned char temp;
    while (1)
    {
        if (values_from_input_key != original_button_state) // we have detected at least one button state change
        {
            delay(1);            //  wait a "second"!

            if (values_from_input_key != original_button_state) // we have to make sure you are indeed pressing a button
            {

                temp = values_from_input_key; // let's save the new state of our buttons

                while (values_from_input_key != original_button_state) // if it was equal, that means Port 1 inputs has been back to the original state.
                {
                    ;   // wait until key was released
                }

                switch (temp)
                // we determine which button you have had pressed, then we change Port 2 accordingly
                {
                case 0x00:
                    P2OUT ^= BIT0;
                    break;
                default:
                    P2OUT = 0x00;
                    break;
                }

                delay(8);
            }
        }
    }
}
```

## Hex to Binary?

```python
while 1:
    hex_ = input("\nEnter any number in Hexadecimal Format: ")
    if hex_.strip() != "":
        try:
            decimal = int(hex_, 16)
            binary = format(decimal, '08b')
            print(hex_, f"in Binary = "+ binary[:4] + " " + binary[4:])
        except Exception as e:
            print(e)
```

## Binary to Hex?

```python
while 1:
    binary = input("\nEnter any number in binary Format: ")
    if binary.strip() != "":
        try:
            hex_ = hex(int(str(binary), 2))
            print(binary, f"in hex = {hex_}")
        except Exception as e:
            print(e)
```

## What happens?

1. Set `port 1.0` to input: `PIDIR &= ~(BIT0)`
2. You should check those comments in above codes seriously.
3. A button was connected, you get 1; A button was being pressed, you get 0.
4. Chinese version board should follow Chinese datasheet gave by the seller. Otherwise, you'll find out that you just connected to a wrong port according to an official document.
5. `Binary to Hex` or `Binary calculation` is sucked, I should find a way to automate it.

`Button0` connect to `port 1.0`, `LED` connect to `port 2.0`, then you should be able to run the above c codes correctly.

## By the way

Debugger is a good thing since we don't have `Serial feedback`

You can use Debugger to check `register values` at run time.

`register` is a fancy word for `variable` or `storage`

## References:

{% embed url="https://users.wpi.edu/~ndemarinis/ece2049/e16/lecture5.html" %}



