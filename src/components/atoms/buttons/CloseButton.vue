<template>
  <v-btn
    class="edit"
    :height="height"
    :width="width"
    :color="buttonColor"
    icon
    @click="onClick"
  >
    <v-icon>mdi-close</v-icon>
  </v-btn>
</template>
  
  <script>
export default {
  name: "close-button",
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
  },
  computed: {
    buttonColor() {
      return this.color ? this.color : "white";
    },
  },
};
</script>
  
<style>
.edit {
    box-shadow: none;
}
</style>