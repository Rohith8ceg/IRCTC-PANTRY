import * as React from 'react';
import { Layout, Text, Card, List, Button } from '@ui-kitten/components';
import GlobalState from '../contexts/GlobalState';
import db from "../firebaseConfig";

export default function CartScreen({ navigation, route }) {

    const [finalList, setFinallist] = React.useState(new Array(0))
    const [billamt, setBill] = React.useState()
    const [cartlist, setCartlist] = React.useContext(GlobalState);

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
        // firebase.database().ref().child('/posts/' + newPostKey)
        // .set({ title: "New title", body: "This is the new body" });
        // for (var i = 0; i < cartlist.length; i++) {
        //     for (var itemid in cartlist[i]) {
        //         console.log(itemid)
        //         db.doc(`item/${itemid}`).get().then((res) => {
        //             let data = res.data()
        //             console.log(data)
        //             if (data) {
        //                 console.log(data['quantity'])
        //             }
        //             //     data.forEach(item => {
        //             //         item.get().then((res)=>{
        //             //             console.log(res.data())
        //             //             setItems(prevItems => [...prevItems,{id: item.id,...res.data(),qty: qty-cartlist[i][itemid]['qty']}])
        //             //         })
        //             // });
        //         });
        //     }
        // }



        for (var i = 0; i < cartlist.length; i++) {
            for (var itemid in cartlist[i]) {
                db.collection('item')
                    .doc(`${itemid}`)
                    .update({
                        quantity: quantity-cartlist[i][itemid]['qty'],
                    })
                    .then(() => {
                        console.log('Updated');
                    });
            }
        }

        //add to users
        // db.collection('orders')
        // .doc()
        // .add({
        //     name: 'Ada Lovelace',
        //     age: 30,
        // })
        // .then(() => {
        //     console.log('User added!');
        // });

}


return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Cart Screen</Text> */}
        <List contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ width: '60%' }} data={finalList} renderItem={renderCard} />
        <Text>{billamt}</Text>
        <Button onPress={confirmBooking}>Confirm booking</Button>
    </Layout>

);
}