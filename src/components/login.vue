<template>
    <div class="father">
        <div class="logo"><img src="../assets/logo.png"></div>
        <div class="conter">
            <el-form ref="loginForm" :model="loginForm" label-width="80px" :rules="loginrules">
                <el-form-item label="用户名 :" prop="username">   
                  <el-input v-model="loginForm.username" style="width: 80%;" prefix-icon='el-icon-user' v-focus></el-input>
                </el-form-item>
                <el-form-item label="密码 :" prop="password">
                    <el-input type="password" v-model="loginForm.password" style="width: 80%;" prefix-icon='el-icon-lock'></el-input>
                </el-form-item>
                <el-form-item style="margin-left:120px;">
                  <el-button type="primary" @click="login">登入</el-button>
                  <el-button @click='onreset'>清空</el-button>
                </el-form-item>
              </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            loginrules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 13, message: '长度在 6 到 13 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
      login() {
        this.$refs.loginForm.validate(async valid => {
            if(!valid) return;
            const {data:res} =await this.$http.post('login',this.loginForm)
            if(res.meta.status!==200) return this.$message.error('登陆失败')
            this.$message.success('登陆成功')
            // console.log(res);
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
        })
      },
      onreset() {
        this.$refs.loginForm.resetFields();
      }
    },
    directives:{
        focus:{
		    inserted(el){
                el.children[0].focus()
		    }
        }
    }   
}
</script>

<style lang="less" scoped>
    .father{
        background-color:steelblue;
        height: 100%;
    }
    .conter{
        width: 500px;
        height: 300px;
        background-color: white;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .logo{
        width: 150px;
        height: 150px;
        background-color: white;
        border-radius: 180px;
        overflow: hidden;
        z-index: 1;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-160%);
    }
    .logo img{
        width: 100%;
        height: 100%;
    }
    .conter form{
        margin:80px 40px;
    }
</style>
