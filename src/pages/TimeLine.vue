<template>
  <v-container fluid fill-height>
    <v-row no-gutters class="py-sm-8">
      <v-col sm="3" class="pt-sm-11">
        <search-form class="following" />
      </v-col>

      <v-col sm="9" class="py-8 px-10">
        <ul>
          <li
            class="timeLine_main"
            v-for="content in displayList"
            :key="content.article.id"
          >
            <v-sheet color="white">
              <v-row no-gutters>
                <v-col cols="3" md="1">

                  <v-avatar size="60" color="indigo">
                    <v-icon size="60" dark> mdi-account-circle </v-icon>
                  </v-avatar>

                </v-col>
                <v-col cols="9" md="11">
                  <v-row no-gutters class="pl-3 pt-2">
                    <general-link
                      id="user_name_size"
                      :params="{ id: content.article.user.id }"
                      :href="'/others-page'"
                      :text="content.article.user.name"
                    />
                  </v-row>
                  <v-row no-gutters class="pl-3 mt-3">
                    <h1 class="text-xs-h6 text-md-h5 text-lg-h4">
                      <general-link
                        :params="{ id: content.article.id }"
                        :href="'/main-article'"
                        :text="content.article.title"
                      />
                    </h1>
                  </v-row>

                  <!--タグの表示-->
                  <v-row no-gutters class="pr-10" justify="end">
                    <v-chip-group>
                      <v-chip
                        v-for="tag in content.article.tags"
                        :key="tag.id"
                        label
                        class="pa-3"
                      >
                        <general-link
                          :params="{ searchType: 0, word: tag.name }"
                          :href="'/search'"
                          :text="'#' + tag.name"
                        />
                      </v-chip>
                    </v-chip-group>
                  </v-row>

                  <!-- リプライ件数表示ボタン -->
                  <v-row no-gutters class="pl-3">
                    <v-col cols="4">
                      <v-card-actions class="justify-center">
                        <replycount-button
                          :color="color"
                          :height="40"
                          :width="40"
                          @button-click="moveReply(content.article.id)"
                          :replyCount="content.replyCount"
                        />
                        {{ content.replyCount }}
                      </v-card-actions>
                    </v-col>

                    <!--保存ボタン-->
                    <v-col cols="4">
                      <v-card-actions class="justify-center">
                        <plus-button
                          :color="color"
                          :height="40"
                          :width="40"
                          @button-click="
                            saveOrDelete(content.article.id, content.isFavorite)
                          "
                          :isFavorite="content.isFavorite"
                        />
                      </v-card-actions>
                    </v-col>
                  </v-row>

                  <v-row class="justify-end mr-3">
                    <p>{{ content.article.insertTime }}</p>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </li>
        </ul>
      </v-col>
    </v-row>

    <!--ページ送り-->
    <v-row no-gutters>
      <v-col cols="12">
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="Math.ceil(this.articles.length / this.pageSize)"
            :total-visible="7"
            @update:modelValue="pageChange($event)"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import SearchForm from "../components/molecules/SearchForm.vue";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import PlusButton from "../components/atoms/buttons/PlusButton.vue";
import ReplyCountButton from "../components/atoms/buttons/ReplyCountButton.vue";

export default {
  components: {
    "general-link": GeneralLink,
    "search-form": SearchForm,
    "plus-button": PlusButton,
    "replycount-button": ReplyCountButton,
  },
  name: "TimeLine",
  data() {
    return {
      height: 40,
      width: 100,
      articles: [],
      replys: [],
      displayList: [],
      page: 1,
      pageSize: 10,
      userId: Number,
      isFavorite: Boolean,
      replyCount: Number,
    };
  },
  methods: {
    async moveReply(articleId) {
      this.$router.push("/main-article?id=" + articleId);
    },
    //ログインしてる情報に基づいてログインユーザーのfavoriteテーブルに記事を保存
    async saveOrDelete(articleId, isFavorite) {
      this.userId = this.$store.getters.getUserId();
      if (isFavorite) {
        const res = await axios.get(
          `${process.env.VUE_APP_API_BASE_UPL}/favorite/seachByIds/` +
            articleId +
            "/" +
            this.userId
        );
        const favArt = res.data;
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_UPL}/favorite/` + favArt.id
        );
      } else {
        await axios.post(`${process.env.VUE_APP_API_BASE_UPL}/favorite`, {
          articleId: articleId,
          pushUserId: this.userId,
        });
      }
      await this.init();
    },
    pageChange(pageNumber) {
      this.displayList = this.articles.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
      this.$store.commit("updatePageNumber", pageNumber);
      scrollTo(0, 0);
    },
    async init() {
      this.userId = this.$store.getters.getUserId(); //1
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/article/timeline/${this.userId}`
      );
      this.articles = res.data;
      //this.length = Math.ceil(this.articles.length/this.pageSize);
      this.page = this.$store.getters.getPageNumber();
      this.displayList = this.articles.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style>
/*searchFormの追従機能*/
.following {
  border-radius: 13px;
  padding: 1rem;
  margin-left: 1rem;
  position: sticky;
  top: 80px;
  max-height: 90vh;
}
.timeLine_main {
  list-style-type: none;
  outline: rgb(235, 235, 235) solid 1px;
  padding: 1em 1em 1em 0;
}
#user_icon_size {
  width: 70%;
  aspect-ratio: 1 / 1;
}
#user_name_size {
  font-size: 20px;
}
#general-link {
  text-align: left;
}
#border {
  border-top: 3px solid #666666;
}
.text-center {
  text-align: center;
  margin-top: 20px;
}
</style>