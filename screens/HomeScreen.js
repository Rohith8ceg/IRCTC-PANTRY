import * as React from 'react';
import { Layout, Text, Card, List } from '@ui-kitten/components';
import db from "../firebaseConfig";
import { StyleSheet } from 'react-native';

export default function HomeScreen({route, navigation }) {
    const [category, setCategory] = React.useState(new Array(0))
    const [login, setLogin] = React.useState()

    const getData = () => {
        console.log("getData:")
        db.collection("category").get().then((querySnapshot)=>{
            let temp = new Array(0)
            querySnapshot.forEach((doc) => {
                temp.push({id: doc.id, name: doc.data().name})
            })
            setCategory([...temp])
        })
    }

    console.log(category)
    // const data = route.params;
    // console.log(data['list'])

    React.useLayoutEffect(()=>{
        getData()
    },[])

    const styles = StyleSheet.create({

    })

    const renderCard = (param)=>{
        return (
            <Card status={'basic'} style={{flex:1, alignItems: 'center' }} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
                <Text category={'h6'}>{param.item.name}</Text>
            </Card>
        )
    }

    return (
        <Layout style={{ flex: 1, alignItems: 'center', justifyContent:'center' }} >
            <Text
                onPress={getData}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen
            </Text>
            <List style={{flexGrow:0, marginTop:50, width:'80%', height:'60%'}} contentContainerStyle={{flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'}} data={category} renderItem={renderCard} />
        </Layout>
    );
}