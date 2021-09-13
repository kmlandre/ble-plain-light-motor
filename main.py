
def on_bluetooth_connected():
    basic.show_icon(IconNames.DIAMOND)
bluetooth.on_bluetooth_connected(on_bluetooth_connected)

def on_bluetooth_disconnected():
    basic.show_icon(IconNames.NO)
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)

class Dir:
        FORWARD = 0x0
        BACKWARD = 0x1
        
class Motor:
    LEFT = 0
    RIGHT = 1
    ALL = 2

def motor_stop(motor):
    motor_run(motor, 0, 0)
    addressToWrite = 0x10;

def motor_run(motor, direction, speed):
    addressToWrite = 0x10;
    buf = bytearray(3)
    buf[1] = direction
    buf[2] = speed

    if(motor == Motor.LEFT or motor == Motor.ALL):
        buf[0] = 0x00;
        pins.i2c_write_buffer(addressToWrite, buf, False)

    if(motor == Motor.RIGHT or motor == Motor.ALL):
        buf[0] = 0x02;
        pins.i2c_write_buffer(addressToWrite, buf, False)

def on_uart_data_received():
    uartCmd = bluetooth.uart_read_until(serial.delimiters(Delimiters.NEW_LINE))
    basic.show_string(uartCmd)
    if uartCmd == "f":
        motor_run(Motor.ALL, Dir.FORWARD, 84)
    elif uartCmd == "s":
        motor_stop(Motor.ALL)
    elif uartCmd == "b":
        motor_run(Motor.ALL, Dir.BACKWARD, 84)
    elif uartCmd == "r":
        motor_run(Motor.RIGHT, Dir.FORWARD, 84)
    elif uartCmd == "l":
        motor_run(Motor.LEFT, Dir.FORWARD, 84)
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.NEW_LINE), on_uart_data_received)

bluetooth.start_uart_service()
basic.show_icon(IconNames.YES)