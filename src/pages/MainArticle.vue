<template>
  <v-container fluid fill-height>
    <div v-if="!isLoading">
      <v-row no-gutters class="mt-12">
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <v-avatar
            icon="mdi-account-circle"
            color="indigo"
            size="40"
            horizontal
          />
        </v-col>
        <v-col>
          <p align="left">
            {{ article.user.name }}
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="2"></v-col>
        <v-col cols="2">
          <p align="left">投稿日時：{{ article.insertTime }}</p>
        </v-col>
        <v-col cols="2">
          <p v-if="article.updateTime != null" align="left">
            最終更新日時：{{ article.updateTime }}
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-5">
        <v-col cols="2"></v-col>
        <v-col>
          <h1 align="left">{{ article.title }}</h1>
        </v-col>
      </v-row>

      <v-row v-if="article.tags.size != 0" no-gutters class="mt-5">
        <v-col cols="2"></v-col>
        <v-col>
          <ul align="left">
            <li
              style="display: inline"
              v-for="tag in article.tags"
              :key="tag.id"
            >
              <general-link
                :params="{ searchType: 0, word: tag.name }"
                :href="'/search'"
                :text="'#' + tag.name"
              />
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="9" />
        <v-col cols="3" class="justify-center">
          <v-card-actions>
            <plus-button
              :color="color"
              :height="40"
              :width="40"
              @button-click="saveOrDelete(article.id, isFavorite)"
              :isFavorite="isFavorite"
            />
          </v-card-actions>
        </v-col>
      </v-row>

      <v-row no-gutters class="justify-center">
        <div id="vue-showdown-container">
          <VueShowdown :markdown="htmlData" />
        </div>
      </v-row>
    </div>

    <div ref="recursiveList" class="recursiveList">
      <dialog class="container-modal" id="modalDialog">
        <div class="wrapper-modal">
          <div class="parent">
            <v-card-actions class="buttonRight">
              <close-button
                @button-click="close"
                :buttonText="closeText"
                :height="40"
                :width="40"
              />
            </v-card-actions>
            <h2 class="replyCenter">{{ parent.user.name }} さんへリプライ</h2>
          </div>
          <reply-form
            :articleId="article.id"
            :parentId="parent.id"
            @sent="onSent"
          />
        </div>
      </dialog>
    </div>
    <v-spacer></v-spacer>

    <reply-form :articleId="article.id" />
    <v-spacer></v-spacer>
  </v-container>
</template>

<script>
import axios from "axios";
import GeneralLink from "../components/atoms/links/GeneralLink.vue";
import ReplyForm from "../components/molecules/ReplyForm.vue";
import CloseButton from "../components/atoms/buttons/CloseButton.vue";
import PlusButton from "../components/atoms/buttons/PlusButton.vue";
import S3 from "../s3/s3";

export default {
  name: "MainArticle",
  components: {
    "general-link": GeneralLink,
    "reply-form": ReplyForm,
    "close-button": CloseButton,
    "plus-button": PlusButton,
  },
  data() {
    return {
      isLoading: Boolean,
      value: " ",
      menuText: "リプライ表示",
      article: Object,
      htmlData: String,
      replys: [],
      loading: false,
      parent: {
        comment: "",
        user: {
          name: "",
        },
      },
      userId: Number,
      isFavorite: Boolean,
    };
  },
  methods: {
    //リプライの表示
    async getReply(articleId) {
      this.loading = true;
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/reply/search/` + articleId
      );
      this.replys = res.data; //3
      this.loading = false;
    },
    //modalを閉じる
    close() {
      const closeDialog = document.getElementById("modalDialog");
      closeDialog.close();
    },
    //replyを送信後modalを閉じる
    async onSent() {
      const closeDialog = document.getElementById("modalDialog");
      closeDialog.close();
      const list = this.$refs.recursiveList;
      while (list.firstElementChild) {
        list.firstElementChild.remove();
      }
      await this.init();
    },
    //サーバーデータの取得と再起処理の呼び出し
    async init() {
      this.isLoading = true;
      this.userId = this.$store.getters.getUserId();
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/article/${this.$route.query.id}/${this.userId}`
      );
      this.article = res.data.article;
      this.isFavorite = res.data.isFavorite;
      const setUrl = async (res) => {
        if (res.data.article.images[0]) {
          await Promise.all(
            res.data.article.images.map(async (image) => {
              const url = await S3.generateSignedURL(image.imageFilePath);
              this.article.body = this.article.body.replace(
                image.imageFilePath,
                `\n\n![${image.imageFilePath}](${url})`
              );
            })
          );
        }
      };
      await setUrl(res);
      this.htmlData = this.article.body;
      await this.getReply(this.article.id);
      //再起処理の呼び出しとdivタグの生成
      this.recursive(this.replys, this.$refs.recursiveList);
      this.isLoading = false;
    },

    formComment(comment) {
      const a = comment.slice(0, 100);
      const b = "<br>";
      let c = comment.slice(100);
      if (c.length > 100) {
        c = this.formComment(c);
      }
      return a + b + c;
    },

    //再起処理メソッド
    async recursive(replys, base) {
      //ulタグを新し生成
      const ul = document.createElement("ul");
      base.appendChild(ul);
      replys.forEach((reply) => {
        //liタグを新しく生成
        const li = document.createElement("li");
        li.innerHTML = reply.user.name + " " + reply.insertTime + "　";
        li.id = "replyId";
        //buttonタグを新しく生成
        const btn = document.createElement("button");
        btn.innerHTML = "リプライ";
        li.appendChild(btn);

        const div = document.createElement("div");

        if (reply.comment.length > 30) {
          reply.comment = this.formComment(reply.comment);
        }
        div.innerHTML = reply.comment;
        li.appendChild(div);

        const openDialog = document.getElementById("modalDialog");
        btn.addEventListener("click", () => {
          this.parent = reply;
          openDialog.showModal();
        });

        const child = ul.appendChild(li);
        //再起処理するかどうかの判定
        if (reply.childrenReply) {
          this.recursive(reply.childrenReply, child);
        }
        if (base == this.$refs.recursiveList) {
          const br = document.createElement("br");
          li.appendChild(br);
          li.classList.add("frameBoder");
        } else {
          li.classList.add("arrows");
        }
      });
    },
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
  },

  async mounted() {
    await this.init();
  },
};
</script>

<style>
#vue-showdown-container {
  display: block;
}

#vue-showdown-container table {
  border-collapse: collapse; /* セルの線を重ねる */
}

#vue-showdown-container thead {
  background-color: rgb(180, 179, 179);
}

#vue-showdown-container table,
td,
th {
  border: 2px #5c5b5b solid;
}

#vue-showdown-container tr:nth-child(even) {
  background-color: #ddd; /* 背景色指定 */
}

#vue-showdown-container th,
td {
  padding: 5px 10px; /* 余白指定 */
}
#vue-showdown-container em {
  font-family: "ＭＳ Ｐゴシック";
  font-style: oblique;
}

/*消去線*/
del {
  text-decoration: line-through;
}
#vue-showdown-container del {
  text-decoration: line-through;
}

/*インラインコード*/
#vue-showdown-container code {
  color: #3594f7;
  background-color: #3baafa1a;
}

/**クオート */
#vue-showdown-container blockquote {
  margin: 20px 0;
  padding: 0.5em 1.2em;
  line-height: 2em;
  background-color: #ececec;
  border-left: 5px solid #35b378;
}

/*ブロックレベルコード */
#vue-showdown-container pre {
  position: relative;
  border-radius: 5px;
  height: 10%;
  box-shadow: #0005 0 2px 2px;
  margin: 20px 0;
}

#vue-showdown-container pre::before {
  content: "";
  display: block;
  height: 32px;
  width: auto;
  background-size: 40px;
  background-color: #282c34;
  margin-bottom: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-position: 10px 10px;
}

#vue-showdown-container pre code {
  position: relative;
  /* padding: 1em; */
  padding-top: 1em;
  padding-right: 1em;
  padding-bottom: 1em;
  padding-left: 1em;
  background-color: #282c34;
  color: #a9b7c6;
  border-radius: 0 0 5px 5px;
  display: block;
  line-height: 1;
  overflow: auto;
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  font-size: 14px;
}

/* 番号が出ない */
/* ●が出ない */
#vue-showdown-container {
  margin: 5%;
}

/*テーブルが左寄り */
#vue-showdown-container table {
  margin-left: auto;
  margin-right: auto;
}

/*画像表示のサイズ指定*/
#vue-showdown-container img {
  width: 50%;
  height: 30%;
}

/*モーダルCSS*/
.container-modal {
  background-color: initial;
  border: none;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
}
.container-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
.wrapper-modal {
  background: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  left: 50%;
  opacity: 1;
  padding: 30px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  width: 1000px;
  z-index: 20;
}
/*モーダルの閉じるボタンとリプライへのリプライの同列化*/
.replyCenter {
  text-align: center;
  float: left;
}
.buttonRight {
  float: ight;
}
.parent {
  /* ベンダープレフィックスは省略 */
  display: flex;
  justify-content: center; /* 子要素を中央揃え */
  position: relative;
}
.buttonRight {
  position: absolute;
  right: 0; /* 右寄せ */
}

/*リプライ表示欄の階段化(リストにするなら必須) */
.recursiveList {
  padding-left: 100px;
  padding-right: 100px;
}
.recursiveList ul {
  padding-left: 1rem;
  list-style: none;
}
.recursiveList ul li {
  position: relative;
  text-align: left;
  padding-left: 30px;
}
.frameBoder::before {
  content: "";
  position: absolute;
  background-color: black;
  width: 0.3em;
  height: 0.3em;
  top: 1em;
  left: 1em;
  border-radius: 0.3em;
}

/*親のリプライ以外は先頭に矢印を作る*/
.arrows {
  position: relative;
  padding-left: 17px;
  list-style: none;
}
.arrows :before {
  content: "";
  display: inline-block;
  position: absolute;
  left: 20px;
  top: 12px;
  width: 5px;
  height: 5px;
  border-bottom: 1px solid #888;
  border-right: 1px solid #888;
  transform: rotateZ(-45deg);
}
.arrows :after {
  content: "";
  position: absolute;
  display: inline-block;
  left: 10px;
  top: 14px;
  width: 10px;
  height: 1px;
  background: #888;
}

/*リプライボタンの囲み(課題：モーダルにも適用されている)*/
.recursiveList button {
  border: 1px solid #000000;
  padding: 2px 4px;
  box-sizing: border-box;
  background: #f2f2f2;
}

/*リプライ表示欄の囲み*/
.frameBoder {
  border: 2px solid #ffb2b2;
  border-collapse: separate; /* 枠線(ボーダー)を離して表示 */
  border-radius: 15px;
  margin-bottom: 10px;
  padding: 5px;
  box-sizing: border-box;
}
</style>

