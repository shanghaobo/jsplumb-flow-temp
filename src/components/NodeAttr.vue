<template>
  <div class="node-attr">
    <el-tabs type="border-card" class="node-attr-content">
      <el-tab-pane label="属性设置">
        <form-auto :form="otherValue" :attrs="otherAttrs"></form-auto>
        <form-auto
          v-if="type == 'node'"
          :form="node"
          :attrs="attrs"
        ></form-auto>
        <el-button type="danger" size="small" @click="deleteActive"
          >删除选中</el-button
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import menuList from "./menu-list.js";
import FormAuto from "./FormAuto";
export default {
  props: {
    node: Object,
    line: Object,
    type: {
      type: String,
      default: "node"
    }
  },
  components: {
    FormAuto
  },
  computed: {
    attrs() {
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].type == this.node.type) {
          return menuList[i].attrs;
        }
      }
      return [];
    },
    otherValue() {
      return { type: this.type };
    }
  },
  data() {
    return {
      otherAttrs: [
        {
          name: "type",
          title: "选中类型",
          type: "select",
          option: [
            {
              value: "line",
              label: "线"
            },
            {
              value: "node",
              label: "节点"
            }
          ],
          disabled: true
        }
      ]
    };
  },
  methods: {
    deleteActive() {
      this.$emit("deleteActive");
    }
  }
};
</script>
<style scoped>
.node-attr {
  position: absolute;
  right: 0;
  top: 0;
  width: 320px;
  height: 100%;
}
.node-attr-content {
  /* width: 100%; */
  position: absolute;
  height: calc(100% - 6px);
  top: 0;
  width: calc(100% - 6px);
  left: 0;
}
</style>
