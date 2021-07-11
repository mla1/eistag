const url = 'https://eistag-default-rtdb.europe-west1.firebasedatabase.app/';
const locations = {};

function init () {
    Alpine.data("locations", () => ({
        locations: {},
        async init() {
            this.locations = await fetch(url+"location.json").then(response => response.json());
        },
    }));

    Alpine.store('review', {
        "loc": "",
        "rating_all": 1,
        "rating_price": 1,
        "rating_ice": 1,
        "rating_service": 1,
        "text": "",
        "status": "",
        clear() {
            this.loc="";
            this.rating_all =1;
            this.rating_price = 1;
            this.rating_ice = 1;
            this.rating_service = 1;
            this.text = "";
            this.status = "";
        },
        send() {
            data = {
                "rating_all": this.rating_all,
                "rating_price": this.rating_price,
                "rating_ice": this.rating_ice,
                "rating_service": this.rating_service,
                "text": this.text
            };
            
            fetch(url+this.loc+".json", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }).then(response => {
                this.clear();
                this.status = "Review sent!";
              }).catch(error => {
                this.clear();
                this.status = "Error sending review";
              });
        }
    });
};


document.addEventListener('alpine:init', () => {
    console.log('alpine:init');
    init();
});




