#include "motor.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "motor_test";

void app_main(void)
{
    motors_init();

    int speed_pct = 10;

    int duty = (1023 * speed_pct) / 100;
    for (int i = 0; i < 4; i++)
        motor_set_speed((motor_t)i, duty);

    while (1)
    {
        for (int i = 0; i < 4; i++)
        {
            motors_stop_all();
            motor_set_on_off((motor_t)i, true);
            ESP_LOGI(TAG, "Motor %d ON", i + 1);
            vTaskDelay(pdMS_TO_TICKS(1000));
        }
    }
}
