<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom: 15px;">添加商品</el-button>
        <tree-table :data="cateData" style="width: 100%" :columns="columns">

        </tree-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
        return {
            queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 6
        },
        columns:[{
            lable:'分类名称'
        }]
        cateData: [{
          cat_name: '',
          cat_deleted: '',
          cat_level: ''
        }]
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('categories',{params: this.queryInfo})
        if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
        }
        this.cateData = res.data.result
        console.log(res);
      }
    },
  }

</script>

<style scoped>
</style>
