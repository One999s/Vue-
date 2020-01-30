<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="exit" class="exit">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px':'200px'">
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened='true'
            :collapse-transition='false'
            :collapse='isCollapse'>
            <div class="togglecollapse" @click="toggleCollapse">|||</div>
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconslist[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
                <el-menu-item :index="items.id+''" v-for="(items) in item.children" :key="items.id">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{items.authName}}</span>
                      </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
          </el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
    export default{
      data() {
          return {
              menulist:[],
              iconslist:{
                  '125':'el-icon-s-custom',
                  '103':'el-icon-key',
                  '101':'el-icon-shopping-bag-2',
                  '102':'el-icon-printer',
                  '145':'el-icon-s-marketing'
                },
                isCollapse:false
          }
      },
      created() {
          this.getMenuList()
      },
      methods: {
          exit:function(){
              window.sessionStorage.clear();
              this.$router.push('/login')
          },
         getMenuList:async function(){
             const {data:res} =await this.$http.get('menus')
             if(res.meta.status!==200) return this.$message.error(res.meta.msg)
             this.menulist = res.data
          },
          toggleCollapse:function(){
              this.isCollapse  = !this.isCollapse
          },
          handleOpen(key, keyPath) {
              console.log(key, keyPath);
              console.log(this.menulist)
          },
          handleClose(key, keyPath) {
              console.log(key, keyPath);
          }
      }
    }
</script>
<style lang="less" scoped>
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding-left: 0;
    div>img{width: 30px;margin-right:16px}
    div{display: flex;align-items: center;font-size: 20px;}
}
.el-aside{
    background-color:#545c64;
    .el-menu{border-right:none}
    .togglecollapse{
        width: 100%;
        background-color:#545c64;
        border:1px solid slategrey;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
        color: white;
    }
}
.el-container{
    height: 100%;
}
</style>