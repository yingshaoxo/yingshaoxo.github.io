# ili9341-LCD

## Where to go

If you want to find resources about an open-source LCD, you could go to this website:

{% embed url="http://www.lcdwiki.com/Main\_Page" %}

## ili9341-LCD

{% embed url="http://www.lcdwiki.com/3.2inch\_SPI\_Module\_ILI9341\_SKU:MSP3218" %}

For this LCD, one thing you need to know is that:

* max\_x = 240
* max\_y = 320

And you don't have to remember the pin-maps, use the following table when you need to connect pins.

| Pin | Description |
| :--- | :--- |
| VCC | 5V/3.3V power input |
| GND | Ground |
| CS | LCD chip select signal, low to enable |
| RESET | LCD reset signal, low to reset |
| DC/RS | LCD register/data selection signal. low for data, high for register |
| SDI\(MOSI\) | SPI bus write data signal |
| SCK | SPI bus clock signal |
| LED | Backlight control, hight to light. \(Connect to 3.3V if you don't need to control it\) |
| SDO\(MISO\) | SPI bus read data signal |
| T\_CLK | Touch screen SPI bus clock signal |
| T\_CS | Touch screen chip select control signal |
| T\_DIN | Touch screen SPI bus write data signal |
| T\_DO | Touch screen SPI bus read data signal |
| T\_IRQ | Touch screen touch interrupt detection signal |

## Let's do it Arduino way

### The file structure

```text
├── include
│   └── README
├── lib
│   ├── LCDWIKI_GUI
│   │   ├── LCDWIKI_font.c
│   │   ├── LCDWIKI_GUI.cpp
│   │   ├── LCDWIKI_GUI.h
│   │   ├── library.properties
│   │   ├── LICENSE
│   │   ├── LICENSE.txt
│   │   └── README.txt
│   ├── LCDWIKI_SPI
│   │   ├── lcd_spi_registers.h
│   │   ├── LCDWIKI_SPI.cpp
│   │   ├── LCDWIKI_SPI.h
│   │   ├── LICENSE
│   │   ├── mcu_spi_magic.h
│   │   └── README.txt
│   └── README
├── platformio.ini
├── src
│   └── main.cpp
└── test
    └── README
```

### The source code

{% embed url="https://github.com/yingshaoxo/msp430f5529-with-lil9341-example" %}

### The connections

For the test, I'm using:

```text
#define CS P6_0
#define CD P6_1
#define RST P6_2
#define MOSI P3_0
#define MISO P6_3
#define SCK P3_2
```

Actually, you can use whatever pins you like, if you know how to change the code.

