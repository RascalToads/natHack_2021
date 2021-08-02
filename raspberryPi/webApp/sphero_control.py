from time import sleep

from pysphero.core import Sphero
from pysphero.driving import Direction


def moveForward():
    mac_address = "C2:A0:A5:9F:B8:A3"
    with Sphero(mac_address=mac_address) as sphero:
        try:
            sphero.power.wake() 
        except bluepy.btle.BTLEInternalError:
            print("Reconnecting")
            sphero.power.wake() 
        except bluepy.btle.BTLEDisconnectError:
            print("Reconnecting")
            sphero.power.wake() 

        
    for _ in range(4):
        #sleep(1)
        speed = 40 #TODO: map concentration value to set the speed (0 to 255)
        heading = 0 #angle direction to move in
        print(f"Send drive with speed {speed} and heading {heading}")

    sphero.driving.drive_with_heading(speed, heading, Direction.forward)

    sphero.power.enter_soft_sleep()


