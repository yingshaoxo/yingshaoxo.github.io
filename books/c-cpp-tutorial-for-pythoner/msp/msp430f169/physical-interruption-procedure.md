# Physical Interruption Procedure

## Introduction

> An interrupt is an event that causes a micro-controller to stop what it’s doing, handle the interrupt by running a special function called an interrupt service routine \(ISR\), and then pick up where it left off before the interrupt happened.

Well, we can't always use the main loop to handle things. Because we got so many information source need to handle at the same time. For example, a keyboard or other sensors.

In this case, what we need to do is find a way to interrupt the main loop, and do a special procedure \(run a sub-program\).

## A simple interrupt

```c
// P1 and P2 could be used for interruption

// P2.0 have to connected to a LED
// P1.3 was used for interruption, so it has to be connected to a button

#include <msp430.h>

void light_up_or_off_LED()
{
    P2OUT ^= BIT0; // Toggle P2.0 using exclusive-OR
}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; // Stop watchdog timer

    P2DIR |= BIT0; // Set P1.0 to output direction

    //P1DIR &= BIT3; // Set P1.3 to input direction. Through I set this, you can't use it as input anyway.
    P1IE |= BIT3; // P1.3 interrupt enabled
    P1IES &= BIT3; // P1.3 Interrupt Edge Select low-to-high

    //_BIS_SR(LPM0 + GIE); // Enter LPM0 mode + general interrupt enable
    _BIS_SR(GIE); // just enable general interrupt

    while (1)
    {
        // we block the main loop
    }
}

// Port 1 interrupt service routine. You can also call it "sub-program for button P1.3"
#pragma vector = PORT1_VECTOR
__interrupt void Port_1_interrupt_procedure(void)
{
    P2OUT ^= BIT0;  // Toggle P2.0
    P1IFG &= ~BIT3; // clean P1.3 IFG
}
```

## Explanation

### IE

Interrupt Enable

### IES

Interrupt Edge Select

* work when pin from **low to high**: `P1IES = 0` \(`P1DIR &= BIT3`\)
* work when pin from **high to low**: `P1IES = 1` \(`P1DIR |= BIT3`\) 

### GIE

General Interrupt Enable

What is general? Some pins like Digit IO from P1 to P2, 16 physical pins.

### IFG

Interrupt Flag

* `IFG = 0`: No interrupt pending, which means you can just start another interrupt, it's OK.
* `IFG = 1`: Interrupt pending, which means currently we are running the interrupt procedure, won't respond to a new interrupt request.

You can use `IFG` to detect which exactly pin has raised that interrupt procedure since we only have `PORT1_VECTOR` and `PORT2_VECTOR` available for `ISR(interrupt service routine)`

For example, `P1IFG & BIT3 == True` means pin `P1.3` caused an interruption at Port 1

## References:

{% embed url="https://embedded.fm/blog/ese101-msp430-interrupts" %}

{% embed url="http://referencedesigner.com/blog/msp430-interrupt-tutorial/2082/" %}

{% embed url="http://referencedesigner.com/blog/msp430-interrupt-rising-and-falling-edge/2089/" %}

{% embed url="https://e2e.ti.com/support/microcontrollers/msp430/f/166/t/305555" %}



