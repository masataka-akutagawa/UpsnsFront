<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center" class="mt-7">
      <v-col cols="10">
        <general-input
          :value="title"
          message="タイトル"
          @input="title = $event"
        />
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" class="mt-5">
      <v-col cols="10">
        <md-editor
          v-model="text"
          @onUploadImg="onUploadImg"
          @onChage="test"
          :toolbars="toolbars"
          :language="language.language"
        >
          <template #defToolbars>
            <emoji @onChange="onChange($event)" />
          </template>
        </md-editor>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" class="mt-7">
      <v-col cols="10">
        <v-combobox
          v-model="tagSelect"
          :items="nameItems"
          label="タグを探す"
          hint="(見つからない場合は直接入力してください)"
          persistent-hint
          multiple
          outlined
          dense
          chips
        />
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" class="mt-5">
      <general-button
        @button-click="isEdit ? onPostEdit() : onPost()"
        :buttonText="buttonText"
      />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { emojis } from "../const/emoji";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import GeneralInput from "../components/atoms/inputs/GeneralInput";
import GeneralButton from "../components/atoms/buttons/GeneralButton.vue";
import Emoji from "../components/atoms/components/Emoji.vue";
import S3 from "../s3/s3";

export default {
  name: "NewPost",
  components: {
    "md-editor": MdEditor,
    emoji: Emoji,
    "general-input": GeneralInput,
    "general-button": GeneralButton,
  },
  data() {
    return {
      emojis: emojis,
      visible: false,
      toolbars: [
        "underline",
        "quote",
        "bold",
        "italic",
        "-",
        "strikeThrough",
        "title",
        "sub",
        "sup",
        "orderedList",
        "unorderedList",
        "-",
        "codeRow",
        "code",
        "link",
        "image",
        "table",
        "-",
        "revoke",
        "next",
        "save",
        0,
        "=",
        "pageFullscreen",
        "fullscreen",
        "preview",
        "htmlPreview",
        "github",
      ],
      language: {
        language: "en-US",
      },
      title: "",
      text: "",
      buttonText: "投稿",
      userId: Number,
      img: "",
      imgs: [],
      imgIds: [],
      imgNames: [],
      files: [],
      isEdit: this.$route.query.isEdit,
      //queryImgs: this.$route.query.imgs,
      nameList: [],
      extention: String,
      tagItems: [],
      tagSelect: [],
      nameItems: [],
      existList: [],
      notExistList: [],
      pushTagList: [],
    };
  },
  //S3の一時保存の方の画像データを消す
  async unmounted() {
    if (this.imgNames.length === 0) {
      return;
    }
    await S3.deleteAllObjects(this.userId, this.imgNames);
  },
  async mounted() {
    if (this.isEdit == undefined) {
      this.isEdit = false;
    }
    const tagRes = await axios.get(`${process.env.VUE_APP_API_BASE_UPL}/tag`);
    this.tagItems = tagRes.data;
    this.nameItems = tagRes.data.map((tag) => tag.name);
    if (this.isEdit) {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_UPL}/article/` + this.$route.query.id
      );
      res.data.images.forEach((image) => {
        this.nameList = [...this.nameList, image.imageFilePath];
        //this.nameList.push(image.imageFilePath);//削除用

        this.imgNames = [...this.imgNames, image.imageFilePath]; //投稿用
      });
      if (res.data.images.length !== 0) {
        await Promise.all(
          this.imgNames.map(async (image) => {
            const url = await S3.generateSignedURL(image);
            res.data.body = res.data.body.replace(
              image,
              `\n\n![${image}](${url})`
            );
          })
        );
      }
      this.title = res.data.title;
      this.text = res.data.body;

      res.data.tags.forEach((tag) => this.tagSelect.push(tag.name));
    }
  },
  watch: {
    //変数の監視
    text: function (newVal) {
      //newVal新しいテキスト
      this.files = this.files.filter((file) => {
        return newVal.indexOf(file.name) !== -1;
      });
      this.imgNames = this.imgNames.filter((imgName) => {
        return newVal.indexOf(imgName) !== -1;
      });
    },
  },
  methods: {
    searchTag() {
      this.existList = this.tagItems.filter((tag) =>
        this.tagSelect.includes(tag.name)
      );
      this.notExistList = this.tagSelect.filter(
        (tag) => !this.tagItems.map((tagItem) => tagItem.name).includes(tag)
      );
    },
    //画像をファイルから選択したとき
    async onUploadImg(files) {
      this.extention = files[0].name.slice(files[0].name.indexOf("."));
      const imgName = Math.random().toString(32).substring(2) + this.extention;
      this.files.push({ name: imgName, file: files[0] });
      this.userId = this.$store.getters.getUserId();
      await S3.putTemporarilyObject(this.userId, imgName, files[0]);
      this.img = `![${imgName}](${await S3.generateTemporarilySignedURL(
        this.userId,
        imgName
      )})`;
      this.imgs.push(this.img);
      this.imgNames.push(imgName);
      this.text += this.img;
    },
    //絵文字の表示
    onChange(emoji) {
      if (typeof emoji == "boolean") {
        return;
      }
      this.text = emoji;
    },
    //記事の保存
    async onPost() {
      this.userId = this.$store.getters.getUserId();
      //|-を見つけたら直す
      this.text = this.text.replaceAll("| -", "| --");
      //マークダウン消去線
      this.text = this.text.replaceAll("~", "~~");

      this.searchTag();
      await Promise.all(
        this.notExistList.map(async (tagName) => {
          const res = await axios.post(
            `${process.env.VUE_APP_API_BASE_UPL}/tag`,
            {
              name: tagName,
            }
          );
          this.existList.push(res.data);
        })
      );
      this.existList.forEach((tag) => {
        this.pushTagList.push(tag.id);
      });
      if (this.imgNames.length !== 0) {
        await S3.deleteAllObjects(this.userId, this.imgNames);
        this.imgNames.forEach((img) => {
          this.text = this.text.replace(new RegExp(/!\[.*\]\(.*\)$/im), img);
        });
        this.files.forEach((file) => {
          S3.putObject(file.name, file.file);
        });

        this.imgIds = await axios
          .post(`${process.env.VUE_APP_API_BASE_UPL}/image`, {
            imageFilePaths: this.imgNames,
          })
          .catch(() => {
            window.alert(
              "画像の名前が重複しています。\nもう一度やり直してください。"
            );
            return;
          });
        this.imgNames = [];
        this.imgs = [];
        await axios.post(`${process.env.VUE_APP_API_BASE_UPL}/article`, {
          body: this.text,
          title: this.title,
          userId: this.userId,
          imageIds: this.imgIds.data,
          tagIds: this.pushTagList,
        });
      } else {
        await axios.post(`${process.env.VUE_APP_API_BASE_UPL}/article`, {
          body: this.text,
          title: this.title,
          userId: this.userId,
          tagIds: this.pushTagList,
        });
      }
      this.$router.push({
        path: "/time-line",
      });
    },
    //編集記事の保存
    async onPostEdit() {
      this.userId = this.$store.getters.getUserId();
      //|-を見つけたら直す

      this.searchTag();
      await Promise.all(
        this.notExistList.map(async (tagName) => {
          const res = await axios.post(
            `${process.env.VUE_APP_API_BASE_UPL}/tag`,
            {
              name: tagName,
            }
          );
          this.existList.push(res.data);
        })
      );
      this.existList.forEach((tag) => {
        this.pushTagList.push(tag.id);
      });

      this.text = this.text.replaceAll("| -", "| --");
      //マークダウン消去線
      this.text = this.text.replaceAll("~~", "~");
      this.text = this.text.replaceAll("~", "~~");
      if (this.imgNames.length !== 0) {
        const list = this.nameList.map((name) => {
          return name;
        });
        if (list.length !== 0) {
          await axios.delete(
            `${process.env.VUE_APP_API_BASE_UPL}/image/names`,
            { data: list }
          );
        }
        for (var i = 0; i < this.imgNames.length; i++) {
          this.text = this.text.replace(
            new RegExp(/^!\[.*\]\(.*\)/im),
            this.imgNames[i]
          );
        }
        this.files.forEach((file) => {
          S3.putObject(file.name, file.file);
        });
        this.imgIds = await axios.post(
          `${process.env.VUE_APP_API_BASE_UPL}/image`,
          {
            imageFilePaths: this.imgNames,
          }
        );
        this.imgIds = await axios.post(
          `${process.env.VUE_APP_API_BASE_UPL}/image`,
          {
            imageFilePaths: this.imgNames,
          }
        );
        this.imgNames = [];
        this.imgs = [];

        console.log(this.imgIds);
        await axios.put(
          `${process.env.VUE_APP_API_BASE_UPL}/article/` + this.$route.query.id,
          {
            body: this.text,
            title: this.title,
            userId: this.userId,
            imageIds: this.imgIds.data,
            tagIds: this.pushTagList,
          }
        );
      } else {
        await axios.put(
          `${process.env.VUE_APP_API_BASE_UPL}/article/` + this.$route.query.id,
          {
            body: this.text,
            title: this.title,
            userId: this.userId,
            tagIds: this.pushTagList,
          }
        );
      }
      this.$router.push({
        path: "/time-line",
      });
    },
  },
};
</script>

<style>
.md-editor {
  height: 200%;
}
</style>