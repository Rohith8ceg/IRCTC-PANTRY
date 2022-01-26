import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Layout, Text, Card, List, Button } from "@ui-kitten/components";
import GlobalState from "../components/GlobalState";
import UserContext from "../components/UserContext";
import db from "../firebaseConfig";
import firebase from "firebase";


export default function CartScreen({ navigation, route }) {
  const [finalList, setFinallist] = React.useState(new Array(0));
  const [billamt, setBill] = React.useState();
  const [cartlist, setCartlist] = React.useContext(GlobalState);
  const [user, setUser] = React.useContext(UserContext);
  const [name, setName] = React.useState("");
  const [seat, setSeat] = React.useState("");
  const [phone, setPhone] = React.useState();
  //   const [docs, setDocs] = React.useState({ user: null, order: null });
  const [userDoc, setUserDoc] = React.useState(undefined);
  const [orderDoc, setOrderDoc] = React.useState(undefined);

  React.useLayoutEffect(() => {
    console.clear();
    console.log(cartlist);
    var bill = 0;
    let temp = [];
    cartlist.forEach((item) => {
      bill += item["total"];
      temp.push({
        item_name: item["name"],
        qty: item["orderqty"],
        cost: item["total"],
      });
    });
    setFinallist([...temp]);
    setBill(bill);
    console.log("Bill -" + bill);
  }, []);

  const renderCard = (param) => {
    return (
      <Card
        status={"basic"}
        style={{ flex: 1, alignItems: "center", flexGrow: 1 }}
      >
        <Text category={"h6"}>{"Name: " + param.item.name}</Text>
        <Text category={"h6"}>{"Quantity: " + param.item.orderqty}</Text>
        <Text category={"h6"}>{"Price: " + param.item.total}</Text>
      </Card>
    );
  };

  async function updateItemQty() {
    await cartlist.forEach((item) => {
      db.collection("item")
        .doc(`${item.id}`)
        .update({
          quantity: item.quantity,
        })
        .then(() => {
          console.log("Updated");
        });
    });
  }



  async function getUserRef() {
    await db
      .collection("users")
      .where("phone", "==", Number(phone))
      .get()
      .then((res) => {
        console.log("Res:\n", res);
        if (!res.empty) {
          setUser({ name: null, phone: null, error: true });
          let data = res.docs[0].data();
          setUserDoc(res.docs[0].ref);
          console.log("userdocs:", res.docs[0].ref);
          // userDoc = res.docs[0]
          console.log("fetched user:\n", data);
          setUser({ name: data.name, phone: data.phone, error: false });
        } else {
          db.collection("users")
            .add({
              name: name,
              order: [],
              phone: Number(phone),
            })
            .then((res) => {
              console.log("User added!");
              res.get().then((res) => {
                // userDoc = res
                console.log("docs:", res.ref.path);
                setUserDoc(res.ref);
                setUser({ name: null, phone: null, error: true });
                let data = res.data();
                setUser({ name: data.name, phone: data.phone, error: false });
              });
            });
        }
      });
    if (userDoc !== undefined) console.log("userDoc:\n", userDoc.path);
  }

  async function pushOrder() {
    var string = JSON.stringify(finalList);
    await db
      .collection("orders")
      .add({
        cart: string,
        datetime: new Date(),
        status: 0,
        total: billamt,
        userid: userDoc,
      })
      .then((res) => {
        console.log("Order added!");
        res.get().then((res) => {
          // orderDoc = res
          console.log("orderdocs:", res);
          setOrderDoc(res.ref);
        //   console.log("Order:\n", orderDoc.path);
        });
      });
  }

  async function updateUserOrderRef() {
    if (orderDoc){
        console.log(userDoc)
        await userDoc.update({
        order: firebase.firestore.FieldValue.arrayUnion(orderDoc),
        }).then((res)=>{
          console.log(res)
        
        navigation.navigate("S", { screen: "Status" });
      });
    }
  }
  
  React.useEffect(() => {
    if (userDoc) {
      console.log("Docs:\n", userDoc.path);
      pushOrder();
    }
  }, [userDoc]);

  React.useEffect(() => {
    if (orderDoc) {
      console.log("Docs:\n", orderDoc.path);
      updateUserOrderRef();
    }
  }, [orderDoc]);

  async function confirmBooking() {
    await updateItemQty();
    await getUserRef();
    // if (userDoc) await pushOrder();
    // if (orderDoc) await updateUserOrderRef();
  }

  return (
    <Layout style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Cart Screen</Text> */}
      <List
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{ width: "60%" }}
        data={cartlist}
        renderItem={renderCard}
      />
      <Text category={"h6"}>{billamt}</Text>
      <Text style={styles.text}>Name</Text>
      <TextInput
        numberOfLines={1}
        onChangeText={(text) => setName(text)}
        placeholder="Enter name"
        placeholderTextColor="#666"
      />
      <Text style={styles.text}>Phone Number</Text>
      <TextInput
        numberOfLines={1}
        onChangeText={(text) => setPhone(text)}
        placeholder={"Enter 10 digit number"}
        placeholderTextColor="#666"
        keyboardType="number-pad"
        maxLength={10}
      />
      <Text style={styles.text}>Compartment and Seat Number</Text>
      <TextInput
        numberOfLines={1}
        onChangeText={(text) => setSeat(text)}
        placeholder={"D5 86"}
        placeholderTextColor="#666"
        maxLength={10}
      />
      <Button onPress={confirmBooking}>Confirm booking</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#051d5f",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    marginTop: -20,
    marginLeft: 140,
    marginBottom: 5,
    borderRadius: 5,
    width: 250,
    height: 80,
    color: "white",
    backgroundColor: "#465881",
    textAlignVertical: "top",
  },
});
