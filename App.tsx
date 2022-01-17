/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {randomPoint} from '@turf/random';
import centroid from '@turf/centroid';
import { polygon, bbox } from '@turf/turf';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Icons } from './Icons'

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoicm9zaGFucmFtZGFzMTciLCJhIjoiY2thcWZ3dzBrMGJ0dzJ4cHcxeXJoMWZpNSJ9.iTZM4T8POBxb-Eb2mTCAHA',
);

const App = () => {
  const [markers, setMarkers] = useState<any>([]);
  const [points, setPoints] = useState<any>();
  const [bboxView, setBbox] = useState<any>();
console.log(centroid)
  const camera = useRef<MapboxGL.Camera>(null)
  
  useEffect(() => {
    const randomPoints = randomPoint(35, {bbox: [-121.879481,13.616777,-82.856044,32.835881]});
    setPoints(randomPoints)
    const points = randomPoints.features.map((item, index) => {
      return { id: index, item: {coords: item.geometry.coordinates, title: `Point ${index + 1}`}}
    });
    setMarkers(points);
  }, []);



  const onViewRef = React.useRef((items: any)=> {
    const pointsVisibleInFlatList = items.viewableItems.map((visibleItem:any)=>{
      return visibleItem.item.item.coords
    })
    setBbox(bbox({ type: 'MultiPoint', coordinates: pointsVisibleInFlatList }))
  })

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })




  const flatListChanged = () => {
    console.log(bboxView)
    camera.current?.fitBounds([bboxView[0], bboxView[1]], [bboxView[2], bboxView[3]], 20, 1000)
    //console.log("Visible items are", viewableItems);
    //console.log("Changed in this iteration", changed);
  }


  const renderItem = ({item}: any) => {
  
    const event = () => {
      camera.current?.zoomTo(8)
      camera.current?.flyTo(item.item.coords)
     
    }

    return (
      <TouchableOpacity style={{
        padding: 3,
        marginLeft: 10,
      }} onPress={event}>
        <Text style={{
          fontSize: 22,
          color: '#001fcc'
        }}>{item.item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.column}>
       <View style= {{
            width: 400,
            height: 300,
            borderColor: '#ededed',
            borderWidth: 3,
            padding: 20
          }}>

       <FlatList
          onViewableItemsChanged={onViewRef.current}
          onScrollEndDrag={flatListChanged}
          viewabilityConfig={viewConfigRef.current}
          data={markers}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          style= {{
            width: 100,
            height: 200
          }}
        />
       </View>
      </View>
      <View style={styles.column}>
        <MapboxGL.MapView
          onPress={(feature: any) =>
            console.log('Coords:', feature.geometry.coordinates)
          }
          style={styles.map}>

          <MapboxGL.ShapeSource id='multiplepoints' shape={points} >

            <MapboxGL.SymbolLayer
                  id={"symbolLocationSymbols"}
                  key={'some-randome-key'}
                  sourceID={'multiplepoints'}
                  minZoomLevel={1}
                  style={{
                    iconImage: Icons.Marker,
                    iconAnchor: 'bottom',
                    iconAllowOverlap: true,
                    iconSize: .05
                  }}
                >
                  <View >
                  
                  </View>
                </MapboxGL.SymbolLayer>
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera
            zoomLevel={5}
            ref={camera}
            centerCoordinate={[-101.76265760195122, 21.87831244482227]}/>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  column: {
    width: '50%',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: 500,
    width: 500,
  },
  icon: {
    backgroundColor: 'red'
  },
  map: {
    flex: 1,
  },
});

export default App;
