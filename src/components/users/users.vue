<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            
          </el-breadcrumb>
          <el-card class="box-card">
            <el-row :gutter="20" class="el-row">
                <el-col :span="6">
                    <el-input placeholder="请输入用户姓名" v-model='usersInfo.query' class="input-with-select" clearable @clear="getUserList"> 
                        <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
                <el-col :span="12"></el-col>
              </el-row>

              <el-table
              :data="userList"
              border
              style="width: 100%">
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column
                prop="username"
                label="姓名"
                width="120px"
              >
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="电话">
              </el-table-column>
              <el-table-column
                prop="email"
                label="邮箱">
              </el-table-column>
              <el-table-column
                prop="role_name"
                label="角色">
              </el-table-column>
              <el-table-column
                prop="mg_state"
                label="状态">
                <template slot-scope="data"> <!--slot-scope用于接收当前组件的数据-->
                  <el-switch
                    v-model="data.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949" @change="switchChange(data.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="175px">
                <template slot-scope="data">
                  <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable='false'>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="userEdit(data.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable='false'>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="userDelete(data.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="assUser(data.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="usersInfo.pagenum"
              :page-sizes="[2, 6, 8, 10]"
              :page-size="usersInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-card>
          <!--添加用户-->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            @close="addDialogClose">
            <div class="adduserClass">
              <el-form ref="addUserForm" :model="addUser" label-width="80px" :rules="addrules">
                <el-form-item label="用户名 :" prop="username">   
                  <el-input v-model="addUser.username" style="width: 80%;" prefix-icon='el-icon-user' v-focus></el-input>
                </el-form-item>
                <el-form-item label="密码 :" prop="password">
                    <el-input type="password" v-model="addUser.password" style="width: 80%;" prefix-icon='el-icon-lock'></el-input>
                </el-form-item>
                <el-form-item label="邮箱 :" prop="email">   
                  <el-input v-model="addUser.email" style="width: 80%;" prefix-icon='el-icon-postcard'></el-input>
                </el-form-item>
                <el-form-item label="电话 :" prop="mobile">   
                  <el-input v-model="addUser.mobile" style="width: 80%;" prefix-icon='el-icon-phone'></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelAdd">取 消</el-button>
              <el-button type="primary" @click="addButton(addUser)">提 交</el-button>
            </span>
          </el-dialog>
          <!--编辑用户-->
          <el-dialog
            title="用户编辑"
            :visible.sync="dialogVisibleEdit"
            width="30%"
            :before-close="handleClose"
            @close="editDialogClose">
            <div class="adduserClass">
              <el-form ref="editUserForm" :model="editUser" label-width="80px" :rules="addrules">
                <el-form-item label="用户ID :" prop="id">   
                  <el-input v-model="editUser.id" style="width: 80%;" prefix-icon='el-icon-user' disabled v-focus></el-input>
                </el-form-item>
                <el-form-item label="电话 :" prop="mobile">
                  <el-input v-model="editUser.mobile" style="width: 80%;" prefix-icon='el-icon-phone'></el-input>
                </el-form-item>
                <el-form-item label="邮箱 :" prop="email">   
                  <el-input v-model="editUser.email" style="width: 80%;" prefix-icon='el-icon-postcard'></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelEdit">取 消</el-button>
              <el-button type="primary" @click="getEdit">提交</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
export default{
  data() {
      //验证邮箱的表达式
      var checkEmail = (rule,val,callback)=>{
        const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if(regEmail.test(val)){return callback()}
        callback(new Error('请输入正确的邮箱地址'))
      }
      var checkMobile = (rule,val,callback)=>{
        const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(regMobile.test(val)){
          return callback()
        }
        callback(new Error('请输入正确的手机号'))
      }
      return {
          usersInfo:{
            query:'',
            //当前的页数
            pagenum:1,
            //当前每页显示多少条
            pagesize:2
          },
          userList:[],
          total:0,
          dialogVisible: false,
          dialogVisibleEdit:false,
          addUser:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
          editUser:{
                username:'',
                email:'',
                mobile:''
            },
            addrules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 13, message: '长度在 6 到 13 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur'}
                ]
            }
      }
  },
  created() {
    this.getUserList()
  },
  methods: {
      getUserList:async function(){ 
        const {data:res} =await this.$http.get('users',{params:this.usersInfo})
        // console.log(res);
        if(res.meta.status !==200) return '获取数据失败'
        this.userList = res.data.users
        this.total = res.data.total
      },
      //监听每页显示多少条的变化
      handleSizeChange(val) {
        this.usersInfo.pagesize = val
        this.getUserList()
      },
      //监听页数变化
      handleCurrentChange(val) {
        this.usersInfo.pagenum = val
        this.getUserList()
      },
      //用了之后 v-model获取不到值,先注释了
      addDialogClose(){ 
        // this.$refs.addUserForm.resetFields()
      },
      editDialogClose(){
         //this.$refs.editUserForm.resetFields()
      },
      cancelEdit(){
        this.dialogVisibleEdit = false
        this.$refs.editUserForm.resetFields()
      },
      cancelAdd(){
        this.dialogVisible = false
        this.$refs.addUserForm.resetFields()
      },
     async switchChange(val){
        const {data:res}=await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
        if(res.meta.status!==200){
          val.mg_state = !val.mg_state
          return this.$message.error('用户状态更新失败')
        }
        this.$message.success('用户状态更新成功')
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      addButton:function(){
        console.log(this.addUser);
        this.$refs.addUserForm.validate(async (valid) => {
          if (valid) {
            this.dialogVisible = false
            const {data:res} = await this.$http.post('users',this.addUser)
            console.log(res);
            console.log(this.addUser);
            this.$message.success(res.meta.msg)
            this.dialogVisible = false
            this.getUserList()
            this.$refs.addUserForm.resetFields()//清空form表单
          } else {
            this.$message.error('请正确填写资料')
            return false;
          }
        })
      },
      userDelete:function(val){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} =await this.$http.delete(`users/${val.id}`)
        if(res.meta.status!==200){return this.$message.error(res.meta.msg)}
        this.$message.success(res.meta.msg)
        this.getUserList()
        console.log(res);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      userEdit:function(val){
          this.dialogVisibleEdit = true
          this.editUser.id = val.id
          this.editUser.email = val.email
          this.editUser.mobile = val.mobile
      },
      getEdit:function(){
        this.$refs.editUserForm.validate(async (valid) => {
          if (valid) {
            this.dialogVisibleEdit = false
            console.log(this.editUser.id);
            const {data:res} = await this.$http.put(`users/${this.editUser.id}`,this.editUser)
            if(res.meta.status!==200){return this.$message.error(res.meta.msg)}
            this.$message.success(res.meta.msg)
            this.getUserList()
          } else {
            this.$message.error('请正确填写资料')
            return false;
          }
        })
      },
      async assUser(data){
        //  const {data:res} =await this.$http.put(`users/${data.id}/role`)
        console.log(data);
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
.box-card{
    margin-top:10px;
}
.el-row{
    margin-bottom: 20px;
}
</style>