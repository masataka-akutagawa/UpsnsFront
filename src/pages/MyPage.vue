<template>
  <v-container fluid fill-height>
    <div v-if="!isLoading">
      <v-row no-gutters justify="center">
        <h1 id="page_name">プロフィール</h1>
      </v-row>
      <v-row no-gutters justify="center" class="mt-5">
        <!-- <img "画像IDの挿入"> -->
        <!--ここに画像を入れる-->
        <v-avatar size="100" color="indigo">
          <v-icon size="100" dark> mdi-account-circle </v-icon>
        </v-avatar>

      </v-row>

      <v-row no-gutters justify="center" class="mt-5">
        <p>ユーザーID:{{ user.id }}</p>
      </v-row>

      <v-row no-gutters justify="center" class="mt-5">
        <h2 class="text-xs-h6 text-md-h5 text-lg-h4">{{ user.name }}</h2>
      </v-row>

      <v-row no-gutters justify="center" class="mt-5">
        <p>{{ user.comment }}</p>
      </v-row>

      <v-row no-gutters justify="center" class="mt-6">
        <!--プロフィール編集ボタン-->
        <general-button @button-click="edit()" :buttonText="buttonText" />
      </v-row>

      <v-row no-gutters justify="center" class="mt-5">
        <v-col cols="7">
          <v-divider inset></v-divider>
          <ul style="list-style: none">
            <li
              id="my_article"
              v-for="article in displayList"
              :key="article.id"
            >
              <v-row no-gutters justify="center">
                <h2 class="text-xs-h6 text-md-h5 text-lg-h4">
                  <general-link
                    :text="article.title"
                    :href="'/main-article'"
                    :params="{ id: article.id }"
                  />
                </h2>
              </v-row>

              <v-row justify="end" class="mt-3">
                <v-col cols="9" />
                <!--編集画面に移動-->
                <v-col cols="2">
                  <general-button
                    color="primary"
                    :buttonText="articleText"
                    @button-click="articleEdit(article.id)"
                  />
                </v-col>
                <v-col cols="1">
                  <!--削除ボタン-->
                  <delete-button @button-click="deleteArticle(article.id)" />
                </v-col>
              </v-row>
              <v-row no-gutters justify="end" class="mt-3">
                <p>投稿日時:{{ article.insertTime }}</p>
              </v-row>
              <div v-if="article.updateTime != null">
                <v-row no-gutters justify="end" class="mt-3">
                  <p>最終更新日時:{{ article.updateTime }}</p>
                </v-row>
              </div>
              <v-row no-gutters justify="end" class="mt-3">
                <v-chip-group>
                  <v-chip
                    label
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
                </v-chip-group>
              </v-row>
              <v-divider></v-divider>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="Math.ceil(this.articleList.length / this.pageSize)"
              :total-visible="7"
              @update:modelValue="pageChange($event)"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import GeneralButton from "../components/atoms/buttons/GeneralButton.vue";
import DeleteButton from "../components/atoms/buttons/Delete.button.vue";
export default {
  name: "OthersPage",
  components: {
    "general-link": GeneralLink,
    "general-button": GeneralButton,
    "delete-button": DeleteButton,
  },
  data() {
    return {
      buttonText: "編集",
      articleText: "記事編集",
      height: 28,
      width: 100,
      isLoading: Boolean,
      dialog: false,
      userId: Number, 
      user: Object, 
      articleList: [], 
      displayList: [],
      page: 1,
      pageSize: 5,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    articleEdit(id) {
      this.$router.push({
        path: "/new-post",
        query: {
          id: id,
          isEdit: true,
        },
      });
    },
    edit() {
      this.$router.push({
        path: "/profile-edit",
        query: {
          userId: this.user.id,
          name: this.user.name,
          furigana: this.user.furigana,
          mail: this.user.mail,
          tel_no: this.user.telNo,
          password: this.user.password,
          role: this.user.role,
          comment: this.user.comment,
        },
      });
    },
    async init() {
      this.userId = this.$store.getters.getUserId(); 
      //if文でセッション切れたときにログイン画面に飛ばす
      let token = this.$store.getters.getToken();
      this.isLoading = true;
      const user = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/user/${this.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const articles = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/article/user/${this.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let userRes;
      let articlesRes;
      [userRes, articlesRes] = await Promise.all([user, articles]);
      this.user = userRes.data;
      this.articleList = articlesRes.data;
      this.isLoading = false;

      this.displayList = this.articleList.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
    async deleteArticle(articleId) {
      var res = confirm("記事を削除しますか？");
      if (res == true) {
        // OKなら削除・キャンセルならなにも起きない
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_UPL}/article/${articleId}`
        );
        await this.init();
      }
    },
    pageChange(pageNumber) {
      this.displayList = this.articleList.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
      scrollTo(0, 0);
    },
  },
};
</script>

<style>
#my_article {
  background-size: cover;
  padding-top: 4%;
}
</style>