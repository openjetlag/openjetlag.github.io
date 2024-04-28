import router from "@/router";

// 日期格式化
export function timeFormat(time, str = "", icon = "/") {
  if (!time) return;

  const time2 = JSON.parse(JSON.stringify(time));
  const timeNow = new Date(time2);
  let month = timeNow.getMonth() + 1;
  month = month >= 10 ? month : "0" + month;
  let day = timeNow.getDate();
  day = day >= 10 ? day : "0" + day;
  let hours = timeNow.getHours();
  hours = hours >= 10 ? hours : "0" + hours;
  let minutes = timeNow.getMinutes();
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  let seconds = timeNow.getSeconds();
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  // 日期
  if (str == "date") {
    return `${timeNow.getFullYear()}${icon}${month}${icon}${day}`;
  }

  // 时间
  if (str == "time") {
    return `${hours}:${minutes}:${seconds}`;
  }

  // 时间
  if (str == "timeHM") {
    return `${hours}:${minutes}`;
  }

  // 完整日期
  return `${timeNow.getFullYear()}${icon}${month}${icon}${day} ${hours}:${minutes}:${seconds}`;
}

// 当前窗口页面跳转
export function toPath(url, str = "", json = "") {
  // console.log(url, str, json, "+++++++url toPath");
  if (!url) return;

  if (str) {
    router.push({ path: url, query: { [str]: json } });
  } else {
    router.push({ path: url, query: {} });
  }
}

// 新建窗口页面跳转
export function toPathWin(url, str = "", json = "") {
  // console.log(url, "+++++++url toPathWin");
  if (!url) return;

  if (str && json) {
    const href = router.resolve({ path: url, query: { [str]: json } });
    window.open(href.href, "_blank");
  } else {
    const href = router.resolve({ path: url, query: {} });
    window.open(href.href, "_blank");
  }
}

// 滚动至此处
export function scrollThis(str, block = "start") {
  // console.log(str, block, "++++++++++str block scrollThis");
  if (!str) return;

  if (str == "body") {
    document.body.scrollIntoView({ block, behavior: "smooth" });
  } else {
    const element = document.getElementById(str);
    if (!element) return;

    if (element) element.scrollIntoView({ block, behavior: "smooth" });
  }
}

// 接收访问地址带的参数
export function getUrlParams(str, icon = "&") {
  const href = window.location.href;
  const arrHref = href && href.split("?") && href.split("?")[1];
  const arr = decodeURIComponent(arrHref).split(icon);

  // 查询参数
  let returnStr = "";
  arr.map((item) => {
    const arrItem = item.split("=");

    if (arrItem && arrItem[0] == str) return (returnStr = arrItem[1]);
  });

  if (returnStr) return returnStr;
  return "";
}

// 获取时区
export function getTimezone({ lng, lat }) {
  if (!lng || !lat) return;

  const apiKey = "AIzaSyDfLGBgjMGYMfL4YuzgGCNztBHbniJlQ1A"; // 谷歌 API 请求 key
  const timestamp = Math.floor(Date.now() / 1000); // 当前时间戳，以秒为单位
  const apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.status == "OK") {
          const num = Math.ceil(data.rawOffset / 3600);
          const numX = Math.ceil(data.dstOffset / 3600);
          // console.log(data, num, "++++++rawOffset");

          resolve({ bool: true, num, numX });
        } else {
          reject({ bool: false, error: data });
          console.log(
            "No data found, or query failed, please check the network or contact the administrator!"
          );
        }
      })
      .catch((error) => {
        reject({ bool: false, error });
      });
  });
}

// 获取数组 - 数字范围
export function makeRange(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
}

// 获取 周几 / 月份
export function getWM(date, str = "week") {
  if (!date) return;

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (str == "month") return monthNames[date.getMonth()];

  return weekDays[date.getDay()];
}
