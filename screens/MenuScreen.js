import * as React from 'react';
import db from "../firebaseConfig";
import { Layout, Text, List, Card, Button, ButtonGroup } from '@ui-kitten/components';
import GlobalState from '../contexts/GlobalState';

export default function MenuScreen({navigation, route}) {

    const [param, setParam] = React.useState(route.params)
    const [items, setItems] = React.useState(new Array(0))
    const [cartlist, setCartlist] = React.useContext(GlobalState);
    // const [finalList, setFinalList] = React.useState({name: "", qty: 0, price: 0})
    var list=[]

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

    const addQty = (item) => {
        // setItems(prevItems => [...prevItems,{orderqty: item.orderqty+1}])
        item.orderqty = item.orderqty+1;
        if(list){
            var flag=0
            for (var i=0; i<list.length; i++) {
                // console.log(list[i])
                for(var itemid in list[i]){
                    if(itemid==item.id){
                        flag=1
                        list[i][item.id]['qty']+=1
                        list[i][item.id]['price']+=item.price
                    }
                }
            }
            if(flag==0){
                list.push(
                    {
                        [item.id]:  {
                            item_name: item.name,
                            qty: item.orderqty,
                            price: item.orderqty*item.price
                        }
                    }
                )
            }
            console.log(list)               
        }
        else{
            list.push(
                {
                    [item.id]:  {
                        item_name: item.name,
                        qty: item.orderqty,
                        price: item.orderqty*item.price
                    }
                }
            )
        }
        // setFinalList(temp)
        // console.log(finalList)
    }

    const lessQty = (item) => {
        item.orderqty = item.orderqty-1;
        if(list){
            var flag=0
            for (var i=0; i<list.length; i++) {
                for(var itemid in list[i]){
                    if(itemid==item.id){
                        flag=1
                        list[i][item.id]['qty']-=1
                        list[i][item.id]['price']-=item.price
                    }
                }
            }
            console.log(list)
        }
    }

    // React.useLayoutEffect(() => {
    //   getData()
    // }, []);

    React.useEffect(()=>{
        getData()
        console.log(items)
    },[items.name])
    
    const renderCard = (param)=>{
        return (
            <Card status={'basic'} style={{flex:1, alignItems: 'center', flexGrow: 1 }} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
                <Text category={'h6'}>{param.item.name}</Text>
                <Text>Price: {param.item.price}</Text>
                <Text>Quantity: {param.item.orderqty}</Text>
                {param.item.quantity && 
                    <ButtonGroup size={'small'}>
                        <Button onPress={() => addQty(param.item)}>+</Button>
                        <Button onPress={() => lessQty(param.item)}>-</Button>
                    </ButtonGroup>
                 } 
            </Card>
        )
    }

    const addToCart = () => {
        setCartlist(list)
        // setCartlist([...prevList, list])
        navigation.navigate('Cart')
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
            <Button onPress={addToCart}>View Cart</Button>
        </Layout>
    );
}