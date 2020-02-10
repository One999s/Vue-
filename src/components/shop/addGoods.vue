<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
          </el-breadcrumb>
          <el-card>
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
              </el-steps>
              <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="options"
                            placeholder="请选择三级商品分类"
                            :props="selectProps"
                            clearable
                            @change="selectChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item) in manyData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="check" v-for="(check,index) in item.attr_vals" :key="index" border ></el-checkbox>
                              </el-checkbox-group>
                          </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="(item) in onlyData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        :action="uploadURL"
                        :headers="headersObj"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"
                                        ref="myQuillEditor"
                                        >
                        </quill-editor>
                        <el-button style="margin-bottom: 12px; float:right" @click="addGoods">提交</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
          </el-card>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex:"0",
            addForm:{
                goods_name:'',
                goods_cat:'',
                goods_price:'',
                goods_number:'',
                goods_weight:'',
                goods_cat:[],
                pics:[],
                attrs:[],
                goods_introduce:''
            },
            options:[],
            selectProps:{
                label:'cat_name',
                value:'cat_id',
            },
            addRules:{
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
                ]
            },
            manyData:[],
            onlyData:[],
            //图片上传地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传请求头
            headersObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
        }
    },
    created() {
        this.getCateList()
    },
    computed: {
        cateId(){
            if(this.addForm.goods_cat.length==3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    methods: {
        async getCateList(){
            const {data:res} =await this.$http.get(`categories`)
            this.options = res.data
            console.log(res);
        },
        selectChange(val){
            this.addForm.goods_cat = val
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat = []
            }
        },
        beforeLeave(activename,oldActivename){
            if(this.activeIndex=='0' && this.addForm.goods_cat.length!==3){
                this.$message.error('请选择商品分类')
                return false
            }
        },
        async tabClick(){
            if(this.activeIndex == '1'){
                const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                res.data.forEach((item)=>{
                    item.attr_vals = item.attr_vals.length==0 ? []:item.attr_vals.split(' ')
                })
                this.manyData = res.data
            }else if(this.activeIndex == '2'){
                const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                if(res.meta.status!==200){return this.$message.error(res.meta.msg)}
                this.onlyData = res.data
                console.log(res);
            }
        },
         //移除图片
        handleRemove(file, fileList) {
            const filePath = file.response.data.tmp_path
            //查找索引
            const i = this.addForm.pics.findIndex((x) => 
              x.pic==filePath);
            this.addForm.pics.splice(i,1)
            console.log(this.addForm);
        },
       //处理图片上传的预览
        handlePreview(file) {
            
        },
        //图片上传成功后的操作
        handleSuccess(response){
            //拼接图片信息对象
            const picInfo = {
                pic:response.data.tmp_path
            }
            //push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
        },
        //提交
        addGoods(){
            this.$refs.addFormRef.validate(async (valid)=>{
                if(!valid){
                    return this.$message.error("必填项未填写，请检查")
                }
                //深拷贝
                const addData = _.cloneDeep(this.addForm)
                addData.goods_cat = addData.goods_cat.join(',')
                //动态参数
                this.manyData.forEach(item=>{
                    const newAttrs = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newAttrs)
                    
                })
                // 静态参数
                this.onlyData.forEach(item=>{
                    const newAttrs = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newAttrs)
                    
                })
                addData.attrs = this.addForm.attrs
                const{data:res} = await this.$http.post('goods',addData)
                console.log(res);
                if(res.meta.status!=201){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.$router.go(-1)
                })
            
        }
    },
}
</script>

<style scoped>
.el-checkbox{
    margin: 0 10px 0 0 !important;
}
</style>