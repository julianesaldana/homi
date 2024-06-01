import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./errandTracker.css"
import {db, auth} from "../components/firebase";
import { getDatabase, ref, get, child, push, update} from "firebase/database";

function ErrandTracker() 
{
    //test data
    var data = [
        { errandID: "Take out the trash" },
        { errandID: "Do the laundry"},
        { errandID: "Walk the dog"},
        { errandID: "Feed the dog"}
      ]
    console.log(data);

    var[newItem, setNewItem] = useState("");

    const handleNewItemChange=(e)=>{
        setNewItem(e.target.value)
      };

    //add a new errand
    const addErrand = async () => {
        try{
          //get a unique key for the item
          var itemRef = push(ref(db, `families/-NDfcsZTM4BWrJoA9eRd/errandTracker`),{
          })
          //add the item to the unique key
          update(ref(db, `families/-NDfcsZTM4BWrJoA9eRd/errandTracker`),{
            [itemRef.key]: newItem
          })
          setNewItem("");
        }
        catch (error) {
            console.log(error.message);
        }
    };

    const id = auth.currentUser.uid;
    console.log("the user id");
    console.log(id);
    const [familyID, setFamilyID] = useState("Default");
  
    //get the familyID of the logged in user
    const userFamilyRef = ref(db, `/users/${id}/families`);
    get(userFamilyRef).then((snapshot) => {
      if (snapshot.exists()) {
        //all the data from the query
        const dataFamily = snapshot.val();
        console.log(dataFamily);
        for(const [key, value] of Object.entries(dataFamily)){
          let value1 = key;
          setFamilyID(value1);
        }
        console.log("family ID found");
        console.log(familyID);
      }}
    );

    const [errand, setErrand] = useState();
    let queryData = [];
    let famArr = new Set();

    const errandRef = ref(db, `families/${familyID}/errandTracker`);
    get(errandRef).then((snapshot) => {
    if (snapshot.exists()) {
        const errandData = snapshot.val();
        console.log(errandData);
        let counter = 0;
        for(const [key, value] of Object.entries(errandData)){
            let value1 = value;
            console.log(value1);
            famArr.add(value1);
        }
        console.log(famArr);
    } 
    else {
        console.log("No data available");
    }
    }).catch((error) => {
    console.error(error);
    });

    
    return (
        <div className="errandTracker">
            <table>
                <tr>
                    <th className="tableHeader">Errand Tracker</th>
                </tr>
                {data.map((value, key) => {
                    return (
                    <tr key={key}>
                        <td>{value.errandID}</td>
                    </tr>
                    )
                })}
            </table>
            <div className="errandInput">
                <input type="text" placeholder="New Item" value={newItem} onChange={handleNewItemChange} />
                <button onClick={addErrand}>Add</button>
            </div>
        </div>
    );
}

export default ErrandTracker