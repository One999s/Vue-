<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-button type="primary" style="margin-bottom: 15px;" @click="addCateDialog">添加分类</el-button>
          <tree-table ref="cateData" :data="cateData" style="width: 100%" :columns="columns" index-text="#" 
          :border="true"
          :show-header="true"
          :show-index="true"
          :tree-type="true"
          :expandType="false"
          :selectionType="false"
         >
        <template slot="isOk" slot-scope="tf">
          <i class="el-icon-success" v-if='tf.row.cat_deleted == true' style="color: green; font-size: 20px;"></i>
          <i class="el-icon-error" v-else style="color: red;font-size: 20px;"></i>
        </template>
         <template slot="caozuo" slot-scope="scope">
           <div>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCateDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
           </div>
         </template>
<<<<<<< HEAD
          </tree-table> 
=======
          </tree-table>
>>>>>>> goods_params
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[6, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination> 
             <!-- 分类添加 -->
           <el-dialog
           title="添加分类"
           :visible.sync="dialogVisibleAdd"
           width="30%"
           @close="closeAddCateForm">
           <el-form ref="addCateformRef" :rules="addRules" :model="addCateform" label-width="80px">
             <el-form-item label="分类名称" prop="cat_name">
               <el-input v-model="addCateform.cat_name"></el-input>
             </el-form-item>
             <el-form-item label="分类层级">
              <el-cascader ref="addSelect" :options="options" change-on-select="true" clearable :props="cascProps" v-model="addSelect" @change="addSelectChange"></el-cascader>
             </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisibleAdd = false">取 消</el-button>
             <el-button type="primary" @click="addCate">确 定</el-button>
           </span>
         </el-dialog>
          <!-- 分类编辑 -->
          <el-dialog
          title="编辑分类"
          :visible.sync="dialogVisibleEdit"
          width="30%">
          <el-form ref="EditCateform" :model="EditCateform" label-width="80px">
            <el-form-item label="分类Id" prop="cat_id">
              <el-input v-model="EditCateform.cat_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="EditCateform.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
          </span>
        </el-dialog>
      
      </el-card>
    </div>
  </template>
  
  <script>
    export default {
      data() {
          return {
          queryInfo: {
            pagenum: 1,
            pagesize: 6
          },
          cateData: [{
            cat_name: '',
            cat_deleted: '',
            cat_level: ''
          }],
          EditCateform:{
            cat_id:'',
            cat_name: '',
          },
          addCateform:{
            cat_pid:'',
            cat_name: '',
            cat_level:''
          },
          addRules:{
          cat_name: [
              { required: true, message: '请输入分类名称', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]},
          columns:[
            {
              label:'分类名称',
              prop:'cat_name'
          },{
              label:'是否有效',
              prop:'cat_deleted',
              type:'template',
              template:'isOk'
          },{
              label:'等级',
              prop:'cat_level'
          },
          {
            label:'操作',
            type:'template',
            template:'caozuo'
          }
        ],
        cascProps:{
          label:'cat_name',
          value:'cat_id',
          leaf:'cat_level'
        },
        options:[],
        addSelect:[],
        dialogVisibleEdit:false,
        dialogVisibleAdd:false,
        total:0
          }
      },
      created() {
          this.getCateList()
      },
      methods: {
        handleSizeChange(val){
          this.queryInfo.pagesize = val
          this.getCateList()
        },
        handleCurrentChange(val){
          this.queryInfo.pagenum = val
          this.getCateList()
        },
        closeAddCateForm(){
          
            this.addCateform.cat_pid=""
            this.addCateform.cat_name=""
            this.addCateform.cat_level=""
            this.addSelect =[]
            
        },
        async getCateList() {
          const {data: res} = await this.$http.get('categories',{params: this.queryInfo})
          if(res.meta.status!==200){
              return this.$message.error(res.meta.msg)
          }
          this.cateData = res.data.result
          console.log(res);
          this.total = res.data.total
        },
        async getSelectionList(){
          const {data:res} = await this.$http.get('categories',{params:{type:2}})
          this.options = res.data
        },
        editCateDialog(data){
          this.dialogVisibleEdit = true
          this.EditCateform.cat_id = data.cat_id
          this.EditCateform.cat_name =data.cat_name
          console.log(data);
        },
        async editCate(){
          var data = {cat_name:this.EditCateform.cat_name}
          const {data:res} = await this.$http.put(`categories/${this.EditCateform.cat_id}`,data)
          if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.dialogVisibleEdit = false
          this.getCateList()
          console.log(res);
        },
        deleteCate(data){
           this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const {data:res} = await this.$http.delete(`categories/${data.cat_id}`)
            if(res.meta.status!==200){
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getCateList()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
           
        },
        addSelectChange(){
          this.$refs.addSelect.dropDownVisible=false;
          // console.log(this.addSelect);
          if(this.addSelect.length>0){
            this.addCateform.cat_pid = this.addSelect[0]
            this.addCateform.cat_level = this.addSelect.length
          }else{
            this.addCateform.cat_pid = 0;
            this.addCateform.cat_level = 0;
          }
        },
         addCate(){
          this.$refs.addCateformRef.validate( async(valid)=>{
            if(valid){
              const {data:res} = await this.$http.post('categories',this.addCateform)
              if(res.meta.status!==201){
                return this.$message.error(res.meta.msg)
              }
              this.$message.success(res.meta.msg)
              this.getCateList()
              this.dialogVisibleAdd = false
            }
          })
        },
        addCateDialog(){
          this.dialogVisibleAdd = true
          this.getSelectionList()
        }
      },
    }
  
  </script>
  
  <style scoped>
  
  </style>
  