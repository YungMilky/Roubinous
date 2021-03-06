import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import AddRoutine from './AddRoutine';
import RemoveRoutine from './RemoveRoutine';

const plusSymbol = () => {
  return (
    <MaterialIcons
      name='playlist-add'
      size={20}
      color={colors.darkmodeSuccessColor}
    />
  );
};
const minusSymbol = () => {
  return (
    <MaterialCommunityIcons
      name='minus'
      size={20}
      color={colors.darkmodeErrorColor}
    />
  );
};
const undoSymbol = () => {
  return (
    <MaterialCommunityIcons
      name='undo'
      size={18}
      color={colors.darkmodeHighWhite}
    />
  );
};

//check - if true: show plus, if false: show minus
//routine - routine name
//size - plus and minus icon size
function AddAndRemoveButton({ style, size, check, routine }) {
  const [addingOrRemoving, setAddingOrRemoving] = useState(check);
  const [checkMessage, setCheckMessage] = useState(
    check ? ' Added!' : ' Removed'
  );
  const [maxWidth, setMaxWidth] = useState(check ? 70 : 84);
  const [plusOrMinus, setPlusOrMinus] = useState(
    check ? plusSymbol : minusSymbol
  );
  const [undo, toggleUndo] = useState();
  const [undoRender, setUndoRender] = useState();

  const [expanded, setExpanded] = useState(true);
  const animationWidth = useRef(new Animated.Value(2)).current;
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    if (expanded) {
      Animated.timing(animationWidth, {
        duration: 500,
        toValue: 20,
        easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animationWidth, {
        duration: 150,
        toValue: maxWidth,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded]);

  return (
    <Animatable.View
      animation={'swing'}
      useNativeDriver={true}
      style={[
        {
          backgroundColor: 'rgba(0,0,0,0.2)',
          height: 20,
          padding: 1,
          paddingBottom: 23,
          paddingHorizontal: 7,
          borderRadius: 3,
          margin: 3,
          borderWidth: 1,
          borderColor: colors.darkmodeMediumWhite,
        },
        style,
      ]}
    >
      {typeof check != 'undefined' && (
        <Animated.View style={{ width: animationWidth }} useNativeDriver={true}>
          <View style={{ position: 'absolute' }}>
            <TouchableWithoutFeedback
              onPress={() => {
                toggleExpansion();
                if (undo) {
                  checkMessage === ' Added!'
                    ? RemoveRoutine(routine)
                    : AddRoutine(routine);
                  // 3. set message to undone
                  setCheckMessage(' Undone!');
                  // set width to adapt to "undone" text
                  setMaxWidth(74);

                  setTimeout(() => {
                    // reset width to adapt to "removed"
                    setMaxWidth(84);
                    // 1. toggle undo
                    toggleUndo(false);
                    setUndoRender(null);
                    // 2. remove plus/minus depending on previous
                    checkMessage === ' Added!'
                      ? setPlusOrMinus(plusSymbol)
                      : setPlusOrMinus(minusSymbol);
                  }, 2000);

                  //  set back to added when out of sight
                  setTimeout(() => {
                    setCheckMessage(' Added!');
                  }, 2600);
                } else if (addingOrRemoving) {
                  //  IF ADDING
                  // 1. set message to Added!
                  setCheckMessage(' Added!');

                  // 2. add routine to db
                  AddRoutine(routine);

                  // 2. toggle undo
                  setTimeout(() => {
                    toggleUndo(true);
                    setUndoRender(undoSymbol);
                    // 3. remove plus/minus
                    setPlusOrMinus(null);
                  }, 2000);
                } else if (!addingOrRemoving) {
                  //  IF REMOVING
                  // 1. set message to Removed!
                  setCheckMessage(' Removed');

                  // 2. remove routine from db
                  RemoveRoutine(routine);

                  // 2. toggle undo
                  setTimeout(() => {
                    toggleUndo(true);
                    setUndoRender(undoSymbol);
                    // 3. remove plus/minus
                    setPlusOrMinus(null);
                  }, 2000);
                }
                setTimeout(() => {
                  setExpanded(expanded);
                }, 2000);
              }}
            >
              <Animated.View
                style={[
                  {
                    width: animationWidth,
                    paddingLeft: 0,
                    marginBottom: 5,
                    marginTop: -2,
                  },
                ]}
                useNativeDriver={true}
              >
                {/* {undo && (
                  <MaterialCommunityIcons
                    name="undo"
                    size={18}
                    color={colors.darkmodeHighWhite}
                  />
                )} */}
                <Text
                  style={{
                    color: colors.darkmodeHighWhite,
                    fontSize: 14,
                  }}
                  numberOfLines={1}
                  multiline={false}
                  ellipsizeMode='clip'
                >
                  {undoRender}
                  {plusOrMinus}
                  {checkMessage}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      )}
    </Animatable.View>
  );
}

export default AddAndRemoveButton;
