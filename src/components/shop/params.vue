<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
          </el-breadcrumb>
          <el-card class="box-card">
            <el-alert
            title="注意:只允许为三级分类设置参数"
            type="warning"
            :closable="false"
            show-icon>
          </el-alert>
          <div class="select">
            <span>选择商品分类 : </span>
            <el-cascader ref="selectRef" :options="options" :props="selectProps" clearable @change="selectChange" v-model="selectModel"></el-cascader>
          </div>
          <!-- 标签页 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="buttonP" @click='dialogVisible=true'>添加参数</el-button>
                <el-table
                    :data="manyData"
                    style="width: 100%"
                    border>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item>
                                <el-tag
                                :key="item"
                                v-for="(item,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleTagClose(scope.row,index)"
                                >
                                {{item}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                    <el-table-column type="index" label="#" align="center"></el-table-column>
                    <el-table-column
                    label="参数名称"
                    prop="attr_name"
                    align="center"
                    >
                   
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="paramsDelete(scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="buttonP" @click='dialogVisible=true'>添加属性</el-button>
                <el-table
                    :data="onlyData"
                    style="width: 100%"
                    border>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item>
                                <el-tag
                                :key="item"
                                v-for="(item,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleTagClose(scope.row,index)"
                                >
                                {{item}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                    <el-table-column type="index" label="#" align="center"></el-table-column>
                    <el-table-column
                    label="属性名称"
                    prop="attr_name"
                    align="center"
                    >
                   
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="paramsDelete(scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
          </el-tabs>
          </el-card>
          <!-- 添加参数属性的对话框 -->
          <el-dialog
            :title="'添加'+titleChange"
            :visible.sync="dialogVisible"
            @close="dialogClose"
                width="30%">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleChange+' :'" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                      </el-form-item>
                  </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
              </span>
           </el-dialog>
           <!-- 编辑参数属性的对话框 -->
           <el-dialog
           :title="'编辑'+titleChange"
           :visible.sync="dialogVisibleEdit"
           @close="editDialogClose"
               width="30%">
               <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                 <el-form-item label="当前名称 :" prop="thisname">
                    <el-input v-model="editForm.thisname" disabled></el-input>
                  </el-form-item>
                <el-form-item label="更新名称 :" prop="attr_name">
                  <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
               </el-form>
             <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisibleEdit = false">取 消</el-button>
               <el-button type="primary" @click="editParams">确 定</el-button>
             </span>
          </el-dialog>
    </div>
</template>
<script>
export default{
    data() {
        return {
            options:[],
            selectProps:{
                label:'cat_name',
                value:'cat_id'
            },
            activeName:'many',
            selectModel:[],
            manyData:[],
            onlyData:[],
            buttonP:'',
            dialogVisible:false,
            dialogVisibleEdit:false,
            Ptitle:'',
            addForm:{
                attr_name:''
            },
            editForm:{
                thisname:'',
                attr_name:''
            },
            addFormRules:{
                attr_name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            attrid:'',
        }
    },
    created() {
        this.getSelectList()
    },
    computed: {
        cateId(){
            if(this.selectModel.length==3){
                return this.selectModel[2]
            }else{return null}
        },
        titleChange(){
            if(this.activeName=='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    },
    methods: {
        async getSelectList(){
            const {data:res} = await this.$http.get('categories')
            this.options = res.data
        },
        handleClick(tab, event) {
            console.log(tab, event);
            this.getCateGories()
        },
        selectChange(){
            //清空非三级分类
            if(this.selectModel.length!=3){
                this.selectModel = []
                this.manyData = []
                this.onlyData = []
                this.buttonP = true
                return
            }
            console.log(this.selectModel);
            this.buttonP = false
            this.getCateGories()
        },
        dialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        editDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
        async getCateGories(){
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            console.log(res);
            res.data.forEach((item)=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                this.dynamicTags = item.attr_vals
                item.inputValue = ''
                item.inputVisible = false
            })
            
            if(this.activeName == 'many'){
                this.manyData = res.data
            }else{
                this.onlyData = res.data
            }
            
        },
        addParams(){
            this.$refs.addFormRef.validate(async(valid)=>{
                if(valid){
                    this.dialogVisible = false
                    const {data:res} =await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    })
                    if(res.meta.status!==201){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.getCateGories()
                }
            })
        },
        paramsDelete(datas){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${datas.attr_id}`)
                if(res.meta.status!==200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getCateGories()
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        editDialog(val){
            this.dialogVisibleEdit = true
            this.editForm.thisname = val.attr_name
            this.attrid = val.attr_id
        },
        editParams(){
            this.$refs.editFormRef.validate(async (valid)=>{
                if(valid){
                    this.dialogVisibleEdit = false
                    var editData = {
                        attr_name:this.editForm.attr_name,
                        attr_sel:this.activeName
                    }
                    const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.attrid}`, editData)
                    if(res.meta.status!==200){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.getCateGories()
                }
            })
        },
         //tag标签
          handleInputConfirm(scope){
            console.log(scope);
            if(scope.inputValue.trim().length==0){
                scope.inputVisible = false;
                scope.inputValue = ''
                return
            }
            scope.attr_vals.push(scope.inputValue)
            scope.inputValue = ''
            scope.inputVisible = false;
            this.tagChange(scope)
            
        },
        async tagChange(scope){
            const {data:res} =await this.$http.put(`categories/${this.cateId}/attributes/${scope.attr_id}`,{
                attr_name:scope.attr_name,
                attr_sel:scope.attr_sel,
                attr_vals:scope.attr_vals.join(' ')
            })
            if(res.meta.status!==200){
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
        },
        showInput(scope){
            scope.inputVisible = true
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //删除标签参数
        handleTagClose(scope,index) {
            scope.attr_vals.splice(index,1)
            this.tagChange(scope)
      },
    },
}
</script>
<style scoped>
    .select{
        margin:20px 0;
    }
    .el-table{
        margin-top: 20px;
    }
    .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>