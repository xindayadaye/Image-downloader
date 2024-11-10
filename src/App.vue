<template>
  <el-config-provider :locale="locale">
    <header class="header">
      <div class="title">
        <div class="left">
          <el-checkbox
            v-model="checkAll"
            :label="selectAllText"
            border
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          />
          <el-divider direction="vertical" />
          <el-button
            v-if="checkedImagesTotal"
            type="primary"
            @click="downloadFile"
            style="margin-top: -6px"
          >
            {{ downloadBtn }}
          </el-button>
          <el-text v-if="!checkedImagesTotal" class="mx-1" size="large">
            {{ foundLabel }}
          </el-text>
        </div>
        <div class="right">
          <!-- 筛选 -->
          <section>
            <span>{{ TypeText }}</span>
            <el-select
              v-model="selectType"
              clearable
              style="width: 120px; margin: 0 8px"
            >
              <el-option
                v-for="item in imgTypes"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value"
              />
            </el-select>
            <el-divider direction="vertical" />
            <span>{{ SizeText }}</span>
            <el-select
              v-model="selectSize"
              clearable
              style="width: 120px; margin-left: 8px"
            >
              <el-option
                v-for="item in imgSizes"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item"
              >
                <div v-if="item.value !== 'Custom'">
                  {{ item.label }}
                </div>
                <div v-else>
                  {{ item.label }}
                  <el-input
                    v-model="item.w"
                    @focus="selectTextOnFocus"
                    @click.stop
                    style="width: 60px"
                  />
                  *
                  <el-input
                    v-model="item.h"
                    @focus="selectTextOnFocus"
                    @click.stop
                    style="width: 60px"
                  />
                </div>
              </el-option>
              <template #footer>
                <div>
                  <el-checkbox
                    v-model="saveSelection"
                    :label="SaveSizeSelection"
                  />
                </div>
              </template>
            </el-select>
          </section>
          <el-divider direction="vertical" />
          <el-icon class="setting" size="20" @click="openSetting">
            <Setting />
          </el-icon>
        </div>
      </div>
    </header>
    <el-empty
      v-if="!showImageList?.length"
      :image-size="200"
      style="padding: 150px 10px"
    />
    <div v-else style="padding: 80px 10px 10px">
      <el-card
        v-for="item in showImageList"
        :key="item.src"
        :class="{ cardBox: true, activeCard: item?.isCheck?.length }"
        @click="clickCard(item)"
      >
        <template #header>
          <div class="card-header">
            <el-space>
              <span
                :class="{ checkBox: true, isCheck: !!item?.isCheck?.length }"
              ></span>
              <span class="custom-label">{{ item.src }}</span>
            </el-space>
            <el-space>
              <el-tag v-if="item.type" type="primary" size="large">
                {{ item.type }}
              </el-tag>
              <el-tag v-if="item.width" type="primary" size="large">
                {{ item.size }}：{{ item.width }}*{{ item.height }}
              </el-tag>
              <el-tag v-if="item.mimeType" type="primary" size="large">
                {{ item.mimeType }}
              </el-tag>
            </el-space>
          </div>
        </template>
        <div style="width: 100%">
          <el-image
            style="width: 100%; max-height: 800px"
            :src="item.src"
            :preview-src-list="previewList(item)"
          />
          <el-input v-model="item.src" @click.stop />
        </div>
      </el-card>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="settingTitle"
      append-to-body
      width="450"
    >
      <div>
        <div class="setItem">
          <div calss="setTitle">
            {{ SpecifyDownloadLocation }}
            <el-input v-model="customFolder" @click.stop style="width: 200px" />
          </div>
          <div class="setContent">
            <el-radio-group v-model="selectCreateFolderMode">
              <el-radio :value="0" size="large">
                {{ CreateFolder }}
              </el-radio>
              <br />
              <el-radio :value="1" size="large">
                {{ UseAlwaysFolder }} {{ customFolder }}
              </el-radio>
            </el-radio-group>
            <div>
              <el-text tag="mark">
                {{ makesurechrome }}
                <el-text
                  type="primary"
                  @click="openDownloadsAll"
                  style="cursor: pointer"
                >
                  {{ browserType }} Settings --> Advanced --> Download section.
                </el-text>
              </el-text>
            </div>
          </div>
        </div>
        <div class="setItem">
          {{ isImgPreview }} <el-switch v-model="isPreview" />
        </div>
      </div>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ locale.el.messagebox.cancel }}
          </el-button>
          <el-button type="primary" @click="dialogVisible = false">
            {{ locale.el.messagebox.confirm }}
          </el-button>
        </div>
      </template> -->
    </el-dialog>
  </el-config-provider>
</template>
<script setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import { cloneDeep } from "lodash-es";
import { Setting } from "@element-plus/icons-vue";

const langObject = chrome["i18n"];
const lang = langObject.getUILanguage(); // 当前语言
const locale = computed(() => (lang === "zh-CN" ? zhCn : en));
// start
const selectAllText = langObject?.getMessage?.("selectall");
// 找到n张图片
const foundLabel = computed(() =>
  langObject
    ?.getMessage?.("foundLabel")
    ?.replace("%n", showImageList.value.length)
);
// 下载n张图片
const downloadBtn = computed(() =>
  langObject
    ?.getMessage?.("manyfilesnum")
    ?.replace("%n", checkedImagesTotal.value)
);
const openinnewtab = langObject?.getMessage?.("openinnewtab");
const filterbyurlinputplaceholder = langObject?.getMessage?.(
  "filterbyurlinputplaceholder"
);
const isImgPreview = langObject?.getMessage?.("isImgPreview");
const makesurechrome = langObject?.getMessage?.("makesurechrome");
const settingTitle = ref(langObject?.getMessage?.("settingTitle"));
const UseAlwaysFolder = langObject?.getMessage?.("UseAlwaysFolder");
const CreateFolder = langObject?.getMessage?.("CreateFolder");
const SpecifyDownloadLocation = langObject?.getMessage?.(
  "SpecifyDownloadLocation"
);
const All = langObject?.getMessage?.("All");
const Small = langObject?.getMessage?.("Small");
const Medium = langObject?.getMessage?.("Medium");
const Large = langObject?.getMessage?.("Large");
const Custom = langObject?.getMessage?.("Custom");
const SaveSizeSelection = langObject?.getMessage?.("SaveSizeSelection");
const SizeText = langObject?.getMessage?.("Size");
const TypeText = langObject?.getMessage?.("Type");
const imgSizeText = {
  All,
  Small,
  Medium,
  Large,
};

// end
// 浏览器信息start
const tabObj = ref({});
// 浏览器信息end
const checkAll = ref(false);
const isIndeterminate = ref(false);
const allImageList = ref([]); // 所有的图片
const showImageList = ref([]); // 显示的图片
const checkedImagesTotal = ref(0); // 选择的图片个数
const checkedImages = ref([]);
const imgTypes = ref([
  { value: "All", label: "" },
  { value: "JPG", label: "" },
  { value: "GIF", label: "" },
  { value: "PNG", label: "" },
  { value: "SVG", label: "" },
  { value: "WEBP", label: "" },
  { value: "BMP", label: "" },
  { value: "ICO", label: "" },
  { value: "TIFF", label: "" },
]);
const selectType = ref("All");
const imgSizes = ref([
  { value: "All", label: "" },
  { value: "Small", label: "", w: 200, h: 200 },
  { value: "Medium", label: "", w: 200, h: 200 },
  { value: "Large", label: "", w: 800, h: 600 },
  { value: "Custom", label: "", w: 0, h: 0 },
]);
const selectSize = ref({ value: "All", label: "" });
const saveSelection = ref(false); // 是否需要持久化保存尺寸
const customFolder = ref("downloadhub");
const selectCreateFolderMode = ref(0); // 选择那种创建文件夹方式
const isPreview = ref(true); // 是否开启预览
const dialogVisible = ref(false);
const browserType = getBrowserType();

watchEffect(() => {
  console.log(111);
  // 统计数量
  statTotal();
  // 过滤
  showImageList.value = allImageList.value.filter((item) => {
    let isType = false,
      isSize = false;
    if (selectType.value === "All" || selectType.value === item.type) {
      isType = true;
    }
    if (
      selectSize.value.value === "All" ||
      judgeSize(item.width, item.height) === selectSize.value.value ||
      (selectSize.value.value === "Custom" &&
        item.width > imgSizes.value[4].w &&
        item.height > imgSizes.value[4].h)
    ) {
      isSize = true;
    }
    return isType && isSize;
  });
});

function handleCheckAllChange(val) {
  showImageList.value = showImageList.value.map((item) => ({
    ...item,
    isCheck: val ? [item.src] : [],
  }));
  isIndeterminate.value = false;
  checkedImagesTotal.value = val ? showImageList.value.length : 0;
  checkedImages.value = val ? showImageList.value : [];
}
function handleCheckedImageChange(value = []) {
  const checkedCount = value?.length || 0;
  checkAll.value = checkedCount === showImageList.value?.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < showImageList.value?.length;
}
function clickCard(item) {
  item.isCheck = item.isCheck.length ? [] : [item.src];

  const checkedImgs = showImageList.value.filter((cur) => cur.isCheck.length);
  checkedImages.value = checkedImgs;
  checkedImagesTotal.value = checkedImgs.length;
  handleCheckedImageChange(checkedImgs);
}
watch(
  () => [
    selectSize,
    saveSelection,
    customFolder,
    selectCreateFolderMode,
    imgSizes,
    isPreview,
  ],
  () => {
    if (selectSize.value.value === "Custom") {
      selectSize.value.w = imgSizes.value[4].w;
      selectSize.value.h = imgSizes.value[4].h;
    }
    setStorage();
  },
  { deep: true }
);
// 持久化保存尺寸
function setStorage() {
  chrome.storage.sync.set({
    selectSize: selectSize.value,
    saveSelection: saveSelection.value,
    customFolder: customFolder.value,
    selectCreateFolderMode: selectCreateFolderMode.value,
    isPreview: isPreview.value,
  });
}
// 获取保存的尺寸
function getStorage() {
  chrome.storage.sync
    .get([
      "selectSize",
      "saveSelection",
      "customFolder",
      "selectCreateFolderMode",
      "isPreview",
    ])
    .then((result) => {
      saveSelection.value = result?.saveSelection || false;
      if (result?.selectSize) {
        selectSize.value = result?.selectSize;
        imgSizes.value[4].h = result?.selectSize?.h || 0;
        imgSizes.value[4].w = result?.selectSize?.w || 0;
      }
      customFolder.value = result?.customFolder ?? customFolder.value;
      selectCreateFolderMode.value = result?.selectCreateFolderMode;
      isPreview.value = !!result?.isPreview;
    });
}
function openSetting() {
  if (dialogVisible.value) return;
  dialogVisible.value = true;
}
function selectTextOnFocus(el) {
  el.target.select();
}
function previewList(item) {
  return isPreview.value ? [item.src] : [];
}
// 设置下载文件夹及文件名
function setDownload() {
  chrome.downloads.onDeterminingFilename.addListener(function (
    downloadItem,
    suggest
  ) {
    // 固定
    let downloadFolder = customFolder.value + " - " + tabObj.value?.title;
    if (selectCreateFolderMode.value) {
      downloadFolder = customFolder.value || "downloadhub";
    }

    downloadFolder = (downloadFolder || "")?.replace?.(
      new RegExp("[^0-9a-zA-Z-_ ]", "g"),
      "_"
    );

    let filename = downloadItem?.filename
      ?.replace(/\\/g, "/")
      .replace(/\/{2,}/g, "/");
    // 拼接文件路径
    filename = downloadFolder + "/" + filename;
    // 在这里，你可以根据downloadItem的信息来自定义文件名
    // suggest是一个函数，用于向浏览器建议新的文件名
    // 如果你不调用suggest()，则使用downloadItem的默认文件名
    suggest({ filename });
  });
}
// 下载文件
function downloadFile() {
  for (let index = 0; index < checkedImages.value.length; index++) {
    chrome.downloads.download({ url: checkedImages.value[index]?.src });
  }
}
function openDownloadsAll() {
  chrome["tabs"]["create"]({
    url: "chrome://settings/downloads#All",
    active: !![],
  });
}
function getBrowserType() {
  const userAgent = navigator.userAgent;

  if (/Edg/.test(userAgent)) {
    return "Edge";
  } else if (/Chrome/.test(userAgent)) {
    return "Chrome";
  } else {
    return "Unknown";
  }
}
// 初始化
init();
function init() {
  setDownload();
  getStorage();
  getTabImage();
}

function getTabImage() {
  // chrome["runtime"]["sendMessage"]({ msg: "getImagesCT" }, function (f) {});
  // 获取当前活动的tab
  chrome["tabs"]["query"](
    {
      active: !![],
      currentWindow: !![],
    },
    function (data) {
      console.log(data);
      tabObj.value = data?.[0];
      // 获取到所有的照片
      chrome["scripting"]["executeScript"](
        {
          target: {
            tabId: data[0]["id"],
            // allFrames: b,
          },
          files: ["lib/image.js"],
        },
        (res = []) => {
          console.log(res);
          queryImage(res.sort((a, b) => a - b));
        }
      );
    }
  );
}
// 获取图片的尺寸
async function queryImage(res) {
  for (let i = 0; i < (res || []).length; i++) {
    if (!res[i] || !res[i]?.result?.images.length) continue;

    localStorage["active_tab_origin"] = res[i]?.result?.origin;
    const images = res[i]?.result?.images || [];
    const addRules = images.map((item, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "Referer",
            operation: "set",
            value: localStorage["active_tab_origin"],
          },
        ],
      },
      condition: {
        urlFilter: item,
        resourceTypes: ["image"],
      },
    }));
    //
    await chrome["declarativeNetRequest"]["updateSessionRules"]({
      addRules,
      removeRuleIds: addRules.map((item) => item.id),
    });

    loadImage(images);
  }
}
// 加载所有图片，获取图片的资料
async function loadImage(images) {
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    try {
      // 如果有了，就不继续加了
      if (allImageList.value.some((cur) => cur.src === item)) continue;
      allImageList.value.push({ src: item, isCheck: [] });

      const img = document["createElement"]("img");
      img.crossOrigin = "anonymous";
      img.src = item;
      img.onerror = () => {
        console.log("加载失败");
      };

      img.onload = function (e) {
        const imgInfo = {
          width: e?.target?.width,
          height: e?.target?.height,
          src: e?.target?.currentSrc,
        };
        // 图片大小
        imgInfo["size"] = judgeSize(imgInfo.width, imgInfo.height);
        imgInfo["type"] = getImageType(imgInfo.src, this);

        if (!allImageList.value.some((cur) => cur.src === imgInfo.src)) {
          allImageList.value.push(imgInfo);
        }
        allImageList.value = allImageList.value.map((cur) => {
          if (cur.src === imgInfo.src) {
            return {
              ...cur,
              ...imgInfo,
            };
          }
          return cur;
        });
      };
    } catch (e) {
      console.log(e);
    }
  }
  chrome["runtime"]["sendMessage"]({ msg: "getImagesCT" }, function (f) {
    const images = [];
    Object.keys(f?.imagesCT || {}).forEach((item) => {
      const el = f?.imagesCT?.[item];
      images.push(item);
      allImageList.value = allImageList.value.map((cur) => {
        if (item === cur.src) {
          return {
            ...cur,
            mimeType: formatBytes(el.contentLength, 0),
          };
        }
        return cur;
      });
    });
  });
}
function statTotal() {
  // 统计数量
  const total = allImageList.value.reduce(
    ({ type, size }, item) => {
      if (item.type in type) {
        type[item.type]++;
      } else {
        type[item.type] = 1;
      }

      if (item.size in size) {
        size[item.size]++;
      } else {
        size[item.size] = 1;
      }
      return { type, size };
    },
    { type: {}, size: {} }
  );

  imgTypes.value = imgTypes.value.map((item) => ({
    ...item,
    disabled:
      item.value === "All"
        ? !allImageList.value.length
        : !total.type[item.value],
    label: `${item.value === "All" ? All : item.value} ( ${
      item.value === "All"
        ? allImageList.value.length
        : total.type[item.value] || 0
    } )`,
  }));

  imgSizes.value = imgSizes.value.map((item) => ({
    ...item,
    disabled: ["All", "Custom"].includes(item.value)
      ? false
      : !total.size[item.value],
    label:
      item.value === "Custom"
        ? Custom
        : `${imgSizeText[item.value]} ( ${
            item.value === "All"
              ? allImageList.value.length
              : total.size[item.value] || 0
          } )`,
  }));
}
// 判断图片大小
function judgeSize(w, h) {
  if (w * h >= 800 * 600) return "Large";
  if (w * h >= 200 * 200 && w * h < 800 * 600) return "Medium";
  if (w * h < 200 * 200) return "Small";
}
// 获取图片类型
function getImageType(src = "", e) {
  let imageType;
  const imgSrc = src.toLowerCase();

  // 检测图片URL中的文件扩展名
  if (imgSrc.indexOf(".jpg") !== -1 || imgSrc.indexOf(".jpeg") !== -1) {
    imageType = "JPG";
  } else if (imgSrc.indexOf(".png") !== -1) {
    imageType = "PNG";
  } else if (imgSrc.indexOf(".gif") !== -1) {
    imageType = "GIF";
  } else if (imgSrc.indexOf(".webp") !== -1) {
    imageType = "WEBP";
  } else if (imgSrc.indexOf(".SVG") !== -1) {
    imageType = "SVG";
  } else if (imgSrc.indexOf(".BMP") !== -1) {
    imageType = "BMP";
  } else if (imgSrc.indexOf(".ICO") !== -1) {
    imageType = "ICO";
  } else if (imgSrc.indexOf(".TIFF") !== -1) {
    imageType = "TIFF";
  } else {
    // 如果无法从URL中检测到，则可以尝试其他方法
    // 例如，通过canvas检测图片数据的MIME类型
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    context.drawImage(e, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    imageType = dataURL.split(";")[0].split("/")[1];
  }

  return imageType.toUpperCase();
}
// 格式化字节大小
function formatBytes(a, b) {
  if (a == 0) return "0 B";
  const e = 1024,
    f = b,
    g = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    h = Math["floor"](Math["log"](a) / Math["log"](e));
  return parseFloat((a / Math["pow"](e, h))["toFixed"](f)) + " " + g[h];
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  box-shadow: 0px 0px 5px rgb(187 187 187 / 80%);
  z-index: 100;
  padding: 10px 20px 0;
  background-color: #fff;
}
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
}

.right {
  display: flex;
  align-items: center;
}
.setting {
  cursor: pointer;
}
.setting:hover {
  color: var(--el-color-primary);
}

.cardBox {
  display: block;
  margin-bottom: 10px;
}
.activeCard {
  border-color: var(--el-color-primary);
}
.custom-label {
  display: block; /* 或者 inline-block */
  width: 400px; /* 你想要限制的宽度 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  line-height: 23px;
}
.checkBox {
  width: 14px;
  height: 14px;
  position: relative;
  border: 1px solid var(--el-border-color);
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
.checkBox:hover {
  border-color: var(--el-color-primary);
}
.checkBox::before {
  box-sizing: content-box;
  content: "";
  border: 1px solid transparent;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
}
.checkBox.isCheck {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.checkBox.isCheck::before {
  transform: rotate(45deg) scaleY(1);
  border-color: var(--el-color-white);
}
.setItem {
  margin-bottom: 20px;
}
.setContent {
  padding: 0 12px;
}
</style>
