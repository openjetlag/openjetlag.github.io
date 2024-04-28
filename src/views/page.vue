<template>
  <div class="page flexCCC">
    <div>
      <h2 class="font47">
        Light Exposure
        <br />
        Schedule
      </h2>

      <h3 class="font16 color6">
        The following times are in the time zone of the arrival city.
      </h3>

      <div>
        <ul>
          <li v-for="item in listData.data">
            <h2>{{ item.title }}</h2>

            <div class="font18 color6">
              {{ item.start }}
              <span>{{ item.bool ? "AVOID LIGHT" : "SEEK LIGHT" }}</span>
            </div>

            <div class="font18 color6">
              {{ item.end }}
              <span>{{ !item.bool ? "AVOID LIGHT" : "SEEK LIGHT" }}</span>
            </div>

            <div class="font18 color6">
              {{ item.sleep }}
              <span>Sleep Time</span>
            </div>
          </li>

          <h2
            v-show="!listData.data || !listData.data.length"
            class="flexCCC font20"
          >
            <span class="color6 fwNo">
              The time difference in the time zone you crossed is less than 4
              hours. Biologically, you won’t need strategic adjustment for a
              less-than-four-hour difference.
            </span>
            <span class="color6 fwNo">
              Here are some tips for you to reduce your travel fatigue.
            </span>
          </h2>

          <h2
            v-show="listData.data && listData.data.length"
            class="flexCCC font26"
          >
            <img src="@/assets/img/sun.png" alt="" />
            Period to Seek Light

            <b class="font20">What to Do:</b>
            <span class="font16 color6 fwNo">
              Use this time to immerse yourself in natural sunlight, helping
              your body clock match your destination’s local time.
            </span>

            <b class="font20">How to Engage:</b>
            <span class="font16 color6 fwNo">
              ● Plan outdoor activities like a morning walk, a short hike, or
              even a leisurely breakfast in a sunlit café.
            </span>
            <span class="font16 color6 fwNo">
              ● If outdoor options are limited, create a bright environment
              indoors. Position yourself near large windows or under bright
              light.
            </span>
            <span class="font16 color6 fwNo">
              ● If natural light is scarce, a portable light box can be a great
              travel companion. These devices mimic natural light and can be
              used while reading or having breakfast.
            </span>
          </h2>

          <h2
            v-show="listData.data && listData.data.length"
            class="flexCCC font26"
          >
            <img src="@/assets/img/glasses.png" alt="" />
            Period to Avoid Light

            <b class="font20">What to Do:</b>
            <span class="font16 color6 fwNo">
              Limit your exposure to both natural and artificial light to
              encourage your body to adapt to the night phase of your new time
              zone.
            </span>

            <b class="font20">How to Engage:</b>
            <span class="font16 color6 fwNo">
              ● Wear sunglasses to reduce sunlight exposure if you need to be
              outside. Indoors, draw the curtains to create a twilight ambiance.
            </span>
            <span class="font16 color6 fwNo">
              ● Reduce overhead lighting and use low-intensity, warm-hued bulbs
              to mimic sunset, which naturally encourages your body to prepare
              for sleep.
            </span>
            <span class="font16 color6 fwNo">
              ● If you must use screens, activate night-mode settings to
              minimize blue light exposure or use apps that overlay a warm tint
              to your screens.
            </span>
          </h2>

          <h2 class="flexCCC">
            <b class="font20">Additional Tips:</b>
            <span class="font16 color6 fw">Melatonin:</span>
            <span class="font16 color6 fwNo">
              ● Modest doses at night to advance the clock
            </span>
            <span class="font16 color6 fwNo">
              ● Small doses in the morning to delay the clock
            </span>
            <span class="font16 color6 fw">Meal:</span>
            <span class="font16 color6 fwNo">
              ● Take small snack before bed promote sleep
            </span>
            <span class="font16 color6 fwNo">
              ● Warm milk, turkey, and food that are rich in tryptophan promote
              sleep
            </span>
            <span class="font16 color6 fw">Drink:</span>
            <span class="font16 color6 fwNo">
              ● Caffeine leads to a decrease in deep sleep, the most restful
              sleep
            </span>
            <span class="font16 color6 fwNo">
              ● Low doses of alcohol (1 drink equivalent or less) are generally
              sleep promoting. However, Alcohol increases NREM and reduces deep
              sleep
            </span>
            <span class="font16 color6 fw">Nicotine:</span>
            <span class="font16 color6 fwNo">
              ● Lower doses tend to stimulate deep sleep(REM)
            </span>
            <span class="font16 color6 fwNo">
              ● Higher doses tend to suppress deep sleep
            </span>
            <span class="font16 color6 fw">Exercise:</span>
            <span class="font16 color6 fwNo">
              ● Exercise affects sleep by increasing core body temperature,
              which is ideal during seek light period
            </span>

            <span class="font16 color6 fwNo">
              <span class="font20 fw">Attention:</span>
              While it’s helpful to follow the recommend schedule, also pay
              attention to your body’s signals. If you're experiencing
              significant discomfort, adjust your meal, fluid intake, exercise
              timing, and light exposure period accordingly.
            </span>
          </h2>
        </ul>
      </div>

      <ol class="flexCB">
        <li
          class="flexCC font20 colorF09 cur tran"
          @click="router.push({ path: '/info', query: {} })"
        >
          FAQs
        </li>
        <li class="flexCC font20 colorF09 cur tran" @click="router.go(-1)">
          Back
        </li>
      </ol>
    </div>

    <span class="flexCCC colorF09">
      This webpage is brought to you by Will Zhang and Lucy Zhai as a community
      project aimed at educating our community about sleep and jetlag. We extend
      our heartfelt gratitude to Professor Argelinda Baroni and Professor Jess
      P. Shatkin for their invaluable insights and expertise on jet lag which
      have greatly enriched the content and resources available on this site.

      <span>Contact us at: openjetlag@gmail.com</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "./page.scss";
</style>

<script setup>
import router from "@/router";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as Utils from "@/utils/utils";

// 变量声明
const listData = reactive({ data: [] });

// 页面加载完成
onMounted(() => {
  const listJSON = sessionStorage.getItem("list");
  if (listJSON) listData.data = JSON.parse(listJSON);
});

// 页面即将卸载时
onUnmounted(() => {});
</script>
