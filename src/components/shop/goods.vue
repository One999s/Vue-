<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          </el-breadcrumb>

          <el-card class="box-card">
              <!-- 添加 -->
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable style="width: 250px;" @clear="getGoodsList()">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
              </el-input>
            <el-button type="primary" @click="addPath" style="margin-left: 10px;">添加商品</el-button>
            <!-- 编辑 -->
            <el-dialog
            title="编辑商品"
            :visible.sync="dialogVisibleEdit"
            width="30%">
            <el-form :model="editForm" :rules="goodsRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品名称 :" prop="goods_name">
                  <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="价格 :" prop="goods_price">
                  <el-input v-model="editForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="数量 :" prop="goods_number">
                    <el-input v-model="editForm.goods_number"></el-input>
                  </el-form-item>
                  <el-form-item label="重量 :" prop="goods_weight">
                    <el-input v-model="editForm.goods_weight"></el-input>
                  </el-form-item>
              </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
            </span>
            </el-dialog>
            <template>
                <el-table
                  :data="goodsData"
                  border
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="#"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="goods_price"
                    label="价格"
                    align="center"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="goods_number"
                    label="数量"
                    align="center"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="goods_weight"
                    label="重量"
                    align="center"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="goods_state"
                    label="状态"
                    align="center"
                    width="80">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.goods_state==0">未通过</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.goods_state==1">审核中</el-tag>
                        <el-tag type="success" v-else>已审核</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="hot_mumber"
                    label="热销品数量"
                    align="center"
                    width="80">
                  </el-table-column>
                  <el-table-column
                  prop="add_time"
                  label="添加时间"
                  align="center">
                  <template slot-scope="scope">
                      {{scope.row.add_time | dateFormat}}
                  </template>
                </el-table-column>
                  <el-table-column
                    prop="is_promote"
                    label="是否是热销品"
                    align="center"
                    width="80"
                    >
                  <template slot-scope="scope">
                      <div>
                        <el-tag type="success" v-if="scope.row.is_promote">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                      </div>
                  </template>
                  </el-table-column>
                  <el-table-column
                  label="操作"
                  align="center"
                  width="178"
                  >
                  <template slot-scope="data">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(data.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(data.row)">删除</el-button>
                  </template>
                </el-table-column>
                </el-table>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[4, 10, 20, 30]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
              </template>
          </el-card>
    </div>
</template>

<script>
export default{
    data() {
        return {
            goodsData:[],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:3
            },
            total:0,
            dialogVisibleEdit:false,
            editForm:{
                goods_name:'',
                goods_price:'',
                goods_number:'',
                goods_weight:''
            },
            goodsRules:{
                goods_name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                ],
                goods_price:[
                { required: true, message: '请输入商品价格', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                goods_number:[
                { required: true, message: '请输入商品数量', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                goods_weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ], 
                goods_cat:[
                { required: true, message: '请选择商品分类', trigger: 'blur' },
                { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ]
            },
            searchGoods:''
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            this.goodsData = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(val){
            this.queryInfo.pagesize = val
            this.getGoodsList()
        },
        handleCurrentChange(val){
            this.queryInfo.pagenum = val
            this.getGoodsList()
        },
        addPath(){
            this.$router.push('/goods/add')
        },
        selectChange(val){
            console.log(val);
        },
        editDialog(val){    
            this.dialogVisibleEdit = true
            this.editForm = val
            this.editForm.goods_id = val.goods_id
            // this.editForm.goods_name = val.goods_name
            // this.editForm.goods_price = val.goods_price
            // this.editForm.goods_number = val.goods_number
            // this.editForm.goods_weight = val.goods_weight
        },
        async editGoods(){
          const {data:res} = await this.$http.put(`goods/${this.editForm.goods_id}`,this.editForm) 
          console.log(res);
        },
         deleteGoods(val){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            const {data:res} = await this.$http.delete(`goods/${val.goods_id}`)
            if(res.meta.status!==200){
                this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getGoodsList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
    },
}
</script>

<style scoped>
    .el-table{
        margin-top: 10px;
    }
</style>