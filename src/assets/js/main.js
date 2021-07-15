const url = 'https://eistag-default-rtdb.europe-west1.firebasedatabase.app/';

function ratingstuff(num, type) {
  document.querySelectorAll("#" + type + " i").forEach((e) => {
    e.classList.remove("set");
  });
  for (let i = 1; i <= num; i++) {
    document.querySelector("i#" + type + i).classList.add('set');
  }
}

function init () {
  Alpine.data("locations", () => ({
    locations: {},
    first: '',
    async init() {
      this.locations = await fetch(url+"location.json").then(response => response.json());
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
    "rating_price": 1,
    "rating_ice": 1,
    "rating_service": 1,
    text: "",
    status: "",
    clear() {
        console.log("clear");
        this.rating_price = 1;
        this.rating_ice = 1;
        this.rating_service = 1;
        this.text = "";
        this.status = "";
    },
    send() {
      console.log(this.loc);
      data = {
          "timestamp": Date.now()-1000,
          "rating_price": this.rating_price,
          "rating_ice": this.rating_ice,
          "rating_service": this.rating_service,
          "text": this.text
      };
      console.log(JSON.stringify(data));

      fetch(url+"reviews/"+this.loc+".json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        console.log("success!");
        this.clear();
        this.status = "Review sent!";
      }).catch(error => {
        console.log("failed....");
        this.clear();
        this.status = "Error sending review";
      });
    }
  }));
};


document.addEventListener('alpine:init', () => init());




