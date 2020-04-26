<template>
  <div class="login-main">
    <div class="login-from-box">
      <p class="title">岗隆数码后台管理</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="帐号" prop="name">
          <el-input v-model="form.name" placeholder="您的管理员帐号" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="您的管理员密码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    password: '',
                    remember: 'on'
                },
                rules: {
                    name: [
                        {required: true, message: '请输入您的帐号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入您的密码', trigger: 'blur'},
                    ],

                },
                remember: false
            };
        },
        computed: {},
        created() {

        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let m_loading = this.$loading({
                            text: '登录中'
                        });
                        this.$post('login', {
                            name: this.form.name,
                            password: this.form.password
                        })
                            .then((token) => {
                                if (token) {
                                    //保存持久存储
                                    let gl_cms_token_ = {};
                                    gl_cms_token_.token = token;
                                    gl_cms_token_.over_time = parseInt((new Date()).getTime()) + 63072000000;
                                    localStorage.setItem('gl_cms_token', JSON.stringify(gl_cms_token_));
                                    this.$set(this.$store.state, 'gl_cms_token', token);
                                    /*跳转*/
                                    this.goBeforeLoginUrl();
                                }
                                m_loading.close();
                            })

                    } else {
                        return false;
                    }
                });
            },
            goBeforeLoginUrl() {
                let url = localStorage.getItem("beforeLoginUrl");
                if (!url || url.indexOf('/login') != -1) {
                    this.$router.push('/index')
                } else {
                    localStorage.setItem("beforeLoginUrl", "/index");
                    this.$router.push(url)
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
  .login-main {
    width: 100vw;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url("../../assets/b.jpg");
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font: 30px Extra large;
      text-align: center;
      margin-bottom: 30px;
    }

    .login-from-box {
      width: 500px;
      height: 300px;
      background-color: white;
      border-radius: 5px;
      padding: 50px;
    }
  }
</style>