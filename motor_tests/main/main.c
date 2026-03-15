#include "motor.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "motor_test";

void app_main(void)
{
    motors_init();

    int speed_pct = 10;

    while (1)
    {
        int duty = (255 * speed_pct) / 100;
        ESP_LOGI(TAG, "=== Speed: %d%% (duty=%d) ===", speed_pct, duty);

        for (int i = 0; i < 4; i++)
            motor_set_speed((motor_t)i, duty);

        ESP_LOGI(TAG, "Motor 1 ON");
        motor_set_on_off(MOTOR_1, true);
        vTaskDelay(pdMS_TO_TICKS(4000));

        ESP_LOGI(TAG, "Motor 2 ON");
        motor_set_on_off(MOTOR_2, true);
        vTaskDelay(pdMS_TO_TICKS(4000));

        ESP_LOGI(TAG, "Motor 3 ON");
        motor_set_on_off(MOTOR_3, true);
        vTaskDelay(pdMS_TO_TICKS(4000));

        ESP_LOGI(TAG, "Motor 4 ON");
        motor_set_on_off(MOTOR_4, true);
        vTaskDelay(pdMS_TO_TICKS(4000));

        ESP_LOGI(TAG, "All ON — holding 2s");
        vTaskDelay(pdMS_TO_TICKS(4000));

        ESP_LOGI(TAG, "All OFF");
        motors_stop_all();
        vTaskDelay(pdMS_TO_TICKS(1000));

        if (speed_pct < 60)
            speed_pct += 5;
    }
}
