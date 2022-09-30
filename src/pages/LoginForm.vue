<template>
  <v-app>
    <v-card width="400px" class="mx-auto mt-15">
      <v-card-text>
        <v-form>
          <v-text-field
            prepend-icon="mdi-account-circle"
            label="ユーザ名"
            v-model="name"/>
          <v-text-field
            v-bind:type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            prepend-icon="mdi-lock"
            v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="パスワード"
            v-model="password"/>
          <p v-if="errText"
            color="red">
            {{ errText }}
          </p>
          <v-card-actions class="justify-center">
            <v-btn @click="submit">
              ログイン
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import Cognito from '../cognito/Cognito';
import axios from 'axios';
export default {
  name: "LoginForm",
  data() {
    return {
      showPassword: false,
      name: "",
      password: "",
      errText:""
    };
  },
  methods: {
    submit() {
      Cognito.signin(this.name, this.password).then(async(session)=>{
        this.$store.commit('setToken', session.idToken.jwtToken);
        console.log(session);
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_UPL}/user/cognitoId/${this.name}`);
        this.$store.commit('insertUser', res);
        let tologin ={
          name:this.name,
          password:this.password,
          isLogin:true
        };
        this.$store.commit('login', tologin);
        this.$router.push('/mypage');
      }).catch((e)=>{
        this.errText="※ユーザ名かパスワードが間違っています";
        console.log(e);
      });
    },
  },
};
</script>

