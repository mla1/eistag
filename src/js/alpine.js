import Alpine from 'alpinejs';
import { doSignIn, getLocations, postReview, getIceCreamEaten } from './firebase.js'


const url = 'https://eistag-default-rtdb.europe-west1.firebasedatabase.app/';
const current='2023';

function init () {

  Alpine.store("user", {
    loggedin: false,
    username: '',
    userId: '',
    icecream: 0,
    login(user) {
      console.log("user store login function called");
      this.loggedin = true;
      this.username = user.displayName;
      this.userId = user.uid;
      this.getIceCream();
    },
    logout() {
      this.loggedin = false;
      this.username = '';
      this.userId = '';
    },
    async getIceCream() {
      const val = await getIceCreamEaten();
      this.icecream = val;
    }
  });

  Alpine.data("tracker", () => ({
    number: 0,
    submit() {
      if (!!this.number) {

      }
    }
  }));

  Alpine.data("login", () => ({
    error: '',
    signIn() {
      if (this.loggedin) {
        return;
      }

      doSignIn()
      .then((result) => {
        this.error = '';
        this.$store.user.login(result.user);
      })
      .catch((e) => {
        this.error = e.message;
      });
    },
    
  }));

  Alpine.store("locations", {
    locations: {},
    first: '',
    error: null,
    async init() {
      try {
        this.locations = await getLocations(current);
        this.first = Object.keys(this.locations)[0];
        let event = new CustomEvent("loc-loaded", {
          detail: {
            location: this.first
          }
        });
        window.dispatchEvent(event);
      } catch (e) {
        this.error = e;
      }
    },
  });

  Alpine.data('review', () => ({
    loc: "",
    "rating_price": 0,
    "rating_ice": 0,
    "rating_service": 0,
    text: "",
    status: "",
    clear() {
        this.rating_price = 0;
        this.rating_ice = 0;
        this.rating_service = 0;
        this.text = "";
        this.status = "";
    },
    send() {
      if (!this.rating_ice || !this.rating_price || !this.rating_service) {
        this.status = "Star ratings are required!"
        return;
      }

      review = {
        "rating_price": this.rating_price,
        "rating_ice": this.rating_ice,
        "rating_service": this.rating_service,
        "text": this.text
      };
    

      postReview(this.loc, review)
      .then(response => {
        this.clear();
        document.querySelectorAll("span.rating > i").forEach((e) => {
          e.classList.remove("set");
        });
        this.status = "Review submitted 🍦";
      }).catch(error => {
        this.clear();
        this.status = "Error saving review";
      });
    },
    ratingstuff(num, type) {
      this.status = '';
      document.querySelectorAll("#" + type + " i").forEach((e) => {
        e.classList.remove("set");
      });
      for (let i = 1; i <= num; i++) {
        document.querySelector("i#" + type + i).classList.add('set');
      }
    }
  }));
};


document.addEventListener('alpine:init', () => init());
window.Alpine = Alpine;
Alpine.start();