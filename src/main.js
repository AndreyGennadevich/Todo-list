import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHand,
  faHandBackFist,
  faPen,
  faCircleCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

library.add(faHand, faHandBackFist, faPen, faCircleCheck, faTrashCan);

createApp(App)
  .use(store)
  .use(router)
	.component('font-awesome-icon', FontAwesomeIcon)
  .mount("#app");
