import * as React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Layout, Text, Card, List, Button } from '@ui-kitten/components';
import GlobalState from '../components/GlobalState';
import db from "../firebaseConfig";

export default function CartScreen({ navigation, route }) {

    const [finalList, setFinallist] = React.useState(new Array(0))
    const [billamt, setBill] = React.useState()
    const [cartlist, setCartlist] = React.useContext(GlobalState);
    const [name, setName] = React.useState("")
    const [seat, setSeat] = React.useState("")
    const [phone, setPhone] = React.useState()

    React.useEffect(() => {
        console.log(cartlist)
        // const data = route.params
        // var cartlist = data['cartlist']
        var bill = 0
        for (var i = 0; i < cartlist.length; i++) {
            for (var itemid in cartlist[i]) {
                console.log(cartlist[i][itemid]['item_name'])
                console.log(cartlist[i][itemid]['qty'])
                console.log(cartlist[i][itemid]['price'])
                bill += cartlist[i][itemid]['price']
                let temp = finalList
                temp.push({ item_name: cartlist[i][itemid]['item_name'], qty: cartlist[i][itemid]['qty'], price: cartlist[i][itemid]['price'] })
                setFinallist([...temp])
            }
        }
        setBill(bill)
        console.log("Bill -" + bill)
    }, [])

    const renderCard = (param) => {
        return (
            <Card status={'basic'} style={{ flex: 1, alignItems: 'center', flexGrow: 1 }}>
                <Text category={'h6'}>{"Name: " + param.item.item_name}</Text>
                <Text category={'h6'}>{"Quantity: " + param.item.qty}</Text>
                <Text category={'h6'}>{"Price: " + param.item.price}</Text>
            </Card>
        )
    }

    const confirmBooking = () => {
        // modifying quantity based on selected items
        for (var i = 0; i < cartlist.length; i++) {
            for (var itemid in cartlist[i]) {
                db.collection('item')
                    .doc(`${itemid}`)
                    .update({
                        quantity: cartlist[i][itemid]['total'] - cartlist[i][itemid]['qty'],
                    })
                    .then(() => {
                        console.log('Updated');
                    });
            }
        }

        // adding user
        var flag=0
        db.collection("users").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var data = doc.data()
                var odr = data['order']
                console.log(odr)
                if(data['phone']==phone){
                    console.log("User exists")
                    flag=1
                    db.collection('users')
                    .doc(doc.id)
                    .update({
                        order: odr.push('/orders/')
                    })
                }
                // console.log(doc.id, " => ", doc.data());
            });
            //first time user
            if(flag==0){
                db.collection('users')
                .add({
                    name,
                    order: finalList,
                    phone,
                })
                .then(() => {
                    console.log('User added!');
                });
            }
        });

        //adding order
        var string = JSON.stringify(finalList);
        db.collection('orders')
        .add({
            cart: string,
            datetime: new Date(),
            status: 1,
            total: 0,
            userid: "/users/"
        })
        .then(() => {
            console.log('Order added!');
        });
    }


    return (
        <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Cart Screen</Text> */}
            <List contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ width: '60%' }} data={finalList} renderItem={renderCard} />
            <Text category={'h6'}>{billamt}</Text>
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
                placeholder={"+91"}
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
})
