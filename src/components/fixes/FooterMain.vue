<template>
    <v-footer class="v_footer">
      <v-row justify="center" no-gutters>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          <v-btn
            class="space"
            @click="toHome"
          >Home</v-btn>
          <!-- <router-link to="/time-line">Home</router-link> -->

          <v-btn>
            <home-page-link
              :href="href2" 
              :text="text2"
            />
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
</template>

<script>
import HomePageLink from "../atoms/links/HomePageLink.vue";
export default {
  name: "footer-main",
  components: { 
    "home-page-link": HomePageLink,
  },
  data() {
    return {
      value: " ",
      text: "Home",
      href2: "https://www.upload-gp.co.jp/",
      text2: "アップロードホームページ",
    }
  },
  methods: {
    toHome() {
      this.$router.push("/time-line");
    },
  }
};
</script>

<style>
.v_footer {
  background-color: rgba(0, 41, 78, 1) !important;
  color: #000000 !important;
}
.space {
  margin-right: 10px;
}
</style>