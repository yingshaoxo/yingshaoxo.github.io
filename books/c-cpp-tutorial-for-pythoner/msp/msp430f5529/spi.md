# SPI

## General Meaning

SPI = Serial Peripheral Interface

* Clock \(SPI CLK, SCLK\)
* Chip select \(CS\)
* Master out, slave in \(MOSI\)
* Master in, slave out \(MISO\)

> Due to some stupid reason \(people can't be smart in the first place\), the pin-name for SPI can be varied. That's why I have to write them all down, so you won't feel confused when you meet those strange names later.

## SCLK: Serial Clock \(output from master\)

Serial Clock:

* SCK

## MOSI: Master Out Slave In \(data output from master\)

Master Output → Slave Input \(MOSI\):

* SIMO, MTSR - correspond to MOSI on both master and slave devices, connects to each other
* SDI, DI, DIN, SI - on slave devices; connects to MOSI on master, or to below connections
* SDO, DO, DOUT, SO - on master devices; connects to MOSI on slave, or to above connections

> I just want to give it a middle finger.

## MISO: Master In Slave Out \(data output from slave\)

Master Input ← Slave Output \(MISO\):

* SOMI, MRST - correspond to MISO on both master and slave devices, connects to each other
* SDO, DO, DOUT, SO - on slave devices; connects to MISO on master, or to below connections
* SDI, DI, DIN, SI - on master devices; connects to MISO on slave, or to above connections

> Also for this one.

## SS: Slave Select \(often [active low](https://en.wikipedia.org/wiki/Logic_level), output from master\)

Slave Select:

* SS, SS, SSEL, nSS, /SS, SS\# \(slave select\)
* CS, CS \(chip select\)
* CSN \(chip select/enable\)
* CE \(chip enable\)

