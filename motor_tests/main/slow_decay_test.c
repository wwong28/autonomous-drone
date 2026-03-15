/*
 * SLOW DECAY TEST — different approach from all previous tests
 *
 * Hardware changes needed:
 *   - Wire GPIO 10 → ULT pin on board B (enables board B via software)
 *
 * Slow decay mode: IN1=always HIGH, IN2=PWM
 *   - Duty 0%   = full speed forward
 *   - Duty 100% = full brake (stopped)
 *   So speed % is INVERTED: duty = (100 - speed_pct)
 *
 * Motor pin mapping:
 *   Motor 1: IN1=GPIO6 (HIGH), IN2=GPIO7 (PWM)  — board A
 *   Motor 2: IN1=GPIO8 (HIGH), IN2=GPIO9 (PWM)  — board A
 *   Motor 3: IN1=GPIO0 (HIGH), IN2=GPIO1 (PWM)  — board B
 *   Motor 4: IN1=GPIO4 (HIGH), IN2=GPIO5 (PWM)  — board B
 */

#include "driver/ledc.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "slow_decay";

// IN1 pins — driven permanently HIGH (slow decay)
static const int in1_pins[] = {6, 8, 0, 4};
// IN2 pins — PWM controlled (speed)
static const int in2_pins[] = {7, 9, 1, 5};

static const ledc_channel_t channels[] = {
    LEDC_CHANNEL_0, LEDC_CHANNEL_1, LEDC_CHANNEL_2, LEDC_CHANNEL_3
};

// GPIO driving ULT HIGH on board B
#define BOARD_B_ULT_GPIO 10

// 10-bit resolution, 20kHz
#define DUTY_RES   LEDC_TIMER_10_BIT
#define FREQ_HZ    20000
#define MAX_DUTY   1023

// In slow decay, duty is inverted: 0 = full speed, MAX = stopped
// speed_pct 0-100 → actual duty = (100 - speed_pct) * MAX / 100
#define SPEED_DUTY(pct) ((MAX_DUTY * (100 - (pct))) / 100)

static void set_speed_all(int speed_pct)
{
    int duty = SPEED_DUTY(speed_pct);
    ESP_LOGI(TAG, "Setting all motors to %d%% (duty=%d)", speed_pct, duty);
    for (int i = 0; i < 4; i++) {
        ledc_set_duty(LEDC_LOW_SPEED_MODE, channels[i], duty);
        ledc_update_duty(LEDC_LOW_SPEED_MODE, channels[i]);
    }
}

void app_main(void)
{
    // Drive board B ULT HIGH via GPIO 10
    gpio_config_t ult_cfg = {
        .pin_bit_mask = (1ULL << BOARD_B_ULT_GPIO),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = 0, .pull_down_en = 0,
        .intr_type = GPIO_INTR_DISABLE,
    };
    gpio_config(&ult_cfg);
    gpio_set_level(BOARD_B_ULT_GPIO, 1);
    ESP_LOGI(TAG, "Board B ULT pin driven HIGH via GPIO %d", BOARD_B_ULT_GPIO);

    // Drive IN1 pins permanently HIGH (slow decay)
    for (int i = 0; i < 4; i++) {
        gpio_config_t cfg = {
            .pin_bit_mask = (1ULL << in1_pins[i]),
            .mode = GPIO_MODE_OUTPUT,
            .pull_up_en = 0, .pull_down_en = 0,
            .intr_type = GPIO_INTR_DISABLE,
        };
        gpio_config(&cfg);
        gpio_set_level(in1_pins[i], 1);
    }

    // Configure LEDC timer
    ledc_timer_config_t timer = {
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .timer_num = LEDC_TIMER_0,
        .duty_resolution = DUTY_RES,
        .freq_hz = FREQ_HZ,
        .clk_cfg = LEDC_AUTO_CLK,
    };
    ledc_timer_config(&timer);

    // Configure LEDC channels on IN2 pins, start stopped (duty = MAX)
    for (int i = 0; i < 4; i++) {
        ledc_channel_config_t ch = {
            .speed_mode = LEDC_LOW_SPEED_MODE,
            .channel = channels[i],
            .timer_sel = LEDC_TIMER_0,
            .intr_type = LEDC_INTR_DISABLE,
            .gpio_num = in2_pins[i],
            .duty = MAX_DUTY,  // fully braked at start
            .hpoint = 0,
        };
        ledc_channel_config(&ch);
    }

    ESP_LOGI(TAG, "Starting motor sequence — slow decay mode");

    while (1) {
        ESP_LOGI(TAG, "--- Motor 1 ON ---");
        ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, SPEED_DUTY(50));
        ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
        vTaskDelay(pdMS_TO_TICKS(2000));

        ESP_LOGI(TAG, "--- Motor 2 ON ---");
        ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_1, SPEED_DUTY(50));
        ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_1);
        vTaskDelay(pdMS_TO_TICKS(2000));

        ESP_LOGI(TAG, "--- Motor 3 ON ---");
        ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_2, SPEED_DUTY(50));
        ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_2);
        vTaskDelay(pdMS_TO_TICKS(2000));

        ESP_LOGI(TAG, "--- Motor 4 ON ---");
        ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_3, SPEED_DUTY(50));
        ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_3);
        vTaskDelay(pdMS_TO_TICKS(2000));

        ESP_LOGI(TAG, "--- All ON 2s ---");
        vTaskDelay(pdMS_TO_TICKS(2000));

        ESP_LOGI(TAG, "--- All OFF ---");
        set_speed_all(0);  // duty = MAX = brake
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
