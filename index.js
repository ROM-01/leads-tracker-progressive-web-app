require('dotenv').config()

//import firebase code
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

//call database url key with dotenv
const firebaseConfig = {
    databaseURL: process.env.DATABASE_URL
}

// initialize firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
// create reference to database, leads is a random name
const referenceDB = ref(database, "leads")


const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")


function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

//get a snapshot of the data from database (fetching)
onValue(referenceDB, function (snapshot) {
    const snapshotDoesExist = snapshot.exists()
    //if snapshot exists => execute code, if not => do nothing
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val() //snapshots have a lot of info, i just want the value (.val())
        const leads = Object.values(snapshotValues) //convert the snapshot values into an array
        render(leads) //use this array
    }
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceDB) // remove data (will cause an error since snapshot will be deleted)
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    // pushing new data to database
    push(referenceDB,inputEl.value)
    inputEl.value = ""
})