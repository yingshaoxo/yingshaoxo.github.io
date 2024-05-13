# Sing a song for me

```c
#include "msp430.h"

//Definition of the notes' frequecies in Hertz.
#define c 261
#define d 294
#define e 329
#define f 349
#define g 391
#define gS 415
#define a 440
#define aS 455
#define b 466
#define cH 523
#define cSH 554
#define dH 587
#define dSH 622
#define eH 659
#define fH 698
#define fSH 740
#define gH 784
#define gSH 830
#define aH 880

/* This two functions stop the main thread for a certain number of milli -or- microseconds.
 They are based on trial and error, but they work fine for the out-of-the-box Launchpad board.
 TI should really add this types of functions as default, just like Arduino does :) .
 */
void delay_ms(unsigned int ms)
{
    unsigned int i;
    for (i = 0; i <= ms; i++)
        __delay_cycles(500); //Built-in function that suspends the execution for 500 cicles
}

void delay_us(unsigned int us)
{
    unsigned int i;
    for (i = 0; i <= us / 2; i++)
        __delay_cycles(1);
}

//This function generates the square wave that makes the piezo speaker sound at a determinated frequency.
void beep(unsigned int note, unsigned int duration)
{
    int i;
    long delay = (long) (10000 / note);  //This is the semiperiod of each note.
    long time = (long) ((duration * 100) / (delay * 2)); //This is how much time we need to spend on the note.
    for (i = 0; i < time; i++)
    {
        P6OUT |= BIT0;     //Set P6.0...
        delay_us(delay);   //...for a semiperiod...
        P6OUT &= ~BIT0;    //...then reset it...
        delay_us(delay);   //...for the other semiperiod.
    }
    delay_ms(20); //Add a little delay to separate the single notes
}

//This is the Imperial March code.
//As you can see, there are lots of beeps at different frequencies and durations, and some delays to separate the various bits of this wonderful song.
void play()
{
    beep(a, 500);
    beep(a, 500);
    beep(a, 500);
    beep(f, 350);
    beep(cH, 150);
    beep(a, 500);
    beep(f, 350);
    beep(cH, 150);
    beep(a, 650);

    delay_ms(150);
    //end of first bit

    beep(eH, 500);
    beep(eH, 500);
    beep(eH, 500);
    beep(fH, 350);
    beep(cH, 150);
    beep(gS, 500);
    beep(f, 350);
    beep(cH, 150);
    beep(a, 650);

    delay_ms(150);
    //end of second bit...

    beep(aH, 500);
    beep(a, 300);
    beep(a, 150);
    beep(aH, 400);
    beep(gSH, 200);
    beep(gH, 200);
    beep(fSH, 125);
    beep(fH, 125);
    beep(fSH, 250);

    delay_ms(250);

    beep(aS, 250);
    beep(dSH, 400);
    beep(dH, 200);
    beep(cSH, 200);
    beep(cH, 125);
    beep(b, 125);
    beep(cH, 250);

    delay_ms(250);

    beep(f, 125);
    beep(gS, 500);
    beep(f, 375);
    beep(a, 125);
    beep(cH, 500);
    beep(a, 375);
    beep(cH, 125);
    beep(eH, 650);

    //end of third bit... (Though it doesn't play well)
    //let's repeat it

    beep(aH, 500);
    beep(a, 300);
    beep(a, 150);
    beep(aH, 400);
    beep(gSH, 200);
    beep(gH, 200);
    beep(fSH, 125);
    beep(fH, 125);
    beep(fSH, 250);

    delay_ms(250);

    beep(aS, 250);
    beep(dSH, 400);
    beep(dH, 200);
    beep(cSH, 200);
    beep(cH, 125);
    beep(b, 125);
    beep(cH, 250);

    delay_ms(250);

    beep(f, 250);
    beep(gS, 500);
    beep(f, 375);
    beep(cH, 125);
    beep(a, 500);
    beep(f, 375);
    beep(cH, 125);
    beep(a, 650);
    //end of the song

}

int main(void)
{
    WDTCTL = WDTPW + WDTHOLD; //Disable Watchdog Timer
    P6DIR |= BIT0;              // P6.0 output
    while (1)
    {
        play();
        delay_ms(2000); //Add a 2 sec. delay to avoid replaying right after the end.
    }
}
```

## Beep?

> A short, high-pitched sound emitted by electronic equipment or a vehicle horn.

In here, it's a device for micro-computer to make sounds.

> When a voltage is applied across the terminals, the piezoelectric material in the speaker deflects in one direction. Applying an alternating voltage, such as a square wave, will cause the material to vibrate and create a sound.

## References:

{% embed url="http://processors.wiki.ti.com/index.php/Playing\_The\_Imperial\_March" %}



