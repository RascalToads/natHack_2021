# natHack_2021

## Overview

For our submissions for [natHACKS 2021](https://nathacks.devpost.com/), the RascalToads team had one goal in mind, "How do we control physical things with our mind?" Most BCI is local between the device and a single computer. We wanted to reach out into the world and do something. Here is what we did.  

We trained software to classify gestures from a Muse headsets. These included detections like winks, blinks, and brow movements. Now that we had gestures, we needed to get them off our computers. To start that journey, we leveraged webhooks. Webhooks allows web communication between conforming parties. We created the Webhook Configurator(WHC) to bridge the varying modes of communication.  

Data is sent to the backend from either the [Petal Metrics app](https://github.com/RascalToads/natHack_2021) or the python script. With WHC serving as a translator, we can send these received gestures outward. We can control who, what, and when detections are delivered. In WHC, you can select which detect to listen for. These detects can also be filtered from their raw JSON format or reduced down to a true or false value. There can even be multiple recipients - one brow movement could flip a switch in Austin and control a robot in Alberta. That's exactly what we did. We controlled [SwitchBot](https://www.switch-bot.com/) with [IFTTT](https://ifttt.com/home) , LEDs with Arduino, and [Sphero](https://sphero.com/) with Raspberry Pi.  

## Subrepos

### arduino

Arduino subrepo containing code to call a esp8266 chip and control LEDs

### nodejs

NodeJS subrepo containing the projects for the front end and back end. 

### python

Python desktop subrepo containing scripts used for extra detection output with webhooks and client calls. 

### raspberryPi

Raspberry Pi subrepo containing a Python webserver and Sphero control script. 

### unity

Sick unity demo WIP. Will have Unity Packages recieving Muse Detects soon. 
