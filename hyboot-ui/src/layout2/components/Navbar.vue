<template>
  <div class="navbar">
    <div style="padding: 0 10px 0 30px">
      <img src="@/assets/images/header/logo.png" style="width: 30px;height: 30px;">
    </div>
    <div style="width: 150px;">

      <el-dropdown @command="goShowPage">
        <span style="font-size: 20px;color: #31373D;white-space: nowrap;cursor: pointer;">
          <!--          <template v-for="(item, index) in usePermission.platforms">-->
          <!--            <span v-if="item.platformId == platformId">{{item.platformName}}</span>-->
          <!--          </template>-->
          <span>{{ usePermission.platform.platformName || '暂无其他系统显示' }}</span>
          <el-icon class="CaretBottom">
            <caret-bottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="(item, index) in usePermission.platforms">
              <el-dropdown-item :disabled="usePermission.platform.platformId == item.platformId" :command="item" :key="index" v-if="item.status == 0 && (userStore.permissions.includes('platform:' + item.platformId) || userStore.permissions.includes('*:*:*'))">
                {{ item.platformName }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <top-nav id="topmenu-container" class="topmenu-container" style="flex: 1;margin-left: 75px;" />

    <div class="right-menu">
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="hover">
          <div style="display: flex;align-items: center;padding: 15px;font-size: 14px">
            <!-- <div class="avatar-wrapper">
              <img :src="userStore.avatar" class="user-avatar" />
            </div> -->
            <div style="color: #262E4A;padding: 0 5px; line-height: 40px;">
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
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { getPlatform } from "@/utils/auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const usePermission = usePermissionStore()
const router = useRouter()

onMounted(() => {
  let platformId = getPlatform()
})
//
// function toggleSideBar() {
//   appStore.toggleSideBar()
// }

function handleCommand (command) {
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

function logout () {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      sessionStorage.clear();
      location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout () {
  emits('setLayout');
}

function goShowPage (item) {
  usePermission.changeRoute(item.platformId).then(() => {
    router.push(item.prefix)
  })
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #fff;
  //box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

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
        // cursor: pointer;
        // width: 40px;
        // height: 40px;
        // border-radius: 40px;
        // position: relative;
        // text-align: center;
        // line-height: 40px;
        // background-color: #9AC9B5;
        // color: #fff;

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

  /*
  &:hover {
    .right-content {
      img {
        transform: rotate(180deg);
        transition: all 0.3s ease-in;
      }
    }
  }*/
}
</style>
