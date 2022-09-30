<template>
  <input
    type="text"
    class="general-input"
    v-bind:value="value"
    :rules="nameRules"
    :placeholder="message"
    v-on:input="$emit('input', $event.target.value)"
    clearable
  />
</template>

<script>
export default {
  name: "GeneralInput",
  inheritAttrs: false,
  props: {
    message: {
      type: String,
      default: "hello",
    },
    value: {
      type: String,
      // default: "初期値",
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.general-input {
  display: inline-block;
  padding: 0;
  border-bottom: 1px solid #999;
  background: rgb(238, 240, 250);
  margin: 0.5em 0;
  height: 50px;
  width: 100%;
  text-indent: 1em;
}
input[type="button"],
input[type="text"],
input[type="submit"],
input[type="image"],
textarea {
  outline: none;
}
</style>