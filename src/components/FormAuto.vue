<template>
  <el-form
    class="form-auto"
    ref="form"
    :model="form"
    label-width="80px"
    size="mini"
  >
    <el-form-item v-for="attr in attrs" :key="attr.name" :label="attr.title">
      <!-- 文本输入框 -->
      <el-input
        class="attr-item"
        v-if="attr.type == 'text'"
        v-model="form[attr.name]"
        :disabled="attr.disabled"
      ></el-input>
      <!-- 选择器 -->
      <el-select
        class="attr-item"
        v-if="attr.type == 'select'"
        v-model="form[attr.name]"
        :disabled="attr.disabled"
      >
        <el-option
          v-for="op in attr.option"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    form: Object,
    attrs: Array
  }
};
</script>
<style scoped>
.form-auto {
  padding-right: 20px;
}
.attr-item {
  width: 100%;
}
</style>
