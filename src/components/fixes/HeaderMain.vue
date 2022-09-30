<template>
  <v-app-bar :elevation="0" color="#00294e">
    <template v-if="isLogin">
      <v-row>
        <v-col>
          <tohome-button
            :height="50"
            :width="50"
            @button-click="toHome"
            :color="color"
            :content="content"
            :vuetifyProps="props"
          />
        </v-col>

        <v-col>
          <favorite-button
            @button-click="toSaveArticle"
            :color="color"
            :content="content"
            :vuetifyProps="props"
          />
        </v-col>

        <v-col>
          <post-button
            @button-click="post"
            :color="color"
            :content="content"
            :vuetifyProps="props"
          />
        </v-col>

        <v-col>
          <v-row>
            <v-col>
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <icon-button
                    @button-click="toNotification"
                    :color="color"
                    :content="content"
                    :vuetifyProps="props"
                  />
                </template>

                <v-card>
                  <v-list>
                    <v-col>
                      <v-banner
                        lines="one"
                        color="indigo"
                        v-for="reply in displayNotification"
                        :key="reply.id"
                        icon="mdi-account-circle"
                        class="material-icons"
                      >
                        <v-banner-text>
                          {{ reply.user.name }}がコメントしました
                        </v-banner-text>
                        <v-banner-text> {{ reply.insertTime }} </v-banner-text>

                        <template v-slot:actions>
                          <notification-button
                            @button-click="toNotification"
                            :color="color"
                          />
                        </template>
                      </v-banner>
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
                    </v-col>
                  </v-list>
                </v-card>
              </v-menu>
            </v-col>
           <v-col>
              <v-avatar color="indigo" size="48">
                <avatar-button 
                  @button-click="toMyPage" 
                />
              </v-avatar>
            </v-col>

            <v-col>
              <logout-button
                :buttonText="buttonText"
                :color="color"
                @button-click="submit"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-app-bar>
</template>

<script>
import ToHomeButton from "../atoms/buttons/ToHomeButton.vue";
import FavoriteButton from "../atoms/buttons/FavoriteButton.vue";
import PostButton from "../atoms/buttons/PostButton.vue";
import IconButton from "../atoms/buttons/IconButton.vue";
import Cognito from "../../cognito/Cognito";
import LogOutButton from "../atoms/buttons/LogOutButton.vue";
import NotificationButton from "../atoms/buttons/NotificationButton.vue";
import AvatarButton from "../atoms/buttons/AvatarButton.vue";
import axios from 'axios';

export default {
  name: "header-main",
  components: {
    "tohome-button": ToHomeButton,
    "favorite-button": FavoriteButton,
    "post-button": PostButton,
    "icon-button": IconButton,
    "logout-button": LogOutButton,
    "notification-button": NotificationButton,
    "avatar-button": AvatarButton,
  },
  data() {
    return {
      height: 28,
      width: 100,
      color: "blue",
      hover: false,
      isLogin:false,
      isLoading: false,
      notifications: [],
      page: 1,
      pageSize: 5,
      displayNotification: [],
    };
  },
  methods: {
    post() {
      this.$router.push("/new-post");
    },
    toNotification() {
      this.$router.push("/notification");
    },
    toSaveArticle() {
      this.$router.push("/save-article");
    },
    toHome() {
      this.$router.push("/time-line");
    },
    toLoginPage() {
      this.$router.push("/");
    },
    toMyPage() {
      this.$router.push("/myPage");
    },
    submit() {
      Cognito.signout();
      let tologin = {
        name: "",
        password: "",
        isLogin: false,
      };
      this.$store.commit("login", tologin);
      this.$router.push("/");
    },
    pageChange(pageNumber) {
      this.displayNotification = this.notifications.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
    },
  },
  created() {
    this.isLogin=this.$store.getters.getIsLogin();
    this.$store.watch((state, getters)=> getters.getIsLogin(),
     (value)=> {
      this.isLogin=value
      console.log(value)
     })
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
};
</script>

<style>
#bar {
  color: #00294e;
}
.material-icons {
	font-size: 18px;
}
</style>
