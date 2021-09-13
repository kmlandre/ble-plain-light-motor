bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    basic.showIcon(IconNames.Diamond)
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    basic.showIcon(IconNames.No)
})
class Dir {
    static FORWARD = 0x0
    static BACKWARD = 0x1
}

class Motor {
    static LEFT = 0
    static RIGHT = 1
    static ALL = 2
}

function motor_stop(motor: number) {
    motor_run(motor, 0, 0)
    let addressToWrite = 0x10
}

function motor_run(motor: number, direction: number, speed: number) {
    let addressToWrite = 0x10
    let buf = control.createBuffer(3)
    buf[1] = direction
    buf[2] = speed
    if (motor == Motor.LEFT || motor == Motor.ALL) {
        buf[0] = 0x00
        pins.i2cWriteBuffer(addressToWrite, buf, false)
    }
    
    if (motor == Motor.RIGHT || motor == Motor.ALL) {
        buf[0] = 0x02
        pins.i2cWriteBuffer(addressToWrite, buf, false)
    }
    
}

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function on_uart_data_received() {
    let uartCmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    basic.showString(uartCmd)
    if (uartCmd == "f") {
        motor_run(Motor.ALL, Dir.FORWARD, 84)
    } else if (uartCmd == "s") {
        motor_stop(Motor.ALL)
    } else if (uartCmd == "b") {
        motor_run(Motor.ALL, Dir.BACKWARD, 84)
    } else if (uartCmd == "r") {
        motor_run(Motor.RIGHT, Dir.FORWARD, 84)
    } else if (uartCmd == "l") {
        motor_run(Motor.LEFT, Dir.FORWARD, 84)
    }
    
})
bluetooth.startUartService()
basic.showIcon(IconNames.Yes)
