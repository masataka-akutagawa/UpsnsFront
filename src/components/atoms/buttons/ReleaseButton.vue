<template>
  <v-btn 
    :height="height"
    :width="width"
    :color="buttonColor"
    @click="onClick"
    v-bind="vuetifyProps">
    {{ buttonText }}
  </v-btn>
</template>

<script>
export default {
  name: 'release-button',
  methods: {
    onClick() {
      this.$emit('button-click')
    }
  },
  inheritAttrs: false,
  props: {
     buttonText: {
      type: String, 
      required: true
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    color: {
      type: String
    },
    content: {
      type: Number
    },
    value: {
      type: String
    },
    vuetifyProps:{}

  },
  computed: {
    buttonColor(){
      return this.color?this.color:'white';
    }
  }
}
</script>


<style>
.release_button {
  border: solid 1px #333;
  padding: 0px;
  font-weight: bold;
  text-align: center;
}
</style>