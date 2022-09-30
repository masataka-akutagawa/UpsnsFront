<template>
  <v-btn
    :height="height"
    :width="width"
    :color="buttonColor"
    :disabled="disabled"
    v-bind="menuProps"
    @click="onClick"
  >
    {{ buttonText }}
  </v-btn>
</template>

<script>
export default {
  name: "general-button",
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
    disabled: {
      type: Boolean,
      default: false,
    },
    menuProps: { }
  },
  computed: {
    buttonColor() {
      return this.color ? this.color : "white";
    },
  },
};
</script>

<style>
.general_button {
  border: solid 1px #333;
  padding: 0px;
  font-weight: bold;
  text-align: center;
}
</style>