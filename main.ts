/**
 * Output: 
 * 
 *    P0 goes low on Dart sent
 * 
 * Input:
 * 
 *    P1: Fire Switch
 * 
 *    P2: Optical dart sent confirmation
 */
/**
 * Loop to run LEDs
 */
pins.onPulsed(DigitalPin.P2, PulseValue.High, function () {
    DartDetected = true
})
function DartSent () {
    pins.digitalWritePin(DigitalPin.P0, 0)
    keepMotorAtSpeed = control.millis() + StayAliveTime
    basic.showLeds(`
        # . . . #
        . . # . .
        . # # # .
        . . # . .
        # . . . #
        `)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P0, 1)
    basic.pause(250)
    FireState = FireReady
    basic.clearScreen()
    DartDetected = false
    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        RequestFire = true
    } else {
        RequestFire = false
    }
}
function InitMotor () {
    RequestFire = false
    FireState = InitSpeed
    ControlLeds.showColor(neopixel.colors(NeoPixelColors.Black))
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo1, 0)
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo2, 0)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . # # # .
        `)
    basic.pause(200)
    ControlLeds.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    strip.show()
}
function MotorFullSpeed () {
    ControlLeds.setPixelColor(0, neopixel.colors(NeoPixelColors.Yellow))
    ControlLeds.setPixelColor(1, neopixel.colors(NeoPixelColors.Black))
    RequestFire = false
    while (FireState != InStandby) {
        basic.showLeds(`
            # # # # #
            . # . # .
            . . # . .
            . # . # .
            # # # # #
            `)
    }
    keepMotorAtSpeed = control.millis() + StayAliveTime
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo1, FullSpeedValue)
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo2, FullSpeedValue)
    basic.pause(1000)
    basic.showLeds(`
        . . # . .
        . # # # .
        # # # # #
        # # # # #
        # # # # #
        `)
    FireState = FireReady
    ControlLeds.showColor(neopixel.colors(NeoPixelColors.Green))
    strip.show()
}
input.onButtonPressed(Button.A, function () {
    StandByMotor()
})
function FireDart () {
    if (FireState == FireReady) {
        Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo7, FireAngle)
        keepMotorAtSpeed = control.millis() + waitForDartSent
        FireState = FireInProgress
        BarelLeds.showColor(neopixel.colors(NeoPixelColors.White))
        basic.pause(debugDelay)
        basic.pause(500)
        Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo7, LoadAngle)
    }
}
pins.onPulsed(DigitalPin.P8, PulseValue.Low, function () {
    P8Pressed = true
})
function SineOf (Angle: number) {
    return Math.sin(Angle * Math.PI / NumberOfSteps)
}
input.onButtonPressed(Button.AB, function () {
    for (let index = 0; index < 5; index++) {
        FireDart()
        DartSent()
    }
})
input.onButtonPressed(Button.B, function () {
    MotorFullSpeed()
})
function StandByMotor () {
    ControlLeds.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    ControlLeds.setPixelColor(1, neopixel.colors(NeoPixelColors.Black))
    FireState = InStandby
    RequestFire = false
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        # # # # #
        `)
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo1, 40)
    Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo2, 40)
    basic.pause(3500)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        # # # # #
        # # # # #
        `)
    ControlLeds.setPixelColor(0, neopixel.colors(NeoPixelColors.Yellow))
    ControlLeds.setPixelColor(1, neopixel.colors(NeoPixelColors.Black))
    strip.show()
}
let DartDetected = false
let P8Pressed = false
let RequestFire = false
let keepMotorAtSpeed = 0
let waitForDartSent = 0
let StayAliveTime = 0
let FireState = 0
let FireInProgress = 0
let FireReady = 0
let InStandby = 0
let InitSpeed = 0
let FullSpeedValue = 0
let FireAngle = 0
let LoadAngle = 0
let NumberOfSteps = 0
let BarelLeds: neopixel.Strip = null
let ControlLeds: neopixel.Strip = null
let strip: neopixel.Strip = null
let debugDelay = 0
debugDelay = 0
pins.digitalWritePin(DigitalPin.P0, 1)
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
pins.setPull(DigitalPin.P9, PinPullMode.PullUp)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
// Need time for pull up to take effect
basic.pause(100)
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . # . .
    `)
radio.setGroup(10)
strip = neopixel.create(DigitalPin.P14, 57, NeoPixelMode.RGB_RGB)
ControlLeds = strip.range(0, 2)
BarelLeds = strip.range(2, 55)
NumberOfSteps = 200
basic.showString("BOARD")
if (1 == pins.digitalReadPin(DigitalPin.P9)) {
    basic.showString("A")
    // 80 For board A 
    // 80 for board B
    LoadAngle = 80
    // 99 For board A
    // 101 for board B
    FireAngle = 99
    basic.pause(500)
} else {
    basic.showString("B")
    // 80 For board A 
    // 80 for board B
    LoadAngle = 80
    // 99 For board A
    // 101 for board B
    FireAngle = 101
    basic.pause(500)
}
basic.showString("DART")
if (1 == pins.digitalReadPin(DigitalPin.P13)) {
    basic.showString("B")
    // FullSpeedValue for blue darts = 84
    FullSpeedValue = 84
    basic.pause(500)
} else {
    basic.showString("R")
    // FullSpeedValue for blue darts = 84
    FullSpeedValue = 70
    basic.pause(500)
}
InitSpeed = 0
InStandby = 1
let AtSpeed = 2
FireReady = 3
FireInProgress = 4
FireState = InitSpeed
StayAliveTime = 60 * 1000
waitForDartSent = 2 * 1000
keepMotorAtSpeed = 0
RequestFire = false
P8Pressed = false
Kitronik_Robotics_Board.servoStop(Kitronik_Robotics_Board.Servos.Servo1)
Kitronik_Robotics_Board.servoStop(Kitronik_Robotics_Board.Servos.Servo2)
Kitronik_Robotics_Board.servoWrite(Kitronik_Robotics_Board.Servos.Servo7, LoadAngle)
basic.showIcon(IconNames.Butterfly)
InitMotor()
StandByMotor()
basic.forever(function () {
    if (P8Pressed) {
        if (FireState == InStandby) {
            MotorFullSpeed()
        } else {
            StandByMotor()
        }
        P8Pressed = false
    }
    basic.pause(200)
})
basic.forever(function () {
    for (let index3 = 0; index3 <= NumberOfSteps; index3++) {
        if (FireState == FireInProgress) {
            basic.pause(100)
        }
        BarelLeds.showColor(neopixel.rgb(255, Math.round(SineOf(index3) * 150), 0))
        basic.pause(50)
    }
    basic.pause(800)
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        RequestFire = true
    } else {
        basic.pause(50)
    }
})
basic.forever(function () {
    if (RequestFire) {
        FireDart()
    } else {
        basic.pause(50)
    }
})
basic.forever(function () {
    if (FireState >= AtSpeed) {
        if (control.millis() > keepMotorAtSpeed) {
            StandByMotor()
        }
    }
    if (FireState == FireInProgress) {
        if (control.millis() > keepMotorAtSpeed) {
            StandByMotor()
        }
    }
    basic.pause(600)
})
basic.forever(function () {
    if (DartDetected) {
        DartSent()
    } else {
        basic.pause(20)
    }
})
