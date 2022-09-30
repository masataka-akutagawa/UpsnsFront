import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router/route";
import Config from "./cognito-config";
import Cognito from "./cognito/Cognito";
import { VueShowdownPlugin } from "vue-showdown";
import Store from './store';
import S3 from './s3/s3';
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar as fasStar, faComment as fasComment} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faComment as farComment } from '@fortawesome/free-regular-svg-icons'

loadFonts();
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(Cognito, Config.AWSConfig);
app.use(S3);
app.use(VueShowdownPlugin, {
  // set default flavor of showdown
  flavor: "github",
  // set default options of showdown (will override the flavor options)
  options: {
    emoji: false,
  },
});
app.use(Store);


app.component('font-awesome-icon', FontAwesomeIcon)
library.add(fasStar, farStar, fasComment, farComment)

const vuet = createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})

app.use(vuet)

app.mount("#app");
