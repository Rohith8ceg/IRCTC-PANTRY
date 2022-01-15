import * as React from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { collection, getDocs } from "firebase/firestore"; 
import db from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
    const [category, setCategory] = React.useState([{id:0, name:"hello"}])
    const [categoryCards, setCategoryCards] = React.useState(null)

    // const adding = (item) => {
    //     db.ref(`/category/`).push({
    //         name: item
    //     }).then(()=>{
    //         db.ref(`/`).get().then((res)=> console.log(res))
    //     });
    // }

    const getData = () => {
        console.log("\n\n\n\ngetData:")
        db.collection("category").get().then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                setCategory([category,{id: doc.id, name: doc.data().name}])
                setCategoryCards((categoryCards)?[categoryCards,<Text key={item.id}>{item.name}</Text>]:[])
                console.log(`${doc.id} => ${doc.data().name}`);
            })
        })
    }

    React.useEffect(()=>{
        if (categoryCards)
            categoryCards.forEach((card)=> console.log(card))
    },[])

    React.useLayoutEffect(()=>{
        getData()
    },[])

    return (
        <Layout style={{ flex: 1, alignItems: 'center' }}>
            <Text
                onPress={getData}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen
            </Text>
            {categoryCards}
        </Layout>
    );
}