#include <MIDI.h>

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

#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

/*=========================================================================
    APPLICATION SETTINGS

    FACTORYRESET_ENABLE       Perform a factory reset when running this sketch
   
                              Enabling this will put your Bluefruit LE module
                              in a 'known good' state and clear any config
                              data set in previous sketches or projects, so
                              running this at least once is a good idea.
   
                              When deploying your project, however, you will
                              want to disable factory reset by setting this
                              value to 0.  If you are making changes to your
                              Bluefruit LE device via AT commands, and those
                              changes aren't persisting across resets, this
                              is the reason why.  Factory reset will erase
                              the non-volatile memory where config data is
                              stored, setting it back to factory default
                              values.
       
                              Some sketches that require you to bond to a
                              central device (HID mouse, keyboard, etc.)
                              won't work at all with this feature enabled
                              since the factory reset will clear all of the
                              bonding data stored on the chip, meaning the
                              central device won't be able to reconnect.
    MINIMUM_FIRMWARE_VERSION  Minimum firmware version to have some new features
    MODE_LED_BEHAVIOUR        LED activity, valid options are
                              "DISABLE" or "MODE" or "BLEUART" or
                              "HWUART"  or "SPI"  or "MANUAL"
    -----------------------------------------------------------------------*/
    #define FACTORYRESET_ENABLE         1
    #define MINIMUM_FIRMWARE_VERSION    "0.6.6"
    #define MODE_LED_BEHAVIOUR          "MODE"
/*=========================================================================*/

// Create the bluefruit object, either software serial...uncomment these lines
/*
SoftwareSerial bluefruitSS = SoftwareSerial(BLUEFRUIT_SWUART_TXD_PIN, BLUEFRUIT_SWUART_RXD_PIN);

Adafruit_BluefruitLE_UART ble(bluefruitSS, BLUEFRUIT_UART_MODE_PIN,
                      BLUEFRUIT_UART_CTS_PIN, BLUEFRUIT_UART_RTS_PIN);
*/

/* ...or hardware serial, which does not need the RTS/CTS pins. Uncomment this line */
// Adafruit_BluefruitLE_UART ble(Serial1, BLUEFRUIT_UART_MODE_PIN);

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

MIDI_CREATE_DEFAULT_INSTANCE();

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup(void)
{
  while (!Serial);  // required for Flora & Micro
  delay(500);
  MIDI.begin(MIDI_CHANNEL_OMNI);

  Serial.begin(115200);
  if ( !ble.begin(VERBOSE_MODE) ){
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    if ( ! ble.factoryReset() ){
      error(F("Couldn't factory reset"));
    }
  }
  /* Change the device name to make it easier to find */
  Serial.println(F("Setting device name to 'MIDIPlex': "));
  int success = ble.sendCommandCheckOK(F("AT+GAPDEVNAME=MIDIPlex"));
  
  ble.reset();
  
  /* Disable command echo from Bluefruit */
  ble.echo(false);
  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  while (! ble.isConnected()) {
      delay(500);
  }

  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) ){
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
  }
}

int parseMsg(int *vals, char* msg){
  char* token = strtok(msg, "-");
  int count =0;
  while( token != NULL && count <=2) {
    Serial.println(token);
    vals[count] = strtol(token, NULL, 10);
    Serial.println(String(vals[count]));
    count = count + 1;
    token = strtok(NULL, "-");
  }
}

int parseMessages(int *vals, char* buff){
  char* token = strtok(buff, "|");
  int count = 0;
  while(token != NULL){
    parseMsg(vals[count*3], token);
    token = strtok(NULL, "|");
    count = count + 1;
  }
  return count;
}


void fn(byte *vals[], char input[]){
  int msgCount = 0;
  char* commandEnd;
  char* command = strtok_r(input, "|", &commandEnd);
  while (command != NULL){
    Serial.print(command);
    Serial.print("  msgCount");
    Serial.println(msgCount);
    int valCount = 0;
    char* tokenEnd;
    char* token = strtok_r(command, "-", &tokenEnd);
    while(token != NULL && valCount <3){
      vals[msgCount*3+valCount] = atoi(token);
      Serial.print(token);
      Serial.print(" => ");
      Serial.println(*(vals[msgCount*3+valCount]));
      token = strtok_r(NULL, "-", &tokenEnd);
      valCount = valCount+1;
    }
    command = strtok_r(NULL, "|", &commandEnd);
    msgCount = msgCount+1;
   }
}


/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{
  // Check for user input
  char inputs[BUFSIZE+1];

//  if ( getUserInput(inputs, BUFSIZE) )
//  {
//    // Send characters to Bluefruit
//    Serial.print("[Send] ");
//    Serial.println(inputs);
//
//    ble.print("AT+BLEUARTTX=");
//    ble.println(inputs);
//
//    // check response stastus
//    if (! ble.waitForOK() ) {
//      Serial.println(F("Failed to send?"));
//    }
//  }

  // Check for incoming characters from Bluefruit
  ble.println("AT+BLEUARTRX");
  ble.readline();
  if (strcmp(ble.buffer, "OK") == 0) {
    // no data
    return;
  }
  // Some data was found, its in the buffer
  Serial.print(F("[Recv] ")); Serial.println(ble.buffer);


  byte *vals[12] = {NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL};
  int msgCount = 0;
  char* commandEnd;
  char* command = strtok_r(ble.buffer, "|", &commandEnd);
  while (command != NULL){
    Serial.print(command);
    Serial.print("  msgCount");
    Serial.println(msgCount);
    int valCount = 0;
    char* tokenEnd;
    char* token = strtok_r(command, "-", &tokenEnd);
    int chan = atoi(token);
    token = strtok_r(NULL, "-", &tokenEnd);
    int note = atoi(token);
    token = strtok_r(NULL, "-", &tokenEnd);
    int vel = atoi(token);
    MIDI.sendNoteOn(note, vel, chan);
    command = strtok_r(NULL, "|", &commandEnd);
    msgCount = msgCount+1;
  }
  
//  byte *vals[12] = {NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL};
//  fn(vals, ble.buffer);
//  for(int i=0; i<3; i++){
//    if(vals[i] != NULL){
//      MIDI.sendNoteOn(vals[i+1], vals[i+2], vals[i]);
//    } else{
//      break;
//    }
//  }
  
  ble.waitForOK();
}



/**************************************************************************/
/*!
    @brief  Checks for user input (via the Serial Monitor)
*/
/**************************************************************************/
bool getUserInput(char buffer[], uint8_t maxSize)
{
  // timeout in 100 milliseconds
  TimeoutTimer timeout(100);

  memset(buffer, 0, maxSize);
  while( (!Serial.available()) && !timeout.expired() ) { delay(1); }

  if ( timeout.expired() ) return false;

  delay(2);
  uint8_t count=0;
  do
  {
    count += Serial.readBytes(buffer+count, maxSize);
    delay(2);
  } while( (count < maxSize) && (Serial.available()) );

  return true;
}
