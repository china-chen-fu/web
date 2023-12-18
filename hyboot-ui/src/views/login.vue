<template>
  <div class="login">
    <div class="common-layout">
      <el-container>
        <el-header class="header">
          <div class="hidden-md-and-down">
            <img src="@/assets/login/company-logo.png" alt="" class="company-logo">
          </div>
        </el-header>
       <div class="transfer-content">
          <div class="transfer-bottom-image">
            <img src="@/assets/login/left-area.webp" alt="" class="left-area" style="width: 660px;">
          </div>
          <div class="main-right">
            <div class="frame">

              <div class="sys-text">
                <span>朝阳农贸智慧云平台</span>
              </div>
              <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
                <el-form-item prop="username" style="width:333px">
                  <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号"
                    class="input-bck" :clearable=true style="width:333px">
                    <template #prefix>
                      <svg-icon icon-class="user" class="el-input__icon input-icon" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" style="width:333px">
                  <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off"
                    :show-password=true placeholder="密码" @keyup.enter="handleLogin" style="width:333px">>
                    <template #prefix>
                      <svg-icon icon-class="password" class="el-input__icon input-icon" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" v-if="captchaEnabled" style="width:333px">
                  <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码"
                    style="width: 63%" @keyup.enter="handleLogin">
                    <template #prefix>
                      <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
                    </template>
                  </el-input>
                  <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" style="height: 40px;" />
                  </div>
                </el-form-item>
                <el-form-item style="width:100%;" class="remenber-password">
                  <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
                </el-form-item>

                <el-form-item style="width:100%;">
                  <el-button :loading="loading" size="large" type="primary" style="width:100%;"
                    @click.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                  <div style="float: right;" v-if="register">
                    <!--          <router-link class="link-type" :to="'/register'">立即注册</router-link>-->
                  </div>
                </el-form-item>
              </el-form>

            </div>
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        router.push({ path: redirect.value || "/" });
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.data.img;
      loginForm.value.uuid = res.data.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>



<style lang='scss' scoped>
//样式初始化
body,
ol,
ul,
h1,
h2,
h3,
h4,
h5,
h6,
p,
th,
td,
dl,
dd,
form,
fieldset,
legend,
input,
textarea,
select {
  margin: 0;
  padding: 0
}

body {
  font: 12px"宋体", "Arial Narrow", HELVETICA;
  background: #fff;
  -webkit-text-size-adjust: 100%;
}

a {
  color: #2d374b;
  text-decoration: none
}

a:hover {
  color: #cd0200;
  text-decoration: underline
}

em {
  font-style: normal
}

li {
  list-style: none
}

img {
  border: 0;
  vertical-align: middle
}

table {
  border-collapse: collapse;
  border-spacing: 0
}

p {
  word-wrap: break-word
}

.login {
  .common-layout {
    width: 100vw;
    height: 100vh;
    background-image: url("@/assets/login/bck.jpg");
    background-repeat: no-repeat;
    background-size: cover;

    .header {
      margin-top: 2.3%;
      margin-bottom:6%;

      .company-logo {
        width: 11.2%;
      }
    }


    .transfer-content {
      display: flex;
      justify-items: center;


      .transfer-bottom-image {
        flex: 0.7;
        display: flex;
        justify-content: flex-end;
        margin-left: -20px;
      }


      .main-right {
        display: flex;
        flex-direction: column;
        margin: 0 auto;

        .frame {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 438px;
          height: 513px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 14px 14px 14px 14px;
          opacity: 1;
          border: 3px solid rgba(255, 255, 255, 0.4);


          .login-code {
            height: 40px;
            display: flex;
            flex: auto;
            align-items: center;
            justify-content: end
          }


          .remenber-password {

            margin-bottom: 20px;


            :deep(.el-form-item__content) {
              justify-content: flex-end;
            }
          }

          :deep(.el-input__inner) {
            width: 333px;
            background: transparent !important;
            border: 1px solid rgb(194, 201, 210);
          }


          .frame-logo {

            display: flex;
            justify-content: center;
            align-items: center;

            img {
              height: 85px;
              margin-bottom: 25px;
            }
          }

          .sys-text {
            width: 252px;
            height: 40px;
            font-size: 28px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #404040;
            line-height: 33px;
            margin-bottom: 53px;
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
          }




        }

      }

    }

    .left-area {
      min-width: 660px;
      max-width: 70%;
    }

  }




  @media screen and (max-width: 1300px) {
    .transfer-content .transfer-bottom-image {
      display: none;
    }

    .transfer-content .main-right {
      display: flex;
      flex: 1;
      justify-content: center;
      padding-right: 20px;
    }

    .left-area {
      display: none;
    }



  }

}
</style>
