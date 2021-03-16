<template>
  <div class="hw" id="hwid">
    <div id="item_left" class="item"></div>
    <div id="item_right" class="item" style="left:100px;"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      jsPlumb.ready(() => {
        // jsPlumb.importDefaults({
        //   ConnectionsDetachable: false
        // });
        jsPlumb.setContainer("hwid");

        var common = {
          isSource: true,
          isTarget: true,
          endpoint: "Dot",
          connector: ["Bezier"],
          maxConnections: -1,
          anchor: "Continuous",
          paintStyle: { stroke: "green", strokeWidth: 2 },
          endpointStyle: {
            fill: "red",
            outlineStroke: "blue",
            outlineWidth: 2
          },

          overlays: [["Arrow", { width: 10, length: 10, location: 0.5 }]]
        };
        // jsPlumb.connect(
        //   {
        //     source: "item_left",
        //     target: "item_right"
        //   },
        //   common
        // );
        jsPlumb.addEndpoint("item_left", {}, common);
        jsPlumb.addEndpoint("item_left", {}, common);
        jsPlumb.addEndpoint("item_right", {}, common);
        jsPlumb.draggable("item_left", { containment: "parent" });
        jsPlumb.draggable("item_right", { containment: "parent" });
      });
    }
  }
};
</script>
<style scoped>
.hw {
  position: absolute;
  width: 800px;
  height: 800px;
  border: 1px solid black;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
}
.item {
  position: absolute;
  width: 50px;
  height: 50px;
  /* background-color: green; */
  border: 1px solid green;
}
</style>
