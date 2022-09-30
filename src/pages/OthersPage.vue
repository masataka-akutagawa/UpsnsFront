<template>
  <h1 id="page_name">プロフィール</h1>
  <div v-if="!isLoading">
    <div id="main_profile">
      <v-sheet color="white">
        <v-avatar size="100" color="indigo">
          <v-icon size="100" dark> mdi-account-circle </v-icon>
        </v-avatar>
        <v-list>
          <v-list-item>
            <p>{{ user.name }}</p>
          </v-list-item>
          <v-list-item>
            <p>{{ user.comment }}</p>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-sheet>
      <ul>
        <li id="my_article" v-for="article in articleList" :key="article.id">
          <v-sheet color="white">
            <h2 class="text-xs-h4 text-md-h4 text-lg-h4">
              <general-link
                :text="article.title"
                :href="'/main-article'"
                :params="{ id: article.id }"
              />
            </h2>
            <p>投稿日:{{ article.insertTime }}</p>
            <p v-if="article.updateTime != null">
              最終更新日:{{ article.updateTime }}
            </p>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-chip
                draggable
                v-for="tag in article.tags"
                color="primary"
                :key="tag.id"
              >
                <general-link
                  :params="{ searchType: 0, word: tag.name }"
                  :href="'/search'"
                  :text="'#' + tag.name"
                />
              </v-chip>
              <plus-button
                :color="color"
                :height="40"
                :width="40"
                @button-click="save(article.id)"
              />
              <v-btn>
                <v-icon>mdi-message-text</v-icon>
              </v-btn>
            </v-card-actions>
            <v-divider></v-divider>
          </v-sheet>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import PlusButton from "../components/atoms/buttons/PlusButton.vue";

export default {
  name: "OthersPage",
  components: {
    "general-link": GeneralLink,
    "plus-button": PlusButton,
  },
  data() {
    return {
      user: Object,
      articleList: Array,
      isLoading: Boolean,
    };
  },
  methods: {
    async save(articleId) {
      const res = await axios.post(
        `${process.env.VUE_APP_API_BASE_UPL}/favorite`, 
        {
          articleId: articleId,
          pushUserId: 6,
        },
      );
      this.keepArticle = res.data;
      alert("保存しました");
    },
  },
  async mounted() {
    this.isLoading = true;
    const user = axios.get(
      `${process.env.VUE_APP_API_BASE_UPL}/user/${this.$route.query.id}`
    );
    const articles = axios.get(
      `${process.env.VUE_APP_API_BASE_UPL}/article/user/${this.$route.query.id}`
    );
    let userRes;
    let articlesRes;
    [userRes, articlesRes] = await Promise.all([user, articles]);
    this.user = userRes.data;
    this.articleList = articlesRes.data;
    this.isLoading = false;
  },
};
</script>

<style>

</style>