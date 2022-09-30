<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center">
      <h1>[プロフィール編集]</h1>
    </v-row>

    <v-row no-gutters justify="center">
      <div class="editStyle">
        <p>名前</p>
        <general-input :value="name" message="名前" @input="name = $event" />
        <p>ふりがな</p>
        <general-input
          :value="furigana"
          message="ふりがな"
          @input="furigana = $event"
        />
        <p>メールアドレス</p>
        <general-input
          :value="mail"
          message="メールアドレス"
          @input="mail = $event"
        />
        <p>電話番号</p>
        <general-input
          :value="tel_no"
          message="電話番号"
          @input="tel_no = $event"
        />
        <p>役職</p>
        <v-select
          :items="items"
          :modelValue="role"
          @update:modelValue="role = $event"
        />
        <p>パスワード</p>
        <general-input
          :value="password"
          message="パスワード"
          @input="password = $event"
        />
        <p>コメント</p>
        <general-input
          :value="comment"
          message="コメント"
          @input="comment = $event"
        />
      </div>
    </v-row>
    
    <v-row no-gutters justify="center">
      <general-button :buttonText="buttonText" @button-click="edit()" />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import GeneralInput from "../components/atoms/inputs/GeneralInput";
import GeneralButton from "../components/atoms/buttons/GeneralButton";
export default {
  name: "ProfileEdit",
  components: {
    "general-input": GeneralInput,
    "general-button": GeneralButton,
  },

  data() {
    return {
      buttonText: "保存",
      height: 28,
      width: 60,
      ID: this.$route.query.userId,
      name: this.$route.query.name,
      furigana: this.$route.query.furigana,
      tel_no: this.$route.query.tel_no,
      mail: this.$route.query.mail,
      password: this.$route.query.password,
      role: this.$route.query.role,
      comment: this.$route.query.comment,
      items: ["EA", "SA", "TSA", "CA", "TCA", "チーフ", "Tチーフ", "一般"],
    };
  },
  methods: {
    async edit() {
      var res = confirm("変更を保存しますか？");
      if (res == true) {
        await axios.put(
          `${process.env.VUE_APP_API_BASE_UPL}/user/${this.$route.query.userid}`,
          {
            id: this.ID,
            name: this.name,
            furigana: this.furigana,
            telNo: this.tel_no,
            mail: this.mail,
            password: this.password,
            role: this.role,
            comment: this.comment,
          }
        );
        this.$router.push("/mypage");
      }
    },
  },
};
</script>

<style>
.v-select {
  border-radius: 7px;
  background: rgb(238, 240, 250);
  margin: 0.5em auto;
  height: 50px;
}
.editStyle {
  width: 45%;
}
</style>