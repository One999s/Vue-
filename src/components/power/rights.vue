<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-table :data="rightsList" border style="width: 100%"  >
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center">
        </el-table-column>
        <el-table-column prop="path" label="路径" align="center">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
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
        rightsList: [{
          authName: '',
          path: '',
          level: ''
        }]
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
        async getRightsList(){
        const {
          data: res
        } = await this.$http.get('rights/list')
        console.log(res);
        this.rightsList = res.data
      }
    },
  }

</script>

<style lang="less" scoped>
  .el-card {
    margin-top: 20px;
  }

</style>
