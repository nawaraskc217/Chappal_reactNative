

// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// export default function AboutScreen() {
//   return (
//       <View style={styles.container}>
//           <Text style={styles.textStyle} >AboutScreen</Text>
//         </View>
//   )
// }

// const styles = StyleSheet.create({

//   container: {
//     backgroundColor: 'tomato',
//     flex: 1,
//     alignItems:'center',
//     justifyContent:'center'
//   },
//   textStyle: {
//     // marginTop: 8,
//     color:'black',
//     fontSize: 25,
//     fontWeight: '400',
//   },
// })

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'green',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AboutScreen;
