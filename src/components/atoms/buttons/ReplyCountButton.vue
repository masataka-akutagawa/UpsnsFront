<template>
  <v-btn
    :height="height"
    :width="width"
    :color="buttonColor"
    :replyCount="replyCount"
    icon
    @click="onClick"
  >
    <div v-if="replyCount == 0">
      <font-awesome-icon
        icon="fa-regular fa-comment"
        style="color: #a9a9a9"
        size="2x"
      />
    </div>
    <div v-else>
      <font-awesome-icon
        icon="fa-solid fa-comment"
        style="color: #16212c"
        size="2x"
      />
    </div>
  </v-btn>
</template>
  
  <script>
export default {
  name: "repltCountButton",
  methods: {
    onClick() {
      this.$emit("button-click");
    },
  },
  inheritAttrs: false,
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    color: {
      type: String,
    },
    replyCount: {
      type: Number,
    },
  },
  computed: {
    buttonColor() {
      return this.color ? this.color : "black";
    },
  },
};
</script>
  
  <style>
</style>