<template>
  <div
    ref="nodeRef"
    class="node-item"
    :style="nodeItemStyle"
    @click="nodeClick"
    @mouseup="changeNodePostion"
  >
    <div class="node-drag"></div>
    <div class="node-name">{{ node.name }}</div>
  </div>
</template>
<script>
export default {
  props: {
    node: Object
  },
  computed: {
    nodeItemStyle() {
      return {
        top: this.node.top,
        left: this.node.left
      };
    }
  },
  methods: {
    changeNodePostion() {
      this.$emit("changeNodePostion", {
        nodeId: this.node.id,
        left: this.$refs.nodeRef.style.left,
        top: this.$refs.nodeRef.style.top
      });
    },
    nodeClick() {
      this.$emit("nodeClick", this.node);
    },
    nodeRightClick(evt) {
      this.$emit("nodeRightClick", evt, this.node);
    }
  }
};
</script>
<style scoped>
/* 节点样式 */
.node-item {
  position: absolute;
  width: 200px;
  height: 40px;
  border: 1px solid #bdbdbd;
  cursor: move;
  line-height: 40px;
  border-radius: 5px;
  border-left: none;
  overflow: hidden;
  background-color: #fff;
  font-size: 14px;
}
/* 点击可连线区域样式 */
.node-drag {
  /* width: 100%;
  height: 5px; */
  width: 5px;
  height: 100%;
  background-color: #409eff;
  position: absolute;
  top: 0;
  left: 0;
}

.node-drag:hover {
  cursor: crosshair;
}
.node-name {
}
</style>
