<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrders()">
            <el-button slot="append" icon="el-icon-search" @click="getOrders()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderData" border style="width: 100%">
        <el-table-column label="#" type="index" align="center">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220" align="center">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="editDialog"></el-button>
            <el-button type="primary" icon="el-icon-setting" @click="dialogVisiblewuliu=true"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑 -->
      <el-dialog title="修改地址" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
        <el-form :model="adForm" :rules="adFormRules" ref="adForm" label-width="100px">
            <el-form-item label="省市区/县" prop="adress">
                <el-cascader
                v-model="adForm.adress"
                :options="options"
                @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="stree">
              <el-input v-model="adForm.stree"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOK">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流 -->
      <el-dialog title="物流进度" :visible.sync="dialogVisiblewuliu" width="30%">
            <span>暂无物流进度</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblewuliu = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisiblewuliu=false">确 定</el-button>
        </span>
      </el-dialog>
    
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
    import cityData from './citydata.js'
  export default {
    data() {
      return {
        orderData: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        dialogVisible: false,
        dialogVisiblewuliu:false,
        adForm:{
            adress:'',
            stree:''
        },
        adFormRules:{
            // adress: [
            //     { required: true, message: '请选择地址', trigger: 'blur' },
            //     { min: 3, max:15 , message: '长度在 2 到 15 个字符', trigger: 'blur' }
            // ],
            stree: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
            ],
          
        },
        cityData,
        options:[]
        
      }
    },
    created() {
      this.getOrders()
    },
    methods: {
      async getOrders() {
        const {
          data: res
        } = await this.$http.get('orders', {
          params: this.queryInfo
        })
        this.orderData = res.data.goods
        this.total = res.data.total
      },
      handleChange(){},
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getOrders()
      },
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getOrders()
      },
      editDialog(){
          this.dialogVisible=true
          this.options = this.cityData
      },
      editOK(){
          this.$refs.adForm.validate(valid=>{
              if(valid){
                  this.$message.success('修改地址成功')
                  this.dialogVisible = false
              }
          })
      },
      dialogClose(){
          this.$refs.adForm.resetFields()
      }
    },
  }

</script>

<style scoped>
  .el-table {
    margin-top: 20px !important;
  }

</style>
