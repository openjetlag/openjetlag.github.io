<template>
  <div class="info flexCCC">
    <div>
      <span class="flexCC font20 colorF09 cur tran" @click="router.go(-1)">
        Back
      </span>

      <h2 class="font47">Frequently asked questions</h2>

      <div class="tran">
        <div v-for="(item, index) in listData.data" class="font24 colorF tran">
          <h2
            class="selectNo flexCB font24 cur"
            @click="listData.data[index].show = !listData.data[index].show"
          >
            {{ index + 1 }}.{{ item.title }}
            <el-icon v-show="!item.show" class="fw"><Plus /></el-icon>
            <el-icon v-show="item.show" class="fw"><Minus /></el-icon>
          </h2>

          <div class="colorF09 tran" v-show="item.show">{{ item.str }}</div>

          <ul v-show="index + 1 == 1 && item.show" class="colorF09">
            <div>Here is how:</div>
            <li>
              1. we calculate your lowest core body temperature(LCBT) based on
              your regular schedule in your old time zone
            </li>
            <li>
              2. LCBT in the old time zone converts to time in the new time zone
            </li>
            <li>
              3. Depending on west or eastward travel, we decide to either
              expose to light prior to or after LCBT and ideal for darkness
              after or prior to the LCBT time
            </li>
            <li>
              <div>
                * For simplicity in coding, we determine west or eastward travel
                based on the longitude and latitude of different locations. For
                example, if the longitude of the destination is lower than the
                longitude of the origin, we assume it is an eastward travel
              </div>
            </li>
            <li>
              4. We block off time for ideal sleep time in the new time zone
              based on the old sleep schedule
            </li>
            <li>
              5. We advance or delay the schedule based on time difference and
              move to the new time zone by 1 hour per day
            </li>
            <li>
              6. Once the exposure to light/darkness period overlaps with the
              new time zone sleep schedule, the adjustment is complete
            </li>
          </ul>

          <ul v-show="index + 1 == 8 && item.show" class="colorF09">
            <div>Estimate amount of caffeine in different beverages</div>
            <li>- A Cup of Diner Coffee: 80mg</li>
            <li>- 12oz Starbucks Coffee: 260mg</li>
            <li>- Black Tea: 25 - 75mg</li>
            <li>- Chocolate milk and Hot Chocolate: less than 10mg</li>
            <li>- Most 12 ozSodas: 35 - 55mg</li>
          </ul>
        </div>
      </div>
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
@import "./info.scss";
</style>

<script setup>
import router from "@/router";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as Utils from "@/utils/utils";

// 变量声明
const listData = reactive({
  data: [
    {
      show: false,
      title: "How does the calculator work?",
      str: "Our calculator uses cutting-edge algorithms based on sleep science and circadian rhythms to generate a custom schedule after you arrive at your destination. This tailored plan gradually adjusts your sleep and light exposure, optimizing your body's internal clock to your destination's local time.",
    },
    {
      show: false,
      title: "What is jet lag?",
      str: "Jet lag, also known as time zone change syndrome, occurs when people travel rapidly across multiple time zones, which disrupts their body's internal clock or circadian rhythms. This internal clock is what regulates the timing of sleepiness and wakefulness throughout a 24-hour period. Jet lag is essentially the body's struggle to adjust to a new light-dark schedule and local time, leading to various symptoms. Common symptoms of jet lag include fatigue, difficulty sleeping, difficulty staying awake during the day, general malaise, and even digestive problems.",
    },
    {
      show: false,
      title: "What is circadian rhythm?",
      str: `The circadian rhythm is essentially a natural internal process that regulates the sleep-wake cycle and repeats roughly every 24 hours. It's often referred to as the "body clock." This rhythm is influenced by external cues such as light and temperature, which help align the body's functions with the environment's day and night cycle.`,
    },
    {
      show: false,
      title: "What is the difference between east and westward travel",
      str: "Eastward travel jetlag tends to be more difficult to adjust compared to westward travel. The reason is that eastward travel advances a person’s clock while westward travel is delaying the clock. It is easier to stay up late than to sleep early for many of us.",
    },
    {
      show: false,
      title: "What is strategic napping?",
      str: "Strategic Napping serves a preventative purpose before an activity that will make you tired. Typically, the recommendation of a nap time would be a short nap that is between 20 - 30 minutes. Wake up from a short nap will make you feel more energetic than before will not make you feel groggy and will not likely interfere with the sleep cycle.",
    },
    {
      show: false,
      title: "How Does Core Boby Temperature(CBT) affect my sleep?",
      str: "The human body lowers the core body temperature during sleep. Fall in CBT contributes to an energy conservation function of sleep. In general, at night our CBT is low and our melatonin level is high as it starts secretion before going to bed. A low CBT is associated with a high melatonin level which induces sleep. A high CBT will suppress the creation of melatonin and cause difficulties in falling asleep. The lowest CBT time appears two hours before normal awake time.",
    },
    {
      show: false,
      title: "Why do we need to aviod light at a certain hour?",
      str: "One of the major sleep-inducing factors is the production of melatonin. A major factor that suppresses the creation of melatonin is Light(especially blue light from all the technology). Melatonin is thought to relate to the adjustment of Core body temperature (CBT)  which lowers during sleep. Exposure to light before the lowest CBT will cause the sleep clock to be delayed, and exposure to light after the lowest CBT will advance the clock. It is key to remember that when adjusting for jet lag, prevent light exposure a few hours prior to the lowest CBT according to the original time zone instead of the current time zone.",
    },
    {
      show: false,
      title: "How does caffeine work?",
      str: "It takes approximately 45 minutes for the caffeine from a cup of coffee to start working in the human body. The caffeine will block a neurotransmitter called adenosine(the hypnotoxin), which slows down the brain and induces drowsiness, to its receptors. It takes up to 6 hours after consuming coffee to process half of the caffeine the person consumes.",
    },
    {
      show: false,
      title: "How does exercise affect sleep?",
      str: "Exercising will raise our core body temperature(CBT). Having a high CBT may affect our body’s ability to produce melatonin therefore causing us to have a hard time falling asleep. An ideal exercise session should be 4 hours before bedtime. However, if exercise before bedtime does not impact the current sleep quality, maintain the normal schedule.",
    },
    {
      show: false,
      title: "How does a shower affect sleep?",
      str: "A long hot shower before bed could potentially raise the Core Body Temperature and might cause trouble to fall asleep due to the rise in temperature suppressing melatonin. Generally, a short shower would be a better recommendation since it reduces the risk of raising CBT. However, if taking a shower does not impact the current sleep quality, maintain the normal schedule. ",
    },
  ],
});

// 页面加载完成
onMounted(() => {});

// 页面即将卸载时
onUnmounted(() => {});
</script>
