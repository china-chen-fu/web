<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">

        <div class="hidden-md-and-down">
          <img src="@/assets/login/company-logo.png" alt="" class="company-logo ">
        </div>

        <div class="right-menu">
          <div class="avatar-container">
            <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="hover">
              <div style="display: flex;align-items: center;padding: 10px;font-size: 14px">
                <div class="avatar-wrapper">
                  <img :src="userStore.avatar" class="user-avatar" />
                </div>
                <div style="color: #262E4A;padding: 0 5px">
                  {{ userStore.nickName || userStore.name }}
                </div>
                <div style="padding-top: 3px">
                  <el-icon>
                    <arrow-down-bold />
                  </el-icon>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>



      </el-header>



      <div class="transfer-title">
        <span>朝阳农贸智慧云平台</span>
      </div>
      <div class="transfer-content">

        <div class="main-right" style="flex: 0.4">
          <template v-for="(item, index) in usePermission.platforms">
            <div class="img-container" :key="index" @click="goShowPage(item)" v-if="item.status == 0 && (userStore.permissions.includes('platform:' + item.platformId) || userStore.permissions.includes('*:*:*'))">
              <img src="@/assets/transfer/money.png" alt="" class="area-img" v-if="item.icon=='money'">
              <img src="@/assets/transfer/light-monitor.png" alt="" class="area-img" v-if="item.icon=='light-monitor'">
              <img src="@/assets/transfer/fire-monitor.png" alt="" class="area-img" v-if="item.icon=='fire-monitor'">
              <img src="@/assets/transfer/sys.png" alt="" class="area-img" v-if="item.icon=='sys'">
              <div class="description">
                <span class="description-text">
                  {{ item.platformName }}
                </span>
                <el-icon>
                  <arrow-right-bold />
                </el-icon>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script setup>

import { ElMessageBox } from "element-plus";
import useUserStore from '@/store/modules/user'
import usePermissionStore from "../store/modules/permission";
import { useRouter } from "vue-router";

const userStore = useUserStore()
const usePermission = usePermissionStore()
const router = useRouter()


function handleCommand(command) {
  switch (command) {
    case "setLayout":
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
    })
  }).catch(() => { });
}

function goShowPage(item) {
  usePermission.changeRoute(item.platformId).then(() => {
    router.push(item.prefix)
  })
}

const getImageURL=(payload)=>{
  return new URL(`../assets/transfer/${payload}.png`,import.meta.url).href;
}


</script>
<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/login/bck.png');
  background-repeat: round;


  .header {
    margin-top: 21px;
    margin-bottom: 80px;
    display: flex;

    .company-logo {
      width: 189px;
    }

    .right-menu {
      line-height: 70px;
      display: flex;
      flex: 1;
      justify-content: flex-end;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        margin-left: auto;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }

          &:hover i {
            transform: rotate(180deg);
            transition: all 0.3s ease-in;
          }
        }
      }

      .avatar-container {
        //margin-right: 10px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 40px;
          }

          i {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }

  }


  .title {
    font-size: 50px;
    font-weight: 500;
  }

  .left-area {
    min-width: 600px;
    max-width: 70%;
  }



  .transfer-content {

    margin-top: 50px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 330px);

    &>div {
      text-align: center;
    }

    .main-right {
      display: flex;
      flex: 1;
      justify-content: center;

      .img-container {
        margin: 20px;
        padding-top: 20px;
        width: 240px;
        height: 240px;
        background-image: url("@/assets/login/platform_bg.svg");
        background-size: 100% 100%;
        cursor: pointer;

        .area-img {
          width: 130px;
        }

        .description {

          display: flex;
          //justify-content: center;
          //align-items: center;
          font-weight: 500;
          font-size: 24px;
          padding-right: 15px;
          margin-top: 15px;

          .description-text {
            flex: 1;
          }

          & i {
            margin-top: 7px;
          }
        }
      }

    }
  }
}

.transfer-bottom-image {
  flex: 0.6;
  text-align: center;
}

.transfer-title {
  font-size: 48px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #31373D;
  text-align: center;
  padding: 30px 0;
  white-space: nowrap;
}



@media screen and (max-width: 1300px) {
  .transfer-content .transfer-bottom-image {
    display: none;
  }

  .transfer-content .main-right {
    flex: 1 !important;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (max-width: 1410px) {
  .main-right .img-container {

    width: 220px !important;
    height: 220px !important;

  }

  .main-right .img-container .description {
    font-size: 20px !important;
  }

  .main-right .img-container .area-img {
    width: 120px !important;
  }
}
</style>


