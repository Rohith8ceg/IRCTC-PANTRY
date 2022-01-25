import * as React from 'react';
import { Layout, Text, Card, List } from '@ui-kitten/components';
import db from "../firebaseConfig";
import { View } from 'react-native';

export default function HomeScreen({route, navigation }) {
    const [category, setCategory] = React.useState(new Array(0))

    const getData = () => {
        console.log("getData:")
        db.collection("category").get().then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                let temp = category
                temp.push({id: doc.id, name: doc.data().name})
                setCategory([...temp])
            })
        })
    }

    console.log(category)
    // const data = route.params;
    // console.log(data['list'])

    React.useLayoutEffect(()=>{
        getData()
    },[])

    const renderCard = (param)=>{
        return (
            <Card status={'basic'} style={{flex:1, alignItems: 'center', flexGrow: 1 }} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
                <Text category={'h6'}>{param.item.name}</Text>
            </Card>
        )
    }

    return (
        <Layout style={{ flex: 1, alignItems: 'center' }} >
            {/* <Text
                onPress={getData}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen
            </Text> */}
            <List contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{width: '60%'}} data={category} renderItem={renderCard} />
        </Layout>
    );
}