import { useRef, useEffect, Dispatch, SetStateAction, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Text } from 'react-native';
import _Button from '../control/button';
import Messages from './messages';
import MessageInput from './message-input';
import MessageTopBar from './message-top-bar';
import BlockedChat from '../../assets/images/blocked_chat_svg';

interface Props {
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
  userInfo: any,
  chat: any,
  socket: any,
  updateBlocked: any
}

const MessagePanel = ({ showPanel, updateShowPanel, userInfo, chat, socket, updateBlocked }: Props) => {
  const [newMessage, setNewMessage] = useState('');

  // These values are mapped to percentage of screen size.
  const PANEL_OUT_OF_SCREEN = Dimensions.get('window').width * 1.5;
  const PANEL_IN_SCREEN = 0;
  
  const slideAnimation = useRef(new Animated.Value(PANEL_OUT_OF_SCREEN)).current;
  
  let animationConfig = {
    toValue: PANEL_OUT_OF_SCREEN,
    duration: 400,
    easing: Easing.ease,
    useNativeDriver: true,
  };

  useEffect(() => {
    if (showPanel) {
      Animated.timing(slideAnimation, {...animationConfig, toValue: PANEL_IN_SCREEN}).start();
    } else {
      Animated.timing(slideAnimation, {...animationConfig}).start((() => setNewMessage('')));
    }
  }, [showPanel, slideAnimation]);

  return (
    <>
      {/*
        This view prevents user from reclicking tab when panel
        animates in screen.
      */}
      <View style={(showPanel) ? styles.hiddenContainer : {display: 'none'}}/>
      <Animated.View 
        style={[
          styles.container,
          {transform: [
            // interpolate maps integer value to string percentage.
            {translateX: slideAnimation},
          ]}
        ]}
      >
        <MessageTopBar
          chat={chat}
          userInfo={userInfo}
          showPanel={showPanel}
          updateShowPanel={updateShowPanel}
          updateBlocked={updateBlocked}
        />
        <Messages chat={chat} userInfo={userInfo} socket={socket}/>
        <MessageInput chat={chat} socket={socket} newMessage={newMessage} setNewMessage={setNewMessage}/>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    backgroundColor: 'white',
  },
  noMessagesContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 40,
    textAlign: 'center',
  },
});

export default MessagePanel;