<template>
  <div class="node-menu">
    <draggable
      v-model="menuList"
      :options="dragOptions"
      @start="start"
      @end="end"
    >
      <div
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        :type="item.type"
      >
        {{ item.name }}
      </div>
    </draggable>
  </div>
</template>
<script>
import Draggable from "vuedraggable";
import menuList from "./menu-list.js";
import { uuid, deepCopy } from "@/components/utils.js";
export default {
  components: {
    Draggable
  },
  data() {
    return {
      dragOptions: {
        sort: false,
        disabled: false,
        preventOnFilter: false,
        ghostClass: "tt",
        forceFallback: true
        // fallbackClass: "menu-item-moving"
      },
      menuList: menuList,
      tmpNode: {}
    };
  },
  methods: {
    findMenuItem(type) {
      for (let i = 0; i < this.menuList.length; i++) {
        let item = this.menuList[i];
        if (item.type == type) {
          return deepCopy(item);
        }
      }
    },
    start(evt) {
      let type = evt.item.attributes.type.nodeValue;
      this.tmpNode = this.findMenuItem(type);
      // 生成默认属性
      for (let i = 0; i < this.tmpNode.attrs.length; i++) {
        let attr = this.tmpNode.attrs[i];
        if (!this.tmpNode[attr.name]) {
          this.tmpNode[attr.name] = attr.default;
        }
      }
      delete this.tmpNode["attrs"];
      // 生成新id
      this.tmpNode.id = uuid();
      // 添加坐标
      this.tmpNode.width = evt.item.clientWidth;
      this.tmpNode.height = evt.item.clientHeight;
      console.log("start", this.tmpNode);
    },
    end(evt, e) {
      console.log("end");
      this.$emit("addNode", evt, this.tmpNode);
    }
  }
};
</script>
<style scoped>
.node-menu {
}
.menu-item {
  width: 200px;
  height: 40px;
  border: 1px dashed #bdbdbd;
  line-height: 40px;
  margin: 10px;
  cursor: move;
  font-size: 14px;
  border-radius: 5px;
}
</style>
