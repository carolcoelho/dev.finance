const Modal = {
    open() {
        document.querySelector(".modal-overlay")
            .classList.add('active')
    },

    close() {
        document.querySelector(".modal-overlay")
            .classList.remove('active')

    }

}

const Storage = {

    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions",)) || []
    },
    set(transaction) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))

    }
}

const Transaction = {
    all: Storage.get(),



    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()

    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let incomes = 0;
        //pegar todas as trasações 
        //para cada transação,
        Transaction.all.forEach(transaction => {
            // se ela for maior que zero
            if (transaction.amount > 0) {
                //somar uma variável e retornar a variável 
                incomes += transaction.amount;
            }
        })

        return incomes;
    },

    expenses() {

        let expenses = 0;
        //pegar todas as trasações 
        //para cada transação,
        Transaction.all.forEach(transaction => {
            // se ela for maior que zero
            if (transaction.amount < 0) {
                //somar uma variável e retornar a variável 
                expenses += transaction.amount;
            }
        })

        return expenses;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();

    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),


    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)



    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        
           <td class="Description">${transaction.description}</td>
           <td class="${CSSclass}"> ${amount}</td>
           <td class="date">${transaction.date}</td>             
           <td> <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt=""></td>                          
                     
                
        `

        return html


    },

    updateBalance() {
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())




    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""

    }

}

const Utils = {


    formatAmount(value) {
        value = Number(value) * 100

        return value

    },

    formatDate(date) {

        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },


    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })


        return signal + value
    }

}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFilds() {

        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }


    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    saveTransaction(transaction) {
        Transaction.add(transaction)


    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            //verificar se as infomações foram preenchidas
            Form.validateFilds()

            //formatar os dados para salvar
            const transaction = Form.formatValues()

            //adicionar informaçoes 
            // Transaction.add(transaction)
            //salvar
            Form.saveTransaction(transaction)

            //apagar os dados do formulário
            Form.clearFields()

            //fechar modal
            Modal.close()


        }

        catch (error) {
            alert(error.message)
        }






    }
}



Storage.get()

const App = {
    init() {

        Transaction.all.forEach(function (transaction, index) {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)


    },

    reload() {
        DOM.clearTransaction()
        App.init()
    },
}


App.init()





// [

//     {


//         description: 'Luz',
//         amount: -50000,
//         date: '23/01/2021'


//     },


//     {


//         description: 'Website',
//         amount: 500000,
//         date: '23/01/2021'


//     },


//     {

//         description: 'Internet',
//         amount: -20000,
//         date: '23/01/2021'


//     },





// ],