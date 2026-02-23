#include "motor.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void app_main(void)
{
    motors_init();

    // Example demo: ramp up motor 1, then stop all
    motor_set_on_off(MOTOR_1, true);
    motor_set_speed(MOTOR_1, 2000);
    vTaskDelay(pdMS_TO_TICKS(1000));

    motor_increase_speed(MOTOR_1, 2000);
    vTaskDelay(pdMS_TO_TICKS(1000));

    motors_stop_all();