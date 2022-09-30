<template>
  <body>
  <h1 id="page_name">自分の記事</h1>
  <div id="my-article">

    <ul>
      <li id="my_article" 
        v-for="article in articleList" 
        :key="article.id"
      >
          <v-card
            elevation="8"
            shaped
            weight="10%"
          >
            <p>記事ID:{{article.id}}</p>
            <p>見出し:{{article.title}}</p>
            <p>投稿日:{{article.insertTime}}</p>
            <p>更新日:{{article.updateTime}}</p>
            <h2 class="text-xs-h4 text-md-h4 text-lg-h4">
              <general-link
                :text="article.title"
                :href="'/main-article'"
                :params="{ id: article.id }"
              />
        </h2>
        <v-card-actions>
            <v-spacer></v-spacer>
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
        </v-card>
      </li>
    </ul>
  </div>
  </body>
</template>

<script>
import axios from 'axios';
import GeneralLink from '../components/atoms/links/GeneralLink.vue'
// import EditButton from '../components/atoms/buttons/GeneralButton'
// import DeleteButton from '../components/atoms/buttons/GeneralButton'

export default {
  name: "MyArticle",
  components:{
    'general-link': GeneralLink,
    // "edit-button":EditButton,
    // 'delete-button':DeleteButton
  },
  data(){
    return {
      user: Object,
      articleList:Array,
      isLoading: Boolean,
      userId: this.$route.query.userId,
    }
  },
  async mounted (){
    this.isLoading = true;
    const user = axios.get(
      `${process.env.VUE_APP_API_BASE_UPL}/user/${this.$route.query.userId}`
    );
    const articles = axios.get(
      `${process.env.VUE_APP_API_BASE_UPL}/article/user/${this.$route.query.userId}`
    );
    let userRes;
    let articlesRes;
    [userRes, articlesRes] = await Promise.all([user, articles]);
    this.user = userRes.data;
    this.articleList = articlesRes.data;
    this.isLoading = false;
  },
  methods:{
  mounted() {
        axios.get('URL' + this.$route.params.userId)
        .then(response => { this.user = response.data[0]
        })
    }
}
}

</script>

<style>
.article{
  border: 1px; 
  background-color: rgba(215, 233, 250, 0.527);
}

#page_name {
  position: relative;
  padding: 0.25em 0;
}
#page_name:after {
  content: "";
  display: block;
  height: 4px;
  background: -webkit-linear-gradient(to right, rgb(255, 186, 115), #ffb2b2);
  background: linear-gradient(to right, rgb(255, 186, 115), #ffb2b2);
}
#my-article {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  background-color: #e6e6fa;
}
</style>