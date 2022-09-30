<template>
  <p class="link" @click="moveTo(createUrl)">{{ text }}</p>
</template>

<script>
export default {
  name: "GeneralLink",
  props: {
    text: String,
    href: String,
    params: {
      type: Object,
      default(rawProps) {
        return { ...rawProps };
      },
    },
  },
  computed: {
    createUrl() {
      let url = this.href;
      if (Object.keys(this.params).length != 0) {
        
        url += "?";
        Object.keys(this.params).forEach((element, index) => {
          if (index !== 0) {
            url += "&";
          }
          url += `${element}=${this.params[element]}`;
        });
      }
      return url;
    }
  },
  methods:{
    moveTo(url){
      this.$router.push(url);
    }
  }

};
</script>

<style>
.link {
  cursor: pointer;
}
</style>