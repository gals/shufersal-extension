
let colors = [
    'blue',
    'blue-grey',
    'brown',
    'green',
    'orange',
    'purple',
];

class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.color = this.constructor.getColor();
        this.total = 0;
    }

    addShare(price) {
        this.total += price;
    }

    removeShare(price) {
        this.total = Math.max(0, this.total - price);
    }

    static getColor() {
        let color = colors.splice(Math.floor(Math.random()*colors.length), 1)[0];
        return color || '';
    }
}

class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

class OrderItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
        this.peopleChecked = {};
    }

    total() {
        return this.product.price * this.quantity;
    }

    check(person, people) {
        let checked = this.peopleChecked[person.id];

        let price = this.total();
        let pricePerPerson = price;

        let shares = Object.keys(this.peopleChecked).filter(id => { return this.peopleChecked[id]; }).length;
        let prevShares = 0;
        if (shares > 0) {
            pricePerPerson = price / shares;
            prevShares = checked ? shares - 1 : shares + 1;
        }

        let prevPricePerPerson = pricePerPerson;
        if (prevShares > 0) {
            prevPricePerPerson = price / prevShares;
        }

        for (let id in this.peopleChecked) {
            // adjust the price only for previously checked people
            if (id == person.id)
                continue

            people.forEach(p => {
                if (p.id != id || !this.peopleChecked[p.id])
                    return

                p.removeShare(prevPricePerPerson);
                p.addShare(pricePerPerson);
            });
        }

        // adjust the price for the current toggled person
        if (checked) {
            person.addShare(pricePerPerson);
        } else {
            person.removeShare(prevPricePerPerson);
        }
    }
}

class Provider {
}

class Shufersal extends Provider {
    // builds a list of order items out of a JSON blob that represents an order
    static fromJSON(data) {
        let items = [];
        data.entries.forEach(entry => {
            // console.log(entry);
            let totalPrice = entry.totalPrice.value;
            if (entry.priceAfterDiscount) {
                totalPrice = entry.priceAfterDiscount;
            }

            let price = totalPrice / entry.quantity;
            let product = new Product(
                entry.product.code,
                entry.product.name,
                price);
            items.push(new OrderItem(product, entry.quantity));
        });
        return items;
    }
}

window.onload = () => function() {
    new Vue({
        el: '#app',
        data: {
            name: '',
            people: [],
            lastPersonID: 0,
            orderItems: [],
        },
        methods: {
            readFile: function(f) {
                let reader = new FileReader();
                reader.onload = e => {
                    this.orderItems = Shufersal.fromJSON(JSON.parse(e.target.result));
                };
                reader.readAsText(f);
            },
            addName: function() {
                if (this.name === '')
                    return;
                this.lastPersonID++;
                this.people.push(new Person(this.lastPersonID, this.name));

                this.$refs.nameTxt.focus();
                this.name = '';
            },
        },
        vuetify: new Vuetify({
            rtl: true,
        }),
    })
}