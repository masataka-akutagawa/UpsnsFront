<template>
    <v-btn 
      :height="height"
      :width="width"
      :color="buttonColor"
      @click="onClick"
      v-bind="vuetifyProps"
      icon
    >
      <v-icon size="45" dark> mdi-account-circle </v-icon>
    </v-btn>
</template>
  
<script>
  export default {
    name: 'avatar-button',
    methods: {
      onClick() {
        this.$emit('button-click')
      }
    },
    inheritAttrs: false,
    props: {
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
  /* .general_button {
    border: solid 1px #333;
    padding: 0px;
    font-weight: bold;
    text-align: center;
  } */
</style>