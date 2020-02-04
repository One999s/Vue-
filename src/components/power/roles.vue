<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" :body-style="{ padding: '15px' }">
      <el-row :gutter="20" class="el-row">
        <el-col :span="6">
          <el-input placeholder="请输入角色id" v-model='rolesList.id' class="input-with-select" clearable
            @clear="getRolesList">
            <el-button slot="append" icon="el-icon-search" @click='getRolesList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" style="margin-bottom: 15px;" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <!-- 角色添加 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%">
        <el-form ref="rolesForm" :model="rolesForm" label-width="80px" :rules="rolesRlues">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="addRoles">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 角色编辑 -->
      <el-dialog title="编辑角色" :visible.sync="dialogVisible1" width="30%">
        <el-form ref="editRolesForm" :model="editRolesForm" label-width="80px" :rules="rolesRlues">
          <el-form-item label="角色ID" prop="roleName">
            <el-input v-model="editRolesForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="editRoles(editRolesForm.id)">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="dialogVisible2" width="50%" @close="resetKey">
        <el-tree
          :data="dataTree"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="treeCheckedKey"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="cancelPower()">提 交</el-button>
        </span>
      </el-dialog>

      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="20" v-for="(item,index) in scope.row.children" :key="item.id"
              :class="['borderBottom',index==0 ? 'borderTop' : '']">
              <el-col :span="6">
                <el-tag closable @close="removePower(scope.row,item)">{{item.authName}}</el-tag> <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row v-for="(item1) in item.children" :key="item1.id"
                  :class="['borderBottom',index==0 ? 'borderTop' : '']">
                  <el-col :span="12">
                    <el-tag closable @close="removePower(scope.row,item1)">{{item1.authName}}</el-tag> <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <el-row v-for="(item2) in item1.children" :key="item2.id">
                      <el-col :span="24">
                        <el-tag :disable-transitions="false" closable @close="removePower(scope.row,item2)">{{item2.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="data">
            <div>
              <el-button type="primary" icon="el-icon-edit" @click="editDialog(data.row)">编辑</el-button>
              <el-button type="success" icon="el-icon-delete" @click=deleteRoles(data.row.id)>删除</el-button>
              <el-button type="warning" icon="el-icon-setting" @click='cancelPowerDialog(data.row)'>分配</el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rolesList: [{
          id: '',
          roleName: '',
          roleDesc: ''
        }],
        rolesForm: {
          roleName: '',
          roleDesc: ''
        },
        rolesRlues: {
          roleName: [{
              required: true,
              message: '请输入角色名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ]
        },
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2:false,
        editRolesForm: {
          id: '',
          roleName: '',
          roleDesc: ''
        },
        dataTree:[],
        roleId:'',
        treeCheckedKey:[],
        defaultProps:{
          children: 'children',
          label: 'authName'
        }
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      getRolesList: async function () {
        const {
          data: res
        } = await this.$http.get('roles')
        console.log(res);
        this.rolesList = res.data
      },
      addRoles: function () {
        this.$refs.rolesForm.validate(async (valid) => {
          if (valid) {
            this.dialogVisible = false
            const {
              data: res
            } = await this.$http.post('roles', this.rolesForm)
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getRolesList()
          } else {
            this.$message.error('请规范填写')
            return false;
          }
        });
      },
      editDialog(data) {
        this.dialogVisible1 = true
        this.editRolesForm = data
      },
      async editRoles(id) {
        const {
          data: res
        } = await this.$http.put(`roles/${id}`, this.editRolesForm)
        if (res.meta.status !== 200) {
          this.$message.error("编辑失败")
        }
        this.$message.success("编辑成功")
        this.dialogVisible1 = false
        this.getRolesList()
      },
      closeAddDialog() {
        this.dialogVisible = false
        this.$refs.rolesForm.resetFields()
      },
      deleteRoles(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {
            data: res
          } = await this.$http.delete(`roles/${id}`)
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error('删除失败')
          }
          this.$message.success(res.meta.msg)
          this.getRolesList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      removePower(data,idata){
         this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`roles/${data.id}/rights/${idata.id}`)
          if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          data.children = res.data
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      async cancelPowerDialog(ck){
        this.dialogVisible2 = true
        const {data:res} = await this.$http.get('rights/tree')
        this.dataTree = res.data
        this.getPowerKey(ck,this.treeCheckedKey)
        this.roleId = ck.id
        console.log(res);
      },
      async cancelPower(){
        const keys = [
          ...this.$refs.tree.getCheckedKeys(),
          ...this.$refs.tree.getHalfCheckedKeys()
      ]
        const keyStr = keys.join(',')
        const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr})
        if(res.meta.status!==200){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible2 = false
        this.getRolesList()
      },
      //递归
      getPowerKey(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item =>
          this.getPowerKey(item,arr)
        )
      },
      resetKey(){
        this.treeCheckedKey =[];
      }
    }
  }

</script>
<style lang="less" scoped>
  .el-tag {
    margin: 5px 0;
  }
  .el-row{
    display: flex;
    align-items: center;
  }
  .borderTop {
    border-top: 1px solid #eee;
  }

  .borderBottom {
    border-bottom: 1px solid #eee;
  }

</style>
