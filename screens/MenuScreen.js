import * as React from 'react';
import { StyleSheet } from 'react-native';
import db from "../firebaseConfig";
import { Layout, Text, List, Card, Button, ButtonGroup } from '@ui-kitten/components';

export default function MenuScreen({navigation, route}) {

    const [param, setParam] = React.useState(route.params)
    const [items, setItems] = React.useState(new Array(0))

    const getData = () => {
        console.log("getData:")
        db.doc(`category/${param.id}`).get().then((res)=>{
            let data = res.data()
            let tempItems = data.item
            if (tempItems){
                let temp = []
                tempItems.forEach(item => {
                    item.get().then((res)=>{
                        temp.push({id: item.id,...res.data(),orderqty: 0})
                        console.log("temp:\n",temp)
                        setItems(temp)
                    })
                });
            }
        });
    }

    React.useLayoutEffect(() => {
      getData()
    }, []);

    React.useLayoutEffect(()=>{
        console.log("items:\n",items)
        
    },[items])

    const styles = StyleSheet.create({
        card:{flex:1, alignItems: 'center', flexGrow: 1 },
        layout:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
        list: {flexGrow:0, marginTop:50, width:'80%', minHeight:'60%'},
        container: {flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'}
    })
    
    const renderCard = (param)=>{
        console.log(param)
        return (
            <Card status={'basic'} style={styles.card} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
                <Text category={'h6'}>{param.item.name}</Text>
                <Text>Price: {param.item.price}</Text>
                <Text>Quantity: {param.item.orderqty}</Text>
                <ButtonGroup size={'small'}>
                    <Button >+</Button>
                    <Button >-</Button>
                </ButtonGroup>
            </Card>
        )
    }

    return (
        <Layout style={styles.layout}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>
                {param && param.name}
            </Text>
            <List style={styles.list} contentContainerStyle={styles.container} data={items} renderItem={renderCard} />
        </Layout>
    );
}