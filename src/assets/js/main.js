const url = 'https://eistag-default-rtdb.europe-west1.firebasedatabase.app/';
const current='2023';

function init () {
  Alpine.data("locations", () => ({
    locations: {},
    first: '',
    async init() {
      this.locations = await fetch(url+"location/"+current+".json").then(response => response.json());
      this.first = Object.keys(this.locations)[0];
      let event = new CustomEvent("loc-loaded", {
        detail: {
          location: this.first
        }
      });
      window.dispatchEvent(event);
    },
  }));

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

      data = {
          "timestamp": {
            ".sv": "timestamp"
          },
          "rating_price": this.rating_price,
          "rating_ice": this.rating_ice,
          "rating_service": this.rating_service,
          "text": this.text
      };

      fetch(url+"reviews/"+this.loc+".json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          // ok
          this.clear();
          document.querySelectorAll("span.rating > i").forEach((e) => {
            e.classList.remove("set");
          });
          this.status = "Review submitted";
        } else {
          switch (response.status) {
            case 400:
              this.status = "Bad Request: " + response.text()
              break;
            case 401:
              this.status = "Error, star ratings are required";
              break;
            default:
              this.status = "Failed"
              break;
          }
        }

      }).catch(error => {
        console.log("failed....");
        console.log(error);
        this.clear();
        this.status = "Error sending review";
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




