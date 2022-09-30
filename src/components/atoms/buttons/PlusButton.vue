<template>
  <v-btn
    :height="height"
    :width="width"
    :color="buttonColor"
    :isFavorite="isFavorite"
    icon
    @click="onClick"
  >
    <div v-if="isFavorite">
      <font-awesome-icon
        icon="fa-solid fa-star"
        style="color: #ffff00"
        size="2x"
      />
    </div>
    <div v-else>
      <font-awesome-icon
        icon="fa-regular fa-star"
        style="color: #a9a9a9"
        size="2x"
      />
    </div>
  </v-btn>
</template>
  
  <script>
export default {
  name: "plus-button",
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
    isFavorite: {
      type: Boolean,
      default: false,
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