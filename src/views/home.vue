<template>
  <div class="home flexCCC">
    <div class="flexCSS color6">
      <h2 class="font47">OpenJetlag Calculator</h2>

      <p class="font18 color7">
        Traveling across the globe can be thrilling, but landing in a new time
        zone with your body clock lagging hours behind is less so. You're tired
        and out of sync. That's where OpenJetLag steps in.
        <br />
        OpenJetLag, your go-to tool for seamless travel transitions. Simply
        input your flight details and sleep habits. OpenJetLag offers
        personalized, scientifically backed recommendations to help you adjust
        to new time zones swiftly and effortlessly AFTER arrival.
      </p>

      <div class="flexCB font18">
        When do you normally go to sleep?
        <el-time-picker
          v-model="userSleep.down"
          popper-class="timePickerDiv"
          :clearable="false"
        >
          <template #suffix>
            <el-icon class="el-input__icon"><calendar /></el-icon>
          </template>
        </el-time-picker>
      </div>
      <div class="flexCB font18">
        When do you normally wake up?
        <el-time-picker
          v-model="userSleep.up"
          popper-class="timePickerDiv"
          :clearable="false"
        />
      </div>

      <ul class="flex">
        <li>
          <h2 class="font16 fwNo">Origin</h2>

          <input id="cityStart" type="text" placeholder="Departure city" />
        </li>

        <li>
          <h2 class="font16 fwNo">Arrival time at destination</h2>

          <input id="cityEnd" type="text" placeholder="Arrival city" />

          <span class="flexCS">
            <el-date-picker
              v-model="userCity.endDate"
              type="date"
              :clearable="false"
            />
            <el-time-picker
              v-model="userCity.endTime"
              popper-class="timePickerDiv"
              :clearable="false"
            />
          </span>
        </li>
      </ul>

      <ol class="flexCB">
        <li
          class="flexCC font20 colorF09 cur tran"
          @click="router.push({ path: '/info', query: {} })"
        >
          FAQs
        </li>
        <li class="flexCC font20 colorF09 cur tran" @click="search">
          Get Plan
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
@import "./home.scss";
</style>

<script setup>
import router from "@/router";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as Utils from "@/utils/utils";

// 变量声明
const userSleep = reactive({
  down: new Date("2000-01-01 18:00:00"),
  up: new Date("2000-01-02 06:00:00"),
});
const userCity = reactive({
  start: "",
  end: "",
  endDate: new Date(Utils.timeFormat(new Date(), "date") + " 00:00:00"),
  endTime: new Date("2000-01-01 12:00:00"),
});

// 开始搜索
const search = async () => {
  // console.log(userCity.start, userCity.end, "++++++search");
  if (!userCity.start) {
    return ElMessage.warning("Please select the correct Departure city!");
  }
  if (!userCity.end) {
    return ElMessage.warning("Please select the correct Arrival city!");
  }

  // 获取时差
  const start = await Utils.getTimezone(userCity.start);
  if (start.bool) {
    userCity.start.num = start.num;
    userCity.start.numX = start.numX;
    // console.log(JSON.stringify(userCity.start), "++++++start");
  } else {
    return ElMessage.warning("Get city time difference anomaly!");
  }
  const end = await Utils.getTimezone(userCity.end);
  if (end.bool) {
    userCity.end.num = end.num;
    userCity.end.numX = end.numX;
    // console.log(JSON.stringify(userCity.end), "++++++end");
  } else {
    return ElMessage.warning("Get city time difference anomaly!");
  }

  // 初始化记录
  sessionStorage.setItem("list", JSON.stringify([]));

  // 1.如出发城市与到达城市时差小于 3 小时或大于 21 小时，输出：无需调整
  const startNum = userCity.start.num + userCity.start.numX;
  const endNum = userCity.end.num + userCity.end.numX;
  let num = Math.abs(startNum - endNum);
  // console.log(num, "++++++num");
  if (num <= 3 || num >= 21) {
    sessionStorage.setItem("list", JSON.stringify([]));
    return router.push({ path: "/page", query: {} });
  }
  if (num > 12) num = 24 - num;

  // 2.通过正常睡眠时间（起床时间 - 入睡时间）计算最低温度时间
  // 如果睡眠时间大于7小时，最低温度时间 = 起床时间 - 3小时
  // 如果睡眠时间小于等于7小时，最低温度时间 = 起床时间 - 2小时
  const oneHours = 60 * 60 * 1000;
  const sleepNum = (userSleep.up - userSleep.down) / oneHours;
  const endDateStr = Utils.timeFormat(userCity.endDate, "date");
  const sleepUpStr = Utils.timeFormat(userSleep.up, "time");
  const endDateTime = new Date(`${endDateStr} ${sleepUpStr}`).getTime();
  let listStartDate = endDateTime - 3 * oneHours;
  if (sleepNum <= 7) listStartDate = endDateTime - 2 * oneHours;
  // console.log(Utils.timeFormat(listStartDate), sleepNum, "+++++222222222");

  // 3. 将出发地最低温度时间换算为到达城市时间（第 2 步时间通过时差换算，减去出发城市时差，加上到达城市时差，并将到达时间换算为记录开始时间）
  let numSE = endNum - startNum;
  const endHours = new Date(userCity.endTime).getHours();
  if (endHours >= 18) numSE += 24;
  listStartDate = new Date(listStartDate).getTime() + numSE * oneHours;
  // console.log(Utils.timeFormat(listStartDate), numSE, "+++++3333333");

  // 4. 根据出发到达城市判断需提前睡觉时间还是延后睡觉时间（通过坐标点判断东西方，纬度越大越向东，东方：提前，西方：延后）
  // 如时间提前，在换算后的最低温度时间前四小时内避光
  // 如时间延后，在换算后的最低温度时间后四小时内避光
  const bool = userCity.end.lat > userCity.start.lat;
  // console.log(bool, userCity.end.lat, userCity.start.lat, "+++++bool");

  // 6. 最低温度时间向到达城市入睡时间调整，每天调整 1 小时（到达时间 18 点以后时，第二天开始记录）
  let list = [];
  const timeDown = Utils.timeFormat(userSleep.down, "timeHM");
  const timeUp = Utils.timeFormat(userSleep.up, "timeHM");
  const numHours = bool ? -1 * oneHours : oneHours;
  listStartDate = new Date(listStartDate).getTime();
  for (let index = 0; index < num; index++) {
    const week = Utils.getWM(new Date(listStartDate + 24 * oneHours * index));

    const toDay = new Date(
      new Date(listStartDate + 24 * oneHours * index)
    ).getDate();

    const month = Utils.getWM(
      new Date(listStartDate + 24 * oneHours * index),
      "month"
    );

    const timeHM = Utils.timeFormat(
      listStartDate + numHours * index + 24 * oneHours * index,
      "timeHM"
    );
    const timeHM1 = Utils.timeFormat(
      listStartDate - 4 * oneHours + numHours * index + 24 * oneHours * index,
      "timeHM"
    );
    const timeHM2 = Utils.timeFormat(
      listStartDate + 4 * oneHours + numHours * index + 24 * oneHours * index,
      "timeHM"
    );
    // console.log(timeHM, timeHM1, timeHM2, "+++++data");

    list.push({
      bool,
      title: `${week} ${toDay}TH ${month}`,
      start: `${timeHM1}-${timeHM}`,
      end: `${timeHM}-${timeHM2}`,
      sleep: `${timeDown}-${timeUp}`,
    });
  }
  // console.log(list, "++++++list");
  sessionStorage.setItem("list", JSON.stringify(list));
  return router.push({ path: "/page", query: {} });
};

// 页面加载完成
onMounted(() => {
  // 获取起点城市坐标
  const autocompleteStart = new google.maps.places.Autocomplete(
    document.getElementById("cityStart"),
    { types: ["(cities)"], fields: ["geometry"] }
  );
  autocompleteStart.addListener("place_changed", () => {
    const place = autocompleteStart.getPlace();
    userCity.start = {
      lng: place.geometry.location.lng(), // 经度
      lat: place.geometry.location.lat(), // 纬度
    };
  });

  // 获取终点城市坐标
  const autocompleteEnd = new google.maps.places.Autocomplete(
    document.getElementById("cityEnd"),
    { types: ["(cities)"], fields: ["geometry"] }
  );
  autocompleteEnd.addListener("place_changed", () => {
    const place = autocompleteEnd.getPlace();
    userCity.end = {
      lng: place.geometry.location.lng(), // 经度
      lat: place.geometry.location.lat(), // 纬度
    };
  });
});

// 页面即将卸载时
onUnmounted(() => {});
</script>
