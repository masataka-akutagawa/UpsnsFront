<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center">
      <v-col sm="3" class="pt-sm-11">
        <search-form class="following" />
      </v-col>

      <v-col sm="9" class="py-8 px-10">
        <v-row no-gutters justify="center" class="mt-8">
          <h1>検索結果</h1>
        </v-row>

        <v-row no-gutters justify="center" class="my-3">
          <h3 id="space_top">{{ displayList.length }} 件見つかりました</h3>
        </v-row>

        <v-row no-gutters justify="center">
          <v-col cols="8">
            <v-divider inset></v-divider>
            <ul style="list-style: none">
              <li
                class="result-article"
                v-for="result in displayList"
                :key="result.id"
              >
                <v-row no-gutters class="my-5">
                  <v-col cols="2"></v-col>
                  <v-col cols="1">
                    <v-avatar size="60" color="indigo">
                      <v-icon size="60" dark> mdi-account-circle </v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col cols="1"></v-col>
                  <v-col cols="8">
                    <v-row no-gutters justify="start">
                      <general-link
                        id="user_name_size"
                        :params="{ id: result.article.user.id }"
                        :href="'/others-page'"
                        :text="result.article.user.name"
                      />
                    </v-row>

                    <v-row no-gutters justify="start" class="my-4">
                      <h1 class="text-xs-h6 text-md-h5 text-lg-h4">
                        <general-link
                          :text="result.article.title"
                          :href="'/main-article'"
                          :params="{ id: result.article.id }"
                        />
                      </h1>
                    </v-row>

                    <v-row no-gutters class="pr-10" justify="end">
                      <v-chip-group>
                        <v-chip
                          v-for="tag in result.article.tags"
                          :key="tag.id"
                          label
                        >
                          <general-link
                            :params="{ searchType: 0, word: tag.name }"
                            :href="'/search'"
                            :text="'#' + tag.name"
                          />
                        </v-chip>
                      </v-chip-group>
                    </v-row>

                    <v-row no-gutters class="pr-10" justify="end">
                      <v-card-actions class="justify-end">
                        <plus-button
                          :color="color"
                          :height="40"
                          :width="40"
                          @button-click="
                            saveOrDelete(result.article.id, result.isFavorite)
                          "
                          :isFavorite="result.isFavorite"
                        />
                      </v-card-actions>
                      <v-col cols="3"></v-col>
                    </v-row>

                    <v-row no-gutters justify="end">
                      <p>{{ result.article.insertTime }}</p>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider inset></v-divider>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters justify="center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(this.resultList.length / this.pageSize)"
        :total-visible="7"
        @update:modelValue="pageChange($event)"
      >
      </v-pagination>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import PlusButton from "../components/atoms/buttons/PlusButton.vue";
import SearchForm from "../components/molecules/SearchForm.vue";

export default {
  name: "SearchArticle",
  components: {
    "general-link": GeneralLink,
    "plus-button": PlusButton,
    "search-form": SearchForm,
  },
  data() {
    return {
      userId: Number,
      page: 1,
      pageSize: 10,
      displayList: [],
      resultList: [],
    };
  },
  methods: {
    async saveOrDelete(articleId, isFavorite) {
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
      console.log(pageNumber);
      this.displayList = this.resultList.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
    },
    async init() {
      this.userId = this.$store.getters.getUserId();
      this.resultList = await axios.post(
        `${process.env.VUE_APP_API_BASE_UPL}/article/search`,
        {
          term: this.$route.query.word,
          type: this.$route.query.searchType,
          userId: this.userId,
        }
      );
      this.displayList = this.resultList.data.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
  },
  async mounted() {
    this.init();
  },
};
</script>

<style>
.following {
  border-radius: 13px;
  padding: 1rem;
  margin-left: 1rem;
  position: sticky;
  top: 80px;
  max-height: 90vh;
}
</style>