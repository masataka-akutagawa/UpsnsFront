<template>
  <div v-if = !isloding>
    <h1>通知一覧</h1>
      <v-row justify="center">
        <v-col cols="7">
          <v-banner
            v-for="reply of displayNotification"
            :key="reply.id"
            lines="one"
            icon="mdi-account-circle"
            color="indigo"
            class="my-4 material-icons large-size"
            >
            <v-banner-text>
              {{ reply.article.title }}に
              {{ reply.user.name }}がコメントしました
            </v-banner-text>
              <v-banner-text>
                {{ reply.insertTime }}
              </v-banner-text>
                <template v-slot:actions>
                  <v-btn
                    @click="sentArticle(reply.article.id)"
                  >
                    記事
                  </v-btn>
                </template> 
            </v-banner>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="Math.ceil(this.notifications.length / this.pageSize)"
              :total-visible="7"
              @update:modelValue="pageChange($event)"
            />
          </div>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import axios from 'axios';
  
export default {
  name: "NortificationList",
  data() {
    return {
      isLoading: Boolean,
      value: " ",
      menuText: "リプライ表示",
      article: Object,
      htmlData: String,
      replys: [],
      loading: false,
      notifications: [],
      page: 1,
      pageSize: 10,
      displayNotification: [],
    }
  },
  methods: {
     async sentArticle(articleId) {
      this.$router.push("/main-article?id=" + articleId);
     },
    pageChange(pageNumber) {
      this.displayNotification = this.notifications.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    const notifications = await axios.get(
    `${process.env.VUE_APP_API_BASE_UPL}/reply/notification/${this.$store.getters.getUserId()}`
    );
    this.notifications = notifications.data;
    this.displayNotification = this.notifications.slice(
      this.pageSize * (this.page - 1),
      this.pageSize * this.page
    );
    this.isLoading = false;
  },
}
</script>

<style>
.material-icons.large-size {
	font-size: 18px;
}
.mdi-account-circlemdi-v-icon-notranslate-v-theme--light-v-icon--size-defaul {
  size: 50;
}
</style>