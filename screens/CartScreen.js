import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import {
  Layout,
  Text,
  Card,
  List,
  Button,
  Modal,
  ListItem,
} from "@ui-kitten/components";
import GlobalState from "../components/GlobalState";
import UserContext from "../components/UserContext";
import db from "../firebaseConfig";
import firebase from "firebase";

export default function CartScreen({ navigation, route }) {
  const [finalList, setFinallist] = React.useState(new Array(0));
  const [billamt, setBill] = React.useState();
  const [cartlist, setCartlist] = React.useContext(GlobalState);
  const [user, setUser] = React.useContext(UserContext);
  const [name, setName] = React.useState(user.name);
  const [seat, setSeat] = React.useState("");
  const [phone, setPhone] = React.useState(() => {
    console.log("user.phone:", user.phone ? true : false);
    if (user.phone) return String(user.phone);
    return "";
  });
  const [train, setTrain] = React.useState("");
  const [userDoc, setUserDoc] = React.useState(undefined);
  const [orderDoc, setOrderDoc] = React.useState(undefined);
  const [visible, setVisible] = React.useState(false);
  const [err, setErr] = React.useState({ present: false, message: "" });

  React.useEffect(() => {
    setPhone(user.phone ? String(user.phone) : "");
    setName(user.name);
  }, [user.phone]);

  const styles = StyleSheet.create({
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      color: "#051d5f",
      fontSize: 20,
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      borderColor: "#000",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    center: { textAlign: "center" },
  });

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
    console.log(cartlist.length);
    return (
      <ListItem
        disabled={true}
        title={param.item.name}
        description={`Quantity: ${param.item.orderqty}`}
        accessoryRight={(props) => {
          const prop = props;
          delete prop.style.height;
          delete prop.style.width;
          return <Text>₹{param.item.total}</Text>;
        }}
      />
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

  function clearState() {
    console.log("clear");
    setName("");
    setSeat("");
    setPhone("");
    setTrain("");
    setUserDoc(undefined);
    setOrderDoc(undefined);
    setFinallist(null);
    setBill(0);
    setCartlist([]);
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
        location: {
          seat_location: seat,
          train_num: train,
        },
        datetime: new Date(),
        status: 0,
        total: billamt,
        userid: userDoc,
        name: name,
      })
      .then((res) => {
        console.log("Order added!");
        res.get().then((res) => {
          console.log("orderdocs:", res);
          setOrderDoc(res.ref);
        });
      });
  }

  async function updateUserOrderRef() {
    if (orderDoc) {
      console.log(userDoc);
      await userDoc
        .update({
          order: firebase.firestore.FieldValue.arrayUnion(orderDoc),
        })
        .then((res) => {
          console.log(res);
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
      clearState();
      navigation.popToTop();
      navigation.navigate("S", { screen: "Status" });
    }
  }, [orderDoc]);

  function validate() {
    let flag = 0;
    let errMsg = "";
    let regx = {
      name: new RegExp(`^[a-zA-Z][a-zA-Z\\s]*$`),
      // name: new RegExp("([A-Z][a-z]*|[A-Z][a-z]*\\s[A-Z][a-z]*|[A-Z]\\s[A-Z][a-z]*\\s[A-Z][a-z]*)"),
      phone: new RegExp("(\\d{10})"),
      train: new RegExp("(\\d{5})"),
    };
    if (name === "") {
      errMsg = errMsg.concat("Name field is empty\n");
      console.log(errMsg);
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (phone === "") {
      errMsg = errMsg.concat("Phone number field is empty\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (train === "") {
      errMsg = errMsg.concat("Train number field is empty\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (seat === "") {
      errMsg = errMsg.concat("Seat number field is empty\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (flag != 0) return false;
    else setErr({ present: false, message: "" });
    if (!regx.name.test(name)) {
      errMsg = errMsg.concat("Invalid name entered\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (!regx.phone.test(phone)) {
      errMsg = errMsg.concat("Invalid phone number entered\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (!regx.train.test(train)) {
      errMsg = errMsg.concat("Invalid train number entered\n");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    let loc = seat.split(" ");
    loc[0] = [loc[0][0], loc[0].slice(1)];
    if (
      !(
        loc[0][0] == "S" &&
        1 <= Number(loc[0][1]) &&
        Number(loc[0][1]) <= 12 &&
        1 <= Number(loc[1]) &&
        Number(loc[1]) <= 72
      ) &&
      !(
        loc[0][0] == "A" &&
        1 <= Number(loc[0][1]) &&
        Number(loc[0][1]) <= 3 &&
        1 <= Number(loc[1]) &&
        Number(loc[1]) <= 24
      ) &&
      !(
        loc[0][0] == "D" &&
        1 <= Number(loc[0][1]) &&
        Number(loc[0][1]) <= 15 &&
        1 <= Number(loc[1]) &&
        Number(loc[1]) <= 120
      )
    ) {
      errMsg = errMsg.concat("Invalid Seat/Coach Number entered\n");
      console.debug("S");
      setErr({ present: true, message: errMsg });
      flag++;
    }
    if (flag == 0) setErr({ present: false, message: "" });
    return flag == 0 ? true : false;
  }

  async function confirmBooking() {
    console.log("Valid:", validate());
    if (validate()) {
      await updateItemQty();
      await getUserRef();
    }
  }

  return (
    <Layout
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginVertical: 50 }}>
        Cart Screen
      </Text>
      {cartlist.length > 0 && (
        <List
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "stretch",
          }}
          style={{ flexGrow: 0, width: "80%" }}
          scrollEnabled={false}
          data={cartlist}
          renderItem={renderCard}
        />
      )}
      {cartlist.length === 0 && (
        <Text category={"s1"} style={styles.center}>
          Your cart is empty
        </Text>
      )}
      <View>
        <Text category={"h5"}>Total Amount: ₹{billamt}</Text>
        <Button onPress={() => setVisible(true)}>Checkout</Button>
      </View>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        {billamt !== 0 && (
          <Card disabled={true}>
            <Text style={styles.text}>Name</Text>
            <TextInput
              value={name}
              numberOfLines={1}
              onChangeText={(text) => setName(text)}
              placeholder="Enter name"
              placeholderTextColor="#666"
              style={styles.input}
            />
            <Text style={styles.text}>Phone Number</Text>
            <TextInput
              numberOfLines={1}
              onChangeText={(text) => setPhone(text)}
              value={phone}
              placeholder={"Enter 10 digit number"}
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />
            <Text style={styles.text}>Train Number</Text>
            <TextInput
              numberOfLines={1}
              onChangeText={(text) => setTrain(text)}
              placeholder={"Enter train number"}
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={5}
              style={styles.input}
            />
            <Text style={styles.text}>Compartment and Seat Number</Text>
            <TextInput
              numberOfLines={1}
              onChangeText={(text) => setSeat(text)}
              placeholder={"D5 86"}
              placeholderTextColor="#666"
              maxLength={10}
              style={styles.input}
            />
            {err.present && <Text status={"danger"}>{err.message}</Text>}
            <Button onPress={confirmBooking}>Confirm booking</Button>
          </Card>
        )}
        {billamt === 0 && (
          <Card disabled={true} style={{ textAlign: "center" }}>
            <Text>Cart is empty!</Text>
            <Text>Add items to continue.</Text>
            <Button size={"small"} onPress={() => setVisible(false)}>
              Go Back
            </Button>
          </Card>
        )}
      </Modal>
    </Layout>
  );
}
