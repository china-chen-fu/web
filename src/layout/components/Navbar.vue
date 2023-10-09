<template>
  <div class="navbar">
    <div class="navbar-title">
      <div class="navbar-title-box">
        <el-popover placement="right" :width="400" trigger="click" popper-class="application" :offset="30">
          <template #reference>
            <div class="dropdown">
              <img src="../../assets/images/layout/application.png" alt="">
            </div>
          </template>
          <div class="application--list">
            <div class="list--container">
<!--              <el-scrollbar max-height="312px">-->
<!--                <div class="grid">-->
<!--                  <div class="grid&#45;&#45;item" v-for="item in platformList" @click="goShowPage(item)">-->
<!--                    <div class="icon" >-->
<!--                      <img :src="item.logoUrl" alt="">-->
<!--                    </div>-->
<!--                    <div class="icon&#45;&#45;title">-->
<!--                      {{item.platformName.slice(0,4)}}-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </el-scrollbar>-->
            </div>

            <div class="list--footer">
              <span @click="goOpenPlatform">
                 全部应用
               </span>
            </div>
          </div>
        </el-popover>

        <div class="logo">
          <img :src="getLogo().url" alt="">
        </div>
      </div>

    </div>
    <breadcrumb
      v-if="!settingsStore.topNav"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <top-nav
      v-if="settingsStore.topNav"
      id="topmenu-container"
      class="topmenu-container"
    />
    <div class="right-menu">

      <div class="avatar-container">
        <el-dropdown>
          <template #default>
            <span style="margin-right: 16px;display: inline-block;min-width: 100px;text-align: right">
              {{ userStore.nickName || userStore.name }}
            <el-icon><ArrowDown /></el-icon>
            </span>

          </template>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>



<!--        <div class="user">-->

<!--        </div>-->
<!--        <div class="logout">-->
<!--          <span @click="logout">退出登录</span>-->
<!--          <div class="icon">-->
<!--            <img src="" alt="">-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import { removePlatform } from "@/utils/auth";
import usePermissionStore from "@/store/modules/permission";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
// const usePermission = usePermissionStore();
function toggleSideBar() {
  appStore.toggleSideBar();
}

const logoUrl = import.meta.env.VITE_APP_LOGO_PATH;
function getLogo() {
  return {
    url: new URL(`../../assets/logo/${logoUrl}/bigLogo.png`, import.meta.url).href,
    height: "56px",
  };
}

// usePermissionStore()
//   .getPlatforms()
//   .then((res) => {});

//得到计算后的platform
// const platformList = computed(()=>{
//   // usePermission.platforms
//   //过滤掉没有运行的平台 和自身
//   let list =usePermission.platforms.filter((item)=>{
//    return item.status === '0' && item.platformId !== usePermission.platform.platformId
//   })
//
//   //如果管理员都显示  一般人只显示有权限的
//   if(userStore.permissions.includes('*:*:*')){
//     return list
//   }else{
//     return list.filter((item)=>userStore.permissions.includes(
//         'platform:' + item.platformId
//     ))
//   }
// })


function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore
        .logoutGateway()
        .then(() => {
          removePlatform();
          sessionStorage.clear();
          location.href = import.meta.env.VITE_APP_LOGIN_OUT_PATH;
        })
        .catch(() => {});
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}

function goOpenPlatform() {
  location.href = import.meta.env.VITE_APP_OPENPLATFORM_HOME_URL;
}

//切换平台
function goShowPage(item={targetUrl:'#'}) {
  location.href = item.targetUrl;
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module";
.navbar {
  height: 72px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  //box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  z-index: 1002;
  background: #fff;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    .avatar-container {
      height: 100%;
      display: flex;
      align-items: center;

      span{
        height: 22px;
        font-size: 15px;
        font-weight: 400;
        color: #647386;
        line-height: 22px;
        &:hover{
          cursor:pointer;
        }
      }

      .user{

      }

      .logout{
        display: flex;
      }
    }

  }
}

.navbar-title {

.navbar-title-box{
  width: $base-sidebar-width;
  height: 100%;
  background: $theme-color;
  display: flex;
  align-items: center;
  .dropdown{
    width: 28px;
    height: 28px;
    margin-left: 15px;
    margin-right: 24px;
    &:hover{
      cursor:pointer;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }

  .logo{
    width: 135px;
    height: 45px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
}
</style>
