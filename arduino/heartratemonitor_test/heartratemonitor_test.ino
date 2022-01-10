#include <MIDI.h>

#ifdef USE_TINYUSB
#include <Adafruit_TinyUSB.h>
#endif

MIDI_CREATE_DEFAULT_INSTANCE();

int notes[] = {69, 72, 74, 76, 72, 81, 79};  // melody notes
int vels[] = {127, 96, 64, 96, 32, 127, 64};  // velocity per note
int rests[] = {50, 50, 50, 50, 50, 200, 50};  // rests between notes
int note_mods[] = {0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 3, 3};  // modifies notes for progression

/*********************************************************************
 This is an example for our nRF51822 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution
*********************************************************************/

/*
    Please note the long strings of data sent mean the *RTS* pin is
    required with UART to slow down data sent to the Bluefruit LE!
*/

#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

// Create the bluefruit object, either software serial...uncomment these lines
/*
SoftwareSerial bluefruitSS = SoftwareSerial(BLUEFRUIT_SWUART_TXD_PIN, BLUEFRUIT_SWUART_RXD_PIN);

Adafruit_BluefruitLE_UART ble(bluefruitSS, BLUEFRUIT_UART_MODE_PIN,
                      BLUEFRUIT_UART_CTS_PIN, BLUEFRUIT_UART_RTS_PIN);
*/

/* ...or hardware serial, which does not need the RTS/CTS pins. Uncomment this line */
// Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);

/* ...hardware SPI, using SCK/MOSI/MISO hardware SPI pins and then user selected CS/IRQ/RST */
Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

/* ...software SPI, using SCK/MOSI/MISO user-defined SPI pins and then user selected CS/IRQ/RST */
//Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_SCK, BLUEFRUIT_SPI_MISO,
//                             BLUEFRUIT_SPI_MOSI, BLUEFRUIT_SPI_CS,
//                             BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);


// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

/* The service information */
int32_t midiServiceId;
int32_t midiChanCharId;
int32_t midiNoteCharId;
int32_t midiVelCharId;

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup(void)
{
  while (!Serial); // required for Flora & Micro
  delay(500);
  MIDI.begin(MIDI_CHANNEL_OMNI);
  boolean success;

  Serial.begin(115200);
  randomSeed(micros());

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));
  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );
  Serial.println(F("Performing a factory reset: "));
  if (! ble.factoryReset() ){
       error(F("Couldn't factory reset"));
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);
  Serial.println("Requesting Bluefruit info:");
  ble.info();

  /* Change the device name to make it easier to find */
  Serial.println(F("Setting device name to 'MIDIPlex': "));

  if (! ble.sendCommandCheckOK(F("AT+GAPDEVNAME=MIDIPlex")) ) {
    error(F("Could not set device name?"));
  }

  /* Add the Heart Rate Service definition */
  /* Service ID should be 1 */
  Serial.println(F("Adding the MIDI Service definition (UUID = 0x180D): "));
  success = ble.sendCommandWithIntReply( F("AT+GATTADDSERVICE=UUID=0x180D"), &midiServiceId);
  if (! success) {
    error(F("Could not add HRM service"));
  }

  /* Add Characteristics */
  /* Chars ID for Measurement should be 1 */
  // Midi Chan
//  Serial.println(F("Adding the MIDI Note characteristic (UUID = 0x2A37): "));
//  success = ble.sendCommandWithIntReply(F("AT+GATTADDCHAR=UUID=0x0001, PROPERTIES=0x04, MIN_LEN=1, MAX_LEN=1, VALUE=00-00"), &midiChanCharId);
//  if (! success) {error(F("Could not add midiChan characteristic"));}
//  // Midi Note
//  success = ble.sendCommandWithIntReply(F("AT+GATTADDCHAR=UUID=0x0002, PROPERTIES=0x04, MIN_LEN=1, MAX_LEN=1, VALUE=00-00"), &midiChanCharId);
//  if (! success) {error(F("Could not add midiChan characteristic"));}
//    // Midi Vel
//  success = ble.sendCommandWithIntReply(F("AT+GATTADDCHAR=UUID=0x0003, PROPERTIES=0x04, MIN_LEN=1, MAX_LEN=1, VALUE=00-00"), &midiVelCharId);
//  if (! success) {error(F("Could not add midiChan characteristic"));}
  

  /* Add the Heart Rate Service to the advertising data (needed for Nordic apps to detect the service) */
//  Serial.print(F("Adding Heart Rate Service UUID to the advertising payload: "));
//  ble.sendCommandCheckOK( F("AT+GAPSETADVDATA=02-01-06-05-02-0d-18-0a-18") );

  /* Reset the device for the new service setting changes to take effect */
  Serial.print(F("Performing a SW reset (service changes require a reset): "));
  ble.reset();

  Serial.println();
}

/** Send randomized heart rate data continuously **/
void loop(void)
{
  // int heart_rate = random(50, 100);
  // Serial.print(F("Updating HRM value to "));
  // Serial.print(heart_rate);
  // Serial.println(F(" BPM"));

  /* Command is sent when \n (\r) or println is called */
  /* AT+GATTCHAR=CharacteristicID,value */
  // ble.print( F("AT+GATTCHAR=") );
  // ble.print( hrmMeasureCharId );
  // ble.print( F(",00-") );
  // ble.println(heart_rate, HEX);
  for(int j=0; j<16; j++){  // loop through four measures for progression
    for(int i=0; i<7; i++){ //
      MIDI.sendNoteOn(notes[i]+note_mods[j], vels[i], 1);
      delay(100);
      MIDI.sendNoteOff(notes[i]+note_mods[j], 0, 1);
      delay(rests[i]);
    }
  }

  /* Check if command executed OK */
  if ( !ble.waitForOK() )
  {
    Serial.println(F("Failed to get response!"));
  }

  /* Delay before next measurement update */
  delay(1000);
}
