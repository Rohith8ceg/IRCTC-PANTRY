import * as React from 'react';
import db from "../firebaseConfig";
import { Layout, Text, List, Card, Button, ButtonGroup } from '@ui-kitten/components';

export default function MenuScreen({navigation, route}) {

    const [param, setParam] = React.useState(route.params)
    const [items, setItems] = React.useState(new Array(0))

    const getData = () => {
        console.log("getData:")
        db.doc(`category/${param.id}`).get().then((res)=>{
            let data = res.data()
            let items = data.item
            if (items)
                items.forEach(item => {
                    item.get().then((res)=>{
                        console.log(res.data())
                        setItems(prevItems => [...prevItems,{id: item.id,...res.data(),orderqty: 0}])
                    })
            });
        });
    }

    React.useLayoutEffect(() => {
      getData()
    }, []);

    React.useEffect(()=>{
        console.log(items)
    },[items])
    
    const renderCard = (param)=>{
        return (
            <Card status={'basic'} style={{flex:1, alignItems: 'center', flexGrow: 1 }} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
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
        <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>
                {param && param.name}
            </Text>
            { items.length &&
                <List contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{width: '60%'}} data={items} renderItem={renderCard} />
            }
        </Layout>
    );
}