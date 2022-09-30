<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center" class="mt-8">
      <h1>保存記事一覧</h1>
    </v-row>

    <v-row no-gutters justify="center" class="mt-5">
      <v-col cols="6">
          <v-divider inset></v-divider>
          <ul style="list-style: none">
            <li
              id="favorite"
              v-for="favorite in favoriteList"
              :key="favorite.id"
            >
              <v-row no-getters justify="center" class=mt-4>
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
                      :params="{ id: favorite.article.user.id }"
                      :href="'/others-page'"
                      :text="favorite.article.user.name"
                    />
                  </v-row>
                
                  <v-row no-gutters justify="start" class="my-4">
                    <h1 class="text-xs-h6 text-md-h5 text-lg-h4">
                      <general-link
                        :text="favorite.article.title"
                        :href="'/main-article'"
                        :params="{ id: favorite.article.id }"
                      />
                    </h1>
                  </v-row>

                  <v-row no-gutters class="pr-10" justify="end">
                    <v-chip-group>
                      <v-chip
                        label
                        v-for="tag in favorite.article.tags"
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

                  <v-row no-gutters  justify="end">
                    <v-card-action>
                      <delete-button 
                        @button-click="deleteArticle(favorite.id)"
                      />
                    </v-card-action>
                  </v-row>

                  <v-row no-getters justify= "end" class="mt-5">
                    <p>{{ favorite.insertTime }}</p>
                  </v-row>
                </v-col>

              <v-divider inset></v-divider>
              </v-row>
            </li>
          </ul>
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="mt-5">
      <v-pagination
        v-model="page"
        :length="Math.ceil(this.favorites.length / this.pageSize)"
        :total-visible="7"
        @update:modelValue="pageChange($event)"
      />
    </v-row>
  </v-container>

</template>

<script>
import axios from "axios";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import DeleteButton from "../components/atoms/buttons/Delete.button.vue";
export default {
  name: "SaveArticle",
  components: {
    "general-link": GeneralLink,
    "delete-button": DeleteButton,
  },
  data() {
    return {
      height: 28,
      width: 100,
      hover: false,
      page: 1,
      pageSize: 5,
      userId: Number,
      favoriteList: [],
      favorites: [],
    };
  },
  methods: {
    pageChange(pageNumber) {
      this.favoriteList = this.favorites.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
      scrollTo(0, 0);
    },

    async deleteArticle(id) {
      var res = confirm("お気に入りから削除しますか？");
      if (res == true) {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_UPL}/favorite/${id}`
        );
        await this.init();
      }
    },

    async init() {
      const SaveArticle = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/favorite/pushArtcles/` +
        this.$store.getters.getUserId()
      );
      this.favorites = SaveArticle.data;

      this.favoriteList = this.favorites.slice(
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

</style>