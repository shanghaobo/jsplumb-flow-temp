<template>
  <div class="main-panel">
    <div class="node-menu-div">
      <node-menu @addNode="addNode"></node-menu>
    </div>
    <div ref="panelRef" class="panel-div" id="panel-div-id">
      {{ data }}
      <node-item
        v-for="node in data.nodeList"
        :id="node.id"
        :key="node.id"
        :node="node"
        :class="{
          'active-node-item': activeType == 'node' && node.id == activeNode.id
        }"
        @nodeClick="nodeClick"
        @changeNodePostion="changeNodePostion"
      ></node-item>
    </div>
    <node-attr
      :node="activeNode"
      :line="activeLine"
      :type="activeType"
      @deleteActive="deleteActive"
    ></node-attr>
  </div>
</template>
<script>
import NodeMenu from "./NodeMenu";
import NodeItem from "./NodeItem";
import NodeAttr from "./NodeAttr";
import { uuid, deepCopy } from "./utils.js";
import { easyFlowMixin } from "./mixins";
export default {
  mixins: [easyFlowMixin],
  components: {
    NodeMenu,
    NodeItem,
    NodeAttr
  },
  data() {
    return {
      jsPlumb: null,
      data: {
        nodeList: [],
        lineList: []
      },
      loadLineFinished: false,
      activeNode: {},
      activeLine: {},
      activeType: "",
      attrShow: false,
      mouseX: 0,
      mouseY: 0
    };
  },
  mounted() {
    // this.initData();
    this.jsPlumb = jsPlumb.getInstance();
    this.init();
  },
  methods: {
    initData() {
      let id1 = uuid();
      let id2 = uuid();
      let id3 = uuid();
      this.data.nodeList.push({
        id: id1,
        name: "新增节点1",
        left: "20px",
        top: "20px"
      });
      this.data.nodeList.push({
        id: id2,
        name: "新增节点2",
        left: "160px",
        top: "100px"
      });
      this.data.nodeList.push({
        id: id3,
        name: "新增节点3",
        left: "220px",
        top: "320px"
      });
      this.data.lineList.push({
        from: id1,
        to: id3
      });
    },
    init() {
      console.log("init start");
      this.jsPlumb.ready(() => {
        console.log("this.jsPlumb ready");
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        this.jsPlumb.setContainer("panel-div-id");
        this.$nextTick(() => {
          this.loadNode();
          this.loadLine();
        });
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind("click", (conn, originalEvent) => {
          console.log("click ", conn);
          this.activeType = "line";
          this.activeLine = {
            from: conn.sourceId,
            to: conn.targetId
          };
        });
        // 连线
        this.jsPlumb.bind("connection", evt => {
          let from = evt.source.id;
          let to = evt.target.id;
          if (this.loadLineFinished) {
            this.data.lineList.push({
              from: from,
              to: to
            });
          }
        });
        // 删除连线回调
        this.jsPlumb.bind("connectionDetached", evt => {
          console.log("删除连线", evt);
          for (let i = 0; i < this.data.lineList.length; i++) {
            if (
              this.data.lineList[i].from == evt.sourceId &&
              this.data.lineList[i].to == evt.targetId
            ) {
              this.data.lineList.splice(i, 1);
              break;
            }
          }
        });
        // 连线右击
        this.jsPlumb.bind("contextmenu", evt => {
          console.log("连线右击", evt);
        });
        // 连线前
        this.jsPlumb.bind("beforeDrop", evt => {
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            this.$message.warning("节点不能自连接");
            return false;
          }
          console.log("连线前", evt);
          return true;
        });
      });
    },
    // 初始化节点
    loadNode() {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        console.log("node=", node);
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbTargetOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        this.jsPlumb.draggable(node.id, {
          containment: "parent",
          stop: function(el) {
            // 拖拽节点结束后的对调
            console.log("拖拽结束: ", el);
          }
        });
      }
    },
    // 初始化连线
    loadLine() {
      for (let i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        let connParam = {
          source: line.from,
          target: line.to
        };
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
      }
      this.$nextTick(() => {
        this.loadLineFinished = true;
      });
    },
    // 添加节点
    addNode(evt, tmpNode) {
      console.log("addNode start");
      let screenX = evt.originalEvent.clientX;
      let screenY = evt.originalEvent.clientY;
      let left = screenX;
      let top = screenY;
      let panelRef = this.$refs.panelRef;
      var containerRect = panelRef.getBoundingClientRect();
      // 计算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        return;
      }
      left = left - containerRect.x + panelRef.scrollLeft;
      top = top - containerRect.y + panelRef.scrollTop;
      // 节点鼠标居中
      left = left - tmpNode.width / 2;
      top = top - tmpNode.height / 2;
      if (left < 0) {
        left = 0;
      }
      if (top < 0) {
        top = 0;
      }
      console.log("left=", left, "top=", top);
      let node = deepCopy(tmpNode);
      node.left = left + "px";
      node.top = top + "px";
      this.data.nodeList.push(node);
      this.$nextTick(() => {
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbTargetOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        this.jsPlumb.draggable(node.id, {
          containment: "parent",
          stop: function(el) {
            // 拖拽节点结束后的对调
            console.log("拖拽结束: ", el);
          }
        });
      });
    },
    // 节点位置改变（节点被拖动）
    changeNodePostion(data) {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id == data.nodeId) {
          if (node.left == data.left && node.top == data.top) {
            // 没有移动（点击）
            // this.attrShow = true;
            return;
          }
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    // 节点被点击
    nodeClick(node) {
      console.log("active", node);
      this.activeType = "node";
      this.activeNode = node;
      // this.attrShow = true;
    },
    // 删除选中
    deleteActive() {
      if (this.activeType == "line") {
        var conn = this.jsPlumb.getConnections({
          source: this.activeLine.from,
          target: this.activeLine.to
        })[0];
        this.jsPlumb.deleteConnection(conn);
        this.activeLine = {};
      } else if (this.activeType == "node") {
        for (let i = 0; i < this.data.nodeList.length; i++) {
          if (this.data.nodeList[i].id == this.activeNode.id) {
            this.data.nodeList.splice(i, 1);
            this.$nextTick(() => {
              this.jsPlumb.removeAllEndpoints(this.activeNode.id);
              this.activeNode = {};
            });
            break;
          }
        }
      }
    }
  }
};
</script>
<style scoped>
.main-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.node-menu-div {
  position: absolute;
  width: 240px;
  height: 100%;
  border-right: 1px solid #e0e0e0;
}
.panel-div {
  position: absolute;
  /* 250+320 */
  width: calc(100vw - 570px);
  height: 100%;
  left: 240px;
  top: 0;
}
.active-node-item {
  background-color: rgba(64, 158, 255, 0.1) !important;
  border: 1px dashed #409eff !important;
}
</style>
