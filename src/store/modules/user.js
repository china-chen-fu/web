import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import { getCampusInfo, logoutGateway } from "@/api/campus";

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userId:'',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    park: '空调分户计费系统'
  }),
  actions: {
    // 登录
    login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            let data = res.data
            setToken(data.token)
            this.token = data.token
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.data.user
            const avatar =
              user.avatar == '' || user.avatar == null ? defAva : user.avatar

            if (res.data.roles && res.data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.data.roles
              this.permissions = res.data.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getCampusInfo() {
      return new Promise((resolve, reject) => {
        getCampusInfo().then((res) => {
          const user = res.data.user;
          const avatar = user.avatar == "" || user.avatar == null ? defAva : user.avatar;

          if (res.data.roles && res.data.roles.length > 0) {
            // 验证返回的roles是否是一个非空数组
            this.roles = res.data.roles;
            this.permissions = res.data.permissions;
          } else {
            this.roles = ["ROLE_DEFAULT"];
          }
          this.name = user.userName;
          /// {{{ add by wangxin 20230117 显示昵称代替名称
          this.nickName = user.nickName;
          this.userId = user.userId;
          /// }}}
          this.avatar = avatar;
          resolve(res);
      }).catch((error) => {
          reject(error);
      });
    })
  },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出网关登录
    logoutGateway(statusCode) {
      return new Promise((resolve, reject) => {
          if (statusCode == 401) {
              this.token = "";
              this.roles = [];
              this.permissions = [];
              removeToken();
              resolve();
          } else {
              logoutGateway(this.token).then(() => {
                  this.token = "";
                  this.roles = [];
                  this.permissions = [];
                  removeToken();
                  resolve();
              })
              .catch((error) => {
                  reject(error);
              });
          }
      });
  }
  }
})

export default useUserStore
